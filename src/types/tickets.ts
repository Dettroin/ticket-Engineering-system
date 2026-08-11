import { TicketPriority, TicketSeverity, TicketStatus, TicketType } from './database';

export const TICKET_TYPE_LABELS: Record<TicketType, string> = {
  bug: 'Bug',
  task: 'Task',
  feature: 'Feature Request',
  improvement: 'Improvement',
  question: 'Question',
  api_issue: 'API Issue',
  ui_issue: 'UI Issue',
  integration_issue: 'Integration Issue',
  database_issue: 'Database Issue',
  deployment_issue: 'Deployment Issue',
  security_issue: 'Security Issue',
  technical_debt: 'Technical Debt',
};

export const TICKET_TYPE_COLORS: Record<TicketType, string> = {
  bug: 'bg-rose-50 text-rose-700 border-rose-200',
  task: 'bg-blue-50 text-blue-700 border-blue-200',
  feature: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  improvement: 'bg-purple-50 text-purple-700 border-purple-200',
  question: 'bg-amber-50 text-amber-700 border-amber-200',
  api_issue: 'bg-navy-50 text-navy-900 border-navy-200 font-semibold',
  ui_issue: 'bg-sky-50 text-sky-700 border-sky-200',
  integration_issue: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  database_issue: 'bg-orange-50 text-orange-700 border-orange-200',
  deployment_issue: 'bg-violet-50 text-violet-700 border-violet-200',
  security_issue: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
  technical_debt: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  triaged: 'Triaged',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  blocked: 'Blocked',
  code_review: 'Code Review',
  ready_for_testing: 'Ready for Testing',
  testing: 'Testing',
  changes_requested: 'Changes Requested',
  resolved: 'Resolved',
  closed: 'Closed',
  reopened: 'Reopened',
};

export const STATUS_COLORS: Record<TicketStatus, string> = {
  open: 'bg-slate-100 text-slate-700 border-slate-200',
  triaged: 'bg-blue-50 text-blue-700 border-blue-200',
  assigned: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  in_progress: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
  blocked: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
  code_review: 'bg-purple-50 text-purple-700 border-purple-200',
  ready_for_testing: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  testing: 'bg-teal-50 text-teal-700 border-teal-200',
  changes_requested: 'bg-orange-50 text-orange-800 border-orange-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  closed: 'bg-slate-200 text-slate-600 border-slate-300',
  reopened: 'bg-pink-50 text-pink-700 border-pink-200',
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent / Critical',
};

export const PRIORITY_COLORS: Record<TicketPriority, string> = {
  low: 'bg-slate-100 text-slate-600 border-slate-200',
  medium: 'bg-blue-50 text-blue-700 border-blue-200',
  high: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold',
  urgent: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
};

export const SEVERITY_LABELS: Record<TicketSeverity, string> = {
  minor: 'Minor',
  major: 'Major',
  critical: 'Critical',
  blocker: 'Blocker',
};

export const KANBAN_STAGES: { id: TicketStatus; name: string }[] = [
  { id: 'open', name: 'Open' },
  { id: 'triaged', name: 'Triaged' },
  { id: 'in_progress', name: 'In Progress' },
  { id: 'blocked', name: 'Blocked' },
  { id: 'code_review', name: 'Code Review' },
  { id: 'ready_for_testing', name: 'Ready for Testing' },
  { id: 'testing', name: 'Testing' },
  { id: 'resolved', name: 'Resolved' },
  { id: 'closed', name: 'Closed' },
];
