'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ROLE_BADGE_COLORS, ROLE_LABELS } from '@/types/rbac';
import { STATUS_COLORS, STATUS_LABELS, TICKET_TYPE_COLORS, TICKET_TYPE_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types/tickets';
import {
  FolderKanban,
  Ticket as TicketIcon,
  AlertOctagon,
  Zap,
  ArrowRight,
  Code,
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
      <div className="bg-navy-950 text-white rounded-3xl p-6 shadow-apple-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url}
              alt={user?.full_name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Welcome back, {user?.full_name}!</h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${ROLE_BADGE_COLORS[user?.role || 'developer']}`}>
                  {ROLE_LABELS[user?.role || 'developer']}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-blue-300" />
                <span>{organization.name} Engineering Workspace</span>
                <span>•</span>
                <span className="text-slate-200 font-medium">{user?.job_title}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/tickets">
              <Button size="sm" variant="glass">
                <TicketIcon className="w-4 h-4" /> My Tickets ({myAssignedTickets.length})
              </Button>
            </Link>
            <Link href="/kanban">
              <Button size="sm" variant="secondary">
                <FolderKanban className="w-4 h-4 text-navy-950" /> Kanban Board
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="border-l-4 border-l-navy-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Projects</p>
              <h3 className="text-2xl font-black text-navy-950 mt-1">{totalProjects}</h3>
            </div>
            <div className="p-3 bg-navy-50 text-navy-800 rounded-2xl border border-navy-100">
              <FolderKanban className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">School ERP, Public Portal</p>
        </Card>

        <Card hoverable className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Open Tickets</p>
              <h3 className="text-2xl font-black text-amber-700 mt-1">{openTickets}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100">
              <TicketIcon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">{totalTickets - openTickets} resolved / closed</p>
        </Card>

        <Card hoverable className="border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Blocked Issues</p>
              <h3 className="text-2xl font-black text-rose-700 mt-1">{blockedTickets}</h3>
            </div>
            <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100">
              <AlertOctagon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">Requires cross-team unblocking</p>
        </Card>

        <Card hoverable className="border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Sprint</p>
              <h3 className="text-base font-bold text-teal-800 mt-1 truncate">Sprint 24</h3>
            </div>
            <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl border border-teal-100">
              <Zap className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">{activeSprint?.goal || 'Student API Sync'}</p>
        </Card>
      </div>

      {/* Featured Core Communication Ticket (DET-143) */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-navy-50 text-navy-900 rounded-2xl border border-navy-100">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-navy-950">Frontend ↔ Backend Communication Highlight</h2>
              <p className="text-xs text-slate-500 font-medium">Core engineering ticket resolving API mismatch between Tarun & Rahul</p>
            </div>
          </div>
          <Link href="/tickets/DET-143">
            <Button size="sm" variant="outline">
              Open DET-143 <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-apple-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-navy-950 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                DET-143
              </span>
              <h3 className="text-sm font-bold text-slate-900">Student API returning incorrect attendance structure</h3>
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

          <p className="text-xs text-slate-700 font-medium">
            Frontend Lead (Tarun) logged API payload mismatch on GET /api/students. Backend Engineer (Rahul) linked PR #284 with SQL view updates.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-emerald-700 shadow-apple-sm">
              <span className="text-slate-500 block text-[10px] font-sans font-bold uppercase tracking-wider mb-1">Expected Frontend Structure</span>
              {`{\n  "student_id": 101,\n  "attendance": 95\n}`}
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-rose-700 shadow-apple-sm">
              <span className="text-slate-500 block text-[10px] font-sans font-bold uppercase tracking-wider mb-1">Actual Backend Response</span>
              {`{\n  "student": 101,\n  "attendance_percentage": null\n}`}
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Tickets Table */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-navy-950">Recent Engineering Tickets</h2>
          <Link href="/tickets" className="text-xs text-navy-700 font-semibold hover:underline">
            View all tickets →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Assignee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.slice(0, 5).map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-navy-950">
                    <Link href={`/tickets/${ticket.ticket_number}`}>{ticket.ticket_number}</Link>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <Link href={`/tickets/${ticket.ticket_number}`} className="hover:text-navy-700">
                      {ticket.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] ${TICKET_TYPE_COLORS[ticket.type]}`}>
                      {TICKET_TYPE_LABELS[ticket.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] ${STATUS_COLORS[ticket.status]}`}>
                      {STATUS_LABELS[ticket.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] ${PRIORITY_COLORS[ticket.priority]}`}>
                      {PRIORITY_LABELS[ticket.priority]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {ticket.assignee ? (
                      <div className="flex items-center gap-1.5">
                        <img src={ticket.assignee.avatar_url} className="w-5 h-5 rounded-full object-cover" />
                        <span className="font-medium text-slate-800">{ticket.assignee.full_name}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
