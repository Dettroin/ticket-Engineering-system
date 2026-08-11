'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminDashboardPage from './admin/page';
import PMDashboardPage from './pm/page';
import DeveloperDashboardPage from './developer/page';
import QADashboardPage from './qa/page';
import ClientDashboardPage from './client/page';
import { UserRole, ROLE_LABELS } from '@/types/rbac';
import { LayoutDashboard, ShieldCheck, FolderKanban, Code, CheckSquare, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardRouterPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  if (!user) return null;

  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  // Determine current active dashboard view based on active tab override (Admin only) or user role
  const currentRoleView: UserRole = (isAdmin && activeTab as UserRole) ? (activeTab as UserRole) : user.role;

  const roleTabs: { role: UserRole; label: string; icon: any }[] = [
    { role: 'admin', label: 'Admin View', icon: ShieldCheck },
    { role: 'project_manager', label: 'PM View', icon: FolderKanban },
    { role: 'frontend_developer', label: 'Developer View', icon: Code },
    { role: 'qa_tester', label: 'QA View', icon: CheckSquare },
    { role: 'client_user', label: 'Client View', icon: Eye },
  ];

  const renderDashboardContent = () => {
    switch (currentRoleView) {
      case 'super_admin':
      case 'admin':
        return <AdminDashboardPage />;
      case 'project_manager':
        return <PMDashboardPage />;
      case 'qa_tester':
        return <QADashboardPage />;
      case 'client_user':
        return <ClientDashboardPage />;
      case 'developer':
      case 'frontend_developer':
      case 'backend_developer':
      case 'team_lead':
      default:
        return <DeveloperDashboardPage />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Dashboard Selector Bar — RESTRICTED TO ADMINS ONLY */}
      {isAdmin && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-apple-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-2">
            <LayoutDashboard className="w-4 h-4 text-navy-800" />
            <span className="text-xs font-bold text-navy-950">System Admin Control:</span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {ROLE_LABELS[user.role]} (Inspector Mode)
            </span>
          </div>

          {/* Quick View Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {roleTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected =
                activeTab === tab.role ||
                (!activeTab &&
                  (user.role === tab.role ||
                    (tab.role === 'admin' && user.role === 'super_admin')));

              return (
                <button
                  key={tab.role}
                  onClick={() => setActiveTab(tab.role)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150',
                    isSelected
                      ? 'bg-navy-950 text-white shadow-apple-sm'
                      : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Single Role Dashboard for Non-Admins or Selected Admin View */}
      {renderDashboardContent()}
    </div>
  );
}
