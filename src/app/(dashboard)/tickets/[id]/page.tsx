'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Select } from '@/components/ui/Select';
import { STATUS_COLORS, STATUS_LABELS, TICKET_TYPE_COLORS, TICKET_TYPE_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types/tickets';
import { TicketStatus } from '@/types/database';
import {
  GitPullRequest,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Clock,
  UserCheck,
  AlertTriangle,
  Code,
  Send,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const { tickets, comments, subtasks, githubPRs, user, users, updateTicketStatus, addComment } = useAuth();

  const ticket = tickets.find((t) => t.ticket_number === ticketId || t.id === ticketId);
  const ticketComments = comments.filter((c) => c.ticket_id === ticket?.id);
  const ticketSubtasks = subtasks.filter((s) => s.ticket_id === ticket?.id);
  const ticketPRs = githubPRs.filter((p) => p.ticket_id === ticket?.id);

  const [commentText, setCommentText] = useState('');
  const [mentionedUser, setMentionedUser] = useState('');

  if (!ticket) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Ticket Not Found</h2>
        <p className="text-xs text-slate-400">The requested ticket {ticketId} does not exist or was deleted.</p>
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
        <Link href="/tickets" className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Ticket List
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Update Lifecycle Status:</span>
          <Select
            options={statusOptions}
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
            className="w-48 bg-slate-900 border-slate-700"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Info & Comments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card className="space-y-4 border-slate-800 bg-slate-900/90">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-bold text-dettroin-400 bg-dettroin-950 px-3 py-1 rounded-lg border border-dettroin-800">
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

            <h1 className="text-lg font-bold text-slate-100">{ticket.title}</h1>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>

            {/* Frontend ↔ Backend JSON Payloads */}
            {(ticket.expected_result || ticket.actual_result) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                {ticket.expected_result && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5" /> Expected Result Payload
                    </span>
                    <pre className="text-xs text-emerald-300 font-mono bg-slate-900 p-2.5 rounded-lg overflow-x-auto">
                      {ticket.expected_result}
                    </pre>
                  </div>
                )}
                {ticket.actual_result && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Actual Result / Error Received
                    </span>
                    <pre className="text-xs text-rose-300 font-mono bg-slate-900 p-2.5 rounded-lg overflow-x-auto">
                      {ticket.actual_result}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* GitHub PR Integration Widget */}
          <Card className="space-y-3 border-slate-800 bg-slate-900/90">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-purple-400" /> Linked GitHub Pull Requests & Commits
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Auto-detected DET-143</span>
            </div>

            {ticketPRs.length === 0 ? (
              <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl text-center text-xs text-slate-500">
                No PR linked yet. Include <code className="text-purple-400 font-mono">DET-143</code> in your PR title to auto-link.
              </div>
            ) : (
              ticketPRs.map((pr) => (
                <div key={pr.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                      <GitPullRequest className="w-4 h-4" />
                    </div>
                    <div>
                      <a href={pr.pr_url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-slate-100 hover:text-purple-300">
                        #{pr.pr_number}: {pr.pr_title}
                      </a>
                      <p className="text-[10px] text-slate-400">{pr.repo_name} • Author: {pr.author}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono border border-purple-500/30 capitalize">
                    {pr.status}
                  </span>
                </div>
              ))
            )}
          </Card>

          {/* Subtasks Section */}
          {ticketSubtasks.length > 0 && (
            <Card className="space-y-3 border-slate-800 bg-slate-900/90">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-teal-400" /> Subtask Checklist ({ticketSubtasks.filter(s => s.is_completed).length}/{ticketSubtasks.length})
              </h3>
              <div className="space-y-2">
                {ticketSubtasks.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                    <div className="flex items-center gap-2.5">
                      <input type="checkbox" checked={sub.is_completed} readOnly className="rounded border-slate-700 text-dettroin-500" />
                      <span className={`text-xs ${sub.is_completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{sub.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Discussion Thread & Comments */}
          <Card className="space-y-4 border-slate-800 bg-slate-900/90">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-dettroin-400" /> Technical Discussion Thread
            </h3>

            {/* Comment List */}
            <div className="space-y-3">
              {ticketComments.map((comment) => (
                <div key={comment.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar src={comment.user?.avatar_url} name={comment.user?.full_name} size="xs" />
                      <span className="text-xs font-semibold text-slate-200">{comment.user?.full_name}</span>
                      <span className="text-[10px] text-slate-500">({comment.user?.job_title})</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{comment.content}</p>
                </div>
              ))}
            </div>

            {/* Post Comment Form */}
            <form onSubmit={handlePostComment} className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">@Mention Developer:</span>
                <select
                  value={mentionedUser}
                  onChange={(e) => setMentionedUser(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded px-2 py-1"
                >
                  <option value="">None</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.job_title})</option>
                  ))}
                </select>
              </div>

              <textarea
                rows={3}
                placeholder="Add a technical comment, API response snippet, or question for the team..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-dettroin-500"
              />

              <div className="flex justify-end">
                <Button type="submit" size="sm">
                  <Send className="w-3.5 h-3.5" /> Post Comment
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Sidebar Metadata Column */}
        <div className="space-y-6">
          <Card className="space-y-4 border-slate-800 bg-slate-900/90 text-xs">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-3">Ticket Metadata</h3>

            <div className="space-y-3 text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Assignee</span>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar src={ticket.assignee?.avatar_url} name={ticket.assignee?.full_name} size="xs" />
                  <span className="font-semibold">{ticket.assignee?.full_name || 'Unassigned'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Reporter</span>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar src={ticket.reporter?.avatar_url} name={ticket.reporter?.full_name} size="xs" />
                  <span>{ticket.reporter?.full_name}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Module & Environment</span>
                <p className="mt-1 font-medium">{ticket.module} • {ticket.environment}</p>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Browser / Device</span>
                <p className="mt-1 font-mono text-[11px]">{ticket.browser_device || 'All Devices'}</p>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Story Points</span>
                <span className="inline-block mt-1 font-mono bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
                  {ticket.story_points} Points
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase mb-1">Labels</span>
                <div className="flex flex-wrap gap-1">
                  {ticket.labels.map((l) => (
                    <span key={l} className="text-[10px] bg-dettroin-950 text-dettroin-300 border border-dettroin-800 px-2 py-0.5 rounded font-mono">
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
