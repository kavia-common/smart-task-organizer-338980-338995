import React, { useState } from 'react';
import { setDragData } from '../../utils/dragDrop';
import './TaskCard.css';

const PRIORITY_COLORS = {
  low: { bg: '#dbeafe', text: '#1d4ed8' },
  medium: { bg: '#fef3c7', text: '#92400e' },
  high: { bg: '#fee2e2', text: '#dc2626' },
};

// PUBLIC_INTERFACE
/** Draggable task card rendered inside a kanban column. */
export default function TaskCard({ task, onEdit, onDelete, onToggleDone }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setDragData(e, task.id);
    setIsDragging(true);
    setTimeout(() => e.target.classList.add('dragging'), 0);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    e.target.classList.remove('dragging');
  };

  const priorityStyle = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;
  const isDone = task.status === 'done';

  return (
    <div
      className={`task-card ${isDragging ? 'task-card--dragging' : ''} ${isDone ? 'task-card--done' : ''}`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      role="listitem"
      aria-label={`Task: ${task.title}`}
    >
      <div className="task-card__header">
        <span className="task-card__priority" style={{ backgroundColor: priorityStyle.bg, color: priorityStyle.text }}>
          {task.priority}
        </span>
        <div className="task-card__actions">
          <button className="task-card__action-btn" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} title="Edit">✏️</button>
          <button className="task-card__action-btn task-card__action-btn--delete" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`} title="Delete">🗑️</button>
        </div>
      </div>
      <h3 className={`task-card__title ${isDone ? 'task-card__title--done' : ''}`}>{task.title}</h3>
      {task.description && <p className="task-card__description">{task.description}</p>}
      <div className="task-card__footer">
        <button
          className={`task-card__toggle ${isDone ? 'task-card__toggle--done' : ''}`}
          onClick={() => onToggleDone(task.id)}
          aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
        >
          {isDone ? '✅ Completed' : '⬜ Mark done'}
        </button>
      </div>
    </div>
  );
}
