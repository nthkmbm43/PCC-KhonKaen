# ADR-004: Observability Foundation

## Status
Accepted

## Context
As the CMS scales, debugging and monitoring become complex without a unified logging mechanism. We need a central Observability Foundation that standardizes logs, correlates cross-system requests, masks sensitive PII, and operates seamlessly in Serverless environments without vendor lock-in.

## Decision
We implement a robust, Framework Agnostic Structured Logging system with the following architectural guarantees:

1. **Structured JSON Logs & Schema Versioning**
   - All logs output strictly as JSON with a locked schema containing: `schemaVersion: 1`, `timestamp` (ISO-8601 UTC), `level`, `service`, `environment`, `requestId`, `userId`, `route`, `event`, `message`, `error`, and `metadata`.
2. **Correlation ID (X-Request-ID) with AsyncLocalStorage**
   - We reuse the `x-request-id` header if present (from proxies/load balancers). Otherwise, we generate a UUID.
   - Using Node.js `AsyncLocalStorage`, the `RequestContext` is propagated implicitly through the request lifecycle, ensuring `requestId` is appended to all logs without manual drilling.
3. **Immutable Child Loggers**
   - The logger exposes a `.child(context)` method that returns a brand new logger instance. This prevents context mutation collisions across asynchronous requests.
4. **Transport Layer Abstraction**
   - The logger delegates output to a Transport Layer (currently writing to `stdout`), ensuring that replacing the destination (e.g., streaming to CloudWatch) does not require changes to the application code.
5. **PII Masking & Error Normalization**
   - Redaction relies on a centralized `REDACT_KEYS` constant and masks recursively.
   - Error objects are normalized (`type`, `name`, `message`, `code`, `digest`). Stack traces are aggressively stripped in `production` environments to prevent secret leakage.
6. **Log Event Enums**
   - Log tracking uses strict Event Enums (e.g., `PRODUCT_UPDATED`) instead of free-text messages for machine readability and robust dashboard querying.
7. **Client Error Boundary Protection & Rate Limiting**
   - Client runtime errors are logged via an internal API (`/api/internal/log`), strictly guarded by Same-Origin/Host checks (preventing the need for exposed `NEXT_PUBLIC_` secrets).
   - Rate Limiting (30 req/min) via Upstash Redis prevents log spamming.
   - **Fail-Open Policy:** If the Redis rate limiter goes down, we allow logs to pass through rather than blocking them (fail-open) and log a `WARN`. This prioritizes system observability and traceability over strict rate limit enforcement.

## Log Level Policy
- **TRACE:** Deep debugging (Sampling 0% in Prod)
- **DEBUG:** Development state (Sampling 0% in Prod)
- **INFO:** Business Events (Sampling policies to be defined)
- **WARN:** Recoverable Errors (Sampling 100%)
- **ERROR:** Failed Requests (Sampling 100%)
- **FATAL:** Service Crash (Sampling 100%)

## Retention Policy & Log Ownership
- **Dev:** 7 days
- **Staging:** 14 days
- **Production:** 90 days (Archived to cold storage thereafter)
- **Ownership:** Platform/DevOps Team is responsible for provisioning storage and maintaining transport pipelines.

## Rejected Alternatives
- **Pino / Winston / Bunyan:**
  - *Rejected:* We want to minimize dependency bloat for this early phase. A highly optimized custom JSON `stdout` logger is sufficient and easier to control until high-traffic (50k+ req/day) necessitates a highly optimized buffer-based library like Pino.
- **OpenTelemetry SDK:**
  - *Deferred:* Introducing full OTLP traces is scheduled for a future Sprint when Distributed Tracing becomes necessary.

## Consequences
- Requires strict adherence to the logging API (`logger.info`, `logger.child`).
- Modest memory overhead from Node `AsyncLocalStorage`.
