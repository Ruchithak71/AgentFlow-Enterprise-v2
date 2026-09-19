import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { TaskSubmitForm } from './components/TaskSubmitForm';
import { RouterVisualizer } from './components/RouterVisualizer';
import { TaskTable } from './components/TaskTable';
import { AuditDetailModal } from './components/AuditDetailModal';
import { api } from './api/client';
import { TaskEntity, CachedTaskResult, TaskPayload, ServiceHealth, AIProvider } from './types';
import { CheckCircle, AlertTriangle, Clock, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [resultsMap, setResultsMap] = useState<Record<string, CachedTaskResult | null>>({});
  const [health, setHealth] = useState<ServiceHealth | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<TaskEntity | null>(null);
  const [activeProvider, setActiveProvider] = useState<AIProvider | undefined>(undefined);

  // Fetch all tasks from PostgreSQL
  const loadTasks = useCallback(async () => {
    try {
      const taskList = await api.getAllTasks();
      setTasks(taskList);

      // Concurrently poll results from Redis for uncompleted or recent tasks
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

  // Poll system health
  const checkHealth = useCallback(async () => {
    try {
      const h = await api.getHealth();
      setHealth(h);
    } catch {
      setHealth({ status: 'DOWN' });
    }
  }, []);

  // Global manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadTasks(), checkHealth()]);
    setIsRefreshing(false);
  };

  // Submit task handler with automatic polling
  const handleTaskSubmit = async (payload: TaskPayload) => {
    setIsSubmitting(true);
    try {
      const response = await api.submitTask(payload);
      const newTaskId = response.taskId;

      // Predict provider for immediate visual feedback
      if (payload.containsPII) setActiveProvider('SAP_AI_CORE');
      else if (payload.invoiceAmount > 100000) setActiveProvider('GPT_5');
      else if (payload.pageCount > 10) setActiveProvider('CLAUDE_SONNET');
      else setActiveProvider('GEMINI_FLASH');

      // Refresh task table immediately
      await loadTasks();

      // Poll Redis for result every 1.5 seconds for up to 15 seconds
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        try {
          const res = await api.getTaskResult(newTaskId);
          if (res) {
            setResultsMap((prev) => ({ ...prev, [newTaskId]: res }));
            if (res.provider) setActiveProvider(res.provider);
            clearInterval(interval);
            loadTasks();
          }
        } catch (e) {
          // ignore transient poll error
        }

        if (attempts > 10) {
          clearInterval(interval);
        }
      }, 1500);

    } catch (err: any) {
      alert(`Error submitting task: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initial load and periodic background poll
  useEffect(() => {
    handleRefresh();
    const timer = setInterval(() => {
      loadTasks();
      checkHealth();
    }, 5000);
    return () => clearInterval(timer);
  }, [loadTasks, checkHealth]);

  // Aggregate KPI metrics
  const completedCount = Object.values(resultsMap).filter((r) => r?.status === 'COMPLETED').length;
  const flaggedCount = Object.values(resultsMap).filter((r) => r?.result?.audit_status?.includes('FLAGGED')).length;
  const approvedCount = Object.values(resultsMap).filter((r) => r?.result?.audit_status === 'APPROVED' || r?.result?.audit_status === 'COMPLIANT').length;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Navigation */}
      <Navbar health={health} onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium">Total Ingested Tasks</span>
            <div className="flex items-baseline space-x-2 my-1">
              <span className="text-2xl font-bold text-white">{tasks.length}</span>
              <span className="text-xs text-slate-500 font-mono">DB records</span>
            </div>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Layers className="h-3 w-3 text-indigo-400" /> PostgreSQL 15
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium">Auto-Approved Audits</span>
            <div className="flex items-baseline space-x-2 my-1">
              <span className="text-2xl font-bold text-emerald-400">{approvedCount}</span>
              <span className="text-xs text-slate-500">cleared</span>
            </div>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-emerald-400" /> SAP Policy Compliant
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium">Flagged for Review</span>
            <div className="flex items-baseline space-x-2 my-1">
              <span className="text-2xl font-bold text-rose-400">{flaggedCount}</span>
              <span className="text-xs text-slate-500">exceptions</span>
            </div>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-rose-400" /> Blocked / High-Exposure
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium">Redis In-Memory Cache</span>
            <div className="flex items-baseline space-x-2 my-1">
              <span className="text-2xl font-bold text-sky-400">{completedCount}</span>
              <span className="text-xs text-slate-500">active keys</span>
            </div>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3 text-sky-400" /> 1 Hour TTL
            </span>
          </div>
        </div>

        {/* Section 1: Submit Form */}
        <TaskSubmitForm onSubmit={handleTaskSubmit} isSubmitting={isSubmitting} />

        {/* Section 2: AI Dynamic Router Visualizer */}
        <RouterVisualizer activeProvider={activeProvider} />

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
