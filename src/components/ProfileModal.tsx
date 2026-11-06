import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  GraduationCap,
  Target,
  Flame,
  CheckCircle2,
  Clock,
  LogOut,
  Save,
  BookOpen,
} from 'lucide-react';
import { UserProfile, SubjectId } from '../types';
import { SUBJECTS } from '../constants/subjects';
import { updateUserProfile } from '../services/storage';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
}

const GRADE_LEVELS = [
  'Middle School (6th - 8th)',
  'High School (9th - 10th)',
  'High School (11th - 12th)',
  'College / University Student',
  'Graduate / Advanced Scholar',
  'Self-Directed Learner',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
}) => {
  const [name, setName] = useState(user.name);
  const [gradeLevel, setGradeLevel] = useState(user.gradeLevel);
  const [targetGoal, setTargetGoal] = useState(user.targetGoal);
  const [favoriteSubjects, setFavoriteSubjects] = useState<SubjectId[]>(
    user.favoriteSubjects || ['Mathematics', 'Science']
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggleSubject = (subjId: SubjectId) => {
    if (favoriteSubjects.includes(subjId)) {
      if (favoriteSubjects.length > 1) {
        setFavoriteSubjects(favoriteSubjects.filter((s) => s !== subjId));
      }
    } else {
      setFavoriteSubjects([...favoriteSubjects, subjId]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateUserProfile({
      name,
      gradeLevel,
      targetGoal,
      favoriteSubjects,
    });
    if (updated) {
      onUpdateUser(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 rounded-3xl bg-slate-900 dark:bg-slate-900 bg-white border border-slate-200 dark:border-indigo-500/30 shadow-2xl shadow-indigo-950/60 p-6 sm:p-8 text-slate-800 dark:text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Avatar & Badge */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-lg shadow-indigo-500/30"
          />
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {user.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </p>
            <div className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {user.gradeLevel}
            </div>
          </div>
        </div>

        {/* Study Stats Grid */}
        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/90 text-center">
            <div className="w-7 h-7 mx-auto rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-1.5">
              <Flame className="w-4 h-4" />
            </div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {user.streakDays || 1}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Day Streak</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/90 text-center">
            <div className="w-7 h-7 mx-auto rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-1.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {user.doubtsSolved || 0}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Doubts Solved</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/90 text-center">
            <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {user.minutesStudied || 0}m
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Study Time</div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Student Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Academic Grade / Level
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none"
            >
              {GRADE_LEVELS.map((g) => (
                <option key={g} value={g} className="bg-slate-900 text-white">
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Learning Focus & Target Goal
            </label>
            <div className="relative">
              <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Primary Learning Disciplines
            </label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => {
                const isSelected = favoriteSubjects.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleToggleSubject(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-white'
                    }`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? 'Saved Changes!' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
