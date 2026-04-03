import React, { useState, useCallback } from 'react';
import Header from './components/Header/Header';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import TaskForm from './components/TaskForm/TaskForm';
import useTasks from './hooks/useTasks';
import './App.css';

/**
 * App – Root component and top-level orchestrator for the Smart Task Organizer.
 *
 * Flow name: AppOrchestrationFlow
 * Entrypoint: <App />
 *
 * Responsibilities:
 *   - Owns modal visibility state (form open/close)
 *   - Delegates task CRUD to the useTasks hook
 *   - Wires callbacks between Header, KanbanBoard, and TaskForm
 */
// PUBLIC_INTERFACE
export default function App() {
  const { tasks, isLoading, addTask, updateTask, deleteTask, moveTask, getColumnTasks } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  /** Open the form in "create" mode. */
  const handleOpenCreate = useCallback(() => {
    setEditingTask(null);
    setIsFormOpen(true);
  }, []);

  /** Open the form in "edit" mode with existing task data. */
  const handleOpenEdit = useCallback((task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  }, []);

  /** Close the form modal and reset editing state. */
  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingTask(null);
  }, []);

  /**
   * Handle form submission for both create and edit.
   * @param {Object} formData – { title, description, status, priority }
   */
  const handleFormSubmit = useCallback(
    (formData) => {
      if (editingTask) {
        updateTask(editingTask.id, formData);
      } else {
        addTask(formData);
      }
      handleCloseForm();
    },
    [editingTask, updateTask, addTask, handleCloseForm]
  );

  /**
   * Toggle a task's done status.
   * If currently done -> move to todo; if not done -> move to done.
   */
  const handleToggleDone = useCallback(
    (taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      const newStatus = task.status === 'done' ? 'todo' : 'done';
      updateTask(taskId, { status: newStatus });
    },
    [tasks, updateTask]
  );

  /** Handle drag-and-drop: move task to target column at given index. */
  const handleDrop = useCallback(
    (taskId, columnId, index) => {
      moveTask(taskId, columnId, index);
    },
    [moveTask]
  );

  /** Confirm before deleting a task. */
  const handleDelete = useCallback(
    (taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      const taskTitle = task ? task.title : 'this task';
      if (window.confirm(`Delete "${taskTitle}"? This cannot be undone.`)) {
        deleteTask(taskId);
      }
    },
    [tasks, deleteTask]
  );

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header onAddTask={handleOpenCreate} />
      <main className="app-main">
        <KanbanBoard
          getColumnTasks={getColumnTasks}
          onDrop={handleDrop}
          onEditTask={handleOpenEdit}
          onDeleteTask={handleDelete}
          onToggleDone={handleToggleDone}
        />
      </main>
      <TaskForm
        isOpen={isFormOpen}
        task={editingTask}
        onSubmit={handleFormSubmit}
        onClose={handleCloseForm}
      />
    </div>
  );
}
