import { useReducer, useRef, useCallback } from 'react';

const TIMER_STATES = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  BREAK: 'break'
};

const initialState = {
  status: TIMER_STATES.IDLE,
  timeLeft: 25 * 60, // 25 minutes in seconds
  breakTime: 5 * 60, // 5 minutes in seconds
  isBreak: false
};

const timerReducer = (state, action) => {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        status: TIMER_STATES.RUNNING
      };
    case 'PAUSE':
      return {
        ...state,
        status: TIMER_STATES.PAUSED
      };
    case 'RESET':
      return {
        ...state,
        status: TIMER_STATES.IDLE,
        timeLeft: state.isBreak ? state.breakTime : 25 * 60,
      };
    case 'TICK':
      const newTimeLeft = state.timeLeft - 1;
      if (newTimeLeft === 0) {
        return {
          ...state,
          status: TIMER_STATES.IDLE,
          isBreak: !state.isBreak,
          timeLeft: !state.isBreak ? state.breakTime : 25 * 60
        };
      }
      return {
        ...state,
        timeLeft: newTimeLeft
      };
    case 'SET_BREAK_TIME':
      return {
        ...state,
        breakTime: action.payload
      };
    default:
      return state;
  }
};

const usePomodoroTimer = () => {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const intervalRef = useRef(null);

  const startTimer = useCallback(() => {
    if (state.status !== TIMER_STATES.RUNNING) {
      dispatch({ type: 'START' });
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }
  }, [state.status]);

  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    dispatch({ type: 'PAUSE' });
  }, []);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    dispatch({ type: 'RESET' });
  }, []);

  const setBreakTime = useCallback((minutes) => {
    dispatch({ type: 'SET_BREAK_TIME', payload: minutes * 60 });
  }, []);

  // Format time left into MM:SS
  const formattedTime = useCallback(() => {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [state.timeLeft]);

  return {
    ...state,
    startTimer,
    pauseTimer,
    resetTimer,
    setBreakTime,
    formattedTime: formattedTime()
  };
};

export default usePomodoroTimer; 