import React, { useState, useRef, useCallback } from 'react';

const TaskInput = ({ onAddTask }) => {
  const [taskText, setTaskText] = useState('');
  const inputRef = useRef(null);

  // Focus input on mount
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const text = taskText.trim();
    
    if (text) {
      onAddTask({
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date().toISOString()
      });
      setTaskText('');
      inputRef.current?.focus();
    }
  }, [taskText, onAddTask]);

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Add a new task..."
          className="input flex-1"
          maxLength={100}
        />
        <button
          type="submit"
          disabled={!taskText.trim()}
          className="btn btn-primary"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

export default React.memo(TaskInput); 