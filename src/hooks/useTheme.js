import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ui.theme'; // 'light' | 'dark'

export default function useTheme(defaultTheme = 'light') {
  const [theme, setTheme] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const isDark = theme === 'dark';

  return { theme, isDark, toggle, setTheme };
}
