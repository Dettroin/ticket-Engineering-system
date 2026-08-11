'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS, ROLE_BADGE_COLORS } from '@/types/rbac';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  Ticket,
  Columns,
  Zap,
  CheckSquare,
  BarChart3,
  Bot,
  Users,
  Bell,
  Settings,
  ShieldCheck,
  ChevronDown,
  LogOut,
  UserCheck,
  X,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, users, switchUser, returnToAdminProfile, canReturnToAdmin, logout, tickets } = useAuth();

  const navItems = [
    { href: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: FolderKanban },
    { href: '/tickets', label: 'Tickets', icon: Ticket },
    { href: '/kanban', label: 'Kanban Board', icon: Columns },
    { href: '/sprints', label: 'Sprints', icon: Zap },
    { href: '/my-work', label: 'My Workstation', icon: CheckSquare },
    { href: '/reports', label: 'Analytics & Reports', icon: BarChart3 },
    { href: '/ai-assistant', label: 'Gemini AI Assistant', icon: Bot },
    ...(canReturnToAdmin ? [{ href: '/teams', label: 'Team & Role Control', icon: Users }] : []),
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/settings', label: 'Settings & Profile', icon: Settings },
  ];

  const blockedCount = tickets.filter((t) => t.status === 'blocked').length;

  const handleReturnAdmin = () => {
    returnToAdminProfile();
    if (onCloseMobile) onCloseMobile();
    router.push('/dashboard');
  };

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={cn(
        'w-64 border-r border-slate-200/80 bg-white/95 backdrop-blur-2xl flex flex-col h-screen fixed md:sticky top-0 left-0 z-50 transition-transform duration-300 md:translate-x-0 shrink-0 shadow-apple-lg md:shadow-none',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
    >
      {/* Brand Header & Mobile Close */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-navy-950 flex items-center justify-center text-white font-black text-lg shadow-apple-sm">
            D
          </div>
          <div>
            <h1 className="font-bold text-sm text-navy-950 tracking-tight font-sf-display">Dettroin</h1>
            <p className="text-[11px] text-slate-500 font-medium font-sf-text">Engineering System</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono border border-slate-200">
            v1.0
          </span>
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Role Swapper Widget & Return to Admin Profile — ALWAYS visible for Admin Sessions */}
      {canReturnToAdmin ? (
        <div className="px-3 py-3 border-b border-slate-100 bg-slate-50/70 space-y-2">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1 font-sf-text">
            <ShieldCheck className="w-3.5 h-3.5 text-navy-700" /> Admin Persona Switcher
          </label>
          <div className="relative">
            <select
              value={user?.id || ''}
              onChange={(e) => switchUser(e.target.value)}
              className="w-full bg-white border border-slate-200 text-xs text-navy-950 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-navy-600/20 cursor-pointer appearance-none pr-7 font-semibold shadow-apple-sm font-sf-text"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id} className="bg-white text-navy-950">
                  {u.full_name} ({ROLE_LABELS[u.role] || u.role})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={handleReturnAdmin}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-sf-text shadow-apple-sm transition-all"
          >
            <UserCheck className="w-4 h-4" /> Return to Admin Profile
          </button>
        </div>
      ) : user ? (
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2.5">
          <Avatar name={user.full_name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-navy-950 truncate font-sf-text">{user.full_name}</p>
            <span className={`text-[9px] px-2 py-0.2 rounded-full border font-semibold ${ROLE_BADGE_COLORS[user.role] || 'bg-navy-950 text-white'}`}>
              {ROLE_LABELS[user.role] || user.role}
            </span>
          </div>
        </div>
      ) : null}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-150 group font-medium font-sf-text',
                isActive
                  ? 'bg-navy-950 text-white font-semibold shadow-apple-sm'
                  : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-navy-900')} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status & Sign Out */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-700 font-sf-text">Supabase Active</span>
          </div>
          {blockedCount > 0 && (
            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-200">
              {blockedCount} Blocked
            </span>
          )}
        </div>
        <button
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            logout();
          }}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold transition-colors border border-slate-200 font-sf-text"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
};
