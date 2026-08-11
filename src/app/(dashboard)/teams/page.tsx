'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Dialog } from '@/components/ui/Dialog';
import { Avatar } from '@/components/ui/Avatar';
import { ROLE_BADGE_COLORS, ROLE_LABELS, UserRole } from '@/types/rbac';
import { Users, Mail, Github, Plus, Key, ShieldCheck, Lock } from 'lucide-react';

export default function TeamsPage() {
  const { users, createAdminUser, resetUserPassword, canManageMembersPermission } = useAuth();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');

  // New User Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('frontend_developer');
  const [jobTitle, setJobTitle] = useState('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !username || !password) return;

    createAdminUser({
      fullName,
      email,
      username,
      password,
      role,
      jobTitle,
    });

    setIsCreateModalOpen(false);
    setFullName('');
    setEmail('');
    setUsername('');
    setPassword('');
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId || !newResetPassword) return;

    resetUserPassword(targetUserId, newResetPassword);
    setIsResetModalOpen(false);
    setTargetUserId('');
    setNewResetPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-950 flex items-center gap-2">
            <Users className="w-5 h-5 text-navy-800" /> Dettroin Engineering Team Directory
          </h1>
          <p className="text-xs text-slate-500 font-medium">User credentials & role permissions are created exclusively by the Administrator</p>
        </div>

        {canManageMembersPermission && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4" /> Admin: Provision New User & Password
          </Button>
        )}
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <Card key={u.id} hoverable className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={u.avatar_url} name={u.full_name} size="lg" />
                <div>
                  <h3 className="text-sm font-bold text-navy-950">{u.full_name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{u.job_title}</p>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold mt-1 inline-block ${ROLE_BADGE_COLORS[u.role]}`}>
                    {ROLE_LABELS[u.role]}
                  </span>
                </div>
              </div>
            </div>

            {/* Credentials Info */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px] font-bold uppercase">Username</span>
                <span className="font-mono text-navy-950 font-bold">{u.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px] font-bold uppercase">Admin Password</span>
                <span className="font-mono text-blue-700 font-bold">{u.password || '••••••••'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[140px]">{u.email}</span>
              </div>

              {canManageMembersPermission && (
                <button
                  type="button"
                  onClick={() => {
                    setTargetUserId(u.id);
                    setNewResetPassword(`AdminNewPass@${Math.floor(1000 + Math.random() * 9000)}`);
                    setIsResetModalOpen(true);
                  }}
                  className="text-xs text-blue-700 hover:underline font-bold flex items-center gap-1"
                >
                  <Key className="w-3 h-3" /> Reset Pass
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Admin: Create New User & Password Modal */}
      <Dialog isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Admin: Provision User Credentials">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <span>Only Administrators can create new user credentials and assign their login passwords.</span>
          </div>

          <Input label="Full Name *" placeholder="e.g. Vikram Malhotra" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input label="Work Email *" type="email" placeholder="e.g. vikram@dettroin.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="System Username *" placeholder="e.g. dev_vikram" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <Input label="Admin-Created Password *" type="text" placeholder="e.g. DevPass@2026" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <Select
            label="Assign Role Permission *"
            options={[
              { value: 'admin', label: 'Admin / Head of Engineering' },
              { value: 'project_manager', label: 'Project Manager' },
              { value: 'frontend_developer', label: 'Frontend Developer' },
              { value: 'backend_developer', label: 'Backend Developer' },
              { value: 'qa_tester', label: 'QA / Tester' },
              { value: 'client_user', label: 'Client User (Viewer)' },
            ]}
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          />

          <Input label="Job Title" placeholder="e.g. Senior Full Stack Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Provision User Credentials</Button>
          </div>
        </form>
      </Dialog>

      {/* Admin: Reset Password Modal */}
      <Dialog isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} title="Admin: Reset User Password">
        <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
          <p className="text-xs text-slate-600">Enter new password for selected user. This password will immediately take effect for sign in.</p>
          <Input label="New Password *" value={newResetPassword} onChange={(e) => setNewResetPassword(e.target.value)} required />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Password</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
