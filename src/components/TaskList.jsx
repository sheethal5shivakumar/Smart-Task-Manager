import React, { useReducer, useMemo, useLayoutEffect, useRef, useCallback, useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { useTheme } from '../context/ThemeContext';
import useLocalStorage from '../hooks/useLocalStorage';

// Task reducer
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'DELETE_TASK':
      return state.filter(task => task.id !== action.payload);
    case 'TOGGLE_TASK':
      return state.map(task =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
    case 'REORDER_TASKS':
      return action.payload;
    default:
      return state;
  }
};

// Sortable task item component
const SortableTask = ({ task, onToggle, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card group mb-2 animate-slide-up"
      {...attributes}
    >
      <div className="flex items-center gap-4 p-4">
        <button className="drag-handle" {...listeners}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
          </svg>
        </button>
        
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="checkbox"
        />
        
        <div className="flex-1 min-w-0">
          <div className={`${task.completed ? 'line-through text-secondary' : 'text-text'} truncate transition-all duration-300`}>
            {task.text}
          </div>
          <div className="text-sm text-secondary/70 mt-1 truncate">
            {new Date(task.createdAt).toLocaleDateString(undefined, {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="btn btn-danger opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Delete task"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const TaskList = () => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [storedTasks, setStoredTasks] = useLocalStorage('tasks', []);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const listRef = useRef(null);
  const { theme } = useTheme();

  // Load tasks from localStorage on mount
  useEffect(() => {
    dispatch({ type: 'REORDER_TASKS', payload: storedTasks });
  }, []);

  // Save tasks to localStorage when they change
  useEffect(() => {
    setStoredTasks(tasks);
  }, [tasks, setStoredTasks]);

  // Scroll to bottom when new task is added
  useLayoutEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [tasks.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Memoized filtered and sorted tasks
  const processedTasks = useMemo(() => {
    let result = [...tasks];

    // Filter
    if (filter === 'active') {
      result = result.filter(task => !task.completed);
    } else if (filter === 'completed') {
      result = result.filter(task => task.completed);
    }

    // Sort
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'date_desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'name_asc':
          return a.text.localeCompare(b.text);
        case 'name_desc':
          return b.text.localeCompare(a.text);
        default:
          return 0;
      }
    });
  }, [tasks, filter, sortBy]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(task => task.id === active.id);
      const newIndex = tasks.findIndex(task => task.id === over.id);
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      dispatch({ type: 'REORDER_TASKS', payload: newTasks });
    }
  }, [tasks]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'completed'].map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`btn ${filter === value ? 'btn-primary' : 'btn-secondary'}`}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input max-w-[200px]"
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
        </select>
      </div>

      <div ref={listRef} className="max-h-[60vh] overflow-y-auto card">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={processedTasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {processedTasks.map((task) => (
              <SortableTask
                key={task.id}
                task={task}
                onToggle={(id) => dispatch({ type: 'TOGGLE_TASK', payload: id })}
                onDelete={(id) => dispatch({ type: 'DELETE_TASK', payload: id })}
              />
            ))}
          </SortableContext>
        </DndContext>

        {processedTasks.length === 0 && (
          <div className="text-center py-12 text-secondary/70 flex flex-col items-center gap-4">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm">Add some tasks to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TaskList); 