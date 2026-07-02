# ADR 005: Health Checks & Readiness Probes

**Date:** 2026-07-02
**Status:** Accepted
**Context:** OBS-002, DB-001

## Context
As the CMS infrastructure scales and prepares for containerized or load-balanced environments, a robust mechanism for health monitoring is required. Cloud platforms (Kubernetes, Vercel) and Load Balancers rely on standard HTTP probes to determine if an instance should receive traffic or be restarted. Combining all checks into a single endpoint is an anti-pattern that can lead to cascading failures (e.g., a rolling update failing because an external API is temporarily slow).

## Decision
We will implement the standard Kubernetes-style three-probe architecture:

### 1. Endpoint Separation
- **`/health` (Basic Status):** Fast, non-blocking check. Indicates the application layer is running and can process requests.
- **`/live` (Liveness Probe):** Mirrors `/health`. Used by orchestrators to determine if the process has deadlocked and requires a hard restart.
- **`/ready` (Readiness Probe):** Deep check. Connects to backend dependencies to determine if the node is capable of successfully fulfilling a user request.

### 2. Critical vs. Optional Dependencies
Not all dependencies are strictly required to serve the core CMS product. To maximize uptime, we implement a **Graceful Degradation** policy on the `/ready` endpoint:
- **Database (PostgreSQL):** **CRITICAL**. The CMS cannot function without the database. Failure results in `status: "error"` and HTTP `503 Service Unavailable`.
- **Redis (Upstash):** **OPTIONAL**. Used for rate limiting and telemetry. Failure results in `status: "degraded"` and HTTP `200 OK`.
- **Blob Storage (Vercel):** **OPTIONAL**. Used for file uploads. The site can still be viewed if uploads fail. Failure results in `status: "degraded"` and HTTP `200 OK`.

### 3. Application Metadata Constraints (Serverless)
- **Version:** Read dynamically from `process.env.npm_package_version` or `process.env.APP_VERSION`. Hardcoding is strictly forbidden.
- **Commit SHA:** Read from `process.env.VERCEL_GIT_COMMIT_SHA`.
- **Uptime:** We expose `process.uptime()`. However, because Next.js operates in a Serverless environment (Vercel), **uptime represents the Instance Uptime (the lifespan of the specific Lambda execution context), not the absolute global service uptime.** This distinction is critical for monitoring dashboards.

## Consequences
- **Positive:** We prevent cascading outages. If Redis goes down, the CMS stays online but operates in a degraded state.
- **Positive:** Load balancers can accurately pull unhealthy instances out of rotation only when critical systems fail.
- **Negative:** Alerting systems must be configured to parse the JSON body to alert on `"degraded"` status, since the HTTP code will remain `200 OK`.
