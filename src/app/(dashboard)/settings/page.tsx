'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { ROLE_BADGE_COLORS, ROLE_LABELS } from '@/types/rbac';
import { Settings as SettingsIcon, Building2, Database, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, organization } = useAuth();

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-navy-950 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-navy-800" /> Settings & User Profile
        </h1>
        <p className="text-xs text-slate-500 font-medium">Manage your user profile credentials, organization details, & database connections</p>
      </div>

      {/* User Profile Card */}
      {user && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-4">
              <Avatar src={user.avatar_url} name={user.full_name} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-navy-950">{user.full_name}</h2>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${ROLE_BADGE_COLORS[user.role]}`}>
                    {ROLE_LABELS[user.role]}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{user.job_title} • {user.email}</p>
              </div>
            </div>

            {isAdmin && (
              <Link href="/dashboard">
                <Button size="sm">
                  <ShieldCheck className="w-4 h-4 mr-1.5" /> Back to My Admin Dashboard
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="System Username" value={user.username} readOnly />
            <Input label="Work Email" value={user.email} readOnly />
            <Input label="Assigned System Role" value={ROLE_LABELS[user.role]} readOnly />
            <Input label="Job Title" value={user.job_title || 'Engineer'} readOnly />
          </div>
        </Card>
      )}

      {/* Organization Details */}
      <Card className="space-y-4">
        <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-navy-800" /> Organization Profile
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Organization Name" value={organization.name} readOnly />
          <Input label="Slug" value={organization.slug} readOnly />
        </div>
      </Card>

      {/* Supabase Status */}
      <Card className="space-y-4">
        <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600" /> Supabase Connection Status
        </h2>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs shadow-apple-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-800 font-bold">PostgreSQL Database & Auth</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Active / Production Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            SQL Migrations (<code className="text-navy-950 font-bold">00001_initial_schema.sql</code>, <code className="text-navy-950 font-bold">00002_rls_policies.sql</code>) are configured in <code className="text-slate-800 font-mono font-bold">supabase/migrations/</code>.
          </p>
        </div>
      </Card>
    </div>
  );
}
