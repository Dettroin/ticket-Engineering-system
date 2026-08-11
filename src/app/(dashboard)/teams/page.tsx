'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { ROLE_BADGE_COLORS, ROLE_LABELS } from '@/types/rbac';
import { Users, Mail, Github, Shield } from 'lucide-react';

export default function TeamsPage() {
  const { users, organization } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-dettroin-400" /> Dettroin Engineering Team Directory
        </h1>
        <p className="text-xs text-slate-400">10+ engineering team members across Frontend, Backend, QA, PM, and Leadership</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <Card key={u.id} hoverable className="space-y-4 border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <Avatar src={u.avatar_url} name={u.full_name} size="lg" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">{u.full_name}</h3>
                <p className="text-xs text-slate-400">{u.job_title}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-medium mt-1 inline-block ${ROLE_BADGE_COLORS[u.role]}`}>
                  {ROLE_LABELS[u.role]}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{u.email}</span>
              </div>
              {u.github_username && (
                <div className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-dettroin-400">@{u.github_username}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
