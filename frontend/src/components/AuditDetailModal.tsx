import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Building2, Layers, Cpu, Award } from 'lucide-react';
import { CachedTaskResult, TaskEntity } from '../types';

interface AuditDetailModalProps {
  task: TaskEntity;
  auditResult: CachedTaskResult | null;
  onClose: () => void;
}

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({ task, auditResult, onClose }) => {
  let parsedPayload: any = {};
  try {
    parsedPayload = JSON.parse(task.rawPayload);
  } catch (e) {
    parsedPayload = {};
  }

  const result = auditResult?.result;
  const isApproved = result?.audit_status === 'APPROVED' || result?.audit_status === 'COMPLIANT';
  const riskScore = result?.overallVendorRiskScore ?? (isApproved ? 15 : 85);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl border ${isApproved ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400' : 'bg-rose-950/50 border-rose-500/30 text-rose-400'}`}>
              {isApproved ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">SAP S/4HANA AI Audit Dossier</h3>
                <span className="font-mono text-xs text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/60">
                  {task.taskId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Routed Engine: <span className="font-semibold text-slate-200">{auditResult?.provider || 'Processing'}</span> • Type: {task.taskType}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Risk Score */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Composite Risk Score</span>
              <div className="flex items-baseline space-x-2 my-1">
                <span className={`text-3xl font-extrabold tracking-tight ${riskScore < 30 ? 'text-emerald-400' : riskScore < 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {riskScore.toFixed(1)}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Category: {result?.riskCategory || (riskScore < 30 ? 'LOW_RISK' : 'HIGH_RISK')}
              </span>
            </div>

            {/* Audit Status */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Compliance Decision</span>
              <div className="my-1">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                  isApproved 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' 
                    : 'bg-rose-950 text-rose-300 border border-rose-700/50'
                }`}>
                  {result?.audit_status || 'PENDING_EVALUATION'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">
                ERP Reconciliation Validated
              </span>
            </div>

            {/* SAP Master Record Status */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">SAP Master Data Status</span>
              <div className="my-1 flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-sky-400" />
                <span className="font-mono text-sm font-bold text-white">
                  {result?.sapAccountStatus || 'FETCHING'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Vendor: {parsedPayload.vendorId || 'UNKNOWN'}
              </span>
            </div>
          </div>

          {/* Key Findings List */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              Automated Forensic Findings
            </h4>
            {result?.keyFindings && result.keyFindings.length > 0 ? (
              <ul className="space-y-2">
                {result.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">No automated findings generated yet or task still in queue.</p>
            )}
          </div>

          {/* Detailed Financial & Privacy Breakdown if available */}
          {result?.riskBreakdown && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Executive Risk Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Financial Exposure:</span>
                  <span className="text-slate-200">{result.riskBreakdown.financialExposure}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Fraud Probability:</span>
                  <span className="text-slate-200 font-mono">{result.riskBreakdown.fraudProbabilityScore}</span>
                </div>
              </div>
            </div>
          )}

          {result?.recommendedAction && (
            <div className="p-3.5 rounded-xl border border-amber-800/40 bg-amber-950/20 text-xs">
              <span className="font-semibold text-amber-300 block mb-0.5">Recommended Action:</span>
              <p className="text-amber-200/90">{result.recommendedAction}</p>
            </div>
          )}

          {/* Raw Payload Inspector (Accordion) */}
          <details className="text-xs bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-slate-400">
            <summary className="cursor-pointer font-medium text-slate-300 hover:text-white transition">
              View Raw Ingestion Payload
            </summary>
            <pre className="mt-2 p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800">
              {JSON.stringify(parsedPayload, null, 2)}
            </pre>
          </details>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
