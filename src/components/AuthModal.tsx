import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  Target,
  BookMarked,
} from 'lucide-react';
import { loginUser, signupUser, loginAsDemoGuest } from '../services/storage';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  initialMode?: 'login' | 'signup';
  onSuccess: (user: UserProfile) => void;
}

const GRADE_LEVELS = [
  'Middle School (6th - 8th)',
  'High School (9th - 10th)',
  'High School (11th - 12th)',
  'College / University Student',
  'Graduate / Advanced Scholar',
  'Self-Directed Learner',
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState(GRADE_LEVELS[2]);
  const [targetGoal, setTargetGoal] = useState('Master STEM & Ace Exams');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password should be at least 4 characters long.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (isLogin) {
        const result = loginUser(email, password);
        if (result.success && result.user) {
          onSuccess(result.user);
        } else {
          setError(result.error || 'Invalid email or password.');
          setLoading(false);
        }
      } else {
        if (!name.trim()) {
          setError('Please provide your name.');
          setLoading(false);
          return;
        }

        const result = signupUser({
          name,
          email,
          password,
          gradeLevel,
          targetGoal,
          avatar: selectedAvatar,
        });

        if (result.success && result.user) {
          onSuccess(result.user);
        } else {
          setError(result.error || 'Failed to create student account.');
          setLoading(false);
        }
      }
    }, 400);
  };

  const handleDemoGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const demo = loginAsDemoGuest();
      onSuccess(demo);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md my-8 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl shadow-indigo-950/90 text-slate-100 p-6 sm:p-8">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-2xl rounded-full pointer-events-none" />

        {/* Close button if provided */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isLogin ? 'Welcome Back!' : 'Create Student Account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isLogin
              ? 'Access your saved doubts, study history, and AI tutor'
              : 'Join to receive personalized step-by-step academic assistance'}
          </p>
        </div>

        {/* 1-Click Demo Guest Button */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleDemoGuestLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500/15 to-purple-500/15 hover:from-indigo-500/25 hover:to-purple-500/25 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>⚡ Instant Demo Access (No password required)</span>
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-slate-500 text-xs uppercase font-medium">Or continue with credentials</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950/70 border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError(null);
            }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              isLogin
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError(null);
            }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              !isLogin
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Academic Level / Grade
                </label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                >
                  {GRADE_LEVELS.map((g) => (
                    <option key={g} value={g} className="bg-slate-900 text-white">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Study Goal / Exam Target
                </label>
                <div className="relative">
                  <Target className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Ace SAT Math, Master Python & AP Physics"
                    value={targetGoal}
                    onChange={(e) => setTargetGoal(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Choose Avatar
                </label>
                <div className="flex items-center gap-3">
                  {AVATAR_PRESETS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedAvatar(url)}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedAvatar === url
                          ? 'border-indigo-500 ring-2 ring-indigo-500/40 scale-105'
                          : 'border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Authenticating...' : isLogin ? 'Sign In to Assistant' : 'Create My Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Footer switch */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {isLogin ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError(null);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError(null);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
