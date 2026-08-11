import { UserRole } from './rbac';

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';

export type TicketType =
  | 'bug'
  | 'task'
  | 'feature'
  | 'improvement'
  | 'question'
  | 'api_issue'
  | 'ui_issue'
  | 'integration_issue'
  | 'database_issue'
  | 'deployment_issue'
  | 'security_issue'
  | 'technical_debt';

export type TicketStatus =
  | 'open'
  | 'triaged'
  | 'assigned'
  | 'in_progress'
  | 'blocked'
  | 'code_review'
  | 'ready_for_testing'
  | 'testing'
  | 'changes_requested'
  | 'resolved'
  | 'closed'
  | 'reopened';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketSeverity = 'minor' | 'major' | 'critical' | 'blocker';

export type SprintStatus = 'planning' | 'active' | 'completed';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  created_at: string;
}

export interface User {
  id: string;
  org_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  job_title?: string;
  github_username?: string;
  created_at: string;
}

export interface Project {
  id: string;
  org_id: string;
  name: string;
  key: string;
  description?: string;
  client_name?: string;
  project_manager_id?: string;
  tech_stack: string[];
  repository_url?: string;
  staging_url?: string;
  production_url?: string;
  status: ProjectStatus;
  priority: TicketPriority;
  start_date?: string;
  end_date?: string;
  created_at: string;
  project_manager?: User;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role_in_project?: string;
  user?: User;
}

export interface Sprint {
  id: string;
  project_id: string;
  name: string;
  goal?: string;
  status: SprintStatus;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  ticket_number: string; // e.g. DET-143
  project_id: string;
  sprint_id?: string;
  team_id?: string;
  title: string;
  description?: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  severity: TicketSeverity;
  reporter_id: string;
  assignee_id?: string;
  module?: string;
  environment?: string;
  browser_device?: string;
  steps_to_reproduce?: string;
  expected_result?: string;
  actual_result?: string;
  due_date?: string;
  story_points: number;
  labels: string[];
  related_ticket_id?: string;
  created_at: string;
  updated_at: string;
  reporter?: User;
  assignee?: User;
  project?: Project;
  sprint?: Sprint;
}

export interface Subtask {
  id: string;
  ticket_id: string;
  title: string;
  is_completed: boolean;
  assignee_id?: string;
  created_at: string;
  assignee?: User;
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  mentions?: string[];
  created_at: string;
  user?: User;
}

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  uploaded_by: string;
  created_at: string;
  user?: User;
}

export interface TicketHistory {
  id: string;
  ticket_id: string;
  actor_id: string;
  action: string;
  field_changed?: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
  actor?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  ticket_id?: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  type: 'assigned' | 'mentioned' | 'status_changed' | 'commented' | 'general';
  created_at: string;
}

export interface GitHubPR {
  id: string;
  ticket_id: string;
  repo_name: string;
  pr_number: number;
  pr_title: string;
  pr_url: string;
  status: 'open' | 'merged' | 'closed';
  author?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  org_id?: string;
  actor_id?: string;
  action: string;
  metadata?: Record<string, any>;
  created_at: string;
  actor?: User;
}
