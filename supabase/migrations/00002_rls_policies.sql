-- Dettroin Engineering & Project Management System
-- Schema Migration 00002: Row Level Security (RLS) Policies

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_pull_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check user org_id
CREATE OR REPLACE FUNCTION auth.user_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper Function: Check user role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. USERS POLICIES
CREATE POLICY "Users can view members in their organization"
ON public.users FOR SELECT
USING (org_id = auth.user_org_id());

CREATE POLICY "Users can update their own profile"
ON public.users FOR UPDATE
USING (id = auth.uid());

-- 2. PROJECTS POLICIES
CREATE POLICY "Users can view projects in their organization"
ON public.projects FOR SELECT
USING (org_id = auth.user_org_id());

CREATE POLICY "Admins and PMs can create/update projects"
ON public.projects FOR ALL
USING (
  org_id = auth.user_org_id() 
  AND auth.user_role() IN ('super_admin', 'admin', 'project_manager')
);

-- 3. TICKETS POLICIES
CREATE POLICY "Users can view tickets in their organization projects"
ON public.tickets FOR SELECT
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE org_id = auth.user_org_id()
  )
);

CREATE POLICY "Users can create tickets in their organization projects"
ON public.tickets FOR INSERT
WITH CHECK (
  project_id IN (
    SELECT id FROM public.projects WHERE org_id = auth.user_org_id()
  )
);

CREATE POLICY "Users can update assigned or reported tickets"
ON public.tickets FOR UPDATE
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE org_id = auth.user_org_id()
  )
);

-- 4. TICKET COMMENTS POLICIES
CREATE POLICY "Users can view comments for authorized tickets"
ON public.ticket_comments FOR SELECT
USING (
  ticket_id IN (
    SELECT t.id FROM public.tickets t
    JOIN public.projects p ON t.project_id = p.id
    WHERE p.org_id = auth.user_org_id()
  )
);

CREATE POLICY "Users can insert comments"
ON public.ticket_comments FOR INSERT
WITH CHECK (user_id = auth.uid());

-- 5. NOTIFICATIONS POLICIES
CREATE POLICY "Users view their own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users update their own notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());
