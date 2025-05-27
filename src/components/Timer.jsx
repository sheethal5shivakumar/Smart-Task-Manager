import React, { useCallback } from 'react';
import usePomodoroTimer from '../hooks/usePomodoroTimer';
import { useTheme } from '../context/ThemeContext';

const Timer = () => {
  const {
    status,
    isBreak,
    formattedTime,
    startTimer,
    pauseTimer,
    resetTimer,
    setBreakTime
  } = usePomodoroTimer();

  const { isDark } = useTheme();

  const handleBreakTimeChange = useCallback((e) => {
    const minutes = parseInt(e.target.value, 10);
    if (!isNaN(minutes) && minutes > 0) {
      setBreakTime(minutes);
    }
  }, [setBreakTime]);

  return (
    <div className="card p-6 mb-6">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">
          {isBreak ? 'Break Time' : 'Work Time'}
        </h2>
        
        <div className="text-4xl font-mono mb-6 bg-surface rounded-lg px-6 py-3 shadow-inner-soft">
          {formattedTime}
        </div>

        <div className="flex gap-2 mb-6">
          {status === 'running' ? (
            <button
              onClick={pauseTimer}
              className="btn btn-secondary"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={startTimer}
              className="btn btn-primary"
            >
              {status === 'paused' ? 'Resume' : 'Start'}
            </button>
          )}
          <button
            onClick={resetTimer}
            className="btn btn-secondary"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="breakTime" className="text-sm">
            Break Duration (minutes):
          </label>
          <select
            id="breakTime"
            onChange={handleBreakTimeChange}
            className="input py-1 px-2"
            defaultValue="5"
          >
            {[5, 10, 15, 20].map(minutes => (
              <option key={minutes} value={minutes}>
                {minutes}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 text-sm text-secondary/70">
          {status === 'running' ? 'Timer is running' :
           status === 'paused' ? 'Timer is paused' :
           'Timer is ready'}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Timer); 