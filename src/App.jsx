import React, { useCallback, useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TaskStatsProvider } from './context/TaskStatsContext';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import Timer from './components/Timer';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Task Manager</h1>
      <button
        onClick={toggleTheme}
        className="btn btn-secondary"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
};

const AppContent = () => {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = useCallback((task) => {
    setTasks(prev => [...prev, task]);
  }, []);

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TaskStatsProvider tasks={tasks}>
              <TaskStats />
              <TaskInput onAddTask={handleAddTask} />
              <TaskList tasks={tasks} setTasks={setTasks} />
            </TaskStatsProvider>
          </div>
          
          <div className="lg:col-span-1">
            <Timer />
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App; 