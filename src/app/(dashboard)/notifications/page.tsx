'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, CheckCheck } from 'lucide-react';
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
          <h1 className="text-xl font-bold text-navy-950 flex items-center gap-2">
            <Bell className="w-5 h-5 text-navy-800" /> Notifications Feed
          </h1>
          <p className="text-xs text-slate-500 font-medium">Real-time alerts for ticket assignments, mentions, & status updates</p>
        </div>

        {myNotifications.length > 0 && (
          <Button size="sm" variant="outline" onClick={markAllNotificationsRead}>
            <CheckCheck className="w-4 h-4 mr-1.5" /> Mark all read
          </Button>
        )}
      </div>

      <Card className="divide-y divide-slate-100 p-0 overflow-hidden">
        {myNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-medium">No notifications yet.</div>
        ) : (
          myNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 cursor-pointer ${
                !n.is_read ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-slate-100 shrink-0 mt-0.5">
                <Bell className="w-4 h-4 text-navy-800" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm ${!n.is_read ? 'font-bold text-navy-950' : 'font-semibold text-slate-700'}`}>
                    {n.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">{formatTimeAgo(n.created_at)}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">{n.message}</p>
                {n.link && (
                  <Link href={n.link} className="inline-block text-xs text-navy-800 font-bold hover:underline mt-2">
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
