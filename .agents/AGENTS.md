<!-- BEGIN:glossary-rule -->
# Glossary Rules
1. ALWAYS use the word "พรีแคสท์" (Precast) for any Thai text referencing Precast. NEVER use "พรีคาสท์".
<!-- END:glossary-rule -->
<!-- BEGIN:deployment-db-rules -->
# Deployment & Database Preservation Rules

## Core Principle
From this point forward, treat the existing project as a persistent production system, not a newly generated application.
Every modification must be incremental, preserving all existing data, configurations, and functionality unless explicitly instructed otherwise.

## Database Rules
### DO NOT
* Do NOT truncate any table.
* Do NOT delete existing records.
* Do NOT recreate existing tables.
* Do NOT reseed data that already exists.
* Do NOT overwrite existing content with default values.
* Do NOT regenerate IDs.
* Do NOT reset AUTO_INCREMENT sequences.
* Do NOT remove relationships between existing data.

### DO
* Keep all existing data intact.
* Only add new records if they do not already exist.
* Only update records that are explicitly modified.
* Use UPSERT / INSERT ... ON CONFLICT / INSERT IGNORE / MERGE whenever appropriate.
* Preserve all primary keys and foreign keys.
* Preserve timestamps unless intentionally updated.

## Migration Rules
Database migrations must be additive whenever possible.
Allowed: Add new tables, columns, indexes, constraints, nullable fields, backfill data safely.
Avoid destructive operations unless explicitly requested.
Forbidden unless instructed: DROP TABLE, DROP COLUMN, TRUNCATE, DELETE ALL, RESET DATABASE, Fresh Seed.

## Seed Rules
Seed scripts must be idempotent.
Requirements:
* Running the seed multiple times must produce the exact same database state.
* Existing data must never be duplicated.
* Existing records must never be overwritten unless values actually changed.
* Detect existing records by unique keys.

## Deployment Rules
Deployments must preserve: Database data, Uploaded files, Media assets, User accounts, Roles & permissions, CMS Pages, SEO Metadata, Settings, Configuration, Logs (unless rotation is intended).
Deployment should update only: Source code, New migrations, Changed assets, Modified configuration. Nothing else.

## File Rules
Do not recreate files that already exist.
If a file has not changed: Keep it unchanged, do not reformat it unnecessarily, do not rename it, do not regenerate it.
Modify only the portions required for the requested feature.

## Change Detection Rules
Before making changes:
1. Compare the requested feature with the existing implementation.
2. Identify exactly what must change.
3. Leave everything else untouched.
If there is no functional difference, make no modification.

## Minimal Change Policy
Every task should produce the smallest possible diff.
Avoid: unnecessary refactoring, unrelated formatting, file reordering, import reorganization, renaming variables without purpose.
Only edit what is required.

## Review Before Applying
Before generating code: Provide Files that will change, Reason for each change, Database impact, Migration impact, Breaking changes (if any), Rollback considerations.
If a file does not require modification, do not regenerate it.

## Preservation Priority
Existing implementation has priority over regeneration.
If an existing component already satisfies the requirement: Reuse it, Extend it, Refactor only if absolutely necessary.
Never replace working functionality simply because a new implementation could also work.

## Default Behavior
Unless explicitly instructed otherwise: Preserve existing data, architecture, APIs, business logic, database contents, uploaded assets.
Generate only the minimum set of changes required to implement the requested feature.
The goal is to produce clean, reviewable, incremental commits with the smallest possible code diff while keeping the system fully deployable and preserving all existing production data.
<!-- END:deployment-db-rules -->
