'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ROLE_BADGE_COLORS, ROLE_LABELS, UserRole } from '@/types/rbac';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { users, login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('frontend@dettroin.com');
  const [password, setPassword] = useState('dettroin2026');
  const [selectedRole, setSelectedRole] = useState<UserRole>('frontend_developer');
  const [showRoleInfo, setShowRoleInfo] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
    router.push('/dashboard');
  };

  const handleSelectPersona = (email: string, role: UserRole) => {
    setUsername(email);
    setSelectedRole(role);
    login(email);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-slate-100/90 flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* 2-Column Main Portal Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-slate-300/80 overflow-hidden flex flex-col md:flex-row min-h-[500px] border border-slate-200/80">
        
        {/* Left Column - Blue Graphic Section */}
        <div className="w-full md:w-1/2 bg-blue-600 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Geometric Apple/MDM Ring Accent */}
          <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full border-[18px] border-white text-white opacity-90 pointer-events-none" />
          <div className="absolute top-1/2 -right-8 w-24 h-24 rounded-full border-[12px] border-white/20 pointer-events-none" />

          {/* Header Brand */}
          <div className="z-10 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white text-blue-600 font-black text-xl flex items-center justify-center shadow-lg">
                D
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">Dettroin</span>
            </div>
          </div>

          {/* Center Copy */}
          <div className="z-10 space-y-4 my-8">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome to Dettroin</h1>
              <div className="w-12 h-1 bg-white rounded-full" />
            </div>

            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-sm">
              Internal SaaS Engineering & Project Management System for Frontend Developers, Backend Developers, QA Testers, PMs, and Admins.
            </p>

            <button
              type="button"
              onClick={() => setShowRoleInfo(!showRoleInfo)}
              className="inline-flex items-center gap-2 border border-white/80 hover:bg-white hover:text-blue-600 text-white text-xs font-bold px-5 py-2 rounded-full transition-all duration-200 shadow-md"
            >
              {showRoleInfo ? 'Hide Role Info' : 'Know More'}
            </button>
          </div>

          {/* Footer Note */}
          <div className="z-10 text-[11px] text-blue-200 font-medium">
            Role-Based Access Control • Supabase PostgreSQL • Gemini AI
          </div>
        </div>

        {/* Right Column - Signin Form */}
        <div className="w-full md:w-1/2 bg-white p-8 sm:p-10 flex flex-col justify-center relative">
          
          {/* Subtle Ring Accent on Right */}
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full border-[16px] border-slate-100/80 pointer-events-none" />

          <div className="max-w-sm mx-auto w-full space-y-6 z-10">
            {/* Title with Blue Bar */}
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Signin</h2>
              <div className="w-8 h-1 bg-blue-600 rounded-full mx-auto" />
            </div>

            {/* Signin Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username / Email Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Enter Username or Work Email..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-slate-300 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <input
                  type="password"
                  placeholder="Enter Password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-slate-300 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              {/* Role Select Dropdown */}
              <div className="space-y-1 pt-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Select Role Persona *
                </label>
                <select
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    const found = users.find((u) => u.email === e.target.value);
                    if (found) setSelectedRole(found.role);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.email}>
                      {u.full_name} — {ROLE_LABELS[u.role]} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Big Blue Pill LOGIN Button */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-full shadow-lg shadow-blue-600/30 uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5"
              >
                LOGIN
              </button>
            </form>

            {/* Quick 1-Click Role Logins */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-600" /> One-Click Role Signin Demo
              </p>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectPersona(u.email, u.role)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition-all flex items-center gap-2 group"
                  >
                    <img src={u.avatar_url} className="w-6 h-6 rounded-full object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-blue-600">{u.full_name}</p>
                      <p className="text-[9px] text-slate-500 truncate">{ROLE_LABELS[u.role]}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
