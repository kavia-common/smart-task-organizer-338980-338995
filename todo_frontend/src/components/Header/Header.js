import React from 'react';
import './Header.css';

// PUBLIC_INTERFACE
/** App header with title and add-task button. */
export default function Header({ onAddTask }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-brand">
          <span className="header-icon" role="img" aria-label="clipboard">📋</span>
          <h1 className="header-title">Smart Task Organizer</h1>
        </div>
        <button className="btn btn-primary add-task-btn" onClick={onAddTask} aria-label="Add new task">
          <span className="btn-icon">+</span>
          <span className="btn-text">Add Task</span>
        </button>
      </div>
    </header>
  );
}
