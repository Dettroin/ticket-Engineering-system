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
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS } from '@/types/rbac';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, users, switchUser, tickets } = useAuth();

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
    <aside className="w-64 border-r border-slate-200/90 bg-white/90 backdrop-blur-2xl flex flex-col h-screen sticky top-0 shrink-0 select-none z-40">
      {/* Apple style Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-navy-950 flex items-center justify-center text-white font-black text-lg shadow-apple-sm">
            D
          </div>
          <div>
            <h1 className="font-bold text-sm text-navy-950 tracking-tight">Dettroin</h1>
            <p className="text-[11px] text-slate-500 font-medium">Engineering System</p>
          </div>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono border border-slate-200">
          v1.0
        </span>
      </div>

      {/* Role Swapper Widget */}
      <div className="px-3 py-3 border-b border-slate-100 bg-slate-50/70">
        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-navy-700" /> Persona Switcher
        </label>
        <div className="relative">
          <select
            value={user?.id || ''}
            onChange={(e) => switchUser(e.target.value)}
            className="w-full bg-white border border-slate-200 text-xs text-navy-950 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-navy-600/20 cursor-pointer appearance-none pr-7 font-semibold shadow-apple-sm"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id} className="bg-white text-navy-950">
                {u.full_name} ({ROLE_LABELS[u.role]})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
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
                'flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 group font-medium',
                isActive
                  ? 'bg-navy-950 text-white shadow-apple-sm font-semibold'
                  : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100/80'
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-navy-900'
                  )}
                />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.isNew && (
                  <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                    AI
                  </span>
                )}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={cn(
                      'text-[10px] px-2 py-0.2 rounded-full font-mono font-bold',
                      isActive ? 'bg-navy-800 text-white' : 'bg-slate-200/80 text-slate-700'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-700">Supabase Active</span>
          </div>
          {blockedCount > 0 && (
            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-200">
              {blockedCount} Blocked
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
