# ADR-003: Comprehensive Audit Logging System

## Status
Accepted

## Context
As an Enterprise CMS, it is critical to maintain a secure and immutable record of all business data changes. We need an Audit Logging system that provides high traceability, debugging capabilities, and compliance tracking, without causing data loss or massive storage overhead for irrelevant fields.

## Decision
We implement a central `audit_logs` table and a `logAudit` utility function. The system enforces the following architectural rules:

1. **Synchronous Execution (await over Fire-and-Forget)**
   - Audit logs must be explicitly awaited (`await logAudit(...)`).
   - In Next.js Serverless environments (Lambda), returning a response terminates the function execution context. Promises that are not awaited (Fire-and-Forget) risk being dropped silently. Audit data is treated as Security Evidence; we prioritize `Audit Success` immediately after `Business Success` before returning the `Return Response`.
2. **Database Transactions (`db.transaction`)**
   - Both the business data mutation and the audit log insertion MUST occur within the same database transaction. If the audit log fails to insert, the business data mutation is rolled back to prevent state mismatches (where data changes without a trace).
3. **Before-State Retrieval**
   - The `before_state` must be retrieved via a `SELECT` query *before* the `UPDATE` or `DELETE` executes, ensuring an accurate snapshot of the data.
4. **JSONB for State Storage**
   - `before_state` and `after_state` are stored as `jsonb`. This allows flexible schema evolution of business entities (e.g., adding columns to `products` or `pages`) without needing to migrate the `audit_logs` table schema.
5. **Sensitive Data Masking**
   - Fields containing sensitive data (e.g., `password`, `accessToken`, `refreshToken`, `secret`, `apiKey`) will be automatically masked (`"***MASKED***"`) before being serialized into the JSONB state.
6. **Field Filtering**
   - System auto-updated fields like `createdAt` and `updatedAt` are stripped from the state payloads to prevent the JSON objects from inflating the database with non-business changes.
7. **Request ID and Traceability**
   - Every log includes a `request_id` (either from Next.js headers or generated on the fly) to allow correlation across Application Logs, Error Logs, and Audit Logs.
8. **Enums and Indexes**
   - `action` (e.g., `CREATE`, `UPDATE`, `DELETE`) and `resource` (e.g., `product`, `page`) are strongly typed as Enums in the database.
   - Indexes on `user_id`, `resource`, `resource_id`, `action`, and `created_at` are enforced from Day 1 to support fast querying as the table grows.

## Retention Policy
- Audit Logs will be kept in the active PostgreSQL database for **1 to 3 years**.
- Logs older than 3 years will be archived to cold storage (e.g., AWS S3 or equivalent) and pruned from the primary database to maintain query performance.

## Consequences
- Requires refactoring API mutation endpoints to use `db.transaction`.
- Slight increase in latency for write operations due to the synchronous `SELECT`, transaction overhead, and the `await logAudit` call.
- Provides absolute certainty that no business mutation occurs without a corresponding audit trail.
