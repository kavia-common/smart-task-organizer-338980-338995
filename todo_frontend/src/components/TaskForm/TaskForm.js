import React, { useState, useEffect, useRef } from 'react';
import { COLUMNS, PRIORITIES } from '../../utils/constants';
import './TaskForm.css';

// PUBLIC_INTERFACE
/** Modal form for creating or editing a task. */
export default function TaskForm({ isOpen, task, onSubmit, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const titleRef = useRef(null);
  const isEditMode = Boolean(task);

  // Populate form when editing or reset for create
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
    }
    setError('');
  }, [task, isOpen]);

  // Focus title on open
  useEffect(() => {
    if (isOpen && titleRef.current) {
      setTimeout(() => titleRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Task title is required');
      return;
    }
    onSubmit({ title: trimmedTitle, description: description.trim(), status, priority });
    setTitle('');
    setDescription('');
    setStatus('todo');
    setPriority('medium');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={isEditMode ? 'Edit task' : 'Create task'}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEditMode ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        </div>
        <form className="task-form" onSubmit={handleSubmit}>
          {error && <div className="task-form__error" role="alert">{error}</div>}

          <div className="task-form__field">
            <label htmlFor="task-title" className="task-form__label">Title <span className="task-form__required">*</span></label>
            <input ref={titleRef} id="task-title" type="text" className="task-form__input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title..." maxLength={200} />
          </div>

          <div className="task-form__field">
            <label htmlFor="task-description" className="task-form__label">Description</label>
            <textarea id="task-description" className="task-form__textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description (optional)..." rows={3} maxLength={1000} />
          </div>

          <div className="task-form__row">
            <div className="task-form__field">
              <label htmlFor="task-status" className="task-form__label">Status</label>
              <select id="task-status" className="task-form__select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {COLUMNS.map((col) => <option key={col.id} value={col.id}>{col.title}</option>)}
              </select>
            </div>
            <div className="task-form__field">
              <label htmlFor="task-priority" className="task-form__label">Priority</label>
              <select id="task-priority" className="task-form__select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="task-form__actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{isEditMode ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
