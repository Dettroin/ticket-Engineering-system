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
  bug: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  task: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  feature: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  improvement: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  question: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  api_issue: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  ui_issue: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  integration_issue: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  database_issue: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  deployment_issue: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  security_issue: 'bg-red-600/20 text-red-300 border-red-500/50 font-bold',
  technical_debt: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
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
  open: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  triaged: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  assigned: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  in_progress: 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse-subtle',
  blocked: 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-semibold',
  code_review: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  ready_for_testing: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  testing: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  changes_requested: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  resolved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  closed: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  reopened: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent / Critical',
};

export const PRIORITY_COLORS: Record<TicketPriority, string> = {
  low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  high: 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-medium',
  urgent: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold animate-pulse-subtle',
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
