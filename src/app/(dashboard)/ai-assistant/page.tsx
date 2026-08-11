'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Bot, Sparkles, Code, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AIAssistantPage() {
  const { tickets } = useAuth();
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.ticket_number || '');
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customError, setCustomError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const selectedTicket = tickets.find((t) => t.ticket_number === selectedTicketId);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAiResult(null);

    const payload = {
      ticketTitle: selectedTicket?.title || customTitle || 'API Response Error',
      description: selectedTicket?.description || customDescription || 'Payload schema mismatch',
      errorPayload: selectedTicket?.actual_result || customError || '{"student": 101, "attendance_percentage": null}',
      codeSnippet: selectedTicket?.expected_result || '',
    };

    try {
      const res = await fetch('/api/ai/bug-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setAiResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const ticketOptions = tickets.map((t) => ({
    value: t.ticket_number,
    label: `${t.ticket_number}: ${t.title}`,
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white border border-navy-900 rounded-3xl p-6 shadow-apple-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 text-white rounded-2xl border border-white/20 shadow-lg">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Dettroin Gemini AI Developer Assistant</h1>
              <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                Gemini 3.6 / 1.5
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">Auto-summarize long ticket discussions, detect duplicates, generate reproduction steps & proposed code fixes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Column */}
        <Card className="space-y-4">
          <h2 className="text-sm font-bold text-navy-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-navy-800" /> Select Ticket for AI Analysis
          </h2>

          <Select
            label="Choose Existing Ticket *"
            options={ticketOptions}
            value={selectedTicketId}
            onChange={(e) => setSelectedTicketId(e.target.value)}
          />

          {selectedTicket && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs shadow-apple-sm">
              <p className="text-slate-500 font-bold">Selected Ticket Details:</p>
              <p className="font-bold text-navy-950">{selectedTicket.ticket_number}: {selectedTicket.title}</p>
              <p className="text-slate-700 font-medium line-clamp-2">{selectedTicket.description}</p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <p className="text-xs text-slate-500 font-bold">Or enter custom issue details:</p>
            <Input label="Issue Title" placeholder="e.g. JWT Refresh token fails on idle tab" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} />
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1.5">Stack Trace / Error Log</label>
              <textarea
                rows={3}
                placeholder="Paste server logs or network response..."
                value={customError}
                onChange={(e) => setCustomError(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-rose-800 font-mono focus:bg-white focus:outline-none focus:border-navy-600 shadow-apple-sm"
              />
            </div>
          </div>

          <Button onClick={handleAnalyze} isLoading={isLoading} className="w-full">
            <Sparkles className="w-4 h-4 mr-2" /> Run AI Triage & Fix Suggestion
          </Button>
        </Card>

        {/* Output Column */}
        <Card className="space-y-4">
          <h2 className="text-sm font-bold text-navy-950 flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-600" /> Gemini AI Recommendations
          </h2>

          {!aiResult && !isLoading && (
            <div className="h-80 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-2">
              <Bot className="w-10 h-10 text-slate-400" />
              <p className="text-xs text-slate-500 font-medium">Click "Run AI Triage & Fix Suggestion" to generate automated root cause diagnosis & code fix.</p>
            </div>
          )}

          {aiResult && (
            <div className="space-y-4 text-xs animate-in fade-in duration-300">
              {/* Summary */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 shadow-apple-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-navy-800">AI Ticket Summary</span>
                <p className="text-slate-800 font-medium">{aiResult.summary}</p>
              </div>

              {/* Classification & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl shadow-apple-sm">
                  <span className="text-[10px] text-slate-500 block font-semibold">Suggested Type</span>
                  <span className="font-bold text-indigo-700 uppercase">{aiResult.suggestedType}</span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl shadow-apple-sm">
                  <span className="text-[10px] text-slate-500 block font-semibold">Suggested Priority</span>
                  <span className="font-bold text-rose-700 uppercase">{aiResult.suggestedPriority}</span>
                </div>
              </div>

              {/* Root Cause Analysis */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 shadow-apple-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Identified Root Cause
                </span>
                <p className="text-slate-800 font-medium">{aiResult.rootCause}</p>
              </div>

              {/* Reproduction Steps */}
              {aiResult.reproductionSteps && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 shadow-apple-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Generated Reproduction Steps</span>
                  <ul className="space-y-1 text-slate-800 font-mono text-[11px]">
                    {aiResult.reproductionSteps.map((step: string, idx: number) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Proposed Code Fix */}
              {aiResult.suggestedFix && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 shadow-apple-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Proposed Code Fix
                  </span>
                  <pre className="p-3 bg-white text-emerald-800 font-mono text-[11px] rounded-xl overflow-x-auto border border-slate-200 shadow-apple-sm">
                    {aiResult.suggestedFix}
                  </pre>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
