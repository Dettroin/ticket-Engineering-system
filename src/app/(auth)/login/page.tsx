'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      setErrorMessage(result.message || 'Invalid username or password. Contact your Administrator.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f2f4f8] flex items-center justify-center p-4 sm:p-6 font-sans font-sf-text">
      {/* 2-Column Floating Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row min-h-[460px] border border-slate-200/60 relative">
        
        {/* LEFT COLUMN - Vibrant Blue Graphic Section */}
        <div className="w-full md:w-1/2 bg-[#2575fc] p-8 sm:p-12 text-white flex flex-col justify-center relative overflow-hidden">
          
          {/* Half White Circle Ring Accent at bottom-right */}
          <div className="absolute -bottom-6 -right-10 w-32 h-32 rounded-full border-[14px] border-white bg-transparent pointer-events-none z-10" />

          <div className="max-w-sm space-y-6 z-20">
            {/* Title with Underline */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sf-display">
                Welcome to MDM
              </h1>
              <div className="w-12 h-1 bg-white opacity-80 rounded-full" />
            </div>

            {/* Description Text */}
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
              {showInfo
                ? "Dettroin MDM is an enterprise software development and ticket engineering system. Users sign in with credentials provisioned exclusively by the Administrator."
                : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"}
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

        {/* RIGHT COLUMN - Pure Login Window Only */}
        <div className="w-full md:w-1/2 bg-white p-8 sm:p-12 flex flex-col justify-center relative">
          
          {/* Soft Gray Diamond Accent at top-right */}
          <div className="absolute -top-6 -right-8 w-28 h-28 rounded-3xl border-[16px] border-slate-100/90 rotate-45 pointer-events-none z-0" />

          <div className="max-w-sm mx-auto w-full space-y-6 z-10">
            
            {/* Signin Heading with Blue Indicator */}
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-700 tracking-tight font-sf-display">
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

            {/* Login Form Only */}
            <form onSubmit={handleLogin} className="space-y-6 pt-2">
              
              {/* Minimalist Bottom-Border Username Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Enter Username ..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-slate-200 py-2.5 text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#2575fc] transition-colors font-medium font-sf-text"
                />
              </div>

              {/* Minimalist Bottom-Border Password Input */}
              <div className="space-y-1">
                <input
                  type="password"
                  placeholder="Enter Password ..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-slate-200 py-2.5 text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#2575fc] transition-colors font-medium font-sf-text"
                />
              </div>

              {/* Pill-Shaped Blue LOGIN Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#2575fc] hover:bg-blue-600 text-white font-bold text-xs tracking-wider rounded-full shadow-lg shadow-blue-500/30 uppercase transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] font-sf-text"
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
