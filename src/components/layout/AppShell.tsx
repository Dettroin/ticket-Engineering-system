'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { CreateTicketModal } from '@/components/tickets/CreateTicketModal';
import { GlobalSearchModal } from '@/components/search/GlobalSearchModal';
import { usePathname } from 'next/navigation';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if focus is inside input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsCreateOpen(true);
      } else if (e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isAuthPage) {
    return <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onOpenCreateTicket={() => setIsCreateOpen(true)} onOpenGlobalSearch={() => setIsSearchOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* Global Modals */}
      <CreateTicketModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};
