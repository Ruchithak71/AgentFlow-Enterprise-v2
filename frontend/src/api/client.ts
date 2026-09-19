import axios from 'axios';
import { TaskEntity, CachedTaskResult, TaskPayload, ServiceHealth } from '../types';

const API_BASE = '/api';

export const api = {
  // Submit a new task to Spring Boot Orchestrator
  async submitTask(payload: TaskPayload): Promise<{ status: string; taskId: string; message: string }> {
    const response = await axios.post(`${API_BASE}/tasks`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  // Get cached result from Redis via Spring Boot
  async getTaskResult(taskId: string): Promise<CachedTaskResult | null> {
    try {
      const response = await axios.get(`${API_BASE}/tasks/${taskId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null; // Still processing or not found yet
      }
      throw error;
    }
  },

  // Get all tasks from PostgreSQL via Spring Boot
  async getAllTasks(): Promise<TaskEntity[]> {
    try {
      const response = await axios.get(`${API_BASE}/tasks`);
      return response.data;
    } catch (error) {
      console.warn('Could not fetch historical tasks:', error);
      return [];
    }
  },

  // Get actuator health
  async getHealth(): Promise<ServiceHealth> {
    try {
      const response = await axios.get('/actuator/health');
      return response.data;
    } catch (error) {
      return { status: 'DOWN' };
    }
  }
};
