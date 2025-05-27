import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useVoiceInput from '../hooks/useVoiceInput';

const TaskInput = ({ onAddTask }) => {
  const [taskText, setTaskText] = useState('');
  const inputRef = useRef(null);
  const {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceInput();

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setTaskText(transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

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
      <div className="relative">
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Add a new task..."
              className="input w-full pl-4 pr-24 py-3 text-lg"
              maxLength={100}
            />
            <AnimatePresence>
              {isListening && (
                <motion.div
                  className="mic-indicator"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <span className="mic-dot" style={{ animationDelay: '0ms' }} />
                  <span className="mic-dot" style={{ animationDelay: '200ms' }} />
                  <span className="mic-dot" style={{ animationDelay: '400ms' }} />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`mic-button ${isListening ? 'listening' : ''}`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5"
              >
                {isListening ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19V5M12 19H8m4 0h4M12 5a3 3 0 013 3v6a3 3 0 01-6 0V8a3 3 0 013-3z"
                  />
                )}
              </svg>
            </button>
          </div>
          <motion.button
            type="submit"
            disabled={!taskText.trim()}
            className="btn btn-primary px-6 text-lg font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Task
          </motion.button>
        </motion.div>
        
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -bottom-6 left-0 text-sm text-danger mt-1"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
};

export default React.memo(TaskInput); 