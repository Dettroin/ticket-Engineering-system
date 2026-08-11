'use client';

import React, { useState } from 'react';
import { Search, Ticket as TicketIcon, FolderKanban, User as UserIcon, X, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Dialog } from '@/components/ui/Dialog';
import { STATUS_COLORS, STATUS_LABELS } from '@/types/tickets';
import Link from 'next/link';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { tickets, projects, users } = useAuth();
  const [query, setQuery] = useState('');

  const filteredTickets = tickets.filter(
    (t) =>
      t.ticket_number.toLowerCase().includes(query.toLowerCase()) ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description?.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.key.toLowerCase().includes(query.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) => u.full_name.toLowerCase().includes(query.toLowerCase()) || u.role.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Global Search" maxWidth="2xl">
      <div className="space-y-4">
        {/* Search Input Box */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 absolute left-3.5 text-navy-600" />
          <input
            autoFocus
            type="text"
            placeholder="Search DET-143, title, project, or team member..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 shadow-apple-sm transition-all"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3.5 text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto space-y-4 pr-1">
          {/* Tickets Results */}
          {filteredTickets.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <TicketIcon className="w-3.5 h-3.5 text-navy-800" /> Tickets ({filteredTickets.length})
              </div>
              <div className="space-y-1.5">
                {filteredTickets.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tickets/${t.ticket_number}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-apple-sm border border-slate-200/80 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-navy-950 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {t.ticket_number}
                      </span>
                      <span className="text-xs text-slate-800 group-hover:text-navy-950 font-semibold line-clamp-1">
                        {t.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${STATUS_COLORS[t.status]}`}>
                        {STATUS_LABELS[t.status]}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-navy-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects Results */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-indigo-600" /> Projects ({filteredProjects.length})
              </div>
              <div className="space-y-1.5">
                {filteredProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-apple-sm border border-slate-200/80 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        {p.key}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-navy-950">{p.name}</p>
                        <p className="text-[10px] text-slate-500">{p.client_name}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Users Results */}
          {filteredUsers.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-teal-600" /> Team Members ({filteredUsers.length})
              </div>
              <div className="space-y-1.5">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatar_url} alt={u.full_name} className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-semibold text-navy-950">{u.full_name}</p>
                        <p className="text-[10px] text-slate-500">{u.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 font-mono">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredTickets.length === 0 && filteredProjects.length === 0 && filteredUsers.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching tickets, projects, or users found for "{query}"
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
