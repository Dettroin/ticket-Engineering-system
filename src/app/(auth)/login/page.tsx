'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ROLE_LABELS } from '@/types/rbac';
import { ShieldCheck, AlertCircle, Key } from 'lucide-react';

export default function LoginPage() {
  const { users, login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('dev_tarun');
  const [password, setPassword] = useState('DevPass@2026');
  const [errorMessage, setErrorMessage] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    const result = login(username, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(result.message || 'Invalid credentials. Only an Admin can set or reset role passwords.');
    }
  };

  const handleSelectPersona = (userUsername: string, userPass?: string) => {
    setUsername(userUsername);
    setPassword(userPass || 'DevPass@2026');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full bg-[#f2f4f8] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* 2-Column Floating Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row min-h-[480px] border border-slate-200/60 relative">
        
        {/* LEFT COLUMN - Vibrant Blue Graphic Section */}
        <div className="w-full md:w-1/2 bg-[#2575fc] p-8 sm:p-12 text-white flex flex-col justify-center relative overflow-hidden">
          
          {/* Half White Circle Ring Accent at bottom-right */}
          <div className="absolute -bottom-6 -right-10 w-32 h-32 rounded-full border-[14px] border-white bg-transparent pointer-events-none z-10" />

          <div className="max-w-sm space-y-6 z-20">
            {/* Title with Underline */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Welcome to Dettroin
              </h1>
              <div className="w-12 h-1 bg-white opacity-80 rounded-full" />
            </div>

            {/* Description Text */}
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
              {showInfo
                ? "Admin Provisioning Mode: Every user has a unique username & password created exclusively by the System Admin. Users sign in to their designated role dashboard."
                : "Eliminate communication gaps between Frontend, Backend, QA, PMs & Admins. All user passwords are strictly created and managed by your Administrator."}
            </p>

            {/* Outline Pill Button */}
            <div>
              <button
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                className="border border-white/90 text-white hover:bg-white hover:text-[#2575fc] text-xs font-semibold px-6 py-2 rounded-full transition-all duration-200 shadow-sm"
              >
                {showInfo ? 'Close Details' : 'Know More'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Signin Form */}
        <div className="w-full md:w-1/2 bg-white p-8 sm:p-12 flex flex-col justify-center relative">
          
          {/* Soft Gray Diamond Accent at top-right */}
          <div className="absolute -top-6 -right-8 w-28 h-28 rounded-3xl border-[16px] border-slate-100/90 rotate-45 pointer-events-none z-0" />

          <div className="max-w-sm mx-auto w-full space-y-5 z-10">
            
            {/* Signin Heading with Blue Indicator */}
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-700 tracking-tight">
                Signin
              </h2>
              <div className="w-6 h-1 bg-[#2575fc] rounded-full mx-auto" />
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5 pt-1">
              
              {/* Minimalist Bottom-Border Username Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Enter Username ..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 py-2.5 text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#2575fc] transition-colors font-medium"
                />
              </div>

              {/* Minimalist Bottom-Border Password Input */}
              <div className="space-y-1">
                <input
                  type="password"
                  placeholder="Enter Password ..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 py-2.5 text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#2575fc] transition-colors font-medium"
                />
              </div>

              {/* Pill-Shaped Blue LOGIN Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#2575fc] hover:bg-blue-600 text-white font-bold text-xs tracking-wider rounded-full shadow-lg shadow-blue-500/30 uppercase transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                >
                  LOGIN
                </button>
              </div>
            </form>

            {/* Admin-Created User Credentials Reference */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center flex items-center justify-center gap-1">
                <Key className="w-3 h-3 text-[#2575fc]" /> Admin-Created Passwords & Usernames
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectPersona(u.username, u.password)}
                    className="w-full p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={u.avatar_url} className="w-5 h-5 rounded-full object-cover shrink-0" />
                      <span className="text-[11px] font-bold text-slate-800 truncate">{u.full_name} ({ROLE_LABELS[u.role]})</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#2575fc] font-semibold shrink-0">
                      {u.username}
                    </span>
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
