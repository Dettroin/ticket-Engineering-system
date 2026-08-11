# Authentication & RBAC Strategy

## Role Matrix
1. **Super Admin**: Full tenant & infrastructure management.
2. **Admin**: Project & user administration.
3. **Project Manager**: Project, Sprint, and Ticket lifecycle management.
4. **Team Lead**: Technical triage and code review.
5. **Developer / Frontend Dev / Backend Dev**: Ticket resolution, PR linking, status updates.
6. **QA / Tester**: Bug logging with reproduction steps, testing validation.
7. **Client / User**: Restricted viewer mode.

Row Level Security (RLS) policies enforce multi-tenant isolation and role-level write permissions directly in PostgreSQL.
