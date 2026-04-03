/**
 * Drag-and-drop utility helpers for the kanban board.
 */

const DRAG_TYPE = 'application/x-task-id';

// PUBLIC_INTERFACE
/** Attach the task id to a drag event. */
export function setDragData(event, taskId) {
  event.dataTransfer.setData(DRAG_TYPE, taskId);
  event.dataTransfer.setData('text/plain', taskId);
  event.dataTransfer.effectAllowed = 'move';
}

// PUBLIC_INTERFACE
/** Extract the task id from a drop event. */
export function getDragData(event) {
  return event.dataTransfer.getData(DRAG_TYPE) || event.dataTransfer.getData('text/plain') || null;
}

// PUBLIC_INTERFACE
/**
 * Produce a new tasks array after moving a task to a target column at a specific position.
 * Invariant: the returned array has the same length as the input.
 */
export function reorderTasks(tasks, taskId, targetColumnId, targetIndex) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    console.warn('[dragDrop] reorderTasks: task not found', taskId);
    return tasks;
  }

  const withoutTask = tasks.filter((t) => t.id !== taskId);
  const updatedTask = { ...task, status: targetColumnId, updatedAt: new Date().toISOString() };

  const columnTasks = withoutTask.filter((t) => t.status === targetColumnId);
  const otherTasks = withoutTask.filter((t) => t.status !== targetColumnId);

  const insertAt =
    targetIndex !== null && targetIndex !== undefined
      ? Math.min(targetIndex, columnTasks.length)
      : columnTasks.length;

  columnTasks.splice(insertAt, 0, updatedTask);
  return [...otherTasks, ...columnTasks];
}
