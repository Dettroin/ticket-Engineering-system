'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { STATUS_COLORS, STATUS_LABELS } from '@/types/tickets';
import { FolderKanban, CheckCircle2, Ticket as TicketIcon, Plus } from 'lucide-react';

export default function ClientDashboardPage() {
  const { user, projects, tickets } = useAuth();

  const total = tickets.length;
  const resolved = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
  const progressPercent = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-navy-950 text-white rounded-3xl p-6 shadow-apple-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Client Portal Dashboard</h1>
            <span className="text-[10px] bg-slate-200 text-slate-900 font-bold px-2 py-0.5 rounded-full">
              Client Mode
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">High-level project status & feature delivery tracking for Apex Education Trust</p>
        </div>

        <Button size="sm" variant="glass">
          <Plus className="w-4 h-4" /> Submit Client Feedback
        </Button>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="space-y-2">
          <p className="text-xs font-bold uppercase text-slate-500">Overall Project Completion</p>
          <h3 className="text-3xl font-black text-navy-950">{progressPercent}%</h3>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200 mt-2">
            <div className="bg-navy-950 h-full transition-all duration-300 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </Card>

        <Card className="space-y-2">
          <p className="text-xs font-bold uppercase text-slate-500">Active Applications</p>
          <h3 className="text-3xl font-black text-navy-950">{projects.length}</h3>
          <p className="text-[11px] text-slate-500 font-medium">School ERP & Admissions Portal</p>
        </Card>

        <Card className="space-y-2">
          <p className="text-xs font-bold uppercase text-slate-500">Delivered Features</p>
          <h3 className="text-3xl font-black text-emerald-600">{resolved}</h3>
          <p className="text-[11px] text-slate-500 font-medium">{total - resolved} currently in development</p>
        </Card>
      </div>

      {/* Projects List */}
      <Card className="space-y-4">
        <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">Designated Client Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 shadow-apple-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-navy-950">{p.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">{p.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
