
import React from 'react';
import { User } from '../types';
import Avatar from './Avatar';

interface HeaderProps {
  user: User;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, theme, onToggleTheme }) => {
  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-8 z-10 sticky top-0 backdrop-blur-sm">
      <div className="relative w-full max-w-xl">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </span>
        <input
          type="text"
          placeholder="Search materials, summaries, or courses..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-black dark:text-white font-medium"
        />
      </div>

      <div className="flex items-center space-x-6">
        {/* The "Physical" Theme Toggle Button */}
        <div className="flex flex-col items-center">
          <button 
            onClick={onToggleTheme}
            className={`
              relative w-14 h-14 rounded-2xl flex items-center justify-center 
              transition-all duration-150 transform active:translate-y-1 active:shadow-none
              border-b-4 
              ${theme === 'dark' 
                ? 'bg-slate-800 border-slate-950 text-amber-400 shadow-[0_6px_0_0_#0f172a]' 
                : 'bg-white border-slate-200 text-indigo-600 shadow-[0_6px_0_0_#e2e8f0]'
              }
            `}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          <span className="text-[8px] font-black uppercase tracking-widest mt-1.5 text-slate-400 dark:text-slate-500">Mood</span>
        </div>

        <button className="relative w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span className="absolute top-3 right-3 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
        </button>

        <div className="flex items-center space-x-3 ml-2">
          <Avatar src={user.avatar} name={user.name} />
        </div>
      </div>
    </header>
  );
};

export default Header;
