import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface OverlayContextProps {
  isOpen: boolean;
  toggleOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextProps | undefined>(undefined);

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOverlay = useCallback(() => setIsOpen((v) => !v), []);

  // Listen for ctrl+alt+c hotkey
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.code === 'KeyC') {
        e.preventDefault();
        toggleOverlay();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleOverlay]);

  return (
    <OverlayContext.Provider value={{ isOpen, toggleOverlay }}>
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error('useOverlay must be used within OverlayProvider');
  return ctx;
};
