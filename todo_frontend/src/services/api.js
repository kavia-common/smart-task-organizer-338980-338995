/**
 * API client layer for the Smart Task Organizer backend.
 * Uses REACT_APP_API_BASE from environment. Falls back gracefully.
 */

const API_BASE = process.env.REACT_APP_API_BASE || '';

function buildUrl(path) {
  return `${API_BASE}${path}`;
}

async function request(path, options = {}) {
  const url = buildUrl(path);
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };
  const response = await fetch(url, config);
  if (!response.ok) {
    const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) return null;
  return response.json();
}

// PUBLIC_INTERFACE
/** Fetch all tasks from the backend. */
export async function fetchTasks() { return request('/tasks'); }

// PUBLIC_INTERFACE
/** Create a new task on the backend. */
export async function createTask(task) {
  return request('/tasks', { method: 'POST', body: JSON.stringify(task) });
}

// PUBLIC_INTERFACE
/** Update an existing task on the backend. */
export async function updateTask(id, updates) {
  return request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
}

// PUBLIC_INTERFACE
/** Delete a task from the backend. */
export async function deleteTask(id) {
  return request(`/tasks/${id}`, { method: 'DELETE' });
}

// PUBLIC_INTERFACE
/** Move/reorder a task (update status + position). */
export async function moveTask(id, payload) {
  return request(`/tasks/${id}/move`, { method: 'PATCH', body: JSON.stringify(payload) });
}
