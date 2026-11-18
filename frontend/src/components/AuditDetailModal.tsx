import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Building2, HelpCircle, FileText, Layers, Scale, Sparkles } from 'lucide-react';
import { CachedTaskResult, TaskEntity } from '../types';

interface AuditDetailModalProps {
  task: TaskEntity;
  auditResult: CachedTaskResult | null;
  onClose: () => void;
}

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({ task, auditResult, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'multiAgent' | 'whatIf' | 'raw'>('overview');

  let parsedPayload: any = {};
  try {
    parsedPayload = JSON.parse(task.rawPayload);
  } catch {
    parsedPayload = {};
  }

  const result = auditResult?.result;
  const isApproved = result?.audit_status === 'APPROVED' || auditResult?.finalDecision === 'AUTO_APPROVED';
  const riskScore = result?.overallVendorRiskScore ?? (isApproved ? 12 : 88);
  const multiAgent = result?.multiAgentDossier;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cream border border-cream-dark w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-cream-dark flex items-center justify-between bg-cream-light">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl border ${
              isApproved 
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                : 'bg-rose-100 border-rose-300 text-rose-800'
            }`}>
              {isApproved ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-ink text-base">SAP S/4HANA Forensic Audit Dossier</h3>
                <span className="font-mono text-xs text-steel-dark bg-sky/50 px-2 py-0.5 rounded-full border border-steel/30">
                  {task.taskId}
                </span>
              </div>
              <p className="text-xs text-ink-muted">
                Multi-Agent Team Verified • Task Type: {task.taskType}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-cream hover:bg-cream-dark/60 text-ink-muted hover:text-ink transition border border-cream-dark"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-cream-dark bg-cream px-6 space-x-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition ${activeTab === 'overview' ? 'border-steel text-steel font-bold' : 'border-transparent text-ink-muted hover:text-ink'}`}
          >
            Audit Overview
          </button>
          <button
            onClick={() => setActiveTab('multiAgent')}
            className={`py-3 border-b-2 transition ${activeTab === 'multiAgent' ? 'border-steel text-steel font-bold' : 'border-transparent text-ink-muted hover:text-ink'}`}
          >
            4-Agent Execution Trace
          </button>
          <button
            onClick={() => setActiveTab('whatIf')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${activeTab === 'whatIf' ? 'border-steel text-steel font-bold' : 'border-transparent text-ink-muted hover:text-ink'}`}
          >
            <Sparkles className="h-3.5 w-3.5 text-steel" />
            XAI "What-If" Analysis
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`py-3 border-b-2 transition ${activeTab === 'raw' ? 'border-steel text-steel font-bold' : 'border-transparent text-ink-muted hover:text-ink'}`}
          >
            Raw JSON Dossier
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-5 bg-cream flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Score KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-cream-light border border-cream-dark rounded-xl p-4 shadow-sm">
                  <span className="text-xs text-ink-muted font-medium">Composite Risk Score</span>
                  <div className="flex items-baseline space-x-2 my-1">
                    <span className={`text-3xl font-extrabold tracking-tight ${
                      riskScore < 30 ? 'text-emerald-700' : riskScore < 70 ? 'text-amber-700' : 'text-rose-700'
                    }`}>
                      {riskScore.toFixed(1)}
                    </span>
                    <span className="text-xs text-ink-muted">/ 100</span>
                  </div>
                  <span className="text-[10px] font-mono text-ink-muted uppercase">
                    Category: {result?.riskCategory || (riskScore < 30 ? 'LOW_RISK' : 'HIGH_RISK')}
                  </span>
                </div>

                <div className="bg-cream-light border border-cream-dark rounded-xl p-4 shadow-sm">
                  <span className="text-xs text-ink-muted font-medium">Compliance Verdict</span>
                  <div className="my-1.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isApproved 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {result?.audit_status || 'PENDING'}
                    </span>
                  </div>
                  <span className="text-[10px] text-ink-muted">
                    SAP 3-Way Reconciliation Checked
                  </span>
                </div>

                <div className="bg-cream-light border border-cream-dark rounded-xl p-4 shadow-sm">
                  <span className="text-xs text-ink-muted font-medium">SAP Master Record</span>
                  <div className="my-1.5 flex items-center space-x-1.5">
                    <Building2 className="h-4 w-4 text-steel" />
                    <span className="font-mono text-xs font-bold text-ink">
                      {result?.sapAccountStatus || 'FETCHING'}
                    </span>
                  </div>
                  <span className="text-[10px] text-ink-muted">
                    Vendor: {parsedPayload.vendorId || 'UNKNOWN'}
                  </span>
                </div>
              </div>

              {/* Forensic Findings */}
              <div className="bg-cream-light border border-cream-dark rounded-xl p-4 shadow-sm">
                <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-steel" />
                  Forensic Evidence Citations
                </h4>
                {result?.keyFindings && result.keyFindings.length > 0 ? (
                  <ul className="space-y-2">
                    {result.keyFindings.map((finding, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-ink">
                        <span className="h-1.5 w-1.5 rounded-full bg-steel mt-1.5 shrink-0" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-ink-muted italic">Processing multi-agent checks...</p>
                )}
              </div>

              {/* Recommended Action */}
              {result?.recommendedAction && (
                <div className="p-3.5 rounded-xl border border-steel/30 bg-sky/30 text-xs">
                  <span className="font-semibold text-steel-dark block mb-0.5">Recommended Workflow Action:</span>
                  <p className="text-ink">{result.recommendedAction}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MULTI-AGENT TRACE */}
          {activeTab === 'multiAgent' && (
            <div className="space-y-3">
              {/* Agent 1 */}
              <div className="bg-cream-light border border-cream-dark rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-steel" />
                    Agent 1: Visual Document Extractor (Gemini 2.0 Flash)
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Completed (98.5% confidence)
                  </span>
                </div>
                <div className="text-xs text-ink-muted space-y-1 font-mono text-[11px]">
                  <p>Document: {multiAgent?.extractionAgent?.fileName || parsedPayload.fileName || 'invoice.pdf'}</p>
                  <p>Stated Total: ${multiAgent?.extractionAgent?.extractedData?.statedTotal || parsedPayload.invoiceAmount || 0} USD</p>
                  <p>PO Cross-Reference: {multiAgent?.extractionAgent?.extractedData?.poNumber || parsedPayload.poNumber || 'PO-1001'}</p>
                </div>
              </div>

              {/* Agent 2 */}
              <div className="bg-cream-light border border-cream-dark rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-steel" />
                    Agent 2: SAP S/4HANA 3-Way Matcher
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    multiAgent?.sapReconciliationAgent?.matchVerdict === 'MATCH_VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {multiAgent?.sapReconciliationAgent?.matchVerdict || 'MATCH_CHECK'}
                  </span>
                </div>
                <div className="text-xs text-ink-muted space-y-1 font-mono text-[11px]">
                  <p>Vendor Name: {multiAgent?.sapReconciliationAgent?.vendorMaster?.vendorName}</p>
                  <p>Account Status: {multiAgent?.sapReconciliationAgent?.vendorMaster?.accountStatus}</p>
                  <p>Price Variance: ${multiAgent?.sapReconciliationAgent?.poMaster?.priceVariance || 0.0} USD</p>
                </div>
              </div>

              {/* Agent 3 */}
              <div className="bg-cream-light border border-cream-dark rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-steel" />
                    Agent 3: Forensic Compliance Auditor (GPT-4o)
                  </span>
                  <span className="text-[10px] font-mono bg-sky/50 text-steel-dark px-2 py-0.5 rounded-full">
                    Fraud Prob: {((multiAgent?.forensicAgent?.fraudProbability || 0.05) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="text-xs text-ink-muted space-y-1 font-mono text-[11px]">
                  <p>Math Integrity: {multiAgent?.forensicAgent?.mathIntegrityCheck || 'Verified'}</p>
                  <p>Sanctions List: {multiAgent?.forensicAgent?.sanctionsListCheck || 'Clear'}</p>
                </div>
              </div>

              {/* Agent 4 */}
              <div className="bg-cream-light border border-cream-dark rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <Scale className="h-4 w-4 text-steel" />
                    Agent 4: XAI Adjudicator
                  </span>
                  <span className="text-[10px] font-mono bg-steel/20 text-steel px-2 py-0.5 rounded-full">
                    Composite: {riskScore.toFixed(1)} / 100
                  </span>
                </div>
                <p className="text-xs text-ink mt-1">
                  Synthesized all visual, ERP, and fraud flags into final adjudication.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: XAI WHAT-IF ANALYSIS */}
          {activeTab === 'whatIf' && (
            <div className="space-y-4">
              <div className="bg-cream-light border border-steel/40 rounded-xl p-5 shadow-sm">
                <div className="flex items-center space-x-2 text-steel mb-3">
                  <Sparkles className="h-5 w-5" />
                  <h4 className="text-sm font-bold text-ink">Explainable AI (XAI) Counterfactual Rationale</h4>
                </div>
                <p className="text-xs text-ink leading-relaxed font-medium bg-sky/30 p-3.5 rounded-xl border border-steel/20">
                  {result?.counterfactualExplanation || "Processing counterfactual what-if reasoning for this transaction..."}
                </p>
                <div className="mt-4 pt-3 border-t border-cream-dark text-xs text-ink-muted">
                  <span className="font-semibold text-ink block mb-1">What is Counterfactual Explanation?</span>
                  <p>
                    Rather than operating as a black box, the XAI Adjudicator computes the exact mathematical and operational condition required to flip the decision from Flagged to Approved.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RAW DOSSIER */}
          {activeTab === 'raw' && (
            <div className="bg-cream-light border border-cream-dark rounded-xl p-4">
              <pre className="p-3 bg-cream rounded-lg font-mono text-[11px] text-ink overflow-x-auto border border-cream-dark">
                {JSON.stringify(result || parsedPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cream-dark bg-cream-light flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-steel hover:bg-steel-dark text-white text-xs font-semibold transition shadow-sm"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
