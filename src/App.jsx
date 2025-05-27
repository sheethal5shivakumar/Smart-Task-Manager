import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import TaskAnalytics from './components/TaskAnalytics';
import RecurringTaskModal from './components/RecurringTaskModal';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TaskStatsProvider, useTaskStats } from './context/TaskStatsContext';
import { TaskCategoriesProvider, useTaskCategories } from './context/TaskCategoriesContext';

const App = () => {
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { detectCategory } = useTaskCategories();
  const { updateTaskCompletion } = useTaskStats();
  const [tasks, setTasks] = useState([]);

  const handleAddTask = useCallback((task) => {
    const category = task.type === 'recurring' ? task.category : detectCategory(task.text);
    const newTask = {
      ...task,
      category,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [...prev, newTask]);
    updateTaskCompletion(newTask, false);
  }, [detectCategory, updateTaskCompletion]);

  const handleToggleTask = useCallback((taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, completed: !task.completed };
        updateTaskCompletion(updatedTask, updatedTask.completed);
        return updatedTask;
      }
      return task;
    }));
  }, [updateTaskCompletion]);

  const handleDeleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const handleReorderTasks = useCallback((reorderedTasks) => {
    setTasks(reorderedTasks);
  }, []);

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-colors duration-300 ${theme}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header 
          className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold">Smart Task Manager</h1>
            <p className="text-secondary mt-1">Organize your tasks intelligently</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="btn btn-secondary"
            >
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </button>
            <button
              onClick={() => setShowRecurringModal(true)}
              className="btn btn-secondary"
            >
              Add Recurring Task
            </button>
            <button
              onClick={toggleTheme}
              className="btn btn-icon"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="grid gap-8">
          <TaskInput onAddTask={handleAddTask} />
          
          <AnimatePresence mode="wait">
            {showAnalytics && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TaskAnalytics />
              </motion.div>
            )}
          </AnimatePresence>

          <TaskList
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onReorderTasks={handleReorderTasks}
          />
        </div>
      </div>

      <RecurringTaskModal
        isOpen={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        onSave={handleAddTask}
      />
    </div>
  );
};

const AppWrapper = () => (
  <ThemeProvider>
    <TaskCategoriesProvider>
      <TaskStatsProvider>
        <App />
      </TaskStatsProvider>
    </TaskCategoriesProvider>
  </ThemeProvider>
);

export default AppWrapper; 