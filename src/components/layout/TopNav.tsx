'use client';

import React from 'react';
import { Search, Plus, Command } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NotificationCenter } from './NotificationCenter';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { ROLE_BADGE_COLORS, ROLE_LABELS } from '@/types/rbac';

interface TopNavProps {
  onOpenCreateTicket: () => void;
  onOpenGlobalSearch: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenCreateTicket, onOpenGlobalSearch }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Search Input Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenGlobalSearch}
          className="w-full flex items-center justify-between bg-slate-100/80 border border-slate-200/80 hover:bg-white hover:border-slate-300 text-slate-500 px-3.5 py-2 rounded-xl text-xs transition-all duration-150 group shadow-apple-sm"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-navy-900 transition-colors" />
            <span className="font-medium text-slate-600">Search tickets, DET-143, projects, users...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 bg-white border border-slate-200 text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded-md shadow-apple-sm">
            <Command className="w-2.5 h-2.5" /> /
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Create Ticket Button */}
        <Button onClick={onOpenCreateTicket} size="sm" className="hidden sm:flex">
          <Plus className="w-4 h-4" />
          <span>Create Ticket</span>
        </Button>

        <button
          onClick={onOpenCreateTicket}
          className="sm:hidden p-2 bg-navy-950 text-white rounded-xl shadow-apple-sm"
          title="Create Ticket"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <NotificationCenter />

        {/* User Info Pill */}
        {user && (
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <Avatar src={user.avatar_url} name={user.full_name} size="sm" />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-navy-950 leading-tight">{user.full_name}</p>
              <span className={`text-[10px] px-2 py-0.2 rounded-full border font-semibold ${ROLE_BADGE_COLORS[user.role]}`}>
                {ROLE_LABELS[user.role]}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
