'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization, Ticket, Project, Sprint, TicketComment, Notification, Subtask, GitHubPR } from '@/types/database';
import { INITIAL_ORG, INITIAL_USERS, INITIAL_PROJECTS, INITIAL_SPRINTS, INITIAL_TICKETS, INITIAL_COMMENTS, INITIAL_NOTIFICATIONS, INITIAL_SUBTASKS, INITIAL_GITHUB_PRS } from '@/lib/mockData';
import { UserRole, canCreateProject, canCreateTicket, canManageMembers, canManageSprints, canChangeTicketStatus } from '@/types/rbac';

interface AuthContextType {
  user: User | null;
  organization: Organization;
  users: User[];
  projects: Project[];
  sprints: Sprint[];
  tickets: Ticket[];
  comments: TicketComment[];
  subtasks: Subtask[];
  notifications: Notification[];
  githubPRs: GitHubPR[];
  switchUser: (userId: string) => void;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [organization] = useState<Organization>(INITIAL_ORG);
  // Default to Tarun Sharma (Lead Frontend Engineer) to immediately test ticket workflows!
  const [user, setUser] = useState<User | null>(INITIAL_USERS[2]);
  
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [sprints, setSprints] = useState<Sprint[]>(INITIAL_SPRINTS);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [comments, setComments] = useState<TicketComment[]>(INITIAL_COMMENTS);
  const [subtasks, setSubtasks] = useState<Subtask[]>(INITIAL_SUBTASKS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [githubPRs] = useState<GitHubPR[]>(INITIAL_GITHUB_PRS);

  // Sync state to localStorage if available
  useEffect(() => {
    const savedUserId = localStorage.getItem('dettroin_active_user');
    if (savedUserId) {
      const found = users.find((u) => u.id === savedUserId);
      if (found) setUser(found);
    }
  }, [users]);

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setUser(target);
      localStorage.setItem('dettroin_active_user', target.id);
    }
  };

  const createTicket = (newTicketData: Partial<Ticket>): Ticket => {
    const nextNum = tickets.length + 144;
    const ticketNumber = `DET-${nextNum}`;
    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      ticket_number: ticketNumber,
      project_id: newTicketData.project_id || projects[0].id,
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

    // Send notification to assignee if assigned
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

    // Create notification for mentioned users
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
      project_id: newSprintData.project_id || projects[0].id,
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

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        users,
        projects,
        sprints,
        tickets,
        comments,
        subtasks,
        notifications,
        githubPRs,
        switchUser,
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
