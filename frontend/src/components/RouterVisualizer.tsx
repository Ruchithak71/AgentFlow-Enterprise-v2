import React from 'react';
import { Bot, Zap, ShieldAlert, FileText, Database } from 'lucide-react';
import { AIProvider } from '../types';

interface RouterVisualizerProps {
  activeProvider?: AIProvider;
}

export const RouterVisualizer: React.FC<RouterVisualizerProps> = ({ activeProvider }) => {
  const routes = [
    {
      id: 'GEMINI_FLASH',
      name: 'Gemini 2.0 Flash',
      role: 'High-Throughput General Audit',
      condition: 'Standard transactions (≤$100k, ≤10 pages, No PII)',
      icon: Zap,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/40',
      activeColor: 'ring-2 ring-amber-400 bg-amber-950/40 border-amber-400',
    },
    {
      id: 'GPT_5',
      name: 'GPT-4o Auditor',
      role: 'High-Value Forensic Compliance',
      condition: 'Invoice Amount > $100,000.00 USD',
      icon: ShieldAlert,
      color: 'from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/40',
      activeColor: 'ring-2 ring-sky-400 bg-sky-950/40 border-sky-400',
    },
    {
      id: 'CLAUDE_SONNET',
      name: 'Claude 3.5 Sonnet',
      role: 'Extended Context & Legal Review',
      condition: 'Document Length > 10 pages',
      icon: FileText,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/40',
      activeColor: 'ring-2 ring-emerald-400 bg-emerald-950/40 border-emerald-400',
    },
    {
      id: 'SAP_AI_CORE',
      name: 'SAP AI Core Boundary',
      role: 'Zero-Storage Privacy Boundary',
      condition: 'Contains Sensitive PII (GDPR / HIPAA)',
      icon: Database,
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/40',
      activeColor: 'ring-2 ring-purple-400 bg-purple-950/40 border-purple-400',
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bot className="h-5 w-5 text-indigo-400" />
            Dynamic Multi-Model AI Router
          </h3>
          <p className="text-xs text-slate-400">
            Intelligent runtime dispatch based on financial exposure, document volume, and compliance constraints.
          </p>
        </div>
        {activeProvider && (
          <span className="text-[11px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2.5 py-1 rounded-full animate-pulse">
            Active: {activeProvider}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = activeProvider === route.id;

          return (
            <div
              key={route.id}
              className={`p-4 rounded-xl border transition-all duration-300 bg-slate-950/60 ${
                isActive ? route.activeColor : 'border-slate-800/80 opacity-80 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg border bg-gradient-to-br ${route.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                )}
              </div>
              <h4 className="text-xs font-bold text-white tracking-tight">{route.name}</h4>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">{route.role}</p>
              <div className="mt-3 pt-2 border-t border-slate-800/60">
                <span className="text-[10px] text-slate-500 font-mono block">Trigger Rule:</span>
                <p className="text-[10px] text-slate-300 font-mono mt-0.5">{route.condition}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
