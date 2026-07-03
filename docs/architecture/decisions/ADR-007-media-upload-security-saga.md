# ADR-007: Media Upload Security & Deletion Saga

## Status
Approved

## Context
Handling user uploads directly to cloud storage (e.g. Vercel Blob) presents two main challenges:
1. **Security**: We cannot trust the `Content-Type` header from the client browser, as it can be easily spoofed to upload malicious files (e.g. SVG XSS, Image Bombs).
2. **Data Consistency**: When deleting a media file, deleting it from the Vercel Blob might fail due to network errors. If we synchronously delete the database row first, we create "orphaned blobs" that cost money and space.

## Decision
1. **Server-Side Upload & Magic Number Validation**:
   Uploads must pass through `/api/upload` where they are processed by the `sharp` library. The Validation Layer order must be strictly:
   1. **Extension** -> 2. **Content-Type** -> 3. **Magic Number** (Sharp decode) -> 4. **Image Decode** -> 5. **Dimension** (Max 10000x10000) -> 6. **Business Rule**.
   Only if all pass do we push to Vercel Blob.

2. **Soft Delete Saga (Media Deletion)**:
   When `DELETE /api/media/[id]` is called:
   - Mark the row as `delete_status = 'PENDING_DELETE'` instead of hard deleting.
   - Record an Audit Log.
   - Emit an API Observability event (`MEDIA_DELETE_REQUESTED`).
   - *Deferred*: A Background Worker (Sprint 5: `JOB-001`) will scan for `PENDING_DELETE` records, call `del(blobUrl)`.
     - If successful, it deletes the DB row.
     - If it fails, it emits a Worker Observability event (`MEDIA_DELETE_FAILED`) and retries later.

## Consequences
- ✅ Eliminates spoofed file security risks.
- ✅ Prevents orphaned Vercel Blob files on network errors.
- ⚠️ **Current Limitation**: We do not yet have a Background Worker system. Cleanup is explicitly deferred to Sprint 5 (`JOB-001`). Risk is accepted for now; soft-deleted files will temporarily accumulate in storage until the worker is implemented.
