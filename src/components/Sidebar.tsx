import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  HelpCircle,
  MessageSquare,
  Search,
  Trash2,
  Settings,
  LogOut,
  Moon,
  Sun,
  Flame,
  ChevronRight,
  BookOpen,
  Sparkles,
  X,
  Calculator,
  Atom,
  Cpu,
  Code2,
  Globe2,
} from 'lucide-react';
import { ChatSession, UserProfile, SubjectId, StudyModeId } from '../types';
import { SUBJECTS, STUDY_MODES } from '../constants/subjects';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: (subject?: SubjectId, mode?: StudyModeId) => void;
  onDeleteSession: (id: string) => void;
  onOpenDoubtModal: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  selectedSubject: SubjectId;
  onSelectSubject: (subject: SubjectId) => void;
  selectedMode: StudyModeId;
  onSelectMode: (mode: StudyModeId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  user,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onOpenDoubtModal,
  onOpenProfile,
  onLogout,
  theme,
  onToggleTheme,
  selectedSubject,
  onSelectSubject,
  selectedMode,
  onSelectMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.subject.toLowerCase().includes(q);
  });

  // Group sessions by date
  const now = Date.now();
  const dayMs = 86400000;

  const todaySessions: ChatSession[] = [];
  const yesterdaySessions: ChatSession[] = [];
  const olderSessions: ChatSession[] = [];

  filteredSessions.forEach((s) => {
    const time = new Date(s.updatedAt || s.createdAt).getTime();
    const diff = now - time;
    if (diff < dayMs) {
      todaySessions.push(s);
    } else if (diff < 2 * dayMs) {
      yesterdaySessions.push(s);
    } else {
      olderSessions.push(s);
    }
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 sm:w-80 bg-slate-900 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                AI Study Assistant
              </h1>
              <p className="text-[11px] text-indigo-500 dark:text-indigo-400 font-medium">
                Personal AI Teacher
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons: New Chat & Solve Doubt */}
        <div className="p-3.5 space-y-2 border-b border-slate-200 dark:border-slate-800/80">
          <button
            onClick={() => onNewChat(selectedSubject, selectedMode)}
            className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Study Chat</span>
          </button>

          <button
            onClick={onOpenDoubtModal}
            className="w-full py-2 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
            <span>Solve a Tricky Doubt Step-by-Step</span>
          </button>
        </div>

        {/* Subjects & Mode selector quick bar */}
        <div className="px-3.5 py-3 border-b border-slate-200 dark:border-slate-800/80 space-y-2">
          <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 px-1">
            Subjects
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {SUBJECTS.map((subj) => {
              const isActive = selectedSubject === subj.id;
              const Icon = getSubjectIcon(subj.icon);
              return (
                <button
                  key={subj.id}
                  onClick={() => onSelectSubject(subj.id)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 truncate cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                  title={subj.name}
                >
                  <Icon className="w-3 h-3 shrink-0" />
                  <span className="truncate">{subj.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4 scrollbar-thin">
          {/* Search history input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-4">
            {todaySessions.length > 0 && (
              <HistoryGroup
                title="Today"
                sessions={todaySessions}
                activeId={activeSessionId}
                onSelect={onSelectSession}
                onDelete={onDeleteSession}
              />
            )}

            {yesterdaySessions.length > 0 && (
              <HistoryGroup
                title="Yesterday"
                sessions={yesterdaySessions}
                activeId={activeSessionId}
                onSelect={onSelectSession}
                onDelete={onDeleteSession}
              />
            )}

            {olderSessions.length > 0 && (
              <HistoryGroup
                title="Previous Chats"
                sessions={olderSessions}
                activeId={activeSessionId}
                onSelect={onSelectSession}
                onDelete={onDeleteSession}
              />
            )}

            {filteredSessions.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400 space-y-1">
                <MessageSquare className="w-6 h-6 mx-auto opacity-40 text-slate-500" />
                <p>No study conversations found.</p>
                <p className="text-[11px] text-indigo-400">Start a new chat above!</p>
              </div>
            )}
          </div>
        </div>

        {/* User Card & Settings footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 space-y-2">
          {/* Streak indicator badge */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-1.5 font-semibold">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>{user.streakDays || 1} Day Study Streak</span>
            </div>
            <span className="text-[10px] font-mono bg-amber-500/20 px-1.5 py-0.5 rounded font-bold">
              +{user.doubtsSolved} solved
            </span>
          </div>

          {/* Profile pill */}
          <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/60 transition-colors">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 min-w-0 text-left flex-1 cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover border border-indigo-500/40 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {user.gradeLevel.split(' ')[0]}
                </p>
              </div>
            </button>

            {/* Quick Actions: Theme and Logout */}
            <div className="flex items-center gap-1">
              <button
                onClick={onToggleTheme}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>

              <button
                onClick={onLogout}
                title="Log Out"
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const HistoryGroup: React.FC<{
  title: string;
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ title, sessions, activeId, onSelect, onDelete }) => {
  return (
    <div className="space-y-1">
      <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider px-2">
        {title}
      </div>
      <div className="space-y-0.5">
        {sessions.map((s) => {
          const isActive = s.id === activeId;
          return (
            <div
              key={s.id}
              className={`group relative flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <button
                onClick={() => onSelect(s.id)}
                className="flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer"
              >
                <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'}`} />
                <span className="truncate">{s.title || 'Study Discussion'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(s.id);
                }}
                title="Delete Chat"
                className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-opacity cursor-pointer ${
                  isActive ? 'hover:text-white' : ''
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function getSubjectIcon(iconName: string) {
  switch (iconName) {
    case 'Calculator':
      return Calculator;
    case 'Atom':
      return Atom;
    case 'Cpu':
      return Cpu;
    case 'Code2':
      return Code2;
    case 'BookOpen':
      return BookOpen;
    case 'Globe2':
      return Globe2;
    default:
      return MessageSquare;
  }
}
