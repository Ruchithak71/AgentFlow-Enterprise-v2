import React from 'react';
import { Eye, Layers, ShieldCheck, Scale, ArrowRight } from 'lucide-react';

interface MultiAgentPipelineVisualizerProps {
  activeStep?: number;
}

export const MultiAgentPipelineVisualizer: React.FC<MultiAgentPipelineVisualizerProps> = () => {
  const agents = [
    {
      step: 1,
      title: "Agent 1: Document Extractor",
      model: "Gemini 2.0 Flash Vision",
      role: "Visual Line-Item & Tax OCR",
      desc: "Extracts invoice line items, tax ID, and stated total directly from PDF bytes.",
      icon: Eye,
    },
    {
      step: 2,
      title: "Agent 2: SAP ERP Matcher",
      model: "S/4HANA BAPI Gateway",
      role: "3-Way Purchase Order Check",
      desc: "Cross-references vendor status (LFA1) and PO delivery records (EKKO/EKPO).",
      icon: Layers,
    },
    {
      step: 3,
      title: "Agent 3: Forensic Auditor",
      model: "GPT-4o Compliance Engine",
      role: "Anomaly & Math Reconciliation",
      desc: "Detects price variances, bank changes, tax mismatches, and duplicate submissions.",
      icon: ShieldCheck,
    },
    {
      step: 4,
      title: "Agent 4: XAI Adjudicator",
      model: "Explainable Synthesis Agent",
      role: "Counterfactuals & Risk Score",
      desc: "Calculates composite risk (0-100), outputs evidence citations & 'What-If' rationale.",
      icon: Scale,
    }
  ];

  return (
    <div className="bg-cream border border-cream-dark rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-ink flex items-center gap-2">
            <Scale className="h-5 w-5 text-steel" />
            4-Agent Collaborative Audit Pipeline
          </h3>
          <p className="text-xs text-ink-muted">
            Autonomous multi-agent verification: each invoice passes through specialized visual, ERP, forensic, and explainability agents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {agents.map((agent, idx) => {
          const Icon = agent.icon;
          return (
            <div
              key={agent.step}
              className="p-4 rounded-xl border border-cream-dark bg-cream-light hover:border-steel/60 transition shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-sky/40 text-steel">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-steel/10 text-steel px-2 py-0.5 rounded-full">
                    Step {agent.step}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-ink">{agent.title}</h4>
                <span className="text-[10px] font-semibold text-steel block mt-0.5">{agent.model}</span>
                <p className="text-[11px] font-medium text-ink-muted mt-1">{agent.role}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-cream-dark">
                <p className="text-[10px] text-ink-muted leading-relaxed">{agent.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
