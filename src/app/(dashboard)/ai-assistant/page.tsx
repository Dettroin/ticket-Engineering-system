'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Bot, Sparkles, Code, Bug, AlertTriangle, CheckCircle2, ArrowRight, Copy } from 'lucide-react';

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
      <div className="bg-gradient-to-r from-dettroin-950 via-slate-900 to-indigo-950 border border-dettroin-500/30 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-dettroin-500/20 text-dettroin-400 rounded-2xl border border-dettroin-400/30 shadow-lg">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-100">Dettroin Gemini AI Developer Assistant</h1>
              <span className="text-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold px-2 py-0.5 rounded-full">
                Gemini 3.6 / 1.5
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Auto-summarize long ticket discussions, detect duplicates, generate reproduction steps & proposed code fixes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Column */}
        <Card className="space-y-4 border-slate-800 bg-slate-900/90">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-dettroin-400" /> Select Ticket for AI Analysis
          </h2>

          <Select
            label="Choose Existing Ticket *"
            options={ticketOptions}
            value={selectedTicketId}
            onChange={(e) => setSelectedTicketId(e.target.value)}
          />

          {selectedTicket && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
              <p className="text-slate-400 font-medium">Selected Ticket Details:</p>
              <p className="font-bold text-slate-100">{selectedTicket.ticket_number}: {selectedTicket.title}</p>
              <p className="text-slate-300 line-clamp-2">{selectedTicket.description}</p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 space-y-3">
            <p className="text-xs text-slate-400 font-semibold">Or enter custom issue details:</p>
            <Input label="Issue Title" placeholder="e.g. JWT Refresh token fails on idle tab" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} />
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Stack Trace / Error Log</label>
              <textarea
                rows={3}
                placeholder="Paste server logs or network response..."
                value={customError}
                onChange={(e) => setCustomError(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-rose-300 font-mono focus:outline-none focus:border-dettroin-500"
              />
            </div>
          </div>

          <Button onClick={handleAnalyze} isLoading={isLoading} className="w-full">
            <Sparkles className="w-4 h-4 mr-2" /> Run AI Triage & Fix Suggestion
          </Button>
        </Card>

        {/* Output Column */}
        <Card className="space-y-4 border-slate-800 bg-slate-900/90">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" /> Gemini AI Recommendations
          </h2>

          {!aiResult && !isLoading && (
            <div className="h-80 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center space-y-2">
              <Bot className="w-10 h-10 text-slate-600" />
              <p className="text-xs text-slate-400">Click "Run AI Triage & Fix Suggestion" to generate automated root cause diagnosis & code fix.</p>
            </div>
          )}

          {aiResult && (
            <div className="space-y-4 text-xs animate-in fade-in duration-300">
              {/* Summary */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-dettroin-400">AI Ticket Summary</span>
                <p className="text-slate-200">{aiResult.summary}</p>
              </div>

              {/* Classification & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">Suggested Type</span>
                  <span className="font-bold text-indigo-400 uppercase">{aiResult.suggestedType}</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">Suggested Priority</span>
                  <span className="font-bold text-rose-400 uppercase">{aiResult.suggestedPriority}</span>
                </div>
              </div>

              {/* Root Cause Analysis */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Identified Root Cause
                </span>
                <p className="text-slate-300">{aiResult.rootCause}</p>
              </div>

              {/* Reproduction Steps */}
              {aiResult.reproductionSteps && (
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Generated Reproduction Steps</span>
                  <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                    {aiResult.reproductionSteps.map((step: string, idx: number) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Proposed Code Fix */}
              {aiResult.suggestedFix && (
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Proposed Code Fix
                  </span>
                  <pre className="p-3 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-lg overflow-x-auto border border-slate-800">
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
