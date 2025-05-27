import React, { createContext, useContext, useMemo } from 'react';

const TaskStatsContext = createContext();

export const useTaskStats = () => {
  const context = useContext(TaskStatsContext);
  if (!context) {
    throw new Error('useTaskStats must be used within a TaskStatsProvider');
  }
  return context;
};

export const TaskStatsProvider = ({ tasks, children }) => {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    const percentComplete = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      active,
      percentComplete
    };
  }, [tasks]);

  return (
    <TaskStatsContext.Provider value={stats}>
      {children}
    </TaskStatsContext.Provider>
  );
};

export default TaskStatsContext; 