# Project Backlog

| ID | Priority | Status | DoR | DoD | Risk | Version | Task | Blocking | ETA | Owner | Commit | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SEC-001 | P0 | Done | ✅ | ✅ | Low | v1.0.1 | Update vulnerable dependencies | - | 15m | AI Agent | 0d8c58e | High severity in undici patched. |
| SEC-002 | P0 | Done | ✅ | ✅ | Medium | v1.0.1 | Add security headers | SEC-001 | 30m | AI Agent | 01a3b4d | CSP in Report-Only. HSTS added. |
| SEC-003 | P0 | Done | ✅ | ✅ | Medium | v1.0.1 | Login rate limiting | SEC-002 | 1h | AI Agent | e5dd707 | Upstash Redis (Fail-open implemented). |
| REL-001 | P1 | Done | ✅ | ✅ | Low | v1.1.0 | Global error pages | - | 45m | AI Agent | 28041a4 | Custom 404, 500 created |
| AUTH-001 | P1 | Done | ✅ | ✅ | High | v1.1.0 | Enforce RBAC | - | 30m | AI Agent | 4e93a62 | Defense in depth implemented |
| AUDIT-001 | P1 | Done | ✅ | ✅ | Medium | v1.1.0 | Audit log | AUTH-001 | 90m | AI Agent | 3db54df | Phase A implemented |
| OBS-001 | P1 | Done | ✅ | ✅ | High | v1.2.0 | Observability Foundation | AUDIT-001 | 3h | AI Agent | a14d20a | Structured JSON Logger, Correlation ID, Internal Log API |
| OBS-002 | P1 | Todo | ⬜ | ⬜ | Medium | v1.2.0 | Health Checks | OBS-001 | 1h | - | - | /health, /ready, /live |
| DB-001 | P1 | Todo | ⬜ | ⬜ | Medium | v1.2.0 | Database Health Integration | OBS-002 | 2h | - | - | /ready checks PostgreSQL, Redis, Blob |
| OBS-003 | P2 | Todo | ⬜ | ⬜ | High | v1.2.0 | Metrics & Telemetry | OBS-001 | 4h | - | - | Prometheus, OpenTelemetry, Histogram (Latency, Error Rate, Throughput) |
| AUDIT-002 | P2 | Todo | ⬜ | ⬜ | Medium | v1.2.0 | Correlation ID Integration | OBS-003 | 2h | - | - | Connect Correlation ID to Audit Log for full traceability |
| AUTH-002 | P2 | Todo | ⬜ | ⬜ | High | v1.1.0 | Protect Server Actions | AUTH-001 | 1h | - | - | - |
| AUDIT-003 | P2 | Todo | ⬜ | ⬜ | High | v1.2.0 | Diff Logging | AUDIT-001 | 3h | - | - | Optimize JSONB storage size |
| AUDIT-004 | P2 | Todo | ⬜ | ⬜ | Medium | v1.2.0 | Retention Policy & Indexes | AUDIT-001 | 1h | - | - | Composite Indexes and Archival rules |
| AUDIT-005 | P2 | Todo | ⬜ | ⬜ | Low | v1.2.0 | JSONB Size Limit | AUDIT-001 | 1h | - | - | Truncate large fields like content/images |
| AUDIT-007 | P2 | Todo | ⬜ | ⬜ | High | v1.3.0 | Audit Viewer Dashboard | AUDIT-001 | 4h | - | - | UI for Search/Filter/Export logs |
| OPS-001 | P2 | Todo | ⬜ | ⬜ | Medium | v1.1.0 | Monitoring Rate Limit | SEC-003 | 1h | - | - | Setup alert for Rate Limit fail-open |
| OBS-005 | P2 | Todo | ⬜ | ⬜ | Medium | v1.2.0 | Distributed Trace Headers | OBS-001 | 2h | - | - | W3C Trace Context (traceparent, tracestate) |
| OBS-004 | P3 | Todo | ⬜ | ⬜ | Medium | v1.2.0 | Adaptive Sampling | OBS-001 | 2h | - | - | Reduce Log volume in Production |
| OBS-006 | P3 | Todo | ⬜ | ⬜ | Low | v1.2.0 | Dynamic Log Level | OBS-001 | 1h | - | - | Configurable via LOG_LEVEL env |
| OBS-007 | P3 | Todo | ⬜ | ⬜ | Medium | v1.2.0 | Logger Performance Benchmark | OBS-001 | 2h | - | - | Benchmark logs/sec, latency, memory |
| OBS-008 | P3 | Todo | ⬜ | ⬜ | Low | v1.2.0 | Async Transport | OBS-001 | 2h | - | - | Batch / Background Flush |
| AUDIT-006 | P3 | Todo | ⬜ | ⬜ | Low | v1.3.0 | Soft Delete Audit Handling | AUDIT-001 | 1h | - | - | Handle soft delete audits in ADR |
| TECH-001 | P3 | Todo | ⬜ | ⬜ | Low | v1.2.0 | Review Existing ESLint Issues | - | 2h | - | - | 41 Pre-existing warnings |
