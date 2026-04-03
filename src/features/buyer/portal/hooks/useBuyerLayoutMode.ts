import { useState, useCallback, useEffect } from 'react';

export type LayoutMode = 'public' | 'shell';

const STORAGE_KEY = 'buyer-layout-mode';

export function useBuyerLayoutMode() {
  const [mode, setModeState] = useState<LayoutMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return (saved === 'shell' ? 'shell' : 'public') as LayoutMode;
    } catch {
      return 'public';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore storage errors
    }
  }, [mode]);

  const toggle = useCallback(() => {
    setModeState(prev => prev === 'public' ? 'shell' : 'public');
  }, []);

  const setMode = useCallback((newMode: LayoutMode) => {
    setModeState(newMode);
  }, []);

  return { mode, toggle, setMode };
}
