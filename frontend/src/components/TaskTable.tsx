import React from 'react';
import { Clock, Eye, CheckCircle, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { TaskEntity, CachedTaskResult } from '../types';

interface TaskTableProps {
  tasks: TaskEntity[];
  resultsMap: Record<string, CachedTaskResult | null>;
  onSelectTask: (task: TaskEntity) => void;
  isLoading: boolean;
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, resultsMap, onSelectTask, isLoading }) => {
  return (
    <div className="bg-cream border border-cream-dark rounded-2xl overflow-hidden shadow-md">
      {/* Table Header */}
      <div className="p-5 border-b border-cream-dark flex items-center justify-between bg-cream-light">
        <div>
          <h3 className="font-bold text-ink text-base">Live Audit Task Queue</h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Real-time synchronization between PostgreSQL ingestion and Redis completed 4-Agent audit dossiers.
          </p>
        </div>
        <span className="text-xs font-mono text-ink-muted bg-cream px-2.5 py-1 rounded-lg border border-cream-dark">
          {tasks.length} Records Ingested
        </span>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-cream text-ink-muted border-b border-cream-dark uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Task ID</th>
              <th className="py-3 px-4">Document / Type</th>
              <th className="py-3 px-4">Vendor</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Audit Team</th>
              <th className="py-3 px-4">Verdict</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark/60 text-ink">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-ink-muted italic">
                  {isLoading ? 'Loading task records...' : 'No audit tasks found. Ingest a document above!'}
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
                const isApproved = cachedResult?.result?.audit_status === 'APPROVED' || cachedResult?.finalDecision === 'AUTO_APPROVED';

                return (
                  <tr key={task.taskId} className="hover:bg-cream-light transition">
                    {/* Task ID */}
                    <td className="py-3.5 px-4 font-mono font-medium text-steel-dark">
                      {task.taskId}
                    </td>

                    {/* Document / Type */}
                    <td className="py-3.5 px-4 font-medium text-ink flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-steel" />
                      <span>{payload.fileName || task.taskType}</span>
                    </td>

                    {/* Vendor */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-ink bg-sky/40 px-2 py-0.5 rounded-full border border-steel/20 text-[11px]">
                        {payload.vendorId || 'UNKNOWN'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-ink">
                      {payload.invoiceAmount ? `$${Number(payload.invoiceAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A'}
                    </td>

                    {/* AI Provider */}
                    <td className="py-3.5 px-4">
                      {isCompleted ? (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-cream-dark/60 text-ink">
                          4-Agent Team
                        </span>
                      ) : (
                        <span className="text-ink-muted flex items-center gap-1 font-mono text-[11px]">
                          <RefreshCw className="h-3 w-3 animate-spin text-steel" /> Auditing
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {isCompleted ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {isApproved ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                          {cachedResult?.result?.audit_status || 'COMPLETED'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky/50 text-steel-dark border border-steel/30">
                          <Clock className="h-3 w-3" />
                          QUEUED
                        </span>
                      )}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-ink-muted text-[11px] font-mono whitespace-nowrap">
                      {new Date(task.createdAt).toLocaleTimeString()}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectTask(task)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-steel hover:bg-steel-dark text-white transition shadow-sm"
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
