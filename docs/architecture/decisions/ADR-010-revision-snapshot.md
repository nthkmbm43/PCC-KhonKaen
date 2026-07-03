# ADR-010: Revision Snapshotting & Race Condition Prevention

## Status
Approved

## Context
A CMS requires a robust version history (Revision) system to allow admins to view past edits and restore content if mistakes are made.

## Decision
1. **Business Data Snapshots**: The `revisions` table uses a `jsonb` column to store the exact state of a `page` or `product` at the time of modification. To minimize database storage bloat, we explicitly strip metadata (e.g., `id`, `createdAt`, `updatedAt`, `previewTokenHash`) before inserting the payload into the `data` column.
2. **Race Condition Prevention**: We prevent concurrent updates from generating the same revision version number by enforcing a unique constraint at the database schema level on `(resource_type, resource_id, version)`. 
3. **Write Mechanism**: During a `PUT /api/pages/[id]` transaction, the system calculates `MAX(version) + 1` within the transaction scope and inserts the snapshot. If two transactions race, the unique constraint will throw a database error, forcing one to fail (which can be retried by the client).

## Consequences
- ✅ Significantly reduces storage costs by avoiding duplicate metadata.
- ✅ Ensures data integrity and sequence continuity.
- ⚠️ Clients must handle `409 Conflict` or `500 Server Error` on race conditions, though this is rare in a typical CMS environment with few concurrent admins.

## Future Considerations
- **Delta Storage & Compression**: As the CMS scales, storing full JSONB snapshots for large documents (e.g., > 500KB) across hundreds of revisions will bloat the database rapidly. In future iterations, we will investigate either compressing the `data` payload or migrating to a Delta/Diff storage mechanism (storing only changes between versions) for older revisions.
