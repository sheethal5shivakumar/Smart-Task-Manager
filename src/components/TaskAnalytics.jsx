import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTaskStats } from '../context/TaskStatsContext';
import { useTaskCategories } from '../context/TaskCategoriesContext';

const TaskAnalytics = () => {
  const { stats, getProgress, getProductiveHours, getSuggestedTasks } = useTaskStats();
  const { categories } = useTaskCategories();

  const productiveHours = useMemo(() => {
    const hours = getProductiveHours();
    return hours.map(hour => ({
      hour,
      label: new Date(2000, 0, 1, hour).toLocaleTimeString([], { hour: 'numeric' })
    }));
  }, [getProductiveHours]);

  const suggestedCategories = useMemo(() => getSuggestedTasks(), [getSuggestedTasks]);

  const categoryStats = useMemo(() => {
    return Object.entries(stats.categories || {}).map(([category, data]) => ({
      category,
      completed: data.completed || 0,
      total: data.total || 0,
      percentage: data.total ? Math.round((data.completed / data.total) * 100) : 0
    }));
  }, [stats.categories]);

  return (
    <div className="space-y-8">
      {/* Progress Bars */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Task Goals Progress</h3>
        <div className="grid gap-4">
          {['daily', 'weekly', 'monthly'].map((type) => (
            <div key={type} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{type} Progress</span>
                <span>{Math.round(getProgress(type))}%</span>
              </div>
              <div className="h-2 bg-surface rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgress(type)}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Performance */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Category Performance</h3>
        <div className="grid gap-4">
          {categoryStats.map(({ category, completed, total, percentage }) => (
            <div key={category} className="p-4 bg-surface rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{category}</span>
                <span className="text-sm text-secondary">
                  {completed}/{total} tasks
                </span>
              </div>
              <div className="h-2 bg-surface/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Productivity Insights */}
      <section className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Most Productive Hours</h3>
          <div className="space-y-2">
            {productiveHours.map(({ hour, label }) => (
              <div key={hour} className="flex items-center gap-3">
                <div className="w-16 text-sm">{label}</div>
                <div className="flex-1 h-8 bg-surface rounded-lg overflow-hidden">
                  <motion.div
                    className="h-full bg-primary/20"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Suggested Categories</h3>
          <div className="space-y-3">
            {suggestedCategories.map((category) => (
              <motion.div
                key={category}
                className="p-3 bg-surface rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="font-medium">{category}</div>
                <div className="text-sm text-secondary">
                  Based on your completion rate
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaskAnalytics; 