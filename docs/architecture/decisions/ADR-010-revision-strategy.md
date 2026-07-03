# ADR-010: Revision Strategy

## Status
Accepted

## Context
Enterprise CMS systems require the ability to track history, diff changes, and rollback content to previous states. Recording only the current state and audit logs (`before_state`, `after_state`) is insufficient for deep editorial workflows and easy rollbacks.

## Decision
1. **Revision Table**: We introduce a `revisions` table capable of holding historical snapshots of any content entity (Pages, Products, etc.).
2. **Snapshot Storage**: Snapshots are stored in a `jsonb` column. Crucially, strictly business data is stored in the snapshot. Timestamps (`createdAt`, `updatedAt`) and identifiers (`revisionId`) of the original record are omitted from the snapshot to reduce storage bloat and noise.
3. **Concurrency Control**: To prevent race conditions when multiple editors save simultaneously, a unique index on `(resource_type, resource_id, version)` is enforced.
4. **Versioning**: The version number monotonically increases with each save.
5. **Observability**: We emit `REVISION_CREATED` and `REVISION_ROLLBACK` events.

## Consequences
- **Pros**: Immediate capability for rollbacks, previews of past states, and diffing. Mimics robust CMS platforms (e.g., WordPress, Contentful).
- **Cons**: Storage requirements will grow faster as every save operation duplicates content. Requires periodic cleanup or capping of revisions per document in the future if space becomes an issue.
