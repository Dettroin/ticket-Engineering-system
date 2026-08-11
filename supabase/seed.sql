-- Dettroin Engineering & Project Management System - Initial Seed Data

-- 1. Insert Main Organization
INSERT INTO public.organizations (id, name, slug, logo_url)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Dettroin',
  'dettroin',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
) ON CONFLICT DO NOTHING;

-- 2. Insert Users (Auth UUID Mocks)
INSERT INTO public.users (id, org_id, email, full_name, role, job_title, avatar_url) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'admin@dettroin.com', 'Alex Mercer', 'admin', 'Engineering Lead', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
('b2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'pm@dettroin.com', 'Sarah Jenkins', 'project_manager', 'Senior Project Manager', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'),
('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'frontend@dettroin.com', 'Tarun Sharma', 'frontend_developer', 'Lead Frontend Engineer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
('d4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'backend@dettroin.com', 'Rahul Verma', 'backend_developer', 'Senior Backend Engineer', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'),
('e5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'qa@dettroin.com', 'Priya Patel', 'qa_tester', 'Lead QA Automation Specialist', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80')
ON CONFLICT DO NOTHING;

-- 3. Insert Projects
INSERT INTO public.projects (id, org_id, name, key, description, client_name, project_manager_id, tech_stack, repository_url, status, priority, start_date, end_date) VALUES
('p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Dettroin School ERP', 'DET', 'Comprehensive SaaS platform for school administration, student dashboards, and attendance tracking.', 'Apex Education Trust', 'b2222222-2222-2222-2222-222222222222', ARRAY['Next.js', 'PostgreSQL', 'Supabase', 'TailwindCSS', 'TypeScript'], 'https://github.com/dettroin/school-erp', 'active', 'high', '2026-01-10', '2026-12-20'),
('p2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'School Website & Portal', 'WEB', 'Public facing web portal for student admissions and news announcements.', 'Apex Education Trust', 'b2222222-2222-2222-2222-222222222222', ARRAY['Next.js', 'TailwindCSS'], 'https://github.com/dettroin/school-portal', 'active', 'medium', '2026-03-01', '2026-09-30')
ON CONFLICT DO NOTHING;

-- 4. Insert Sprints
INSERT INTO public.sprints (id, project_id, name, goal, status, start_date, end_date) VALUES
('s1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'Sprint 24 - Student Dashboard & API Sync', 'Deliver reliable attendance payload structure and real-time student dashboard widgets.', 'active', '2026-08-01', '2026-08-15'),
('s2222222-2222-2222-2222-222222222222', 'p1111111-1111-1111-1111-111111111111', 'Sprint 25 - Fee Gateway & Reports', 'Integrate Razorpay payment webhooks and automated receipt generation.', 'planning', '2026-08-16', '2026-08-30')
ON CONFLICT DO NOTHING;

-- 5. Insert Tickets (Including core example DET-143)
INSERT INTO public.tickets (
  id, ticket_number, project_id, sprint_id, title, description, type, status, priority, severity, 
  reporter_id, assignee_id, module, environment, browser_device, steps_to_reproduce, 
  expected_result, actual_result, due_date, story_points, labels
) VALUES
(
  't1431431-1431-1431-1431-143143143143', 'DET-143', 'p1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111',
  'Student API returning incorrect attendance structure',
  'When rendering the Student Attendance widget on frontend, GET /api/students response schema mismatches expected TypeScript interface causing client null crashes.',
  'api_issue', 'in_progress', 'high', 'critical',
  'c3333333-3333-3333-3333-333333333333', 'd4444444-4444-4444-4444-444444444444',
  'Student Dashboard', 'Staging Environment', 'Chrome v127 / macOS Sonoma',
  '1. Navigate to /dashboard/student/101\n2. Open Browser DevTools Network tab\n3. Observe GET /api/students payload',
  'Expected JSON:\n{\n  "student_id": 101,\n  "attendance": 95\n}',
  'Actual JSON:\n{\n  "student": 101,\n  "attendance_percentage": null\n}',
  '2026-08-14', 3, ARRAY['api', 'frontend-blocker', 'student-module']
),
(
  't1011011-1011-1011-1011-101101101101', 'DET-101', 'p1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111',
  'Fix auth session timeout refresh token deadlock',
  'When user leaves tab inactive for 45 minutes, Supabase auth token refresh fails silently.',
  'bug', 'code_review', 'urgent', 'blocker',
  'e5555555-5555-5555-5555-555555555555', 'd4444444-4444-4444-4444-444444444444',
  'Authentication', 'Production', 'Firefox & Safari',
  '1. Login as teacher\n2. Wait 45 mins idle\n3. Click Submit Grade',
  'Session should refresh seamlessly.', 'App throws 401 Unauthorized modal.',
  '2026-08-12', 5, ARRAY['auth', 'security', 'backend']
),
(
  't1021021-1021-1021-1021-102102102102', 'DET-102', 'p1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111',
  'Implement dark mode high contrast toggle for accessibility',
  'Add accessible dark/light mode toggle with persistence across browser restarts.',
  'feature', 'ready_for_testing', 'medium', 'minor',
  'b2222222-2222-2222-2222-222222222222', 'c3333333-3333-3333-3333-333333333333',
  'UI Theme', 'All Environments', 'All Browsers',
  '1. Click theme toggle switch in top bar\n2. Reload page',
  'Theme choice should persist in localStorage and sync with system preference.', 'Works as designed.',
  '2026-08-15', 2, ARRAY['ui', 'accessibility', 'frontend']
)
ON CONFLICT DO NOTHING;

-- 6. Comments on DET-143
INSERT INTO public.ticket_comments (ticket_id, user_id, content, mentions) VALUES
('t1431431-1431-1431-1431-143143143143', 'c3333333-3333-3333-3333-333333333333', '@Rahul Verma - I created this ticket regarding the attendance API payload mismatch. We need `attendance` field formatted as integer percentage rather than null.', ARRAY['d4444444-4444-4444-4444-444444444444']),
('t1431431-1431-1431-1431-143143143143', 'd4444444-4444-4444-4444-444444444444', 'Thanks @Tarun Sharma! Investigating the SQL view transformation now. Will push a hotfix and link PR shortly.', ARRAY['c3333333-3333-3333-3333-333333333333'])
ON CONFLICT DO NOTHING;

-- 7. GitHub PR Link
INSERT INTO public.github_pull_requests (ticket_id, repo_name, pr_number, pr_title, pr_url, status, author) VALUES
('t1431431-1431-1431-1431-143143143143', 'dettroin/school-erp', 284, 'Fix DET-143: Update student attendance API response schema', 'https://github.com/dettroin/school-erp/pull/284', 'open', 'Rahul Verma')
ON CONFLICT DO NOTHING;

-- 8. Notifications
INSERT INTO public.notifications (user_id, ticket_id, title, message, link, is_read, type) VALUES
('d4444444-4444-4444-4444-444444444444', 't1431431-1431-1431-1431-143143143143', 'New High Priority Ticket Assigned', 'Tarun Sharma assigned DET-143: Student API returning incorrect attendance structure to you.', '/tickets/DET-143', false, 'assigned'),
('c3333333-3333-3333-3333-333333333333', 't1431431-1431-1431-1431-143143143143', 'New Comment on DET-143', 'Rahul Verma commented: Thanks @Tarun Sharma! Investigating the SQL view transformation now.', '/tickets/DET-143', false, 'commented')
ON CONFLICT DO NOTHING;
