'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROLE_BADGE_COLORS, ROLE_LABELS } from '@/types/rbac';
import { Lock, Mail, ArrowRight, Shield } from 'lucide-react';

export default function LoginPage() {
  const { users, switchUser } = useAuth();
  const router = Router();
  const [email, setEmail] = useState('frontend@dettroin.com');
  const [password, setPassword] = useState('dettroin2026');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      switchUser(foundUser.id);
    }
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-dettroin-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-dettroin-600/30 border border-dettroin-400/40 mx-auto">
          D
        </div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Dettroin Systems</h1>
        <p className="text-xs text-slate-400">Engineering & Project Management Platform</p>
      </div>

      <Card className="p-6 border-slate-800 bg-slate-900/90 shadow-2xl">
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Work Email"
            type="email"
            icon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            icon={<Lock className="w-4 h-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full mt-2">
            Sign In <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-dettroin-400" /> One-Click Role Switcher Demo
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  switchUser(u.id);
                  router.push('/dashboard');
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <img src={u.avatar_url} alt={u.full_name} className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-white">{u.full_name}</p>
                    <p className="text-[10px] text-slate-400">{u.job_title}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${ROLE_BADGE_COLORS[u.role]}`}>
                  {ROLE_LABELS[u.role]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function Router() {
  return useRouter();
}
