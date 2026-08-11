'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/rbac';

export default function LoginPage() {
  const { users, login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('frontend@dettroin.com');
  const [showInfo, setShowInfo] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Use either entered username/email or selected role persona
    const emailToUse = username.trim() ? username.trim() : selectedEmail;
    login(emailToUse, password);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-[#f2f4f8] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* 2-Column Floating Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row min-h-[460px] border border-slate-200/60 relative">
        
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
                ? "Dettroin is an enterprise engineering system that eliminates communication gaps between Frontend, Backend, QA, PMs, and Admins with real-time tickets, Kanban boards, and Gemini AI triage."
                : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Dettroin engineering platform has been the industry's standard development system."}
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

          <div className="max-w-sm mx-auto w-full space-y-6 z-10">
            
            {/* Signin Heading with Blue Indicator */}
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-700 tracking-tight">
                Signin
              </h2>
              <div className="w-6 h-1 bg-[#2575fc] rounded-full mx-auto" />
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6 pt-2">
              
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

              {/* Role Account Select Dropdown */}
              <div className="space-y-1 pt-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Role Account to Signin
                </label>
                <select
                  value={selectedEmail}
                  onChange={(e) => {
                    setSelectedEmail(e.target.value);
                    if (!username) setUsername(e.target.value);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#2575fc]"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.email}>
                      {u.full_name} ({u.job_title || u.role})
                    </option>
                  ))}
                </select>
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

          </div>
        </div>

      </div>
    </div>
  );
}
