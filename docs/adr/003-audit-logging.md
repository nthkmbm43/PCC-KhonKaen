# ADR-003: Comprehensive Audit Logging System

## Context
As an Enterprise CMS, it is critical to maintain a secure and immutable record of all business data changes. We need an Audit Logging system that provides high traceability, debugging capabilities, and compliance tracking, without causing data loss or massive storage overhead for irrelevant fields. However, we must balance data integrity with business continuity.

## Decision
We implement a central `audit_logs` table and a `logAudit` utility function. The system enforces the following architectural rules:

1. **Synchronous Execution (await over Fire-and-Forget)**
   - Audit logs must be explicitly awaited (`await logAudit(...)`). In Next.js Serverless environments, returning a response terminates the execution context.
2. **Failure Policy: Business Continuity over Audit Strictness (Policy B)**
   - If the business mutation (UPDATE/DELETE) succeeds but the Audit Log insertion fails (e.g., Disk Full, Deadlock), the system will **NOT** rollback the business transaction. Instead, it will log the audit failure to the Application Error Log and allow the business transaction to commit. This is standard for CMS systems where content publishing availability out-prioritizes strict financial audit compliance.
3. **Database Transactions (`db.transaction`)**
   - Both the business data mutation and the audit log insertion occur within the same transaction scope, but the audit log failure is caught and suppressed to prevent a global rollback.
4. **Before-State Retrieval**
   - The `before_state` must be retrieved via a `SELECT` query *before* the `UPDATE` or `DELETE` executes, ensuring an accurate snapshot.
5. **JSONB for State Storage**
   - `before_state` and `after_state` are stored as `jsonb` to allow flexible schema evolution without migrating the `audit_logs` table.
6. **Sensitive Data Masking**
   - Fields containing sensitive data (`password`, `accessToken`, `secret`, `apiKey`) will be automatically masked (`"***MASKED***"`).
7. **Phased Rollout**
   - Implemented initially only on Products and Pages API routes (Sprint A) to prevent system-wide regression.

## Alternatives Considered
- **Fire-and-Forget Audit Logs:** Rejected due to high risk of log dropping in Serverless.
- **Strict Audit Compliance (Rollback on Audit Fail - Policy A):** Rejected. While suitable for banking, rejecting a CMS content update because the audit table is full creates unacceptable business friction.

## Consequences
- Requires refactoring API mutation endpoints to use `db.transaction`.
- Slight latency increase for write operations due to the synchronous `SELECT`.
- Potential for a business mutation to exist without an audit log in rare edge cases (e.g., DB crash during the audit insert), which is an accepted tradeoff for business continuity.

## Rollback Plan
`git revert 3db54df` (or current commit). The database schema changes (`audit_logs` table and enums) can remain untouched as they will not interfere with legacy code.

## Future Improvements
- **Correlation ID (X-Request-ID):** Implement a global tracer ID from middleware to audit logs (P1).
- **Diff Logging:** Transition from storing full JSONB objects to only storing changed fields (P2).
- **Composite Indexes & Storage:** Implement composite indexing and a strict 1-3 year Retention/Archival policy (P2).
- **Audit Viewer Dashboard:** Build a UI to search and filter logs for administrators (P2).
- **JSONB Size Limits:** Implement truncation for large fields like `content` to control table size growth (P2).
- **Soft Delete Handling:** Define audit behavior when soft deletes are introduced (P3).
