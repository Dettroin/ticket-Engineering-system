'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { STATUS_COLORS, STATUS_LABELS, TICKET_TYPE_COLORS, TICKET_TYPE_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types/tickets';
import { CheckSquare, UserCheck, Code } from 'lucide-react';
import Link from 'next/link';

export default function MyWorkPage() {
  const { user, tickets } = useAuth();

  const myAssigned = tickets.filter((t) => t.assignee_id === user?.id);

  // Cross-team Dependency Lists
  const waitingForBackend = tickets.filter((t) => (t.type === 'api_issue' || t.type === 'database_issue') && t.status !== 'resolved' && t.status !== 'closed');
  const waitingForFrontend = tickets.filter((t) => (t.type === 'ui_issue' || t.status === 'ready_for_testing') && t.status !== 'resolved' && t.status !== 'closed');
  const waitingForQA = tickets.filter((t) => t.status === 'code_review' || t.status === 'ready_for_testing' || t.status === 'testing');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-navy-950 flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-navy-800" /> My Personal Workstation
        </h1>
        <p className="text-xs text-slate-500 font-medium">Assigned tickets, cross-team dependencies, & pending reviews for {user?.full_name}</p>
      </div>

      {/* Cross-Team Dependency Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-purple-600 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
            <Code className="w-4 h-4" /> Waiting for Backend ({waitingForBackend.length})
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">API payload schema fixes or database queries</p>
          <div className="space-y-1.5 pt-2">
            {waitingForBackend.map((t) => (
              <Link key={t.id} href={`/tickets/${t.ticket_number}`} className="block p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 text-xs text-slate-800 font-semibold transition-all">
                <span className="font-mono text-purple-700 font-bold mr-1.5">{t.ticket_number}</span>
                {t.title}
              </Link>
            ))}
          </div>
        </Card>

        <Card className="border-l-4 border-l-sky-600 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
            <Code className="w-4 h-4" /> Waiting for Frontend ({waitingForFrontend.length})
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">UI component updates or integration</p>
          <div className="space-y-1.5 pt-2">
            {waitingForFrontend.map((t) => (
              <Link key={t.id} href={`/tickets/${t.ticket_number}`} className="block p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 text-xs text-slate-800 font-semibold transition-all">
                <span className="font-mono text-sky-700 font-bold mr-1.5">{t.ticket_number}</span>
                {t.title}
              </Link>
            ))}
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-600 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> Waiting for QA Review ({waitingForQA.length})
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">Tickets marked Code Review / Testing</p>
          <div className="space-y-1.5 pt-2">
            {waitingForQA.map((t) => (
              <Link key={t.id} href={`/tickets/${t.ticket_number}`} className="block p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 text-xs text-slate-800 font-semibold transition-all">
                <span className="font-mono text-amber-800 font-bold mr-1.5">{t.ticket_number}</span>
                {t.title}
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* My Assigned Tickets Table */}
      <Card className="space-y-4">
        <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">Tickets Assigned To Me ({myAssigned.length})</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Ticket ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myAssigned.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-navy-950">{t.ticket_number}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{t.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] ${TICKET_TYPE_COLORS[t.type]}`}>
                      {TICKET_TYPE_LABELS[t.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] ${STATUS_COLORS[t.status]}`}>
                      {STATUS_LABELS[t.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] ${PRIORITY_COLORS[t.priority]}`}>
                      {PRIORITY_LABELS[t.priority]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/tickets/${t.ticket_number}`}>
                      <Button size="sm" variant="ghost">Open →</Button>
                    </Link>
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
