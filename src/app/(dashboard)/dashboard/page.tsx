'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ROLE_BADGE_COLORS, ROLE_LABELS } from '@/types/rbac';
import { STATUS_COLORS, STATUS_LABELS, TICKET_TYPE_COLORS, TICKET_TYPE_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types/tickets';
import {
  FolderKanban,
  Ticket as TicketIcon,
  AlertOctagon,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Bug,
  Code,
  UserCheck,
  Building2,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, organization, projects, tickets, sprints } = useAuth();

  const totalProjects = projects.length;
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status !== 'closed' && t.status !== 'resolved').length;
  const blockedTickets = tickets.filter((t) => t.status === 'blocked').length;
  const activeSprint = sprints.find((s) => s.status === 'active');
  const myAssignedTickets = tickets.filter((t) => t.assignee_id === user?.id);

  return (
    <div className="space-y-6">
      {/* Active User Persona Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-dettroin-950/60 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-dettroin-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url}
              alt={user?.full_name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-dettroin-500/50 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100">Welcome back, {user?.full_name}!</h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${ROLE_BADGE_COLORS[user?.role || 'developer']}`}>
                  {ROLE_LABELS[user?.role || 'developer']}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-dettroin-400" />
                <span>{organization.name} Engineering Workspace</span>
                <span>•</span>
                <span className="text-slate-300 font-medium">{user?.job_title}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/tickets">
              <Button size="sm" variant="glass">
                <TicketIcon className="w-4 h-4" /> View My Tickets ({myAssignedTickets.length})
              </Button>
            </Link>
            <Link href="/kanban">
              <Button size="sm" variant="primary">
                <FolderKanban className="w-4 h-4" /> Kanban Board
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="border-l-4 border-l-dettroin-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Projects</p>
              <h3 className="text-2xl font-black text-slate-100 mt-1">{totalProjects}</h3>
            </div>
            <div className="p-3 bg-dettroin-500/10 text-dettroin-400 rounded-xl">
              <FolderKanban className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">School ERP, Public Portal</p>
        </Card>

        <Card hoverable className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open Tickets</p>
              <h3 className="text-2xl font-black text-amber-400 mt-1">{openTickets}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <TicketIcon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">{totalTickets - openTickets} resolved / closed</p>
        </Card>

        <Card hoverable className="border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Blocked Issues</p>
              <h3 className="text-2xl font-black text-rose-400 mt-1">{blockedTickets}</h3>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
              <AlertOctagon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Requires cross-team unblocking</p>
        </Card>

        <Card hoverable className="border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Sprint</p>
              <h3 className="text-base font-bold text-teal-300 mt-1 truncate">Sprint 24</h3>
            </div>
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">{activeSprint?.goal || 'Student API Sync'}</p>
        </Card>
      </div>

      {/* Featured Core Communication Ticket (DET-143) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-dettroin-500/20 text-dettroin-400 rounded-xl">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Frontend ↔ Backend Communication Highlight</h2>
              <p className="text-xs text-slate-400">Core engineering ticket resolving API mismatch between Tarun & Rahul</p>
            </div>
          </div>
          <Link href="/tickets/DET-143">
            <Button size="sm" variant="outline">
              Open DET-143 <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-dettroin-400 bg-dettroin-950 px-2.5 py-1 rounded-md border border-dettroin-800">
                DET-143
              </span>
              <h3 className="text-sm font-semibold text-slate-200">Student API returning incorrect attendance structure</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${TICKET_TYPE_COLORS['api_issue']}`}>
                API Issue
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${STATUS_COLORS['in_progress']}`}>
                In Progress
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${PRIORITY_COLORS['high']}`}>
                High Priority
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            Frontend Lead (Tarun) logged API payload mismatch on GET /api/students. Backend Engineer (Rahul) linked PR #284 with SQL view updates.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-[11px] text-emerald-400">
              <span className="text-slate-500 block text-[10px] font-sans font-semibold uppercase tracking-wider mb-1">Expected Frontend Structure</span>
              {`{\n  "student_id": 101,\n  "attendance": 95\n}`}
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-[11px] text-rose-400">
              <span className="text-slate-500 block text-[10px] font-sans font-semibold uppercase tracking-wider mb-1">Actual Backend Response</span>
              {`{\n  "student": 101,\n  "attendance_percentage": null\n}`}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100">Recent Engineering Tickets</h2>
          <Link href="/tickets" className="text-xs text-dettroin-400 hover:underline">
            View all tickets →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Assignee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tickets.slice(0, 5).map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-dettroin-400">
                    <Link href={`/tickets/${ticket.ticket_number}`}>{ticket.ticket_number}</Link>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-200">
                    <Link href={`/tickets/${ticket.ticket_number}`} className="hover:text-dettroin-300">
                      {ticket.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] ${TICKET_TYPE_COLORS[ticket.type]}`}>
                      {TICKET_TYPE_LABELS[ticket.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] ${STATUS_COLORS[ticket.status]}`}>
                      {STATUS_LABELS[ticket.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] ${PRIORITY_COLORS[ticket.priority]}`}>
                      {PRIORITY_LABELS[ticket.priority]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {ticket.assignee ? (
                      <div className="flex items-center gap-1.5">
                        <img src={ticket.assignee.avatar_url} className="w-5 h-5 rounded-full" />
                        <span>{ticket.assignee.full_name}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
