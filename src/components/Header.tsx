import React from 'react';
import {
  Menu,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Sun,
  Moon,
  Plus,
  Share2,
  Trash2,
  Flame,
} from 'lucide-react';
import { SubjectId, StudyModeId, UserProfile } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  activeTitle: string;
  activeSubject: SubjectId;
  activeMode: StudyModeId;
  user: UserProfile;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenDoubtModal: () => void;
  onNewChat: () => void;
  onOpenProfile: () => void;
  onClearCurrentChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  activeTitle,
  activeSubject,
  activeMode,
  user,
  theme,
  onToggleTheme,
  onOpenDoubtModal,
  onNewChat,
  onOpenProfile,
  onClearCurrentChat,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Menu + Active Session Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
              {activeTitle || 'Study Session'}
            </h2>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {activeSubject}
            </span>
          </div>
          <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
            {activeMode === 'doubt_solver'
              ? 'Mode: Step-by-Step Doubt Solver'
              : activeMode === 'concept_simplifier'
              ? 'Mode: Concept Simplifier (ELI5)'
              : activeMode === 'code_tutor'
              ? 'Mode: Programming & CS Mentor'
              : activeMode === 'quiz_generator'
              ? 'Mode: Interactive Quiz Master'
              : 'Mode: AI Study Tutor'}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Doubt Solver Action */}
        <button
          onClick={onOpenDoubtModal}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
          <span>Solve Doubt</span>
        </button>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          title="New Chat"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Clear Current Chat */}
        <button
          onClick={onClearCurrentChat}
          title="Clear Conversation"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Theme Switcher */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* Profile Avatar */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 pl-1 cursor-pointer"
          title="View Student Profile"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-xl object-cover border border-indigo-500/40 hover:scale-105 transition-transform"
          />
        </button>
      </div>
    </header>
  );
};
