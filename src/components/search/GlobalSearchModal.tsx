'use client';

import React, { useState, useEffect } from 'react';
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
          <Search className="w-5 h-5 absolute left-3 text-dettroin-400" />
          <input
            autoFocus
            type="text"
            placeholder="Type ticket ID (e.g. DET-143), title, project, or developer name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-dettroin-500 focus:ring-1 focus:ring-dettroin-500 shadow-inner"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto space-y-4 pr-1">
          {/* Tickets Results */}
          {filteredTickets.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <TicketIcon className="w-3.5 h-3.5 text-dettroin-400" /> Tickets ({filteredTickets.length})
              </div>
              <div className="space-y-1.5">
                {filteredTickets.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tickets/${t.ticket_number}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-dettroin-400 bg-dettroin-950 px-2 py-0.5 rounded border border-dettroin-800">
                        {t.ticket_number}
                      </span>
                      <span className="text-xs text-slate-200 group-hover:text-white font-medium line-clamp-1">
                        {t.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${STATUS_COLORS[t.status]}`}>
                        {STATUS_LABELS[t.status]}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects Results */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-indigo-400" /> Projects ({filteredProjects.length})
              </div>
              <div className="space-y-1.5">
                {filteredProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                        {p.key}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.client_name}</p>
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
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-teal-400" /> Team Members ({filteredUsers.length})
              </div>
              <div className="space-y-1.5">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatar_url} alt={u.full_name} className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-medium text-slate-200">{u.full_name}</p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
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
