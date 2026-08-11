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
  super_admin: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  admin: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  project_manager: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  team_lead: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  developer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  frontend_developer: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  backend_developer: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  qa_tester: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  client_user: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
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
