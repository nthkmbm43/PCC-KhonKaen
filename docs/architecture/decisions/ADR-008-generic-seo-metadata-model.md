# ADR-008: Generic SEO Metadata Model

## Status
Accepted

## Context
Various resources (Pages, Products, Categories, Blog Posts) require SEO metadata (title, description, canonical, robots, open graph tags). Hardcoding these fields into every database table leads to schema bloat, duplication, and makes adding SEO to new entities cumbersome.

## Decision
1. **Polymorphic Table**: We will extract SEO fields into a single `seo_metadata` table.
2. **References**: The table will use a polymorphic relation `(resource_type, resource_id)` to link to the respective entity.
3. **Migration (Expand-Migrate-Contract)**: We will not drop the existing SEO columns on `pages` and `products` immediately. We will expand the schema with the new table, migrate the data via a script, and contract (drop columns) in a future release to ensure zero downtime and safety.
4. **Referential Integrity Check**: Since PostgreSQL does not support Foreign Keys across polymorphic types seamlessly without advanced techniques, we acknowledge the lack of strict FK constraints on `resource_id`. A backlog task is created to build application-level referential integrity checks or background cleanup jobs.

## Consequences
- **Pros**: Easily attach SEO to any future entity type without altering their table schemas. Unified SEO management.
- **Cons**: Loss of strict database-level referential integrity. Queries fetching an entity and its SEO metadata now require a `LEFT JOIN` or two queries.
