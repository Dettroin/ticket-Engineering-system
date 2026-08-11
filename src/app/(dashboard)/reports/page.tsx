'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { BarChart3 } from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS } from '@/types/tickets';
import { TicketStatus } from '@/types/database';

export default function ReportsPage() {
  const { tickets } = useAuth();

  const total = tickets.length;
  const bugs = tickets.filter((t) => t.type === 'bug' || t.type === 'api_issue' || t.type === 'database_issue').length;
  const features = tickets.filter((t) => t.type === 'feature' || t.type === 'improvement').length;

  const resolved = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-navy-950 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-navy-800" /> Engineering Reports & Performance Analytics
        </h1>
        <p className="text-xs text-slate-500 font-medium">KPI metrics, bug resolution velocity, & team performance ratios</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="space-y-2">
          <p className="text-xs font-bold uppercase text-slate-500">Overall Resolution Velocity</p>
          <h3 className="text-3xl font-black text-emerald-600">{resolutionRate}%</h3>
          <p className="text-[11px] text-slate-500 font-medium">{resolved} of {total} tickets resolved</p>
        </Card>

        <Card className="space-y-2">
          <p className="text-xs font-bold uppercase text-slate-500">Bugs vs Features Ratio</p>
          <h3 className="text-3xl font-black text-navy-950">{bugs} : {features}</h3>
          <p className="text-[11px] text-slate-500 font-medium">{bugs} Technical Bugs, {features} Features</p>
        </Card>

        <Card className="space-y-2">
          <p className="text-xs font-bold uppercase text-slate-500">Average Sprint Velocity</p>
          <h3 className="text-3xl font-black text-teal-700">18 pts</h3>
          <p className="text-[11px] text-slate-500 font-medium">Story points completed per 2-week iteration</p>
        </Card>
      </div>

      {/* Ticket Breakdown */}
      <Card className="space-y-4">
        <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">Tickets Distribution By Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(STATUS_LABELS).map(([statusKey, label]) => {
            const count = tickets.filter((t) => t.status === statusKey).length;
            return (
              <div key={statusKey} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 shadow-apple-sm">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLORS[statusKey as TicketStatus]}`}>
                  {label}
                </span>
                <p className="text-2xl font-black text-navy-950">{count}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
