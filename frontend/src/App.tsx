import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { DocumentUploadWorkbench } from './components/TaskSubmitForm';
import { MultiAgentPipelineVisualizer } from './components/RouterVisualizer';
import { TaskTable } from './components/TaskTable';
import { AuditDetailModal } from './components/AuditDetailModal';
import { api } from './api/client';
import { TaskEntity, CachedTaskResult, TaskPayload, ServiceHealth } from './types';
import { CheckCircle, AlertTriangle, Clock, Layers, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [resultsMap, setResultsMap] = useState<Record<string, CachedTaskResult | null>>({});
  const [health, setHealth] = useState<ServiceHealth | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<TaskEntity | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      const taskList = await api.getAllTasks();
      setTasks(taskList);

      const newResults: Record<string, CachedTaskResult | null> = {};
      await Promise.all(
        taskList.slice(0, 15).map(async (t) => {
          try {
            const cached = await api.getTaskResult(t.taskId);
            newResults[t.taskId] = cached;
          } catch {
            newResults[t.taskId] = null;
          }
        })
      );
      setResultsMap((prev) => ({ ...prev, ...newResults }));
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const h = await api.getHealth();
      setHealth(h);
    } catch {
      setHealth({ status: 'DOWN' });
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadTasks(), checkHealth()]);
    setIsRefreshing(false);
  };

  const pollForTaskCompletion = (taskId: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await api.getTaskResult(taskId);
        if (res) {
          setResultsMap((prev) => ({ ...prev, [taskId]: res }));
          clearInterval(interval);
          loadTasks();
        }
      } catch {
        // transient poll check
      }
      if (attempts > 12) clearInterval(interval);
    }, 1500);
  };

  const handleUploadSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await api.uploadInvoiceDocument(formData);
      await loadTasks();
      pollForTaskCompletion(response.taskId);
    } catch (err: any) {
      alert(`Upload error: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJsonSubmit = async (payload: TaskPayload) => {
    setIsSubmitting(true);
    try {
      const response = await api.submitTask(payload);
      await loadTasks();
      pollForTaskCompletion(response.taskId);
    } catch (err: any) {
      alert(`Submission error: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    handleRefresh();
    const timer = setInterval(() => {
      loadTasks();
      checkHealth();
    }, 5000);
    return () => clearInterval(timer);
  }, [loadTasks, checkHealth]);

  const completedCount = Object.values(resultsMap).filter((r) => r?.status === 'COMPLETED').length;
  const flaggedCount = Object.values(resultsMap).filter((r) => r?.result?.audit_status?.includes('FLAGGED')).length;
  const approvedCount = Object.values(resultsMap).filter((r) => r?.result?.audit_status === 'APPROVED' || r?.finalDecision === 'AUTO_APPROVED').length;

  return (
    <div className="min-h-screen bg-apricot flex flex-col font-sans">
      <Navbar health={health} onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-cream border border-cream-dark rounded-2xl p-4 shadow-sm">
            <span className="text-xs text-ink-muted font-medium">Total Ingested Tasks</span>
            <div className="flex items-baseline space-x-2 my-1">
              <span className="text-2xl font-bold text-ink">{tasks.length}</span>
              <span className="text-xs text-ink-muted font-mono">DB records</span>
            </div>
            <span className="text-[11px] text-ink-muted flex items-center gap-1">
              <Layers className="h-3 w-3 text-steel" /> PostgreSQL 15
            </span>
          </div>

          <div className="bg-cream border border-cream-dark rounded-2xl p-4 shadow-sm">
            <span className="text-xs text-ink-muted font-medium">Auto-Approved Audits</span>
            <div className="flex items-baseline space-x-2 my-1">
              <span className="text-2xl font-bold text-emerald-700">{approvedCount}</span>
              <span className="text-xs text-ink-muted">cleared</span>
            </div>
            <span className="text-[11px] text-ink-muted flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-emerald-600" /> SAP 3-Way Verified
            </span>
          </div>

          <div className="bg-cream border border-cream-dark rounded-2xl p-4 shadow-sm">
            <span className="text-xs text-ink-muted font-medium">Flagged for Review</span>
            <div className="flex items-baseline space-x-2 my-1">
              <span className="text-2xl font-bold text-rose-700">{flaggedCount}</span>
              <span className="text-xs text-ink-muted">exceptions</span>
            </div>
            <span className="text-[11px] text-ink-muted flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-rose-600" /> XAI Counterfactual Ready
            </span>
          </div>

          <div className="bg-cream border border-cream-dark rounded-2xl p-4 shadow-sm">
            <span className="text-xs text-ink-muted font-medium">Redis Multi-Agent Cache</span>
            <div className="flex items-baseline space-x-2 my-1">
              <span className="text-2xl font-bold text-steel">{completedCount}</span>
              <span className="text-xs text-ink-muted">active dossiers</span>
            </div>
            <span className="text-[11px] text-ink-muted flex items-center gap-1">
              <Clock className="h-3 w-3 text-steel" /> 3600s In-Memory TTL
            </span>
          </div>
        </div>

        {/* Section 1: Multimodal Ingestion Dropzone */}
        <DocumentUploadWorkbench
          onUploadSubmit={handleUploadSubmit}
          onJsonSubmit={handleJsonSubmit}
          isSubmitting={isSubmitting}
        />

        {/* Section 2: 4-Agent Collaborative Visualizer */}
        <MultiAgentPipelineVisualizer />

        {/* Section 3: Live Queue & Results Table */}
        <TaskTable
          tasks={tasks}
          resultsMap={resultsMap}
          onSelectTask={(task) => setSelectedTask(task)}
          isLoading={isRefreshing}
        />
      </main>

      {/* Audit Detail Modal Dossier */}
      {selectedTask && (
        <AuditDetailModal
          task={selectedTask}
          auditResult={resultsMap[selectedTask.taskId] || null}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default App;
