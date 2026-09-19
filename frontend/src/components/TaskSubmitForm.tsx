import React, { useState } from 'react';
import { Send, Sparkles, ShieldAlert, FileText, Database, AlertTriangle } from 'lucide-react';
import { TaskPayload } from '../types';

interface TaskSubmitFormProps {
  onSubmit: (payload: TaskPayload) => Promise<void>;
  isSubmitting: boolean;
}

export const TaskSubmitForm: React.FC<TaskSubmitFormProps> = ({ onSubmit, isSubmitting }) => {
  const [vendorId, setVendorId] = useState('VEN-1001');
  const [invoiceAmount, setInvoiceAmount] = useState<number>(4500.50);
  const [pageCount, setPageCount] = useState<number>(2);
  const [containsPII, setContainsPII] = useState<boolean>(false);
  const [taskType, setTaskType] = useState<string>('INVOICE_AUDIT');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      vendorId,
      invoiceAmount: Number(invoiceAmount),
      pageCount: Number(pageCount),
      containsPII,
      taskType,
    });
  };

  // Presets for 1-click testing of each routing branch & scenario
  const applyPreset = (preset: {
    vendorId: string;
    invoiceAmount: number;
    pageCount: number;
    containsPII: boolean;
  }) => {
    setVendorId(preset.vendorId);
    setInvoiceAmount(preset.invoiceAmount);
    setPageCount(preset.pageCount);
    setContainsPII(preset.containsPII);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            Dispatch AI Audit Task
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit an invoice transaction to Spring Boot Orchestrator for RabbitMQ queueing & dynamic model routing.
          </p>
        </div>
      </div>

      {/* 1-Click Preset Scenario Buttons */}
      <div className="mb-6">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Enterprise Test Scenarios (1-Click Presets):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => applyPreset({ vendorId: 'VEN-1001', invoiceAmount: 4500.50, pageCount: 2, containsPII: false })}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-indigo-500/50 transition text-left group"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
              <FileText className="h-3.5 w-3.5 text-emerald-400" />
              Standard Active
            </div>
            <p className="text-[10px] text-slate-500 mt-1">VEN-1001 • $4.5k • Gemini</p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset({ vendorId: 'VEN-9982', invoiceAmount: 25000, pageCount: 3, containsPII: false })}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-rose-500/50 transition text-left group"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 group-hover:text-rose-300">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
              Blocked Vendor
            </div>
            <p className="text-[10px] text-slate-500 mt-1">VEN-9982 • Blocked in SAP</p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset({ vendorId: 'VEN-1001', invoiceAmount: 185000, pageCount: 4, containsPII: false })}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-amber-500/50 transition text-left group"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 group-hover:text-amber-300">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              High-Value ($100k+)
            </div>
            <p className="text-[10px] text-slate-500 mt-1">VEN-1001 • $185k • GPT-4o</p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset({ vendorId: 'VEN-1001', invoiceAmount: 8500, pageCount: 1, containsPII: true })}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-purple-500/50 transition text-left group"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 group-hover:text-purple-300">
              <Database className="h-3.5 w-3.5 text-purple-400" />
              PII / GDPR
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Contains PII • SAP AI Core</p>
          </button>
        </div>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Vendor ID */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              SAP Vendor ID
            </label>
            <input
              type="text"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              placeholder="e.g. VEN-1001"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 transition"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Try <code className="text-indigo-400">VEN-1001</code> (Active) or <code className="text-rose-400">VEN-9982</code> (Blocked).
            </span>
          </div>

          {/* Invoice Amount */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Invoice Amount ($ USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(parseFloat(e.target.value) || 0)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 transition"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Amounts &gt; $100,000 dynamically route to Senior Auditor (GPT-4o).
            </span>
          </div>

          {/* Page Count */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Document Page Count
            </label>
            <input
              type="number"
              min="1"
              value={pageCount}
              onChange={(e) => setPageCount(parseInt(e.target.value) || 1)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 transition"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Pages &gt; 10 dynamically route to Claude 3.5 Sonnet.
            </span>
          </div>

          {/* Contains PII Toggle */}
          <div className="flex flex-col justify-center pt-2">
            <label className="flex items-center space-x-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={containsPII}
                onChange={(e) => setContainsPII(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
              />
              <div>
                <span className="text-xs font-medium text-slate-200">Contains Sensitive PII</span>
                <p className="text-[10px] text-slate-500">Forces zero-storage routing via SAP AI Core</p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 text-sm transition disabled:opacity-50"
          >
            <Send className={`h-4 w-4 ${isSubmitting ? 'animate-bounce' : ''}`} />
            {isSubmitting ? 'Submitting to Queue...' : 'Dispatch Audit Task'}
          </button>
        </div>
      </form>
    </div>
  );
};
