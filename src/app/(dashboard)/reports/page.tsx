'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { BarChart3, TrendingUp, Bug, CheckCircle2, AlertOctagon, Clock } from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS } from '@/types/tickets';
import { TicketStatus } from '@/types/database';

export default function ReportsPage() {
  const { tickets, projects, sprints } = useAuth();

  const total = tickets.length;
  const bugs = tickets.filter((t) => t.type === 'bug' || t.type === 'api_issue' || t.type === 'database_issue').length;
  const features = tickets.filter((t) => t.type === 'feature' || t.type === 'improvement').length;
  const tasks = total - bugs - features;

  const resolved = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-dettroin-400" /> Engineering Reports & Performance Analytics
        </h1>
        <p className="text-xs text-slate-400">KPI metrics, bug resolution velocity, & team performance ratios</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-800 bg-slate-900/90 space-y-2">
          <p className="text-xs font-bold uppercase text-slate-400">Overall Resolution Velocity</p>
          <h3 className="text-3xl font-black text-emerald-400">{resolutionRate}%</h3>
          <p className="text-[11px] text-slate-500">{resolved} of {total} tickets resolved</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/90 space-y-2">
          <p className="text-xs font-bold uppercase text-slate-400">Bugs vs Features Ratio</p>
          <h3 className="text-3xl font-black text-dettroin-400">{bugs} : {features}</h3>
          <p className="text-[11px] text-slate-500">{bugs} Technical Bugs, {features} Features</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/90 space-y-2">
          <p className="text-xs font-bold uppercase text-slate-400">Average Sprint Velocity</p>
          <h3 className="text-3xl font-black text-teal-400">18 pts</h3>
          <p className="text-[11px] text-slate-500">Story points completed per 2-week iteration</p>
        </Card>
      </div>

      {/* Ticket Breakdown */}
      <Card className="space-y-4 border-slate-800 bg-slate-900/90">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Tickets Distribution By Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(STATUS_LABELS).map(([statusKey, label]) => {
            const count = tickets.filter((t) => t.status === statusKey).length;
            return (
              <div key={statusKey} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${STATUS_COLORS[statusKey as TicketStatus]}`}>
                  {label}
                </span>
                <p className="text-xl font-bold text-slate-100">{count}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
