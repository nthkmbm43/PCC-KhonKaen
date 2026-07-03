# ADR-009: Draft / Preview Publishing Workflow

## Status
Accepted

## Context
Editors need to create content, preview it before it goes live, and manage its lifecycle without accidentally publishing unfinished work. Currently, content uses a simple `status` enum (`'draft'`, `'published'`), which lacks nuance for review flows and secure previews.

## Decision
1. **Workflow State**: We introduce a standard `workflow_state` enum covering `'draft'`, `'review'`, `'published'`, and `'archived'`.
2. **Secure Previews**: 
   - A draft item will generate a temporary, securely hashed token (`preview_token_hash`).
   - Plain text tokens are NOT stored in the database. The database stores the hash and an `expires_at` timestamp.
   - The `/api/preview` or `/preview` route will authenticate the plain token against the hash.
3. **SEO Protection**: Preview pages will automatically include an `X-Robots-Tag: noindex` header to prevent search engines from indexing draft content.
4. **Caching**: Preview routes will bypass the ISR (Incremental Static Regeneration) cache, ensuring editors always see the latest draft.

## Consequences
- **Pros**: Secure, shareable preview links. Clear content lifecycle. Prevents SEO penalties for duplicate/draft content.
- **Cons**: Requires managing token generation, hashing, and validation logic. Preview endpoints must dynamically render content, increasing server load compared to static pages.
