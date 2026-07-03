# ADR-009: Preview Token Hashing, Rate Limiting & Invalidation

## Status
Approved

## Context
The CMS requires a "Preview Mode" for admins to view draft content before it is published. Sharing a raw access token via URL poses security risks (e.g. leaking the token, brute-force guessing).

## Decision
We implement a three-tiered security model for Next.js Draft Mode previews:
1. **SHA-256 Hashing**: We never store the raw preview token in the database. Instead, the backend generates a random string, hashes it using SHA-256, and stores the hash. When `GET /api/preview?token=abc` is hit, the API hashes `abc` and compares it to the database.
2. **Upstash Rate Limiting**: To prevent token brute-forcing, we enforce a strict rate limit on `/api/preview` (e.g., 10 requests per minute per IP) using `@upstash/ratelimit`. Denied requests trigger a `PREVIEW_DENIED` observability event.
3. **Immediate Invalidation**: Preview tokens are bound to a TTL (`previewExpiresAt`). However, the moment a draft transitions its `workflowState` to `'published'`, the system explicitly nullifies both the hash and the TTL, instantly revoking any outstanding preview URLs.

## Consequences
- ✅ Significantly reduces the risk of leaked Draft Mode URLs granting indefinite unauthorized access.
- ✅ Protects the database from brute-force token enumeration attacks.
- ⚠️ Requires Redis/Upstash infrastructure for rate-limiting.
