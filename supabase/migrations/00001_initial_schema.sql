-- Dettroin Engineering & Project Management System
-- Schema Migration 00001: Custom Enums, Core Tables, Indexes & Automated Triggers

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'admin',
  'project_manager',
  'team_lead',
  'developer',
  'frontend_developer',
  'backend_developer',
  'qa_tester',
  'client_user'
);

CREATE TYPE project_status AS ENUM (
  'planning',
  'active',
  'on_hold',
  'completed',
  'archived'
);

CREATE TYPE ticket_type AS ENUM (
  'bug',
  'task',
  'feature',
  'improvement',
  'question',
  'api_issue',
  'ui_issue',
  'integration_issue',
  'database_issue',
  'deployment_issue',
  'security_issue',
  'technical_debt'
);

CREATE TYPE ticket_status AS ENUM (
  'open',
  'triaged',
  'assigned',
  'in_progress',
  'blocked',
  'code_review',
  'ready_for_testing',
  'testing',
  'changes_requested',
  'resolved',
  'closed',
  'reopened'
);

CREATE TYPE ticket_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

CREATE TYPE ticket_severity AS ENUM (
  'minor',
  'major',
  'critical',
  'blocker'
);

CREATE TYPE sprint_status AS ENUM (
  'planning',
  'active',
  'completed'
);

-- 2. TABLES

-- Organizations Table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table (Extends Supabase Auth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'developer',
  job_title TEXT,
  github_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key TEXT NOT NULL, -- e.g. 'DET', 'ERP'
  description TEXT,
  client_name TEXT,
  project_manager_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  tech_stack TEXT[] DEFAULT '{}',
  repository_url TEXT,
  staging_url TEXT,
  production_url TEXT,
  status project_status DEFAULT 'active',
  priority ticket_priority DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_project_key_per_org UNIQUE(org_id, key)
);

-- Teams Table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  lead_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members
CREATE TABLE public.team_members (
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, user_id)
);

-- Project Members
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_in_project TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_project_user UNIQUE(project_id, user_id)
);

-- Sprints Table
CREATE TABLE public.sprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goal TEXT,
  status sprint_status DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tickets Table (CORE)
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL, -- e.g., 'DET-143'
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  type ticket_type NOT NULL DEFAULT 'bug',
  status ticket_status NOT NULL DEFAULT 'open',
  priority ticket_priority NOT NULL DEFAULT 'medium',
  severity ticket_severity NOT NULL DEFAULT 'major',
  reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  module TEXT,
  environment TEXT,
  browser_device TEXT,
  steps_to_reproduce TEXT,
  expected_result TEXT,
  actual_result TEXT,
  due_date DATE,
  story_points INT DEFAULT 1,
  labels TEXT[] DEFAULT '{}',
  related_ticket_id UUID REFERENCES public.tickets(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subtasks Table
CREATE TABLE public.subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket Comments
CREATE TABLE public.ticket_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mentions UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket Attachments
CREATE TABLE public.ticket_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INT,
  uploaded_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket History / Activity Log
CREATE TABLE public.ticket_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- e.g., 'created', 'status_change', 'assigned', 'pr_linked'
  field_changed TEXT,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  type TEXT DEFAULT 'general', -- 'assigned', 'mentioned', 'status_changed', 'commented'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GitHub Pull Requests
CREATE TABLE public.github_pull_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  repo_name TEXT NOT NULL,
  pr_number INT NOT NULL,
  pr_title TEXT NOT NULL,
  pr_url TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- 'open', 'merged', 'closed'
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INDEXES FOR HIGH PERFORMANCE
CREATE INDEX idx_tickets_project ON public.tickets(project_id);
CREATE INDEX idx_tickets_assignee ON public.tickets(assignee_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_number ON public.tickets(ticket_number);
CREATE INDEX idx_comments_ticket ON public.ticket_comments(ticket_id);
CREATE INDEX idx_history_ticket ON public.ticket_history(ticket_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);

-- 4. AUTOMATED UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_modtime BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
