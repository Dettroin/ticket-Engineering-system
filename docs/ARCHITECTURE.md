# System Architecture - Dettroin Engineering System

## Overview
Dettroin Engineering System combines Jira, Linear, Trello, and GitHub Issues into a single unified workspace.

```
Client App (Next.js 14 App Router)
   ├── UI Components (shadcn/ui style, Tailwind CSS)
   ├── Auth & RBAC Context (9 Roles)
   ├── Data Layer (Supabase Client + Hybrid Mock Sync)
   └── API Server Routes (/api/ai/bug-analysis)
        ├── Supabase Postgres & RLS Policies
        ├── Supabase Auth & Realtime
        └── Google Gemini API Engine
```

## Key Modules
1. **Frontend ↔ Backend Workflow**: Dedicated ticket schema for API bug logs (`expected_result` vs `actual_result`).
2. **Interactive Kanban**: 9-stage workflow board (Open -> Triaged -> In Progress -> Blocked -> Code Review -> Ready for Testing -> Testing -> Resolved -> Closed).
3. **Sprint & Velocity Management**: Iteration planning and story point tracking.
4. **GitHub PR Linking**: Automated linking via commit / PR title detection (`DET-143`).
5. **Gemini AI Assistant**: Automated root cause analysis, classification, and code fix generation.
