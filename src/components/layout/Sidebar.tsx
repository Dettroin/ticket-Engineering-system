'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Ticket,
  Columns,
  Zap,
  Users,
  Bell,
  BarChart3,
  Bot,
  Settings,
  ChevronDown,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS } from '@/types/rbac';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, users, switchUser, organization, tickets } = useAuth();

  const openCount = tickets.filter((t) => t.status !== 'closed' && t.status !== 'resolved').length;
  const blockedCount = tickets.filter((t) => t.status === 'blocked').length;

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/projects', icon: FolderKanban },
    { label: 'My Work', href: '/my-work', icon: CheckSquare },
    { label: 'Tickets', href: '/tickets', icon: Ticket, badge: openCount },
    { label: 'Kanban Board', href: '/kanban', icon: Columns },
    { label: 'Sprints', href: '/sprints', icon: Zap },
    { label: 'Teams', href: '/teams', icon: Users },
    { label: 'Notifications', href: '/notifications', icon: Bell },
    { label: 'Reports', href: '/reports', icon: BarChart3 },
    { label: 'AI Assistant', href: '/ai-assistant', icon: Bot, isNew: true },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col h-screen sticky top-0 shrink-0 select-none z-40">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-dettroin-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-dettroin-600/30 border border-dettroin-400/40">
            D
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-100 tracking-wide">Dettroin</h1>
            <p className="text-[11px] text-slate-400 font-medium">Engineering System</p>
          </div>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono border border-slate-700">
          v1.0
        </span>
      </div>

      {/* Role Swapper Widget for Testing */}
      <div className="px-3 py-3 border-b border-slate-800/60 bg-slate-900/40">
        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-dettroin-400" /> Switch Active Persona
        </label>
        <div className="relative">
          <select
            value={user?.id || ''}
            onChange={(e) => switchUser(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-dettroin-500 cursor-pointer appearance-none pr-7 font-medium"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id} className="bg-slate-900 text-slate-200">
                {u.full_name} ({ROLE_LABELS[u.role]})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-dettroin-600/15 text-dettroin-300 border border-dettroin-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/70'
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-dettroin-400' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.isNew && (
                  <span className="text-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                    AI
                  </span>
                )}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full border border-slate-700 font-mono">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-300">Supabase Connected</span>
          </div>
          {blockedCount > 0 && (
            <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-1.5 py-0.5 rounded">
              {blockedCount} Blocked
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
