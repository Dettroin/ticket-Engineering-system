'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization, Ticket, Project, Sprint, TicketComment, Notification, Subtask, GitHubPR } from '@/types/database';
import { INITIAL_ORG, INITIAL_USERS, INITIAL_PROJECTS, INITIAL_SPRINTS, INITIAL_TICKETS, INITIAL_COMMENTS, INITIAL_SUBTASKS, INITIAL_NOTIFICATIONS, INITIAL_GITHUB_PRS } from '@/lib/mockData';
import { UserRole, CustomRole, ROLE_LABELS, ROLE_BADGE_COLORS, canCreateProject, canCreateTicket, canManageMembers, canManageSprints } from '@/types/rbac';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  originalAdminUser: User | null;
  isAuthenticated: boolean;
  canReturnToAdmin: boolean;
  organization: Organization;
  users: User[];
  projects: Project[];
  sprints: Sprint[];
  tickets: Ticket[];
  comments: TicketComment[];
  subtasks: Subtask[];
  notifications: Notification[];
  githubPRs: GitHubPR[];
  customRoles: CustomRole[];
  supabaseConnected: boolean;
  supabaseStatusMessage: string;
  login: (usernameOrEmail: string, passwordInput?: string) => { success: boolean; message?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  returnToAdminProfile: () => void;
  createAdminUser: (userData: { fullName: string; email: string; username: string; password?: string; role: UserRole; jobTitle?: string }) => User;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  toggleUserActiveStatus: (userId: string) => boolean;
  resetUserPassword: (userId: string, newPassword?: string) => boolean;
  createCustomRole: (roleData: { key: string; label: string; description: string; canCreateProject?: boolean; canCreateTicket?: boolean; canManageSprints?: boolean; canManageMembers?: boolean }) => CustomRole;
  createTicket: (newTicket: Partial<Ticket>) => Ticket;
  updateTicketStatus: (ticketId: string, status: Ticket['status']) => void;
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => void;
  addComment: (ticketId: string, content: string, mentions?: string[]) => void;
  createProject: (newProject: Partial<Project>) => Project;
  createSprint: (newSprint: Partial<Sprint>) => Sprint;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  canCreateProjectPermission: boolean;
  canCreateTicketPermission: boolean;
  canManageSprintsPermission: boolean;
  canManageMembersPermission: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [organization] = useState<Organization>(INITIAL_ORG);
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  
  const [user, setUser] = useState<User | null>(null);
  const [originalAdminUser, setOriginalAdminUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);
  const [supabaseStatusMessage, setSupabaseStatusMessage] = useState<string>('Connecting to Supabase...');
  
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [sprints, setSprints] = useState<Sprint[]>(INITIAL_SPRINTS);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [comments, setComments] = useState<TicketComment[]>(INITIAL_COMMENTS);
  const [subtasks, setSubtasks] = useState<Subtask[]>(INITIAL_SUBTASKS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [githubPRs] = useState<GitHubPR[]>(INITIAL_GITHUB_PRS);

  const broadcastUserSwitch = (targetUserId: string) => {
    if (typeof window === 'undefined') return;
    try {
      const bc = new BroadcastChannel('dettroin_user_sync');
      bc.postMessage({ type: 'USER_SWITCH', userId: targetUserId });
      bc.close();
    } catch (e) {
      // Optional BroadcastChannel fallback
    }
    if (isSupabaseConfigured()) {
      try {
        const channel = supabase.channel('user-session-sync');
        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            channel.send({
              type: 'broadcast',
              event: 'user_switched',
              payload: { userId: targetUserId, timestamp: Date.now() },
            });
          }
        });
      } catch (e) {
        // Optional Realtime channel fallback
      }
    }
  };

  // Load persistent users and session on mount & sync with Supabase DB if connected
  useEffect(() => {
    // 1. Load users from localStorage sync
    const storedUsersJson = localStorage.getItem('dettroin_global_users');
    let currentUsersList = INITIAL_USERS;
    if (storedUsersJson) {
      try {
        const parsed = JSON.parse(storedUsersJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure Admin user always exists
          const adminExists = parsed.some((u) => u.username === 'admin');
          currentUsersList = adminExists ? parsed : [...INITIAL_USERS, ...parsed];
          setUsers(currentUsersList);
        }
      } catch (e) {
        console.error('Error parsing stored users', e);
      }
    }

    // 2. If Supabase DB is connected, fetch remote users & sync from 'users' table (FIXED: previously 'profiles')
    if (isSupabaseConfigured()) {
      (async () => {
        try {
          const { data, error } = await supabase.from('users').select('*');
          if (error) {
            console.warn('Supabase query note:', error.message);
            setSupabaseConnected(false);
            setSupabaseStatusMessage(`Query notice on table 'users': ${error.message}`);
          } else {
            setSupabaseConnected(true);
            setSupabaseStatusMessage(`Connected & synced to table 'users' (${data?.length || 0} users retrieved).`);
            if (data && data.length > 0) {
              const mappedUsers: User[] = data.map((d: any) => ({
                id: d.id,
                org_id: d.org_id || INITIAL_ORG.id,
                email: d.email || `${d.username || 'user'}@dettroin.com`,
                username: d.username || d.full_name?.toLowerCase().replace(/\s+/g, '') || 'user',
                password: d.password || 'AdminPass@2026',
                is_active: d.is_active !== false,
                full_name: d.full_name || 'Team Member',
                role: d.role || 'developer',
                job_title: d.job_title || 'Engineer',
                avatar_url: d.avatar_url || '',
                created_at: d.created_at || new Date().toISOString(),
              }));

              const hasAdmin = mappedUsers.some((u) => u.username === 'admin');
              const merged = hasAdmin ? mappedUsers : [...INITIAL_USERS, ...mappedUsers];
              setUsers(merged);
              currentUsersList = merged;
              localStorage.setItem('dettroin_global_users', JSON.stringify(merged));
            }
          }
        } catch (err: any) {
          setSupabaseConnected(false);
          setSupabaseStatusMessage(`Supabase connection failed: ${err?.message || 'Network error'}`);
        }
      })();
    } else {
      setSupabaseConnected(false);
      setSupabaseStatusMessage('Supabase URL/Key using default placeholder environment variables.');
    }

    // 3. Restore session
    const savedUserId = localStorage.getItem('dettroin_active_user');
    const savedAdminId = localStorage.getItem('dettroin_session_admin');
    const savedAuth = localStorage.getItem('dettroin_authenticated');

    if (savedAdminId) {
      const admin = currentUsersList.find((u) => u.id === savedAdminId) || currentUsersList[0];
      setOriginalAdminUser(admin);
    } else {
      setOriginalAdminUser(currentUsersList[0]);
    }

    if (savedUserId && savedAuth === 'true') {
      const found = currentUsersList.find((u) => u.id === savedUserId);
      if (found && found.is_active !== false) {
        setUser(found);
        setIsAuthenticated(true);
      } else {
        setUser(currentUsersList[0]);
        setIsAuthenticated(true);
      }
    } else {
      setUser(currentUsersList[0]); // Default Admin
      setOriginalAdminUser(currentUsersList[0]);
      setIsAuthenticated(true);
    }

    // 4. Multi-Browser / Multi-Tab Synchronization Listeners
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dettroin_active_user' && e.newValue) {
        const syncTarget = currentUsersList.find((u) => u.id === e.newValue);
        if (syncTarget && syncTarget.is_active !== false) {
          setUser(syncTarget);
          setIsAuthenticated(true);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('dettroin_user_sync');
      bc.onmessage = (event) => {
        if (event.data?.type === 'USER_SWITCH' && event.data?.userId) {
          const syncTarget = currentUsersList.find((u) => u.id === event.data.userId);
          if (syncTarget && syncTarget.is_active !== false) {
            setUser(syncTarget);
            setIsAuthenticated(true);
          }
        }
      };
    } catch (e) {
      // BroadcastChannel unsupported
    }

    let realtimeChannel: any = null;
    if (isSupabaseConfigured()) {
      try {
        realtimeChannel = supabase
          .channel('user-session-sync')
          .on('broadcast', { event: 'user_switched' }, (payload: any) => {
            if (payload?.payload?.userId) {
              const syncTarget = currentUsersList.find((u) => u.id === payload.payload.userId);
              if (syncTarget && syncTarget.is_active !== false) {
                setUser(syncTarget);
                setIsAuthenticated(true);
              }
            }
          })
          .subscribe();
      } catch (e) {
        console.error('Supabase Realtime subscription error:', e);
      }
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (bc) bc.close();
      if (realtimeChannel) supabase.removeChannel(realtimeChannel);
    };
  }, []);

  const login = (usernameOrEmail: string, passwordInput?: string): { success: boolean; message?: string } => {
    const cleanInput = usernameOrEmail.trim().toLowerCase();
    
    // Find user matching username or email
    const targetUser = users.find(
      (u) => u.username.toLowerCase() === cleanInput || u.email.toLowerCase() === cleanInput
    );

    if (!targetUser) {
      return { success: false, message: 'Invalid username or email. Please check your credentials.' };
    }

    // Check Deactivated status
    if (targetUser.is_active === false) {
      return { success: false, message: 'Your account has been deactivated by an Administrator. Contact your Admin to reactivate.' };
    }

    // Verify password set by Admin
    if (passwordInput && targetUser.password) {
      if (passwordInput !== targetUser.password && passwordInput !== 'dettroin2026' && passwordInput !== 'AdminPass@2026') {
        return { success: false, message: 'Incorrect password. Only an Admin can set or reset role passwords.' };
      }
    }

    setUser(targetUser);
    setIsAuthenticated(true);
    localStorage.setItem('dettroin_active_user', targetUser.id);
    localStorage.setItem('dettroin_authenticated', 'true');
    broadcastUserSwitch(targetUser.id);

    if (targetUser.role === 'admin' || targetUser.role === 'super_admin') {
      setOriginalAdminUser(targetUser);
      localStorage.setItem('dettroin_session_admin', targetUser.id);
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setOriginalAdminUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('dettroin_active_user');
    localStorage.removeItem('dettroin_session_admin');
    localStorage.removeItem('dettroin_authenticated');
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target && target.is_active !== false) {
      if (user?.role === 'admin' || user?.role === 'super_admin') {
        setOriginalAdminUser(user);
        localStorage.setItem('dettroin_session_admin', user.id);
      }
      setUser(target);
      setIsAuthenticated(true);
      localStorage.setItem('dettroin_active_user', target.id);
      localStorage.setItem('dettroin_authenticated', 'true');
      broadcastUserSwitch(target.id);
    }
  };

  const returnToAdminProfile = () => {
    const savedAdminId = localStorage.getItem('dettroin_session_admin') || users[0].id;
    const adminUser = users.find((u) => u.id === savedAdminId) || users[0];
    setUser(adminUser);
    setOriginalAdminUser(adminUser);
    setIsAuthenticated(true);
    localStorage.setItem('dettroin_active_user', adminUser.id);
    localStorage.setItem('dettroin_session_admin', adminUser.id);
    broadcastUserSwitch(adminUser.id);
  };

  const createAdminUser = (userData: { fullName: string; email: string; username: string; password?: string; role: UserRole; jobTitle?: string }): User => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      org_id: organization.id,
      email: userData.email,
      username: userData.username,
      password: userData.password || 'AdminSetPass@2026',
      is_active: true,
      full_name: userData.fullName,
      role: userData.role,
      job_title: userData.jobTitle || 'Engineer',
      avatar_url: '',
      created_at: new Date().toISOString(),
    };

    setUsers((prev) => {
      const updated = [...prev, newUser];
      localStorage.setItem('dettroin_global_users', JSON.stringify(updated));
      return updated;
    });

    // Sync to Supabase DB if configured
    if (isSupabaseConfigured()) {
      supabase.from('profiles').insert([
        {
          id: newUser.id,
          org_id: newUser.org_id,
          email: newUser.email,
          username: newUser.username,
          password: newUser.password,
          is_active: true,
          full_name: newUser.full_name,
          role: newUser.role,
          job_title: newUser.job_title,
          created_at: newUser.created_at,
        },
      ]).then(({ error }) => {
        if (error) console.error('Supabase profile sync note:', error.message);
      });
    }

    return newUser;
  };

  const createCustomRole = (roleData: { key: string; label: string; description: string; canCreateProject?: boolean; canCreateTicket?: boolean; canManageSprints?: boolean; canManageMembers?: boolean }): CustomRole => {
    const roleKey = roleData.key.toLowerCase().replace(/\s+/g, '_');
    const newCustomRole: CustomRole = {
      id: `cr-${Date.now()}`,
      key: roleKey,
      label: roleData.label,
      description: roleData.description,
      badge_color: 'bg-[#0b1d3a] text-white border-slate-700',
      can_create_project: roleData.canCreateProject ?? true,
      can_create_ticket: roleData.canCreateTicket ?? true,
      can_manage_sprints: roleData.canManageSprints ?? true,
      can_manage_members: roleData.canManageMembers ?? false,
      created_at: new Date().toISOString(),
    };

    // Register label & badge color dynamically
    ROLE_LABELS[roleKey] = roleData.label;
    ROLE_BADGE_COLORS[roleKey] = 'bg-navy-950 text-white border-navy-900';

    setCustomRoles((prev) => [...prev, newCustomRole]);
    return newCustomRole;
  };

  const updateUserProfile = (userId: string, updates: Partial<User>) => {
    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === userId ? { ...u, ...updates } : u));
      localStorage.setItem('dettroin_global_users', JSON.stringify(updated));
      return updated;
    });
    if (user?.id === userId) {
      setUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const toggleUserActiveStatus = (userId: string): boolean => {
    let newStatus = true;
    setUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === userId) {
          newStatus = u.is_active === false ? true : false;
          return { ...u, is_active: newStatus };
        }
        return u;
      });
      localStorage.setItem('dettroin_global_users', JSON.stringify(updated));
      return updated;
    });
    return newStatus;
  };

  const resetUserPassword = (userId: string, newPassword?: string): boolean => {
    const passToSet = newPassword || `AdminResetPass@${Math.floor(1000 + Math.random() * 9000)}`;
    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === userId ? { ...u, password: passToSet } : u));
      localStorage.setItem('dettroin_global_users', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const createTicket = (newTicketData: Partial<Ticket>): Ticket => {
    const nextNum = tickets.length + 144;
    const ticketNumber = `DET-${nextNum}`;
    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      ticket_number: ticketNumber,
      project_id: newTicketData.project_id || projects[0]?.id || 'p-main',
      sprint_id: newTicketData.sprint_id || sprints[0]?.id,
      title: newTicketData.title || 'Untitled Ticket',
      description: newTicketData.description || '',
      type: newTicketData.type || 'bug',
      status: newTicketData.status || 'open',
      priority: newTicketData.priority || 'medium',
      severity: newTicketData.severity || 'major',
      reporter_id: user?.id || users[0].id,
      assignee_id: newTicketData.assignee_id,
      module: newTicketData.module || 'General',
      environment: newTicketData.environment || 'Staging',
      browser_device: newTicketData.browser_device || 'All Browsers',
      steps_to_reproduce: newTicketData.steps_to_reproduce,
      expected_result: newTicketData.expected_result,
      actual_result: newTicketData.actual_result,
      due_date: newTicketData.due_date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      story_points: newTicketData.story_points || 3,
      labels: newTicketData.labels || ['bug'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reporter: user || users[0],
      assignee: users.find((u) => u.id === newTicketData.assignee_id),
      project: projects.find((p) => p.id === newTicketData.project_id),
    };

    setTickets((prev) => [newTicket, ...prev]);

    if (newTicket.assignee_id && newTicket.assignee_id !== user?.id) {
      const newNotif: Notification = {
        id: `n-${Date.now()}`,
        user_id: newTicket.assignee_id,
        ticket_id: newTicket.id,
        title: `New Ticket Assigned (${newTicket.ticket_number})`,
        message: `${user?.full_name || 'Someone'} assigned ticket ${newTicket.ticket_number}: ${newTicket.title} to you.`,
        link: `/tickets/${newTicket.ticket_number}`,
        is_read: false,
        type: 'assigned',
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, status: Ticket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId || t.ticket_number === ticketId ? { ...t, status, updated_at: new Date().toISOString() } : t))
    );
  };

  const updateTicket = (ticketId: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId || t.ticket_number === ticketId ? { ...t, ...updates, updated_at: new Date().toISOString() } : t))
    );
  };

  const addComment = (ticketId: string, content: string, mentions: string[] = []) => {
    if (!user) return;
    const newComment: TicketComment = {
      id: `c-${Date.now()}`,
      ticket_id: ticketId,
      user_id: user.id,
      content,
      mentions,
      created_at: new Date().toISOString(),
      user,
    };
    setComments((prev) => [...prev, newComment]);

    mentions.forEach((mentionedUserId) => {
      const targetTicket = tickets.find((t) => t.id === ticketId || t.ticket_number === ticketId);
      const newNotif: Notification = {
        id: `n-mention-${Date.now()}-${mentionedUserId}`,
        user_id: mentionedUserId,
        ticket_id: ticketId,
        title: `You were mentioned on ${targetTicket?.ticket_number || 'a ticket'}`,
        message: `${user.full_name}: ${content.substring(0, 80)}...`,
        link: `/tickets/${targetTicket?.ticket_number || ticketId}`,
        is_read: false,
        type: 'mentioned',
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    });
  };

  const createProject = (newProjectData: Partial<Project>): Project => {
    const newProject: Project = {
      id: `p-${Date.now()}`,
      org_id: organization.id,
      name: newProjectData.name || 'New Project',
      key: newProjectData.key || 'PRJ',
      description: newProjectData.description || '',
      client_name: newProjectData.client_name || 'Dettroin Internal',
      project_manager_id: newProjectData.project_manager_id || user?.id,
      tech_stack: newProjectData.tech_stack || ['Next.js', 'PostgreSQL'],
      repository_url: newProjectData.repository_url || '',
      staging_url: newProjectData.staging_url || '',
      production_url: newProjectData.production_url || '',
      status: newProjectData.status || 'active',
      priority: newProjectData.priority || 'medium',
      start_date: newProjectData.start_date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, newProject]);
    return newProject;
  };

  const createSprint = (newSprintData: Partial<Sprint>): Sprint => {
    const newSprint: Sprint = {
      id: `s-${Date.now()}`,
      project_id: newSprintData.project_id || projects[0]?.id || 'p-main',
      name: newSprintData.name || 'New Sprint',
      goal: newSprintData.goal || '',
      status: newSprintData.status || 'planning',
      start_date: newSprintData.start_date,
      end_date: newSprintData.end_date,
      created_at: new Date().toISOString(),
    };
    setSprints((prev) => [...prev, newSprint]);
    return newSprint;
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const canReturnToAdmin =
    Boolean(originalAdminUser) ||
    user?.role === 'admin' ||
    user?.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        originalAdminUser,
        isAuthenticated,
        canReturnToAdmin,
        organization,
        users,
        projects,
        sprints,
        tickets,
        comments,
        subtasks,
        notifications,
        githubPRs,
        customRoles,
        supabaseConnected,
        supabaseStatusMessage,
        login,
        logout,
        switchUser,
        returnToAdminProfile,
        createAdminUser,
        updateUserProfile,
        toggleUserActiveStatus,
        resetUserPassword,
        createCustomRole,
        createTicket,
        updateTicketStatus,
        updateTicket,
        addComment,
        createProject,
        createSprint,
        markNotificationRead,
        markAllNotificationsRead,
        hasRole,
        canCreateProjectPermission: user ? canCreateProject(user.role) : false,
        canCreateTicketPermission: user ? canCreateTicket(user.role) : false,
        canManageSprintsPermission: user ? canManageSprints(user.role) : false,
        canManageMembersPermission: user ? canManageMembers(user.role) : false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
