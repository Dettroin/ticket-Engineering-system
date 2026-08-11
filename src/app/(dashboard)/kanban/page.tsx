'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { KANBAN_STAGES, STATUS_COLORS, TICKET_TYPE_COLORS, TICKET_TYPE_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types/tickets';
import { TicketStatus } from '@/types/database';
import { Columns, Search, Filter, Plus, ArrowRight, UserCheck, Code } from 'lucide-react';
import Link from 'next/link';

export default function KanbanPage() {
  const { tickets, users, updateTicketStatus } = useAuth();
  const [search, setSearch] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = t.ticket_number.toLowerCase().includes(search.toLowerCase()) || t.title.toLowerCase().includes(search.toLowerCase());
    const matchesAssignee = assigneeFilter === 'all' || t.assignee_id === assigneeFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesAssignee && matchesPriority;
  });

  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    e.dataTransfer.setData('text/plain', ticketId);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TicketStatus) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('text/plain');
    if (ticketId) {
      updateTicketStatus(ticketId, targetStatus);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const userOptions = [
    { value: 'all', label: 'All Assignees' },
    ...users.map((u) => ({ value: u.id, label: u.full_name })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Columns className="w-5 h-5 text-dettroin-400" /> Interactive Kanban Board
          </h1>
          <p className="text-xs text-slate-400">Drag and drop tickets across 9 engineering workflow columns</p>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-lg">
        <div className="w-full md:w-72">
          <Input
            placeholder="Search DET-143, title..."
            icon={<Search className="w-4 h-4 text-slate-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select options={userOptions} value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)} className="w-44" />
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
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="flex gap-4 overflow-x-auto pb-6 min-h-[650px] snap-x">
        {KANBAN_STAGES.map((stage) => {
          const stageTickets = filteredTickets.filter((t) => t.status === stage.id);

          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              className="w-72 shrink-0 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex flex-col snap-start overflow-hidden shadow-xl"
            >
              {/* Stage Column Header */}
              <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.id === 'blocked' ? 'bg-rose-500 animate-ping' : stage.id === 'in_progress' ? 'bg-amber-500' : 'bg-slate-600'}`} />
                  <h3 className="text-xs font-bold text-slate-200">{stage.name}</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                  {stageTickets.length}
                </span>
              </div>

              {/* Tickets Cards Area */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[580px]">
                {stageTickets.length === 0 ? (
                  <div className="h-24 border border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-[11px] text-slate-600 font-mono">
                    Drop ticket here
                  </div>
                ) : (
                  stageTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ticket.id)}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 shadow-md hover:shadow-lg transition-all duration-150 cursor-grab active:cursor-grabbing space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-dettroin-400 bg-dettroin-950 px-2 py-0.5 rounded border border-dettroin-800">
                          {ticket.ticket_number}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${PRIORITY_COLORS[ticket.priority]}`}>
                          {PRIORITY_LABELS[ticket.priority]}
                        </span>
                      </div>

                      <Link href={`/tickets/${ticket.ticket_number}`} className="block text-xs font-semibold text-slate-100 group-hover:text-dettroin-300 line-clamp-2">
                        {ticket.title}
                      </Link>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                        <span className={`px-1.5 py-0.2 rounded border ${TICKET_TYPE_COLORS[ticket.type]}`}>
                          {TICKET_TYPE_LABELS[ticket.type]}
                        </span>
                        {ticket.assignee && (
                          <div className="flex items-center gap-1">
                            <img src={ticket.assignee.avatar_url} className="w-4 h-4 rounded-full object-cover" />
                            <span className="truncate max-w-[80px]">{ticket.assignee.full_name.split(' ')[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
