'use client';

import React, { useState } from 'react';
import { Bell, CheckCheck, MessageSquare, Ticket as TicketIcon, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatTimeAgo } from '@/lib/utils';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, user, markNotificationRead, markAllNotificationsRead } = useAuth();

  const userNotifs = notifications.filter((n) => n.user_id === user?.id);
  const unreadCount = userNotifs.filter((n) => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'assigned':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'mentioned':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'commented':
        return <MessageSquare className="w-4 h-4 text-teal-600" />;
      default:
        return <TicketIcon className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-navy-950 hover:bg-slate-100 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-navy-950 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-apple-lg z-50 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-navy-900" />
                <h3 className="text-xs font-bold text-navy-950">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-slate-500 hover:text-navy-900 flex items-center gap-1 font-medium transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
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
                    className={`p-3.5 hover:bg-slate-50 transition-colors flex gap-3 cursor-pointer ${
                      !n.is_read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="mt-0.5 p-2 rounded-xl bg-slate-100 shrink-0">{getIcon(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs ${!n.is_read ? 'font-bold text-navy-950' : 'font-semibold text-slate-700'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium">{formatTimeAgo(n.created_at)}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
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
