import React from 'react';
import { Cpu, Activity, RefreshCw, Layers } from 'lucide-react';
import { ServiceHealth } from '../types';

interface NavbarProps {
  health: ServiceHealth | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ health, onRefresh, isRefreshing }) => {
  const isHealthy = health?.status === 'UP';

  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="h-5 w-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg text-white tracking-tight">AgentFlow</h1>
              <span className="text-[10px] tracking-wider uppercase font-semibold bg-indigo-950/80 text-indigo-400 border border-indigo-700/50 px-1.5 py-0.5 rounded">
                Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">SAP S/4HANA AI Operations & Audit Gateway</p>
          </div>
        </div>

        {/* System Telemetry & Actions */}
        <div className="flex items-center space-x-4">
          {/* SAP System Target Badge */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-slate-400">Target ERP:</span>
            <span className="font-mono font-semibold text-amber-300">S4H_PRD_100</span>
          </div>

          {/* Microservices Health Badge */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
            <Activity className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-400">Backend:</span>
            <div className="flex items-center space-x-1.5">
              <span className={`h-2 w-2 rounded-full ${isHealthy ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'}`} />
              <span className={`font-semibold ${isHealthy ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isHealthy ? 'ALL SYSTEMS OPERATIONAL' : 'DEGRADED'}
              </span>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 disabled:opacity-50"
            title="Refresh Tasks & Telemetry"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
