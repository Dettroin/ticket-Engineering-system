'use client';

import React, { useState } from 'react';
import { Bell, CheckCheck, MessageSquare, Ticket as TicketIcon, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatTimeAgo } from '@/lib/utils';
import Link from 'next/link';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, user, markNotificationRead, markAllNotificationsRead } = useAuth();

  const userNotifs = notifications.filter((n) => n.user_id === user?.id);
  const unreadCount = userNotifs.filter((n) => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'assigned':
        return <UserCheck className="w-4 h-4 text-blue-400" />;
      case 'mentioned':
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case 'commented':
        return <MessageSquare className="w-4 h-4 text-teal-400" />;
      default:
        return <TicketIcon className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-dettroin-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-dettroin-400" />
                <h3 className="text-sm font-semibold text-slate-100">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-dettroin-500/20 text-dettroin-400 px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-slate-400 hover:text-dettroin-400 flex items-center gap-1 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
              {userNotifs.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">No notifications right now</div>
              ) : (
                userNotifs.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      setIsOpen(false);
                    }}
                    className={`p-3.5 hover:bg-slate-800/50 transition-colors flex gap-3 cursor-pointer ${
                      !n.is_read ? 'bg-dettroin-950/20' : ''
                    }`}
                  >
                    <div className="mt-0.5 p-2 rounded-lg bg-slate-800/80 shrink-0">{getIcon(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-semibold ${!n.is_read ? 'text-slate-100' : 'text-slate-300'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-500">{formatTimeAgo(n.created_at)}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
