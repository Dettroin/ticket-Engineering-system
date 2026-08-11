'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { ROLE_BADGE_COLORS, ROLE_LABELS } from '@/types/rbac';
import { STATUS_COLORS, STATUS_LABELS, TICKET_TYPE_COLORS, TICKET_TYPE_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types/tickets';
import { TicketStatus } from '@/types/database';
import {
  ShieldCheck,
  FolderKanban,
  Users,
  Ticket as TicketIcon,
  AlertOctagon,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { organization, users, projects, tickets, sprints } = useAuth();

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const totalDevelopers = users.length;
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status !== 'closed' && t.status !== 'resolved').length;
  const criticalBugs = tickets.filter((t) => (t.priority === 'urgent' || t.severity === 'critical' || t.severity === 'blocker') && t.status !== 'resolved' && t.status !== 'closed').length;
  const blockedTickets = tickets.filter((t) => t.status === 'blocked').length;

  const resolvedThisWeek = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;

  return (
    <PermissionGuard allowedRoles={['super_admin', 'admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-navy-950 text-white rounded-3xl p-6 shadow-apple-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 text-white rounded-2xl border border-white/20 shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">{organization.name} Organization Admin Dashboard</h1>
                <span className="text-[10px] bg-purple-500 text-white font-bold px-2 py-0.5 rounded-full">
                  System Admin Mode
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">Organization-wide metrics, developer performance, & system audit trail</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/teams">
              <Button size="sm" variant="glass">
                <Users className="w-4 h-4" /> Manage Team ({users.length})
              </Button>
            </Link>
            <Link href="/projects">
              <Button size="sm" variant="secondary">
                <FolderKanban className="w-4 h-4 text-navy-950" /> Manage Projects
              </Button>
            </Link>
          </div>
        </div>

        {/* Executive KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-navy-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Projects</p>
                <h3 className="text-2xl font-black text-navy-950 mt-1">{totalProjects}</h3>
              </div>
              <div className="p-3 bg-navy-50 text-navy-800 rounded-2xl border border-navy-100">
                <FolderKanban className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 font-semibold">{activeProjects} Active / 0 On Hold</p>
          </Card>

          <Card className="border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Engineering Team</p>
                <h3 className="text-2xl font-black text-blue-700 mt-1">{totalDevelopers}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 font-semibold">Across Frontend, Backend, QA, PM</p>
          </Card>

          <Card className="border-l-4 border-l-rose-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Critical Bugs</p>
                <h3 className="text-2xl font-black text-rose-700 mt-1">{criticalBugs}</h3>
              </div>
              <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100">
                <AlertOctagon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 font-semibold">{blockedTickets} Blocked items</p>
          </Card>

          <Card className="border-l-4 border-l-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Resolved This Week</p>
                <h3 className="text-2xl font-black text-emerald-700 mt-1">{resolvedThisWeek}</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 font-semibold">Resolution Velocity: High</p>
          </Card>
        </div>

        {/* Developer Performance & Workload Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="space-y-4">
            <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-navy-800" /> Developer Performance Matrix
            </h2>
            <div className="space-y-3">
              {users.map((dev) => {
                const assignedCount = tickets.filter((t) => t.assignee_id === dev.id).length;
                const completedCount = tickets.filter((t) => t.assignee_id === dev.id && (t.status === 'resolved' || t.status === 'closed')).length;

                return (
                  <div key={dev.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between shadow-apple-sm">
                    <div className="flex items-center gap-3">
                      <img src={dev.avatar_url} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-navy-950">{dev.full_name}</p>
                        <span className={`text-[10px] px-2 py-0.2 rounded-full border font-semibold ${ROLE_BADGE_COLORS[dev.role]}`}>
                          {ROLE_LABELS[dev.role]}
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <span className="font-bold text-navy-950">{completedCount}</span> / {assignedCount} Resolved
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-700" /> Organization Tickets by Status
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(STATUS_LABELS).slice(0, 8).map(([statusKey, label]) => {
                const count = tickets.filter((t) => t.status === statusKey).length;
                return (
                  <div key={statusKey} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 shadow-apple-sm">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLORS[statusKey as TicketStatus]}`}>
                      {label}
                    </span>
                    <p className="text-xl font-black text-navy-950">{count}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  );
}
