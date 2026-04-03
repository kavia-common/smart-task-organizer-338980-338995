/**
 * LocalStorage adapter for persisting task data.
 */

import { STORAGE_KEY } from '../utils/constants';

// PUBLIC_INTERFACE
/** Load tasks from localStorage. Returns [] on error/empty. */
export function loadTasks() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return [];
    const parsed = JSON.parse(serialized);
    if (!Array.isArray(parsed)) {
      console.warn('[storage] loadTasks: stored data is not an array, resetting');
      return [];
    }
    return parsed;
  } catch (error) {
    console.error('[storage] loadTasks failed:', error);
    return [];
  }
}

// PUBLIC_INTERFACE
/** Save tasks to localStorage. Never throws. */
export function saveTasks(tasks) {
  try {
    if (!Array.isArray(tasks)) {
      console.error('[storage] saveTasks: expected array, got', typeof tasks);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('[storage] saveTasks failed:', error);
  }
}
