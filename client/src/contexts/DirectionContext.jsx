import { createContext, useContext, useState, useEffect } from 'react';

const DirectionContext = createContext();

export const useDirection = () => {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error('useDirection must be used within DirectionProvider');
  }
  return context;
};

export const DirectionProvider = ({ children }) => {
  const [direction, setDirection] = useState(() => {
    // Load from localStorage or default to 'ltr'
    return localStorage.getItem('textDirection') || 'ltr';
  });

  useEffect(() => {
    // Save to localStorage whenever direction changes
    localStorage.setItem('textDirection', direction);

    // Apply to document
    document.documentElement.dir = direction;
  }, [direction]);

  const toggleDirection = () => {
    setDirection(prev => prev === 'ltr' ? 'rtl' : 'ltr');
  };

  return (
    <DirectionContext.Provider value={{ direction, toggleDirection }}>
      {children}
    </DirectionContext.Provider>
  );
};
