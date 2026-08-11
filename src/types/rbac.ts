export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'project_manager'
  | 'team_lead'
  | 'developer'
  | 'frontend_developer'
  | 'backend_developer'
  | 'qa_tester'
  | 'client_user';

export interface UserProfile {
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

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  project_manager: 'Project Manager',
  team_lead: 'Team Lead',
  developer: 'Developer',
  frontend_developer: 'Frontend Developer',
  backend_developer: 'Backend Developer',
  qa_tester: 'QA / Tester',
  client_user: 'Client / User',
};

export const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  super_admin: 'bg-purple-50 text-purple-700 border-purple-200',
  admin: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  project_manager: 'bg-blue-50 text-blue-700 border-blue-200',
  team_lead: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  developer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  frontend_developer: 'bg-sky-50 text-sky-700 border-sky-200',
  backend_developer: 'bg-navy-50 text-navy-800 border-navy-200 font-semibold',
  qa_tester: 'bg-amber-50 text-amber-700 border-amber-200',
  client_user: 'bg-slate-100 text-slate-700 border-slate-200',
};

export function canCreateProject(role: UserRole): boolean {
  return ['super_admin', 'admin', 'project_manager'].includes(role);
}

export function canManageMembers(role: UserRole): boolean {
  return ['super_admin', 'admin', 'project_manager'].includes(role);
}

export function canCreateTicket(role: UserRole): boolean {
  return role !== 'client_user';
}

export function canChangeTicketStatus(role: UserRole): boolean {
  return role !== 'client_user';
}

export function canManageSprints(role: UserRole): boolean {
  return ['super_admin', 'admin', 'project_manager', 'team_lead'].includes(role);
}
