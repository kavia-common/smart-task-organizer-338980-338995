#!/usr/bin/env python3
"""Helper to write source files to disk."""
import os

BASE = os.path.dirname(os.path.abspath(__file__))

files = {}

files["src/App.js"] = '''import React, { useState, useCallback } from 'react';
import Header from './components/Header/Header';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import TaskForm from './components/TaskForm/TaskForm';
import useTasks from './hooks/useTasks';
import './App.css';

// PUBLIC_INTERFACE
export default function App() {
  const { tasks, isLoading, addTask, updateTask, deleteTask, moveTask, getColumnTasks } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleOpenCreate = useCallback(() => {
    setEditingTask(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingTask(null);
  }, []);

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

  const handleToggleDone = useCallback(
    (taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      const newStatus = task.status === 'done' ? 'todo' : 'done';
      updateTask(taskId, { status: newStatus });
    },
    [tasks, updateTask]
  );

  const handleDrop = useCallback(
    (taskId, columnId, index) => {
      moveTask(taskId, columnId, index);
    },
    [moveTask]
  );

  const handleDelete = useCallback(
    (taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      const taskTitle = task ? task.title : 'this task';
      if (window.confirm('Delete "' + taskTitle + '"? This cannot be undone.')) {
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
'''

files["src/index.js"] = '''import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
'''

for rel_path, content in files.items():
    full_path = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        f.write(content)
    print(f"Wrote: {rel_path}")

print("Done!")
