"use client";
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';

export default function Header() {
  const { theme, setTheme, currentUser } = useAppStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="sticky top-0 z-30 glass-effect border-b border-zinc-100/80 dark:border-zinc-800/40 px-6 py-4 flex items-center justify-between transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 bg-gradient-to-tr from-premium-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-premium-500/10 dark:shadow-none">
          <i className="fa-solid fa-compass text-sm"></i>
        </div>
        <div>
          <h1 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">KecamapKita</h1>
          <span className="text-[9px] text-premium-600 dark:text-premium-400 font-semibold uppercase tracking-widest block mt-0.5">Rona Kecamatan</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-1.5 relative">
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="h-9 px-3 flex items-center space-x-2 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300 transition-premium border border-zinc-200/20 shadow-sm weather-pulse">
          <span className="text-xs">☀️</span>
          <span className="text-[10px] font-bold">32°C</span>
        </button>

        <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-premium">
          <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-amber-400' : 'fa-moon' } text-base`}></i>
        </button>

        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-premium border border-zinc-200/30 dark:border-zinc-800">
          <span className="text-sm">{currentUser?.avatar || '👤'}</span>
          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white dark:border-zinc-900 rounded-full transition-premium ${currentUser ? 'bg-premium-500 animate-pulse' : 'bg-zinc-300 dark:bg-zinc-600'}`}></span>
        </button>
      </div>
    </header>
  );
}
