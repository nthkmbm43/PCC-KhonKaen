# ADR-006: Database Index Optimization Strategy

## Context
As the PCC Landing Page moves closer to production, a Database Optimization review (DB-002) was conducted. The system uses PostgreSQL and Drizzle ORM. 

Initial EXPLAIN ANALYZE results on the local test database (seeded with 1000 products, 95% published) showed that queries sorting by `created_at` DESC were triggering `Seq Scan` and `top-N heapsort` operations. This includes both Admin list views (sorting all products/pages) and Frontend list views (filtering by `status = 'published'` and sorting by `created_at` DESC).

With an expected growth of records (especially in `audit_logs`), optimizing the execution paths is critical to prevent CPU spikes from in-memory sorts.

## Decision
1. **Frontend Optimization**: Add a composite index `products_status_created_at_idx` on `products(status, created_at DESC)` to enable `Index Only Scan` or `Index Scan` for frontend queries filtering by status.
2. **Admin Optimization**: Add a single-column index `products_created_at_idx` on `products(created_at DESC)` and `pages_created_at_idx` on `pages(created_at DESC)` since the PostgreSQL query planner cannot effectively use the second column of a composite index for sorting if the first column (`status`) is not constrained in the `WHERE` clause.
3. **Zero-Downtime Migration**: All new indexes on production tables must use the `CREATE INDEX CONCURRENTLY` statement to avoid acquiring an Exclusive Lock (write lock) that blocks API requests during deployment.
4. **Audit Logs Deferred**: Decisions to drop or consolidate indexes on `audit_logs` are deferred to DB-003, pending real-world production metrics.

## Alternatives Considered
- **Cursor Pagination without Indexes**: Considered implementing cursor pagination first, but without an index on the cursor column (`created_at`), it would still result in full table scans.
- **Dropping Existing Audit Indexes**: Considered dropping all `audit_logs` single-column indexes in favor of one composite index. Rejected for Phase B due to high migration risk and lack of production evidence (`pg_stat_statements`) proving they are entirely unused.

## Consequences
- **Positive**: Frontend product listing execution time dropped from ~0.290ms (Seq Scan) to ~0.071ms (Index Scan) in local benchmarks. Admin listing execution time improved proportionally.
- **Negative**: Minor increase in storage overhead and slight write penalty on `INSERT`/`UPDATE` for `products` and `pages`.

## Future Considerations
- **fillfactor Tuning**: For append-heavy tables like `audit_logs`, consider lowering the `fillfactor` (e.g., to 90 or 80) if updates occur, or keeping it at 100 since audit logs are insert-only. This should be reviewed during DB-003.
- **pg_stat_statements**: A backlog item is created to enable `pg_stat_statements` on the production database to gather real `mean_time` and `calls` metrics for data-driven decisions.
