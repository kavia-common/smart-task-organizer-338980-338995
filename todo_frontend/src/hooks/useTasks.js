/**
 * useTasks – Custom React hook that owns task state and exposes CRUD operations.
 *
 * Flow name: TaskManagementFlow
 * Persistence: localStorage primary, backend sync fire-and-forget
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { loadTasks, saveTasks } from '../services/storage';
import * as api from '../services/api';
import { reorderTasks } from '../utils/dragDrop';

function generateId() {
  return `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// PUBLIC_INTERFACE
/** Custom hook for managing task state with localStorage persistence. */
export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  // Mount: load from localStorage
  useEffect(() => {
    console.info('[useTasks] Initializing – loading tasks from storage');
    const stored = loadTasks();
    setTasks(stored);
    setIsLoading(false);
    isInitialized.current = true;

    // Attempt backend sync (non-blocking)
    if (process.env.REACT_APP_API_BASE) {
      api.fetchTasks()
        .then((remoteTasks) => {
          if (Array.isArray(remoteTasks) && remoteTasks.length > 0) {
            console.info('[useTasks] Synced with backend:', remoteTasks.length, 'tasks');
            setTasks(remoteTasks);
          }
        })
        .catch((err) => {
          console.warn('[useTasks] Backend unreachable, using localStorage:', err.message);
        });
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    if (isInitialized.current) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: generateId(),
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.info('[useTasks] addTask:', newTask.id, newTask.title);
    setTasks((prev) => [...prev, newTask]);
    api.createTask(newTask).catch((err) => console.warn('[useTasks] Backend create failed:', err.message));
    return newTask;
  }, []);

  const updateTaskHandler = useCallback((id, updates) => {
    console.info('[useTasks] updateTask:', id);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
    api.updateTask(id, updates).catch((err) => console.warn('[useTasks] Backend update failed:', err.message));
  }, []);

  const deleteTaskHandler = useCallback((id) => {
    console.info('[useTasks] deleteTask:', id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    api.deleteTask(id).catch((err) => console.warn('[useTasks] Backend delete failed:', err.message));
  }, []);

  const moveTaskHandler = useCallback((taskId, targetColumnId, targetIndex) => {
    console.info('[useTasks] moveTask:', taskId, '->', targetColumnId, 'at', targetIndex);
    setTasks((prev) => reorderTasks(prev, taskId, targetColumnId, targetIndex));
    api.moveTask(taskId, { status: targetColumnId, position: targetIndex }).catch((err) =>
      console.warn('[useTasks] Backend move failed:', err.message)
    );
  }, []);

  const getColumnTasks = useCallback(
    (columnId) => tasks.filter((t) => t.status === columnId),
    [tasks]
  );

  return {
    tasks,
    isLoading,
    addTask,
    updateTask: updateTaskHandler,
    deleteTask: deleteTaskHandler,
    moveTask: moveTaskHandler,
    getColumnTasks,
  };
}
