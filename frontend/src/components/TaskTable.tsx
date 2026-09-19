import React from 'react';
import { Clock, Eye, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { TaskEntity, CachedTaskResult } from '../types';

interface TaskTableProps {
  tasks: TaskEntity[];
  resultsMap: Record<string, CachedTaskResult | null>;
  onSelectTask: (task: TaskEntity) => void;
  isLoading: boolean;
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, resultsMap, onSelectTask, isLoading }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Table Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-base">Live Audit Task Queue</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time synchronization between PostgreSQL persistence and Redis completed audit cache.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
          {tasks.length} Total Records
        </span>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Task ID</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Vendor</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">AI Engine</th>
              <th className="py-3 px-4">Audit Result</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                  {isLoading ? 'Loading task records...' : 'No audit tasks found. Dispatch a new task above!'}
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                let payload: any = {};
                try {
                  payload = JSON.parse(task.rawPayload);
                } catch {
                  payload = {};
                }

                const cachedResult = resultsMap[task.taskId];
                const isCompleted = !!cachedResult && cachedResult.status === 'COMPLETED';
                const isApproved = cachedResult?.result?.audit_status === 'APPROVED' || cachedResult?.result?.audit_status === 'COMPLIANT';

                return (
                  <tr key={task.taskId} className="hover:bg-slate-800/40 transition">
                    {/* Task ID */}
                    <td className="py-3.5 px-4 font-mono font-medium text-indigo-400">
                      {task.taskId}
                    </td>

                    {/* Task Type */}
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {task.taskType}
                    </td>

                    {/* Vendor */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {payload.vendorId || 'UNKNOWN'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                      {payload.invoiceAmount ? `$${Number(payload.invoiceAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A'}
                    </td>

                    {/* AI Provider */}
                    <td className="py-3.5 px-4">
                      {cachedResult?.provider ? (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
                          {cachedResult.provider}
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                          <RefreshCw className="h-3 w-3 animate-spin" /> In Queue
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {isCompleted ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          isApproved
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/40'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-700/40'
                        }`}>
                          {isApproved ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                          {cachedResult?.result?.audit_status || 'COMPLETED'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/40">
                          <Clock className="h-3 w-3" />
                          QUEUED
                        </span>
                      )}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono whitespace-nowrap">
                      {new Date(task.createdAt).toLocaleTimeString()}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectTask(task)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
