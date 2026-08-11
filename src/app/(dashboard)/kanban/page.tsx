'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { KANBAN_STAGES, TICKET_TYPE_COLORS, TICKET_TYPE_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types/tickets';
import { TicketStatus } from '@/types/database';
import { Columns, Search } from 'lucide-react';
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
    <div className="space-y-6 font-sf-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-950 flex items-center gap-2 font-sf-display">
            <Columns className="w-5 h-5 text-navy-800" /> Interactive Kanban Board
          </h1>
          <p className="text-xs text-slate-500 font-medium">Drag and drop tickets across 9 engineering workflow columns</p>
        </div>
      </div>

      {/* Controls */}
      <Card className="flex flex-col md:flex-row gap-3 items-center justify-between">
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
      </Card>

      {/* Kanban Board Grid */}
      <div className="flex gap-4 overflow-x-auto pb-6 min-h-[650px] snap-x">
        {KANBAN_STAGES.map((stage) => {
          const stageTickets = filteredTickets.filter((t) => t.status === stage.id);

          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              className="w-72 shrink-0 bg-slate-100/70 border border-slate-200/90 rounded-3xl flex flex-col snap-start overflow-hidden shadow-apple-sm"
            >
              {/* Column Header */}
              <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.id === 'blocked' ? 'bg-rose-500 animate-pulse' : stage.id === 'in_progress' ? 'bg-amber-500' : 'bg-navy-700'}`} />
                  <h3 className="text-xs font-bold text-navy-950 font-sf-display">{stage.name}</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                  {stageTickets.length}
                </span>
              </div>

              {/* Tickets Area */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[580px]">
                {stageTickets.length === 0 ? (
                  <div className="h-24 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-[11px] text-slate-400 font-mono">
                    Drop ticket here
                  </div>
                ) : (
                  stageTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ticket.id)}
                      className="bg-white border border-slate-200 hover:border-navy-300 rounded-2xl p-3.5 shadow-apple-sm hover:shadow-apple-md transition-all duration-150 cursor-grab active:cursor-grabbing space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-navy-950 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          {ticket.ticket_number}
                        </span>
                        <span className={`text-[10px] px-2 py-0.2 rounded-full border font-semibold ${PRIORITY_COLORS[ticket.priority]}`}>
                          {PRIORITY_LABELS[ticket.priority]}
                        </span>
                      </div>

                      <Link href={`/tickets/${ticket.ticket_number}`} className="block text-xs font-bold text-slate-900 group-hover:text-navy-700 line-clamp-2">
                        {ticket.title}
                      </Link>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                        <span className={`px-2 py-0.2 rounded-full border font-semibold ${TICKET_TYPE_COLORS[ticket.type]}`}>
                          {TICKET_TYPE_LABELS[ticket.type]}
                        </span>
                        {ticket.assignee && (
                          <div className="flex items-center gap-1 font-medium">
                            <Avatar name={ticket.assignee.full_name} size="xs" />
                            <span className="truncate max-w-[80px] text-slate-700">{ticket.assignee.full_name.split(' ')[0]}</span>
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
