import React from 'react';
import { ShieldCheck, Activity, RefreshCw, Layers } from 'lucide-react';
import { ServiceHealth } from '../types';

interface NavbarProps {
  health: ServiceHealth | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ health, onRefresh, isRefreshing }) => {
  const isHealthy = health?.status === 'UP';

  return (
    <header className="border-b border-cream-dark/60 bg-cream/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand Title */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-steel p-0.5 shadow-md flex items-center justify-center">
            <div className="h-full w-full bg-cream rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-steel" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg text-ink tracking-tight">AgentFlow</h1>
              <span className="text-[10px] tracking-wider uppercase font-semibold bg-sky/50 text-steel-dark border border-steel/30 px-2 py-0.5 rounded-full">
                XAI Enterprise
              </span>
            </div>
            <p className="text-xs text-ink-muted font-medium">SAP S/4HANA Multi-Agent Autonomous Audit Gateway</p>
          </div>
        </div>

        {/* Telemetry Badges */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cream border border-cream-dark text-xs">
            <Layers className="h-3.5 w-3.5 text-steel" />
            <span className="text-ink-muted">ERP Target:</span>
            <span className="font-mono font-semibold text-ink">S4H_PRD_100</span>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cream border border-cream-dark text-xs">
            <Activity className="h-3.5 w-3.5 text-steel" />
            <span className="text-ink-muted hidden sm:inline">Backend:</span>
            <div className="flex items-center space-x-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${isHealthy ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
              <span className={`font-semibold ${isHealthy ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isHealthy ? 'HEALTHY' : 'DEGRADED'}
              </span>
            </div>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-cream hover:bg-cream-light text-ink hover:text-steel transition border border-cream-dark disabled:opacity-50 shadow-sm"
            title="Refresh Tasks & Telemetry"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-steel' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
