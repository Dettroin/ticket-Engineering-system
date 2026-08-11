'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole, ROLE_LABELS } from '@/types/rbac';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface PermissionGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-4 bg-white border border-slate-200 rounded-3xl shadow-apple-md">
        <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="max-w-md space-y-1">
          <h2 className="text-lg font-bold text-navy-950">Access Restricted</h2>
          <p className="text-xs text-slate-500 font-medium">
            Your role (<strong className="text-navy-900">{ROLE_LABELS[user.role]}</strong>) does not have permission to access this administrative portal.
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to My Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
