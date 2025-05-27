import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const TaskStatsContext = createContext();

export const TaskStatsProvider = ({ children }) => {
  const [stats, setStats] = useLocalStorage('taskStats', {
    daily: {},
    weekly: {},
    monthly: {},
    categories: {},
    patterns: {},
    goals: {
      daily: 5,
      weekly: 25,
      monthly: 100
    }
  });

  const updateTaskCompletion = useCallback((task, completed) => {
    const date = new Date();
    const dateKey = date.toISOString().split('T')[0];
    const weekKey = getWeekNumber(date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

    setStats(prev => {
      const newStats = { ...prev };
      
      // Update daily stats
      newStats.daily[dateKey] = newStats.daily[dateKey] || { completed: 0, total: 0 };
      newStats.daily[dateKey].total = (newStats.daily[dateKey].total || 0) + 1;
      if (completed) {
        newStats.daily[dateKey].completed = (newStats.daily[dateKey].completed || 0) + 1;
      }

      // Update weekly stats
      newStats.weekly[weekKey] = newStats.weekly[weekKey] || { completed: 0, total: 0 };
      newStats.weekly[weekKey].total = (newStats.weekly[weekKey].total || 0) + 1;
      if (completed) {
        newStats.weekly[weekKey].completed = (newStats.weekly[weekKey].completed || 0) + 1;
      }

      // Update monthly stats
      newStats.monthly[monthKey] = newStats.monthly[monthKey] || { completed: 0, total: 0 };
      newStats.monthly[monthKey].total = (newStats.monthly[monthKey].total || 0) + 1;
      if (completed) {
        newStats.monthly[monthKey].completed = (newStats.monthly[monthKey].completed || 0) + 1;
      }

      // Update category stats
      const category = task.category || 'Other';
      newStats.categories[category] = newStats.categories[category] || { completed: 0, total: 0 };
      newStats.categories[category].total = (newStats.categories[category].total || 0) + 1;
      if (completed) {
        newStats.categories[category].completed = (newStats.categories[category].completed || 0) + 1;
      }

      // Update patterns
      const hour = date.getHours();
      newStats.patterns[hour] = newStats.patterns[hour] || { count: 0 };
      newStats.patterns[hour].count += 1;

      return newStats;
    });
  }, [setStats]);

  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return `${d.getFullYear()}-W${weekNo}`;
  };

  const getProductiveHours = useCallback(() => {
    const patterns = { ...stats.patterns };
    return Object.entries(patterns)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));
  }, [stats.patterns]);

  const getSuggestedTasks = useCallback(() => {
    const categories = { ...stats.categories };
    return Object.entries(categories)
      .sort(([, a], [, b]) => (b.completed / b.total) - (a.completed / a.total))
      .slice(0, 3)
      .map(([category]) => category);
  }, [stats.categories]);

  const updateGoals = useCallback((type, value) => {
    setStats(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        [type]: value
      }
    }));
  }, [setStats]);

  const getProgress = useCallback((type) => {
    const date = new Date();
    let current;
    let goal;

    switch (type) {
      case 'daily':
        current = stats.daily[date.toISOString().split('T')[0]]?.completed || 0;
        goal = stats.goals.daily;
        break;
      case 'weekly':
        current = stats.weekly[getWeekNumber(date)]?.completed || 0;
        goal = stats.goals.weekly;
        break;
      case 'monthly':
        current = stats.monthly[`${date.getFullYear()}-${date.getMonth() + 1}`]?.completed || 0;
        goal = stats.goals.monthly;
        break;
      default:
        return 0;
    }

    return Math.min((current / goal) * 100, 100);
  }, [stats]);

  return (
    <TaskStatsContext.Provider value={{
      stats,
      updateTaskCompletion,
      getProductiveHours,
      getSuggestedTasks,
      updateGoals,
      getProgress
    }}>
      {children}
    </TaskStatsContext.Provider>
  );
};

export const useTaskStats = () => {
  const context = useContext(TaskStatsContext);
  if (!context) {
    throw new Error('useTaskStats must be used within a TaskStatsProvider');
  }
  return context;
};

export default TaskStatsContext; 