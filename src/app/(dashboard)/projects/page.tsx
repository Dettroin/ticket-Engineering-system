'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { FolderKanban, Plus, ExternalLink, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const { projects, createProject, canCreateProjectPermission } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('Next.js, TailwindCSS, PostgreSQL');
  const [repositoryUrl, setRepositoryUrl] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !key) return;

    createProject({
      name,
      key: key.toUpperCase(),
      client_name: clientName,
      description,
      tech_stack: techStack.split(',').map((s) => s.trim()).filter(Boolean),
      repository_url: repositoryUrl,
    });

    setIsModalOpen(false);
    setName('');
    setKey('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-950 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-navy-800" /> Projects Directory
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage client software applications, engineering tasks, & sprints</p>
        </div>

        {canCreateProjectPermission && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" /> New Project
          </Button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} hoverable className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-navy-950 text-white flex items-center justify-center font-mono font-bold text-sm shadow-apple-sm">
                  {project.key}
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy-950">{project.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{project.client_name || 'Dettroin Client'}</p>
                </div>
              </div>
              <span className="text-xs px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold capitalize">
                {project.status}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{project.description}</p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 font-mono font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Links & Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Started {project.start_date || '2026-01-10'}</span>
              </div>

              <div className="flex items-center gap-3">
                {project.repository_url && (
                  <a
                    href={project.repository_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-navy-700 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    GitHub Repo <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <Link href={`/kanban?project=${project.id}`}>
                  <Button size="sm" variant="outline">
                    Kanban →
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* New Project Modal */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Project Name *" placeholder="e.g. School ERP Management" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Project Key (Short Prefix) *" placeholder="e.g. DET or ERP" value={key} onChange={(e) => setKey(e.target.value)} required />
          <Input label="Client Name" placeholder="e.g. Apex Education Trust" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1.5">Project Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="System details..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-navy-600 shadow-apple-sm"
            />
          </div>
          <Input label="Tech Stack (comma separated)" placeholder="Next.js, PostgreSQL, Supabase" value={techStack} onChange={(e) => setTechStack(e.target.value)} />
          <Input label="GitHub Repository URL" placeholder="https://github.com/dettroin/school-erp" value={repositoryUrl} onChange={(e) => setRepositoryUrl(e.target.value)} />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
