# ADR-011: Media Library Search Optimization

## Status
Approved

## Context
The current Media Library API uses the `ILIKE` operator in PostgreSQL to search for images by `filename` and `alt` text. While `ILIKE` is sufficient for a small number of records (e.g., thousands), it forces sequential table scans. If the media library grows into hundreds of thousands of files, this will cause significant API latency and database CPU spikes.

## Decision
For the initial Phase (Sprint 4), we will accept the performance characteristic of `ILIKE` as it accelerates time-to-market and keeps the schema simple. 

## Future Considerations
- **GIN & Trigram Indexes**: Once the `media_files` table exceeds 100,000 records or search latency exceeds 500ms at the 95th percentile, we will introduce the `pg_trgm` extension. We will replace `ILIKE` with Trigram-based GIN (Generalized Inverted Index) indexes on the `filename` and `alt` columns.
- **Full Text Search (FTS)**: Alternatively, if we need advanced language parsing and stemming for the `alt` text (e.g., Thai language tokenization), we will consider implementing PostgreSQL's Full Text Search (FTS) using `tsvector`.
