import React from 'react';
import { useTaskStats } from '../context/TaskStatsContext';

const TaskStats = () => {
  const { total, completed, active, percentComplete } = useTaskStats();

  return (
    <div className="card mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center p-4">
          <div className="text-2xl font-bold text-primary">{total}</div>
          <div className="text-sm text-secondary">Total Tasks</div>
        </div>
        <div className="text-center p-4">
          <div className="text-2xl font-bold text-secondary">{active}</div>
          <div className="text-sm text-secondary">Active Tasks</div>
        </div>
        <div className="text-center p-4">
          <div className="text-2xl font-bold text-primary">{completed}</div>
          <div className="text-sm text-secondary">Completed</div>
        </div>
        <div className="text-center p-4">
          <div className="text-2xl font-bold text-secondary">{percentComplete}%</div>
          <div className="text-sm text-secondary">Progress</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4 px-4">
        <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskStats); 