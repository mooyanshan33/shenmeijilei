import { useState, useEffect, useCallback } from 'react';
import type { ThemeType } from '@/types';

function getInitialTheme(): ThemeType {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  } catch {
    return 'light';
  }
  return 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeType>(getInitialTheme);
  const isInitialized = true;

  // Apply theme to document
  useEffect(() => {
    if (!isInitialized) return;
    
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch {
      void 0;
    }
  }, [theme, isInitialized]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const setLightTheme = useCallback(() => {
    setTheme('light');
  }, []);

  const setDarkTheme = useCallback(() => {
    setTheme('dark');
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    isInitialized,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
  };
}
