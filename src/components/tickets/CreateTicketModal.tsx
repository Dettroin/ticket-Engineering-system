'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/context/AuthContext';
import { TicketPriority, TicketSeverity, TicketType } from '@/types/database';
import { TICKET_TYPE_LABELS } from '@/types/tickets';
import { Bug, Code, AlertTriangle } from 'lucide-react';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose }) => {
  const { projects, sprints, users, createTicket } = useAuth();

  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [sprintId, setSprintId] = useState(sprints[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TicketType>('api_issue');
  const [priority, setPriority] = useState<TicketPriority>('high');
  const [severity, setSeverity] = useState<TicketSeverity>('major');
  const [assigneeId, setAssigneeId] = useState(users[3]?.id || '');
  const [moduleName, setModuleName] = useState('Student Dashboard');
  const [environment, setEnvironment] = useState('Staging Environment');
  const [browserDevice, setBrowserDevice] = useState('Chrome v127 / macOS');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [expectedResult, setExpectedResult] = useState('');
  const [actualResult, setActualResult] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [storyPoints, setStoryPoints] = useState('3');
  const [labels, setLabels] = useState('api, frontend-blocker');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTicket({
      project_id: projectId,
      sprint_id: sprintId,
      title,
      description,
      type,
      priority,
      severity,
      assignee_id: assigneeId,
      module: moduleName,
      environment,
      browser_device: browserDevice,
      steps_to_reproduce: stepsToReproduce,
      expected_result: expectedResult,
      actual_result: actualResult,
      due_date: dueDate || undefined,
      story_points: parseInt(storyPoints) || 1,
      labels: labels.split(',').map((l) => l.trim()).filter(Boolean),
    });

    onClose();
  };

  const projectOptions = projects.map((p) => ({ value: p.id, label: `${p.name} (${p.key})` }));
  const sprintOptions = sprints.map((s) => ({ value: s.id, label: s.name }));
  const userOptions = users.map((u) => ({ value: u.id, label: `${u.full_name} (${u.job_title || u.role})` }));

  const typeOptions = Object.entries(TICKET_TYPE_LABELS).map(([key, label]) => ({
    value: key,
    label,
  }));

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent / Critical' },
  ];

  const severityOptions = [
    { value: 'minor', label: 'Minor' },
    { value: 'major', label: 'Major' },
    { value: 'critical', label: 'Critical' },
    { value: 'blocker', label: 'Blocker' },
  ];

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create Technical Ticket" maxWidth="4xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Banner */}
        <div className="bg-navy-950 text-white rounded-2xl p-4 flex items-center justify-between shadow-apple-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 text-white rounded-xl">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Dettroin Engineering Ticket</p>
              <p className="text-[11px] text-slate-300">
                Log API, UI, integration, or database bugs to eliminate WhatsApp/message communication gaps.
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <Input
          label="Ticket Title *"
          placeholder="e.g. Student API returning incorrect attendance structure"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Row 1: Project, Sprint, Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label="Project *" options={projectOptions} value={projectId} onChange={(e) => setProjectId(e.target.value)} />
          <Select label="Sprint" options={sprintOptions} value={sprintId} onChange={(e) => setSprintId(e.target.value)} />
          <Select label="Ticket Type *" options={typeOptions} value={type} onChange={(e) => setType(e.target.value as TicketType)} />
        </div>

        {/* Row 2: Priority, Severity, Assignee */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label="Priority *" options={priorityOptions} value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)} />
          <Select label="Severity *" options={severityOptions} value={severity} onChange={(e) => setSeverity(e.target.value as TicketSeverity)} />
          <Select label="Assign To (Developer/QA) *" options={userOptions} value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} />
        </div>

        {/* Row 3: Module, Environment, Browser */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Module" placeholder="e.g. Student Dashboard" value={moduleName} onChange={(e) => setModuleName(e.target.value)} />
          <Input label="Environment" placeholder="e.g. Staging / Production" value={environment} onChange={(e) => setEnvironment(e.target.value)} />
          <Input label="Browser / Device" placeholder="e.g. Chrome 127 / macOS" value={browserDevice} onChange={(e) => setBrowserDevice(e.target.value)} />
        </div>

        {/* Frontend ↔ Backend Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1.5 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-emerald-600" /> Expected API / Response JSON
            </label>
            <textarea
              rows={3}
              value={expectedResult}
              onChange={(e) => setExpectedResult(e.target.value)}
              placeholder={'{\n  "student_id": 101,\n  "attendance": 95\n}'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-emerald-800 font-mono focus:bg-white focus:outline-none focus:border-navy-600 shadow-apple-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Actual Received Response / Error
            </label>
            <textarea
              rows={3}
              value={actualResult}
              onChange={(e) => setActualResult(e.target.value)}
              placeholder={'{\n  "student": 101,\n  "attendance_percentage": null\n}'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-rose-800 font-mono focus:bg-white focus:outline-none focus:border-navy-600 shadow-apple-sm"
            />
          </div>
        </div>

        {/* Steps to reproduce */}
        <div>
          <label className="block text-xs font-semibold text-navy-900 mb-1.5">Steps to Reproduce</label>
          <textarea
            rows={3}
            value={stepsToReproduce}
            onChange={(e) => setStepsToReproduce(e.target.value)}
            placeholder="1. Open /dashboard/student/101&#10;2. Check network tab payload..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-navy-600 shadow-apple-sm"
          />
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <Input label="Story Points" type="number" min="1" max="13" value={storyPoints} onChange={(e) => setStoryPoints(e.target.value)} />
          <Input label="Labels (comma separated)" placeholder="api, frontend-blocker" value={labels} onChange={(e) => setLabels(e.target.value)} />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit Ticket
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
