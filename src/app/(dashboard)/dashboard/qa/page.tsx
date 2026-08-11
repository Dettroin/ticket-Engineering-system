'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { STATUS_COLORS, STATUS_LABELS, TICKET_TYPE_COLORS, TICKET_TYPE_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types/tickets';
import { CheckSquare, Bug, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function QADashboardPage() {
  const { user, tickets } = useAuth();

  const readyForTesting = tickets.filter((t) => t.status === 'ready_for_testing' || t.status === 'code_review');
  const testingInProg = tickets.filter((t) => t.status === 'testing');
  const changesRequested = tickets.filter((t) => t.status === 'changes_requested');
  const resolved = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed');

  return (
    <PermissionGuard allowedRoles={['super_admin', 'admin', 'project_manager', 'team_lead', 'qa_tester']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-navy-950 text-white rounded-3xl p-6 shadow-apple-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 text-white rounded-2xl border border-white/20 shadow-lg">
              <ShieldCheck className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">QA / Testing Command Center</h1>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                  QA Tester Mode
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">Bug triage, reproduction verification, & test approval queue for {user?.full_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/tickets">
              <Button size="sm" variant="glass">
                <Bug className="w-4 h-4" /> All Reported Bugs
              </Button>
            </Link>
          </div>
        </div>

        {/* QA KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-cyan-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Ready for Testing</p>
                <h3 className="text-2xl font-black text-cyan-700 mt-1">{readyForTesting.length}</h3>
              </div>
              <div className="p-3 bg-cyan-50 text-cyan-700 rounded-2xl border border-cyan-100">
                <CheckSquare className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 font-semibold">PRs merged & ready for verification</p>
          </Card>

          <Card className="border-l-4 border-l-teal-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Testing In Progress</p>
                <h3 className="text-2xl font-black text-teal-800 mt-1">{testingInProg.length}</h3>
              </div>
              <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl border border-teal-100">
                <Bug className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 font-semibold">Active QA test scripts running</p>
          </Card>

          <Card className="border-l-4 border-l-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Changes Requested</p>
                <h3 className="text-2xl font-black text-orange-800 mt-1">{changesRequested.length}</h3>
              </div>
              <div className="p-3 bg-orange-50 text-orange-800 rounded-2xl border border-orange-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 font-semibold">Failed QA verification test</p>
          </Card>

          <Card className="border-l-4 border-l-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Approved & Resolved</p>
                <h3 className="text-2xl font-black text-emerald-700 mt-1">{resolved.length}</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 font-semibold">Passed QA verification</p>
          </Card>
        </div>

        {/* Ready For Testing Queue */}
        <Card className="space-y-4">
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">Pending QA Testing Queue ({readyForTesting.length})</h2>

          <div className="space-y-3">
            {readyForTesting.map((t) => (
              <div key={t.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between shadow-apple-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-navy-950 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {t.ticket_number}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${TICKET_TYPE_COLORS[t.type]}`}>
                      {TICKET_TYPE_LABELS[t.type]}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${PRIORITY_COLORS[t.priority]}`}>
                      {PRIORITY_LABELS[t.priority]}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-navy-950">{t.title}</h3>
                  <p className="text-xs text-slate-600 font-medium">Assigned Developer: {t.assignee?.full_name || 'Unassigned'}</p>
                </div>
                <Link href={`/tickets/${t.ticket_number}`}>
                  <Button size="sm">
                    Start QA Review <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PermissionGuard>
  );
}
