# Database Documentation - Dettroin PostgreSQL Schema

The database uses PostgreSQL hosted on Supabase.

## Primary Entities
- `organizations`: Tenant companies.
- `users`: Extends `auth.users` with `role` (9 levels).
- `projects`: Client applications (e.g. `DET`, `WEB`).
- `sprints`: Iterations with start/end dates and story point goals.
- `tickets`: Main entity containing type, priority, severity, reporter, assignee, module, environment, expected/actual payloads.
- `ticket_comments`: Discussion threads supporting @mentions.
- `github_pull_requests`: Linked PR numbers and statuses.
- `notifications`: Real-time WebSocket event notifications.

See `supabase/migrations/00001_initial_schema.sql` for table definitions and `00002_rls_policies.sql` for Row Level Security definitions.
