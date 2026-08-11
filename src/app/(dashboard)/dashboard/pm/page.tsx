'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { STATUS_COLORS, STATUS_LABELS, TICKET_TYPE_COLORS, TICKET_TYPE_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types/tickets';
import {
  FolderKanban,
  Zap,
  Clock,
  AlertOctagon,
  Users,
  CheckSquare,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function PMDashboardPage() {
  const { user, projects, tickets, sprints, users } = useAuth();

  const activeSprint = sprints.find((s) => s.status === 'active');
  const sprintTickets = tickets.filter((t) => t.sprint_id === activeSprint?.id);
  const totalPoints = sprintTickets.reduce((acc, curr) => acc + (curr.story_points || 0), 0);
  const completedPoints = sprintTickets
    .filter((t) => t.status === 'resolved' || t.status === 'closed')
    .reduce((acc, curr) => acc + (curr.story_points || 0), 0);
  const sprintProgress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  const unassignedTickets = tickets.filter((t) => !t.assignee_id);
  const blockedTickets = tickets.filter((t) => t.status === 'blocked');
  const overdueTickets = tickets.filter((t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'resolved' && t.status !== 'closed');
  const waitingForQA = tickets.filter((t) => t.status === 'code_review' || t.status === 'ready_for_testing' || t.status === 'testing');

  return (
    <PermissionGuard allowedRoles={['super_admin', 'admin', 'project_manager', 'team_lead']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-navy-950 text-white rounded-3xl p-6 shadow-apple-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 text-white rounded-2xl border border-white/20 shadow-lg">
              <FolderKanban className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Project Manager Control Dashboard</h1>
                <span className="text-[10px] bg-blue-500 text-white font-bold px-2 py-0.5 rounded-full">
                  PM Mode
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">Project timelines, developer workloads, sprint velocity, & blocker tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/sprints">
              <Button size="sm" variant="glass">
                <Zap className="w-4 h-4" /> Manage Sprints
              </Button>
            </Link>
            <Link href="/kanban">
              <Button size="sm" variant="secondary">
                <FolderKanban className="w-4 h-4 text-navy-950" /> Open Kanban Board
              </Button>
            </Link>
          </div>
        </div>

        {/* PM KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-teal-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Sprint Progress</p>
                <h3 className="text-2xl font-black text-teal-800 mt-1">{sprintProgress}%</h3>
              </div>
              <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl border border-teal-100">
                <Zap className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 font-semibold">{completedPoints} / {totalPoints} Story Points</p>
          </Card>

          <Card className="border-l-4 border-l-rose-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Blocked Tickets</p>
                <h3 className="text-2xl font-black text-rose-700 mt-1">{blockedTickets.length}</h3>
              </div>
              <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100">
                <AlertOctagon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 font-semibold">Requires immediate PM intervention</p>
          </Card>

          <Card className="border-l-4 border-l-amber-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Unassigned Tickets</p>
                <h3 className="text-2xl font-black text-amber-800 mt-1">{unassignedTickets.length}</h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-800 rounded-2xl border border-amber-100">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 font-semibold">Awaiting developer allocation</p>
          </Card>

          <Card className="border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Waiting for QA</p>
                <h3 className="text-2xl font-black text-blue-700 mt-1">{waitingForQA.length}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
                <CheckSquare className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 font-semibold">Ready for testing validation</p>
          </Card>
        </div>

        {/* Developer Workload Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="space-y-4">
            <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-navy-800" /> Developer Workload Distribution
            </h2>
            <div className="space-y-3">
              {users.map((member) => {
                const assigned = tickets.filter((t) => t.assignee_id === member.id && t.status !== 'closed' && t.status !== 'resolved');
                const points = assigned.reduce((acc, curr) => acc + (curr.story_points || 0), 0);

                return (
                  <div key={member.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 shadow-apple-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={member.avatar_url} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-bold text-navy-950">{member.full_name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{member.job_title}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-navy-950 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                        {assigned.length} Active ({points} pts)
                      </span>
                    </div>

                    {/* Active Ticket Titles */}
                    {assigned.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-slate-200/80">
                        {assigned.map((t) => (
                          <Link key={t.id} href={`/tickets/${t.ticket_number}`} className="block text-[11px] font-semibold text-slate-700 hover:text-navy-950 truncate">
                            <span className="font-mono text-blue-700 mr-1.5">{t.ticket_number}</span>
                            {t.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-600" /> Action Required: Blocked & Unassigned Tickets
            </h2>
            <div className="space-y-2.5">
              {[...blockedTickets, ...unassignedTickets].map((t) => (
                <div key={t.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between shadow-apple-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-navy-950 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        {t.ticket_number}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLORS[t.status]}`}>
                        {STATUS_LABELS[t.status]}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">{t.title}</p>
                  </div>
                  <Link href={`/tickets/${t.ticket_number}`}>
                    <Button size="sm" variant="outline">
                      Manage →
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  );
}
