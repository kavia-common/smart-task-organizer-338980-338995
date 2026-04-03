import React, { useState } from 'react';
import { getDragData } from '../../utils/dragDrop';
import TaskCard from '../TaskCard/TaskCard';
import './Column.css';

// PUBLIC_INTERFACE
/** A single kanban column that renders task cards and acts as a drop zone. */
export default function Column({ column, tasks, onDrop, onEditTask, onDeleteTask, onToggleDone }) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isOver) setIsOver(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = getDragData(e);
    if (taskId) {
      onDrop(taskId, column.id, null);
    }
  };

  return (
    <div
      className={`column ${isOver ? 'column--drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="list"
      aria-label={`${column.title} column`}
    >
      <div className="column__header">
        <div className="column__header-left">
          <span className="column__dot" style={{ backgroundColor: column.color }} />
          <h2 className="column__title">{column.title}</h2>
        </div>
        <span className="column__count">{tasks.length}</span>
      </div>
      <div className="column__body">
        {tasks.length === 0 ? (
          <div className="column__empty">
            <p className="column__empty-text">No tasks yet</p>
            <p className="column__empty-hint">Drag tasks here or create a new one</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleDone={onToggleDone}
            />
          ))
        )}
      </div>
    </div>
  );
}
