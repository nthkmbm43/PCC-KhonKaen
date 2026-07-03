-- Custom Migration: DB-002 Phase B Indexes
-- Created CONCURRENTLY to avoid locking tables in Production

CREATE INDEX CONCURRENTLY IF NOT EXISTS "pages_created_at_idx" ON "pages" ("created_at" DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_status_created_at_idx" ON "products" ("status", "created_at" DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_created_at_idx" ON "products" ("created_at" DESC);