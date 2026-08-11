'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { Zap, Calendar, Plus, CheckCircle2, Ticket as TicketIcon, Clock } from 'lucide-react';
import { STATUS_COLORS, STATUS_LABELS } from '@/types/tickets';

export default function SprintsPage() {
  const { sprints, tickets, createSprint, canManageSprintsPermission } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    createSprint({
      name,
      goal,
      start_date: startDate || new Date().toISOString().split('T')[0],
      end_date: endDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    });

    setIsModalOpen(false);
    setName('');
    setGoal('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-400" /> Sprint Management
          </h1>
          <p className="text-xs text-slate-400">Plan iterations, track story points, & drive engineering velocity</p>
        </div>

        {canManageSprintsPermission && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" /> Create Sprint
          </Button>
        )}
      </div>

      {/* Sprints List */}
      <div className="space-y-6">
        {sprints.map((sprint) => {
          const sprintTickets = tickets.filter((t) => t.sprint_id === sprint.id);
          const totalPoints = sprintTickets.reduce((acc, curr) => acc + (curr.story_points || 0), 0);
          const completedTickets = sprintTickets.filter((t) => t.status === 'resolved' || t.status === 'closed');
          const completedPoints = completedTickets.reduce((acc, curr) => acc + (curr.story_points || 0), 0);
          const progressPercent = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

          return (
            <Card key={sprint.id} className="space-y-4 border-slate-800 bg-slate-900/90">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-bold text-slate-100">{sprint.name}</h2>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium uppercase ${sprint.status === 'active' ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      {sprint.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Goal: {sprint.goal || 'No goal set'}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{sprint.start_date} → {sprint.end_date}</span>
                  </div>
                  <div className="font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                    <span className="text-teal-400 font-bold">{completedPoints}</span> / {totalPoints} Story Points ({progressPercent}%)
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-dettroin-500 to-teal-400 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>

              {/* Sprint Tickets */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sprint Backlog ({sprintTickets.length} Tickets)</h3>
                <div className="space-y-1.5">
                  {sprintTickets.map((ticket) => (
                    <div key={ticket.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-dettroin-400 bg-dettroin-950 px-2 py-0.5 rounded border border-dettroin-800">
                          {ticket.ticket_number}
                        </span>
                        <span className="text-xs text-slate-200 font-semibold">{ticket.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${STATUS_COLORS[ticket.status]}`}>
                          {STATUS_LABELS[ticket.status]}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {ticket.story_points} pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* New Sprint Modal */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Sprint">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Sprint Name *" placeholder="e.g. Sprint 26 - Payment Integration" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Sprint Goal" placeholder="e.g. Complete Razorpay API integration" value={goal} onChange={(e) => setGoal(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Sprint</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
