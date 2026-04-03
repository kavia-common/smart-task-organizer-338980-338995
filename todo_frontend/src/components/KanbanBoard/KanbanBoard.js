import React from 'react';
import { COLUMNS } from '../../utils/constants';
import Column from '../Column/Column';
import './KanbanBoard.css';

// PUBLIC_INTERFACE
/** Renders the three-column kanban layout (Todo, In Progress, Done). */
export default function KanbanBoard({ getColumnTasks, onDrop, onEditTask, onDeleteTask, onToggleDone }) {
  return (
    <div className="kanban-board">
      {COLUMNS.map((column) => (
        <Column
          key={column.id}
          column={column}
          tasks={getColumnTasks(column.id)}
          onDrop={onDrop}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onToggleDone={onToggleDone}
        />
      ))}
    </div>
  );
}
