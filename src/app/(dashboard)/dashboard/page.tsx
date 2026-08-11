'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminDashboardPage from './admin/page';
import PMDashboardPage from './pm/page';
import DeveloperDashboardPage from './developer/page';
import QADashboardPage from './qa/page';
import ClientDashboardPage from './client/page';
import { UserRole, ROLE_LABELS } from '@/types/rbac';
import { LayoutDashboard, ShieldCheck, FolderKanban, Code, CheckSquare, Eye, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function DashboardRouterPage() {
  const { user, canReturnToAdmin, returnToAdminProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  if (!user) return null;

  const isAdmin = user.role === 'admin' || user.role === 'super_admin' || canReturnToAdmin;

  // Determine current active dashboard view based on active tab override (Admin only) or user role
  const currentRoleView: UserRole = (isAdmin && activeTab as UserRole) ? (activeTab as UserRole) : user.role;

  const isInspectingOtherRole = canReturnToAdmin && (user.role !== 'admin' && user.role !== 'super_admin');

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
    <div className="space-y-6 font-sf-text">
      {/* Role Dashboard Selector Bar — RESTRICTED TO ADMIN SESSION */}
      {isAdmin && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-apple-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-navy-950 text-white rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-navy-950 font-sf-display">System Admin Control Center</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Active Persona: {ROLE_LABELS[user.role]}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {isInspectingOtherRole
                  ? `Inspecting ${user.full_name}'s (${ROLE_LABELS[user.role]}) persona view`
                  : 'Viewing primary System Admin dashboard'}
              </p>
            </div>
          </div>

          {/* Return to My Admin Dashboard Button */}
          <div className="flex flex-wrap items-center gap-2">
            {canReturnToAdmin && (
              <Button
                size="sm"
                variant="primary"
                onClick={returnToAdminProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-apple-sm text-xs font-bold"
              >
                <UserCheck className="w-4 h-4 mr-1.5" /> Return to Admin Profile
              </Button>
            )}

            {/* Quick View Tabs */}
            <div className="flex flex-wrap items-center gap-1">
              {roleTabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected =
                  (activeTab === tab.role) ||
                  (!activeTab &&
                    (user.role === tab.role ||
                      (tab.role === 'admin' && (user.role === 'super_admin' || user.role === 'admin'))));

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
        </div>
      )}

      {/* Render Selected Role Dashboard */}
      {renderDashboardContent()}
    </div>
  );
}
