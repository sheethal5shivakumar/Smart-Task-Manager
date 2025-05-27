import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RecurringTaskModal = ({ isOpen, onClose, onSave }) => {
  const [taskData, setTaskData] = useState({
    text: '',
    frequency: 'daily',
    time: '09:00',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    monthDay: 1,
    category: '',
    priority: 'medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...taskData,
      id: Date.now(),
      type: 'recurring',
      nextDue: calculateNextDue(taskData)
    });
    onClose();
  };

  const calculateNextDue = (task) => {
    const now = new Date();
    const [hours, minutes] = task.time.split(':');
    let nextDue = new Date(now);
    nextDue.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    switch (task.frequency) {
      case 'daily':
        if (nextDue <= now) {
          nextDue.setDate(nextDue.getDate() + 1);
        }
        break;
      case 'weekly':
        const today = now.getDay();
        const nextDay = task.days
          .map(day => ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day))
          .find(day => day > today);
        
        if (nextDay === undefined || (nextDay === today && nextDue <= now)) {
          nextDue.setDate(nextDue.getDate() + (7 - today) + task.days[0]);
        } else {
          nextDue.setDate(nextDue.getDate() + (nextDay - today));
        }
        break;
      case 'monthly':
        nextDue.setDate(task.monthDay);
        if (nextDue <= now) {
          nextDue.setMonth(nextDue.getMonth() + 1);
        }
        break;
      default:
        break;
    }

    return nextDue.toISOString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-surface p-6 rounded-xl shadow-xl max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4">Create Recurring Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Task Name</label>
                <input
                  type="text"
                  value={taskData.text}
                  onChange={e => setTaskData(prev => ({ ...prev, text: e.target.value }))}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <select
                  value={taskData.frequency}
                  onChange={e => setTaskData(prev => ({ ...prev, frequency: e.target.value }))}
                  className="input w-full"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={taskData.time}
                  onChange={e => setTaskData(prev => ({ ...prev, time: e.target.value }))}
                  className="input w-full"
                />
              </div>

              {taskData.frequency === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Days</label>
                  <div className="flex flex-wrap gap-2">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={taskData.days.includes(day)}
                          onChange={e => {
                            const days = e.target.checked
                              ? [...taskData.days, day]
                              : taskData.days.filter(d => d !== day);
                            setTaskData(prev => ({ ...prev, days }));
                          }}
                          className="checkbox mr-2"
                        />
                        <span className="capitalize">{day.slice(0, 3)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {taskData.frequency === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Day of Month</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={taskData.monthDay}
                    onChange={e => setTaskData(prev => ({ ...prev, monthDay: parseInt(e.target.value) }))}
                    className="input w-full"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={taskData.priority}
                  onChange={e => setTaskData(prev => ({ ...prev, priority: e.target.value }))}
                  className="input w-full"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecurringTaskModal; 