# ADR-007: Media Storage Architecture

## Status
Accepted

## Context
The CMS requires a Media Library to allow administrators to upload, manage, search, and reuse images and other media assets across pages and products. Uploading binary files directly into PostgreSQL is inefficient and can bloat the database, leading to performance degradation and higher costs. 

## Decision
We will adopt a hybrid approach:
1. **Object Storage**: Store the actual binary media files in Vercel Blob.
2. **Metadata Database**: Store media metadata (filename, size, mime type, alt text, width, height, blob URL) in a PostgreSQL table (`media_files`).
3. **Security**: We will enforce security constraints at the API level before uploading to Vercel Blob. This includes MIME validation, Magic Number checking, Maximum Pixel bounds for images (to prevent image bombs), and SVG sanitization.
4. **Deletion (Saga Pattern)**: Deleting a media file involves calling the Vercel Blob deletion API first, then deleting the database record, and finally logging the event to the Audit Log.
5. **Observability**: `MEDIA_UPLOADED`, `MEDIA_DELETED`, and `MEDIA_SEARCH` events will be logged for tracing and auditing.

## Consequences
- **Pros**: Database remains small and fast. Object storage handles binary data efficiently. Caching via Vercel Edge Network is natively supported.
- **Cons**: We introduce eventual consistency issues if the database delete fails after a blob delete. The Saga pattern mitigates this, but requires careful error handling.
