'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isPublicPage = pathname === '/login' || pathname === '/register';
    if (!isAuthenticated || !user) {
      if (!isPublicPage) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, user, pathname, router]);

  if (!isAuthenticated && pathname !== '/login' && pathname !== '/register') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 text-center">
        <div className="space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-navy-950">Redirecting to Dettroin Signin Portal...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
