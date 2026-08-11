import { User, Organization, Ticket, Project, Sprint, TicketComment, Notification, Subtask, GitHubPR } from '@/types/database';

export const INITIAL_ORG: Organization = {
  id: 'org-dettroin-2026',
  name: 'Dettroin Systems',
  slug: 'dettroin',
  created_at: '2026-01-01T00:00:00Z',
};

// Initial System Admin Account for production handoff
export const INITIAL_USERS: User[] = [
  {
    id: 'admin-001',
    org_id: INITIAL_ORG.id,
    email: 'admin@dettroin.com',
    username: 'admin',
    password: 'AdminPass@2026',
    is_active: true,
    full_name: 'Dettroin Admin',
    role: 'admin',
    job_title: 'System Administrator & Head of Engineering',
    avatar_url: '',
    github_username: 'dettroin-admin',
    created_at: '2026-01-01T00:00:00Z',
  },
];

// Fresh empty data stores for production team usage
export const INITIAL_PROJECTS: Project[] = [];
export const INITIAL_SPRINTS: Sprint[] = [];
export const INITIAL_TICKETS: Ticket[] = [];
export const INITIAL_COMMENTS: TicketComment[] = [];
export const INITIAL_SUBTASKS: Subtask[] = [];
export const INITIAL_NOTIFICATIONS: Notification[] = [];
export const INITIAL_GITHUB_PRS: GitHubPR[] = [];
