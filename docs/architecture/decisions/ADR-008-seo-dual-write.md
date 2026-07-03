# ADR-008: SEO Dual-Write & Expand-Migrate-Contract Strategy

## Status
Approved

## Context
Our legacy schema embedded SEO fields (e.g. `seoTitle`, `seoKeywords`) directly on the `pages` and `products` tables. As our CMS grows, this approach leads to schema duplication and rigidity. We need a unified `seo_metadata` table to support polymorphic attachments (Pages, Products, Categories, Blog Posts) without causing downtime or data loss during the transition.

## Decision
We will employ the **Expand-Migrate-Contract** pattern for database refactoring:
1. **Expand**: Create the new `seo_metadata` table using a polymorphic association (`resource_type`, `resource_id`).
2. **Dual-Write (Current Phase)**: Modify `PUT /api/pages/[id]` and `PUT /api/products/[id]` to write SEO updates to *both* the legacy columns and the new `seo_metadata` table simultaneously.
3. **Migrate**: Run a background migration script (`migrate-seo.ts`) to backfill all legacy SEO data into `seo_metadata`.
4. **Contract (Future Phase)**: The legacy `seo_*` columns on `pages` and `products` will be formally dropped in **Sprint 5**, strictly after the system has been verified across 2 production releases, to prevent legacy cruft from lingering indefinitely.

## Consequences
- ✅ Zero downtime during the database transition.
- ✅ Safety net: if the new table fails, the legacy columns still act as the source of truth.
- ⚠️ Slight performance overhead on `PUT` requests due to dual DB writes, which is acceptable for CMS operations.
