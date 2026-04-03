/**
 * Application-wide constants for the Smart Task Organizer.
 */

// PUBLIC_INTERFACE
/** Column definitions – order determines left-to-right rendering. */
export const COLUMNS = [
  { id: 'todo', title: 'Todo', color: '#3b82f6' },
  { id: 'in-progress', title: 'In Progress', color: '#64748b' },
  { id: 'done', title: 'Done', color: '#06b6d4' },
];

// PUBLIC_INTERFACE
/** Design tokens aligned with the project style guide. */
export const THEME = {
  primary: '#3b82f6',
  secondary: '#64748b',
  success: '#06b6d4',
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  textLight: '#6b7280',
  border: '#e5e7eb',
};

// PUBLIC_INTERFACE
/** Key used to persist task data in localStorage. */
export const STORAGE_KEY = 'smart-task-organizer-tasks';

// PUBLIC_INTERFACE
/** Priority options. */
export const PRIORITIES = ['low', 'medium', 'high'];
