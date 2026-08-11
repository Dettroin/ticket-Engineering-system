'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Select } from '@/components/ui/Select';
import { STATUS_COLORS, STATUS_LABELS, TICKET_TYPE_COLORS, TICKET_TYPE_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types/tickets';
import { TicketStatus } from '@/types/database';
import {
  GitPullRequest,
  CheckSquare,
  MessageSquare,
  AlertTriangle,
  Code,
  Send,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const { tickets, comments, subtasks, githubPRs, users, updateTicketStatus, addComment } = useAuth();

  const ticket = tickets.find((t) => t.ticket_number === ticketId || t.id === ticketId);
  const ticketComments = comments.filter((c) => c.ticket_id === ticket?.id);
  const ticketSubtasks = subtasks.filter((s) => s.ticket_id === ticket?.id);
  const ticketPRs = githubPRs.filter((p) => p.ticket_id === ticket?.id);

  const [commentText, setCommentText] = useState('');
  const [mentionedUser, setMentionedUser] = useState('');

  if (!ticket) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-navy-950">Ticket Not Found</h2>
        <p className="text-xs text-slate-500 font-medium">The requested ticket {ticketId} does not exist or was deleted.</p>
        <Link href="/tickets">
          <Button variant="outline">← Return to Tickets</Button>
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: TicketStatus) => {
    updateTicketStatus(ticket.id, newStatus);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const mentions = mentionedUser ? [mentionedUser] : [];
    addComment(ticket.id, commentText, mentions);
    setCommentText('');
    setMentionedUser('');
  };

  const statusOptions: { value: TicketStatus; label: string }[] = [
    { value: 'open', label: '1. Open' },
    { value: 'triaged', label: '2. Triaged' },
    { value: 'assigned', label: '3. Assigned' },
    { value: 'in_progress', label: '4. In Progress' },
    { value: 'blocked', label: '5. Blocked' },
    { value: 'code_review', label: '6. Code Review' },
    { value: 'ready_for_testing', label: '7. Ready for Testing' },
    { value: 'testing', label: '8. Testing' },
    { value: 'changes_requested', label: '9. Changes Requested' },
    { value: 'resolved', label: '10. Resolved' },
    { value: 'closed', label: '11. Closed' },
    { value: 'reopened', label: '12. Reopened' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/tickets" className="text-xs text-slate-600 hover:text-navy-950 font-semibold flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Ticket List
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-bold">Update Lifecycle Status:</span>
          <Select
            options={statusOptions}
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
            className="w-48 bg-white border-slate-300"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-bold text-navy-950 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  {ticket.ticket_number}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${TICKET_TYPE_COLORS[ticket.type]}`}>
                  {TICKET_TYPE_LABELS[ticket.type]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${PRIORITY_COLORS[ticket.priority]}`}>
                  {PRIORITY_LABELS[ticket.priority]}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${STATUS_COLORS[ticket.status]}`}>
                  {STATUS_LABELS[ticket.status]}
                </span>
              </div>
            </div>

            <h1 className="text-lg font-bold text-navy-950 tracking-tight">{ticket.title}</h1>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{ticket.description}</p>

            {/* Payloads */}
            {(ticket.expected_result || ticket.actual_result) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                {ticket.expected_result && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 shadow-apple-sm">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5" /> Expected Result Payload
                    </span>
                    <pre className="text-xs text-emerald-800 font-mono bg-white p-2.5 rounded-xl border border-slate-200 overflow-x-auto">
                      {ticket.expected_result}
                    </pre>
                  </div>
                )}
                {ticket.actual_result && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 shadow-apple-sm">
                    <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Actual Result Received
                    </span>
                    <pre className="text-xs text-rose-800 font-mono bg-white p-2.5 rounded-xl border border-slate-200 overflow-x-auto">
                      {ticket.actual_result}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* GitHub PR Widget */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-purple-700" /> Linked GitHub Pull Requests & Commits
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Auto-detected DET-143</span>
            </div>

            {ticketPRs.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-center text-xs text-slate-500 font-medium">
                No PR linked yet. Include <code className="text-purple-700 font-mono font-bold">DET-143</code> in your PR title to auto-link.
              </div>
            ) : (
              ticketPRs.map((pr) => (
                <div key={pr.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between shadow-apple-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-700 rounded-xl border border-purple-200">
                      <GitPullRequest className="w-4 h-4" />
                    </div>
                    <div>
                      <a href={pr.pr_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-900 hover:text-purple-700">
                        #{pr.pr_number}: {pr.pr_title}
                      </a>
                      <p className="text-[10px] text-slate-500 font-medium">{pr.repo_name} • Author: {pr.author}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-mono font-bold border border-purple-200 capitalize">
                    {pr.status}
                  </span>
                </div>
              ))
            )}
          </Card>

          {/* Subtasks */}
          {ticketSubtasks.length > 0 && (
            <Card className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-teal-600" /> Subtask Checklist ({ticketSubtasks.filter(s => s.is_completed).length}/{ticketSubtasks.length})
              </h3>
              <div className="space-y-2">
                {ticketSubtasks.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <input type="checkbox" checked={sub.is_completed} readOnly className="rounded border-slate-300 text-navy-950" />
                      <span className={`text-xs font-medium ${sub.is_completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{sub.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Discussion */}
          <Card className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-navy-800" /> Technical Discussion Thread
            </h3>

            <div className="space-y-3">
              {ticketComments.map((comment) => (
                <div key={comment.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 shadow-apple-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar src={comment.user?.avatar_url} name={comment.user?.full_name} size="xs" />
                      <span className="text-xs font-bold text-navy-950">{comment.user?.full_name}</span>
                      <span className="text-[10px] text-slate-500">({comment.user?.job_title})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">{comment.content}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handlePostComment} className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-bold">@Mention Developer:</span>
                <select
                  value={mentionedUser}
                  onChange={(e) => setMentionedUser(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg px-2.5 py-1 font-semibold"
                >
                  <option value="">None</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.job_title})</option>
                  ))}
                </select>
              </div>

              <textarea
                rows={3}
                placeholder="Add a technical comment, API response snippet, or question..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-navy-600 shadow-apple-sm"
              />

              <div className="flex justify-end">
                <Button type="submit" size="sm">
                  <Send className="w-3.5 h-3.5" /> Post Comment
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Metadata Column */}
        <div className="space-y-6">
          <Card className="space-y-4 text-xs">
            <h3 className="font-bold text-navy-950 border-b border-slate-100 pb-3">Ticket Metadata</h3>

            <div className="space-y-3 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Assignee</span>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar src={ticket.assignee?.avatar_url} name={ticket.assignee?.full_name} size="xs" />
                  <span className="font-bold text-navy-950">{ticket.assignee?.full_name || 'Unassigned'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Reporter</span>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar src={ticket.reporter?.avatar_url} name={ticket.reporter?.full_name} size="xs" />
                  <span className="font-semibold">{ticket.reporter?.full_name}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Module & Environment</span>
                <p className="mt-1 font-bold text-slate-800">{ticket.module} • {ticket.environment}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Browser / Device</span>
                <p className="mt-1 font-mono text-[11px] text-slate-700">{ticket.browser_device || 'All Devices'}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Story Points</span>
                <span className="inline-block mt-1 font-mono bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 font-bold">
                  {ticket.story_points} Points
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">Labels</span>
                <div className="flex flex-wrap gap-1">
                  {ticket.labels.map((l) => (
                    <span key={l} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-mono font-bold">
                      #{l}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
