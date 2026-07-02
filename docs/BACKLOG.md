# Project Backlog

| ID | Priority | Status | DoR | DoD | Risk | Version | Task | Blocking | ETA | Owner | Commit | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SEC-001 | P0 | Done | ✅ | ✅ | Low | v1.0.1 | Update vulnerable dependencies | - | 15m | AI Agent | 0d8c58e | High severity in undici patched. |
| SEC-002 | P0 | Done | ✅ | ✅ | Medium | v1.0.1 | Add security headers | SEC-001 | 30m | AI Agent | 01a3b4d | CSP in Report-Only. HSTS added. |
| SEC-003 | P0 | Done | ✅ | ✅ | Medium | v1.0.1 | Login rate limiting | SEC-002 | 1h | AI Agent | e5dd707 | Upstash Redis (Fail-open implemented). |
| REL-001 | P1 | Done | ✅ | ✅ | Low | v1.1.0 | Global error pages | - | 45m | AI Agent | Pending | Custom 404, 500 created |
| AUTH-001 | P1 | Todo | ⬜ | ⬜ | High | v1.1.0 | Enforce RBAC | - | 30m | - | - | - |
| AUDIT-001 | P1 | Todo | ⬜ | ⬜ | Medium | v1.1.0 | Audit log | AUTH-001 | 90m | - | - | - |
| TECH-001 | P3 | Todo | ⬜ | ⬜ | Low | v1.2.0 | Review Existing ESLint Issues | - | 2h | - | - | 41 Pre-existing warnings |
| OPS-001 | P2 | Todo | ⬜ | ⬜ | Medium | v1.1.0 | Monitoring Rate Limit | SEC-003 | 1h | - | - | Setup alert for Rate Limit fail-open |
