# Project Backlog

| ID | Priority | Sprint | Status | DoR | DoD | Risk | Version | Task | Blocking | ETA | Owner | Commit | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SEC-001 | P0 | Sprint 1 | Done | ✅ | ✅ | Low | v1.0.1 | Update vulnerable dependencies | - | 15m | AI Agent | 0d8c58e | High severity in undici patched. |
| SEC-002 | P0 | Sprint 1 | Done | ✅ | ✅ | Medium | v1.0.1 | Add security headers | SEC-001 | 30m | AI Agent | 01a3b4d | CSP in Report-Only. HSTS added. |
| SEC-003 | P0 | Sprint 1 | Done | ✅ | ✅ | Medium | v1.0.1 | Login rate limiting | SEC-002 | 1h | AI Agent | e5dd707 | Upstash Redis (Fail-open implemented). |
| REL-001 | P1 | Sprint 2 | Done | ✅ | ✅ | Low | v1.1.0 | Global error pages | - | 45m | AI Agent | 28041a4 | Custom 404, 500 created |
| AUTH-001 | P1 | Sprint 2 | Done | ✅ | ✅ | High | v1.1.0 | Enforce RBAC | - | 30m | AI Agent | 4e93a62 | Defense in depth implemented |
| AUDIT-001 | P1 | Sprint 2 | Done | ✅ | ✅ | Medium | v1.1.0 | Audit log | AUTH-001 | 90m | AI Agent | 3db54df | Phase A implemented |
| OBS-001 | P1 | Sprint 2 | Done | ✅ | ✅ | High | v1.2.0 | Observability Foundation | AUDIT-001 | 3h | AI Agent | a14d20a | Structured JSON Logger, Correlation ID |
| OBS-002 | P1 | Sprint 2 | Done | ✅ | ✅ | Medium | v1.2.0 | Health Checks | OBS-001 | 1h | AI Agent | ab2c27e | /health, /ready, /live |
| DB-001 | P1 | Sprint 2 | Done | ✅ | ✅ | Medium | v1.2.0 | Database Health Integration | OBS-002 | 2h | AI Agent | ab2c27e | /ready checks PostgreSQL, Redis, Blob |
| QA-001 | P1 | Sprint 3 | Todo | ⬜ | ⬜ | High | v1.3.0 | Regression & Integration Test | DB-001 | 4h | - | - | Production Stabilization: Test Login, CRUD, Upload, Middleware flows |
| DB-002 | P1 | Sprint 3 | Todo | ⬜ | ⬜ | High | v1.3.0 | Database Optimization | QA-001 | 3h | - | - | Production Stabilization: Index Review, Slow Query Analysis |
| PERF-001 | P1 | Sprint 3 | Todo | ⬜ | ⬜ | Medium | v1.3.0 | Performance Audit | DB-002 | 3h | - | - | Production Stabilization: Bundle Size, Caching, Core Web Vitals |
| AUTH-002 | P2 | Sprint 4 | Todo | ⬜ | ⬜ | High | v1.4.0 | Protect Server Actions | PERF-001 | 1h | - | - | Security Hardening: Protect critical Server Actions |
| CI-001 | P1 | Sprint 4 | Todo | ⬜ | ⬜ | High | v1.4.0 | CI/CD Quality Gates | AUTH-002 | 2h | - | - | Security Hardening: Build, Typecheck, ESLint, npm audit, Secret Scan |
| INFRA-001 | P1 | Sprint 4 | Todo | ⬜ | ⬜ | High | v1.4.0 | Backup & Disaster Recovery | CI-001 | 4h | - | - | Security Hardening: Test backup, RTO, RPO |
| OBS-003 | P2 | Sprint 5 | Todo | ⬜ | ⬜ | High | v1.5.0 | Metrics & Telemetry | INFRA-001 | 4h | - | - | Operations: Prometheus, OpenTelemetry, Histogram |
| OPS-002 | P2 | Sprint 5 | Todo | ⬜ | ⬜ | Medium | v1.5.0 | Dashboard and Alerting | OBS-003 | 4h | - | - | Operations: Setup operational dashboards and alerts |
| AUDIT-002 | P2 | Sprint 5 | Todo | ⬜ | ⬜ | Medium | v1.5.0 | Correlation ID Integration | OPS-002 | 2h | - | - | Operations: Connect Correlation ID to Audit Log |
| OBS-005 | P2 | Sprint 5 | Todo | ⬜ | ⬜ | Medium | v1.5.0 | Distributed Trace Headers | AUDIT-002 | 2h | - | - | Operations: W3C Trace Context (traceparent, tracestate) |
| AUDIT-003 | P2 | Future | Todo | ⬜ | ⬜ | High | v1.6.0 | Diff Logging | - | 3h | - | - | Optimize JSONB storage size |
| AUDIT-004 | P2 | Future | Todo | ⬜ | ⬜ | Medium | v1.6.0 | Retention Policy & Indexes | - | 1h | - | - | Composite Indexes and Archival rules |
| AUDIT-005 | P2 | Future | Todo | ⬜ | ⬜ | Low | v1.6.0 | JSONB Size Limit | - | 1h | - | - | Truncate large fields like content/images |
| AUDIT-007 | P2 | Future | Todo | ⬜ | ⬜ | High | v1.6.0 | Audit Viewer Dashboard | - | 4h | - | - | UI for Search/Filter/Export logs |
| OPS-001 | P2 | Future | Todo | ⬜ | ⬜ | Medium | v1.6.0 | Monitoring Rate Limit | - | 1h | - | - | Setup alert for Rate Limit fail-open |
| OBS-004 | P3 | Future | Todo | ⬜ | ⬜ | Medium | v1.6.0 | Adaptive Sampling | - | 2h | - | - | Reduce Log volume in Production |
| OBS-006 | P3 | Future | Todo | ⬜ | ⬜ | Low | v1.6.0 | Dynamic Log Level | - | 1h | - | - | Configurable via LOG_LEVEL env |
| OBS-007 | P3 | Future | Todo | ⬜ | ⬜ | Medium | v1.6.0 | Logger Performance Benchmark | - | 2h | - | - | Benchmark logs/sec, latency, memory |
| OBS-008 | P3 | Future | Todo | ⬜ | ⬜ | Low | v1.6.0 | Async Transport | - | 2h | - | - | Batch / Background Flush |
| AUDIT-006 | P3 | Future | Todo | ⬜ | ⬜ | Low | v1.6.0 | Soft Delete Audit Handling | - | 1h | - | - | Handle soft delete audits in ADR |
| TECH-001 | P3 | Future | Todo | ⬜ | ⬜ | Low | v1.6.0 | Review Existing ESLint Issues | - | 2h | - | - | 41 Pre-existing warnings |
