'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { STATUS_COLORS, STATUS_LABELS, TICKET_TYPE_COLORS, TICKET_TYPE_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types/tickets';
import { Ticket as TicketIcon, Plus, Search, Filter, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function TicketsPage() {
  const { tickets, users } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticket_number.toLowerCase().includes(search.toLowerCase()) ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.module?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <TicketIcon className="w-5 h-5 text-dettroin-400" /> Engineering Ticket Central
          </h1>
          <p className="text-xs text-slate-400">All technical bugs, tasks, API issues, and feature requests</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-lg">
        <div className="w-full md:w-72">
          <Input
            placeholder="Search tickets, DET-143, title..."
            icon={<Search className="w-4 h-4 text-slate-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Select
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'open', label: 'Open' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'blocked', label: 'Blocked' },
              { value: 'code_review', label: 'Code Review' },
              { value: 'ready_for_testing', label: 'Ready for Testing' },
              { value: 'testing', label: 'Testing' },
              { value: 'resolved', label: 'Resolved' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40"
          />

          <Select
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'urgent', label: 'Urgent' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-36"
          />

          <Select
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'api_issue', label: 'API Issue' },
              { value: 'bug', label: 'Bug' },
              { value: 'feature', label: 'Feature' },
              { value: 'database_issue', label: 'Database Issue' },
              { value: 'ui_issue', label: 'UI Issue' },
            ]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-36"
          />
        </div>
      </div>

      {/* Ticket List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Ticket ID</th>
                <th className="px-4 py-3.5">Title & Module</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Priority</th>
                <th className="px-4 py-3.5">Assignee</th>
                <th className="px-4 py-3.5">Reporter</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="px-4 py-3.5 font-mono font-bold text-dettroin-400">
                    <Link href={`/tickets/${ticket.ticket_number}`} className="bg-dettroin-950 px-2 py-1 rounded border border-dettroin-800 hover:border-dettroin-500">
                      {ticket.ticket_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/tickets/${ticket.ticket_number}`} className="font-semibold text-slate-100 hover:text-dettroin-300 transition-colors block">
                      {ticket.title}
                    </Link>
                    <span className="text-[10px] text-slate-400">{ticket.module || 'General'}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded border text-[10px] font-medium ${TICKET_TYPE_COLORS[ticket.type]}`}>
                      {TICKET_TYPE_LABELS[ticket.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded border text-[10px] font-medium ${STATUS_COLORS[ticket.status]}`}>
                      {STATUS_LABELS[ticket.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded border text-[10px] font-medium ${PRIORITY_COLORS[ticket.priority]}`}>
                      {PRIORITY_LABELS[ticket.priority]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {ticket.assignee ? (
                      <div className="flex items-center gap-1.5">
                        <img src={ticket.assignee.avatar_url} className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-slate-200">{ticket.assignee.full_name}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {ticket.reporter ? (
                      <div className="flex items-center gap-1.5">
                        <img src={ticket.reporter.avatar_url} className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-slate-400">{ticket.reporter.full_name}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500">System</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link href={`/tickets/${ticket.ticket_number}`}>
                      <Button size="sm" variant="ghost" className="text-dettroin-400 hover:text-white">
                        Open <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
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
