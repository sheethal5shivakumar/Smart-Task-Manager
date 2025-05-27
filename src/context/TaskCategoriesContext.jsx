import React, { createContext, useContext, useState, useCallback } from 'react';

const defaultCategories = {
  Work: ['meeting', 'project', 'deadline', 'client', 'report', 'presentation'],
  Personal: ['gym', 'shopping', 'family', 'health', 'hobby', 'exercise'],
  Urgent: ['urgent', 'asap', 'emergency', 'important', 'critical', 'due'],
  Learning: ['study', 'learn', 'course', 'read', 'practice', 'research'],
  Home: ['clean', 'cook', 'laundry', 'groceries', 'repair', 'organize']
};

const TaskCategoriesContext = createContext();

export const TaskCategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState(defaultCategories);

  const detectCategory = useCallback((taskText) => {
    const text = taskText.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        return category;
      }
    }
    return 'Other';
  }, [categories]);

  const addCategory = useCallback((name, keywords) => {
    setCategories(prev => ({
      ...prev,
      [name]: keywords
    }));
  }, []);

  const removeCategory = useCallback((name) => {
    setCategories(prev => {
      const newCategories = { ...prev };
      delete newCategories[name];
      return newCategories;
    });
  }, []);

  const updateCategory = useCallback((name, keywords) => {
    setCategories(prev => ({
      ...prev,
      [name]: keywords
    }));
  }, []);

  return (
    <TaskCategoriesContext.Provider value={{
      categories,
      detectCategory,
      addCategory,
      removeCategory,
      updateCategory
    }}>
      {children}
    </TaskCategoriesContext.Provider>
  );
};

export const useTaskCategories = () => {
  const context = useContext(TaskCategoriesContext);
  if (!context) {
    throw new Error('useTaskCategories must be used within a TaskCategoriesProvider');
  }
  return context;
}; 