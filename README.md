# Dettroin Engineering & Project Management System

Production-ready internal SaaS platform engineered specifically for **Dettroin** to eliminate cross-team communication gaps between Frontend Developers, Backend Developers, QA/Testers, Team Leads, Project Managers, and Admins.

---

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui design, Lucide Icons, React Hook Form, Zod.
- **Backend & Database**: Supabase (PostgreSQL, Supabase Auth, Storage, Realtime, Row Level Security).
- **AI Triage**: Google Gemini API (Server API routes).
- **Integrations**: GitHub PR & Commit Linking.

---

## Getting Started

### 1. Install Dependencies
```bash
cmd /c npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Run Database Migrations
Apply the PostgreSQL schema & RLS policies located in:
- `supabase/migrations/00001_initial_schema.sql`
- `supabase/migrations/00002_rls_policies.sql`
- `supabase/seed.sql`

### 4. Start Development Server
```bash
cmd /c npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Documentation
- [Architecture Guide](docs/ARCHITECTURE.md)
- [Database Schema & ER](docs/DATABASE.md)
- [Authentication & RBAC](docs/AUTHENTICATION.md)
- [AI Triage & Gemini Integration](docs/AI.md)
- [Production Deployment](docs/DEPLOYMENT.md)
