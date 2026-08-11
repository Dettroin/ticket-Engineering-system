'use client';

import React from 'react';
import { Search, Plus, Command, LogOut, ShieldCheck, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NotificationCenter } from './NotificationCenter';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { ROLE_BADGE_COLORS, ROLE_LABELS } from '@/types/rbac';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TopNavProps {
  onOpenCreateTicket: () => void;
  onOpenGlobalSearch: () => void;
  onToggleMobileMenu: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenCreateTicket,
  onOpenGlobalSearch,
  onToggleMobileMenu,
}) => {
  const { user, canReturnToAdmin, returnToAdminProfile, logout } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  const handleReturnAdmin = () => {
    returnToAdminProfile();
    router.push('/dashboard');
  };

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between gap-2">
      {/* Mobile Hamburger Toggle & Search Bar */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          title="Toggle Mobile Navigation Drawer"
        >
          <Menu className="w-5 h-5 text-navy-950" />
        </button>

        <button
          onClick={onOpenGlobalSearch}
          className="w-full flex items-center justify-between bg-slate-100/80 border border-slate-200/80 hover:bg-white hover:border-slate-300 text-slate-500 px-3 py-2 rounded-xl text-xs transition-all duration-150 group shadow-apple-sm"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-navy-900 transition-colors shrink-0" />
            <span className="font-medium text-slate-600 font-sf-text truncate text-[11px] sm:text-xs">Search DET-143, tickets, projects...</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-1 bg-white border border-slate-200 text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded-md shadow-apple-sm">
            <Command className="w-2.5 h-2.5" /> /
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Admin Return Button — ALWAYS visible for Admin sessions */}
        {canReturnToAdmin && (
          <Button
            size="sm"
            onClick={handleReturnAdmin}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold font-sf-text shadow-apple-sm text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Return to Admin</span>
            <span className="sm:hidden">Admin</span>
          </Button>
        )}

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
          <Plus className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <NotificationCenter />

        {/* User Profile Avatar Link */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <Link href="/settings" className="flex items-center gap-2 group" title="Click to view My Profile">
              <Avatar name={user.full_name} size="sm" />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-navy-950 leading-tight group-hover:text-blue-600 transition-colors font-sf-text">{user.full_name}</p>
                <span className={`text-[10px] px-2 py-0.2 rounded-full border font-semibold ${ROLE_BADGE_COLORS[user.role] || 'bg-navy-950 text-white'}`}>
                  {ROLE_LABELS[user.role] || user.role}
                </span>
              </div>
            </Link>

            <button
              onClick={handleSignOut}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-0.5"
              title="Sign Out of Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
