'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Settings as SettingsIcon, Building2, Shield, Key, Database } from 'lucide-react';

export default function SettingsPage() {
  const { organization, user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-dettroin-400" /> Organization Settings
        </h1>
        <p className="text-xs text-slate-400">Configure Dettroin system preferences, integrations, & database connections</p>
      </div>

      <Card className="space-y-4 border-slate-800 bg-slate-900/90">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-dettroin-400" /> Organization Profile
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Organization Name" value={organization.name} readOnly />
          <Input label="Slug" value={organization.slug} readOnly />
        </div>
      </Card>

      <Card className="space-y-4 border-slate-800 bg-slate-900/90">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" /> Supabase Connection Status
        </h2>

        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">PostgreSQL Database & Auth</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
              Active / Production Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            SQL Migrations (<code className="text-dettroin-400">00001_initial_schema.sql</code>, <code className="text-dettroin-400">00002_rls_policies.sql</code>) are configured in <code className="text-slate-300 font-mono">supabase/migrations/</code>.
          </p>
        </div>
      </Card>
    </div>
  );
}
