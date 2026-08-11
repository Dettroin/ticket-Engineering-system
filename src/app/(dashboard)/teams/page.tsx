'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Dialog } from '@/components/ui/Dialog';
import { Avatar } from '@/components/ui/Avatar';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { ROLE_BADGE_COLORS, ROLE_LABELS, UserRole } from '@/types/rbac';
import { User } from '@/types/database';
import { Users, Mail, Plus, Key, ShieldCheck, UserX, UserCheck, Edit3 } from 'lucide-react';

export default function TeamsPage() {
  const { users, createAdminUser, updateUserProfile, toggleUserActiveStatus, resetUserPassword, canManageMembersPermission } = useAuth();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [targetUserId, setTargetUserId] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');

  // New User Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('frontend_developer');
  const [jobTitle, setJobTitle] = useState('');

  // Edit User Form State
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('frontend_developer');
  const [editJobTitle, setEditJobTitle] = useState('');

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

  const handleOpenEditModal = (u: User) => {
    setEditingUser(u);
    setEditFullName(u.full_name);
    setEditEmail(u.email);
    setEditUsername(u.username);
    setEditRole(u.role);
    setEditJobTitle(u.job_title || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUserProfile(editingUser.id, {
      full_name: editFullName,
      email: editEmail,
      username: editUsername,
      role: editRole,
      job_title: editJobTitle,
    });

    setIsEditModalOpen(false);
    setEditingUser(null);
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
    <PermissionGuard allowedRoles={['super_admin', 'admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-navy-950 flex items-center gap-2">
              <Users className="w-5 h-5 text-navy-800" /> Admin User & Role Management Center
            </h1>
            <p className="text-xs text-slate-500 font-medium">Provision credentials, edit role profiles, or deactivate user access</p>
          </div>

          {canManageMembersPermission && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4" /> Admin: Provision New User
            </Button>
          )}
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => {
            const isDeactivated = u.is_active === false;

            return (
              <Card key={u.id} hoverable className={`space-y-4 ${isDeactivated ? 'opacity-60 bg-slate-50/90 border-rose-200' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={u.avatar_url} name={u.full_name} size="lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-navy-950">{u.full_name}</h3>
                        {isDeactivated && (
                          <span className="text-[9px] bg-rose-600 text-white font-bold px-2 py-0.2 rounded-full uppercase">
                            Deactivated
                          </span>
                        )}
                      </div>
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

                {/* Admin Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[110px] text-[11px]">{u.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(u)}
                      className="p-1.5 text-slate-600 hover:text-navy-950 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit User Profile"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTargetUserId(u.id);
                        setNewResetPassword(`AdminNewPass@${Math.floor(1000 + Math.random() * 9000)}`);
                        setIsResetModalOpen(true);
                      }}
                      className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Reset Password"
                    >
                      <Key className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleUserActiveStatus(u.id)}
                      className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-colors flex items-center gap-1 ${
                        isDeactivated
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      }`}
                      title={isDeactivated ? 'Reactivate Account' : 'Deactivate Account'}
                    >
                      {isDeactivated ? (
                        <>
                          <UserCheck className="w-3 h-3" /> Reactivate
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3" /> Deactivate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
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

        {/* Admin: Edit User Profile Modal */}
        <Dialog isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Admin: Edit User Profile">
          <form onSubmit={handleSaveEditUser} className="space-y-4">
            <Input label="Full Name *" value={editFullName} onChange={(e) => setEditFullName(e.target.value)} required />
            <Input label="Work Email *" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required />
            <Input label="System Username *" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} required />

            <Select
              label="Assigned Role Permission *"
              options={[
                { value: 'admin', label: 'Admin / Head of Engineering' },
                { value: 'project_manager', label: 'Project Manager' },
                { value: 'frontend_developer', label: 'Frontend Developer' },
                { value: 'backend_developer', label: 'Backend Developer' },
                { value: 'qa_tester', label: 'QA / Tester' },
                { value: 'client_user', label: 'Client User (Viewer)' },
              ]}
              value={editRole}
              onChange={(e) => setEditRole(e.target.value as UserRole)}
            />

            <Input label="Job Title" value={editJobTitle} onChange={(e) => setEditJobTitle(e.target.value)} />

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Profile Changes</Button>
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
    </PermissionGuard>
  );
}
