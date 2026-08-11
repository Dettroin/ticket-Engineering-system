'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, CheckCheck, MessageSquare, Ticket as TicketIcon, UserCheck } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';
import Link from 'next/link';

export default function NotificationsPage() {
  const { notifications, user, markNotificationRead, markAllNotificationsRead } = useAuth();
  const myNotifications = notifications.filter((n) => n.user_id === user?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-dettroin-400" /> Notifications Feed
          </h1>
          <p className="text-xs text-slate-400">Real-time alerts for ticket assignments, mentions, & status updates</p>
        </div>

        {myNotifications.length > 0 && (
          <Button size="sm" variant="outline" onClick={markAllNotificationsRead}>
            <CheckCheck className="w-4 h-4 mr-1.5" /> Mark all read
          </Button>
        )}
      </div>

      <Card className="divide-y divide-slate-800/80 border-slate-800 bg-slate-900/90 p-0 overflow-hidden">
        {myNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No notifications yet.</div>
        ) : (
          myNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 hover:bg-slate-800/40 transition-colors flex items-start gap-4 cursor-pointer ${
                !n.is_read ? 'bg-dettroin-950/20' : ''
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-800/80 shrink-0 mt-0.5">
                <Bell className="w-4 h-4 text-dettroin-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm ${!n.is_read ? 'font-bold text-slate-100' : 'font-medium text-slate-300'}`}>
                    {n.title}
                  </h3>
                  <span className="text-[10px] text-slate-500">{formatTimeAgo(n.created_at)}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{n.message}</p>
                {n.link && (
                  <Link href={n.link} className="inline-block text-xs text-dettroin-400 font-semibold hover:underline mt-2">
                    View details →
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
