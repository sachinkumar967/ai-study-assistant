import React from 'react';
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Calculator,
  Atom,
  Cpu,
  Code2,
  BookOpen,
  Globe2,
  CheckCircle2,
  Brain,
  ShieldCheck,
  Zap,
  HelpCircle,
  PlayCircle,
  Star,
} from 'lucide-react';
import { SUBJECTS } from '../constants/subjects';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onTryDemo: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onLogin,
  onTryDemo,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-blue-600/25 via-indigo-600/25 to-purple-600/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[450px] h-[450px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[60%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-white/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg md:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-300">
              AI Study Assistant
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-full">
              Personal AI Teacher
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTryDemo}
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            Instant Demo
          </button>
          <button
            onClick={onLogin}
            className="text-xs sm:text-sm font-medium text-indigo-300 hover:text-white px-3.5 py-1.5 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/10 transition-colors cursor-pointer"
          >
            Log In
          </button>
          <button
            onClick={onGetStarted}
            className="text-xs sm:text-sm font-semibold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium shadow-inner backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Next-Generation AI Learning Companion</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]">
            Master Any Subject With Your Own{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Personal AI Teacher
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal">
            Stuck on a tricky math equation, science concept, or code bug? Ask questions naturally, scan diagrams, and receive crystal-clear step-by-step solutions designed for deep understanding.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onTryDemo}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-indigo-500/30 hover:border-indigo-400/50 text-indigo-200 font-medium text-base transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-4 h-4 text-indigo-400" />
              <span>Explore Live Demo as Guest</span>
            </button>
          </div>

          {/* Social Proof / Trust metrics */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Step-by-Step Logic</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>STEM, Coding, & Humanities</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Free Instant Access</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Doubt Solver Showcase Card */}
        <div className="mt-14 max-w-4xl mx-auto rounded-2xl border border-indigo-500/30 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-indigo-950/80 overflow-hidden">
          {/* Mock Browser Header */}
          <div className="px-5 py-3 bg-slate-950/90 border-b border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">Step-by-Step Doubt Solver • Mathematics</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
              Live Preview
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Student Doubt Question */}
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-xs font-bold text-slate-300">
                You
              </div>
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-200">
                Can you explain step by step how to find the derivative of{' '}
                <span className="font-mono text-indigo-300 font-semibold bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40">
                  f(x) = (3x² - 2)(x³ + 4)
                </span>{' '}
                using the Product Rule?
              </div>
            </div>

            {/* AI Teacher Response */}
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl rounded-tl-sm p-5 text-sm space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-indigo-300">AI Study Assistant</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      Product Rule Breakdown
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Instant</span>
                </div>

                <div className="space-y-2 text-slate-200">
                  <div className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <span>🔑 Core Formula</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-900/30 border border-indigo-500/30 font-mono text-xs sm:text-sm text-indigo-200">
                    d/dx [ u(x) · v(x) ] = u'(x) · v(x) + u(x) · v'(x)
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="font-mono text-indigo-300 font-semibold">u(x) = 3x² - 2</div>
                    <div className="font-mono text-slate-300 mt-1">u'(x) = 6x</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="font-mono text-purple-300 font-semibold">v(x) = x³ + 4</div>
                    <div className="font-mono text-slate-300 mt-1">v'(x) = 3x²</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm">
                  <span className="font-bold">Final Simplified Result: </span>
                  <span className="font-mono font-bold text-white ml-1">f'(x) = 15x⁴ - 6x² + 24x</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="mt-20">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Comprehensive Learning Across All Disciplines
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              From high school foundations to university-level topics, get targeted explanations and practice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SUBJECTS.map((subj) => {
              const IconComp = getSubjectIcon(subj.icon);
              return (
                <div
                  key={subj.id}
                  onClick={onGetStarted}
                  className="group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${subj.gradient} flex items-center justify-center shadow-md shadow-indigo-600/20`}
                      >
                        <IconComp className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 group-hover:text-indigo-300">
                        {subj.sampleQuestions.length}+ Topics
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                      {subj.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {subj.shortDesc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 group-hover:text-indigo-300">
                    <span className="font-medium">Explore questions</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/90 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white">Doubt Solver Engine</h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              No skipped steps. Our AI breaks equations, physics dilemmas, and grammar puzzles into bite-sized, logical milestones.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/90 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white">ELI5 Concept Simplifier</h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Understand hard theories through everyday analogies, vivid mental models, and real-life connections.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/90 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white">Code & Syntax Mentor</h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Clean syntax explanations, algorithmic complexity (Big-O), debugging insights, and runnable examples.
            </p>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/50 to-purple-900/40 border border-indigo-500/40 text-center space-y-5 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Ready to upgrade your study routine?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Join students mastering complex concepts with zero stress and 24/7 personalized guidance.
          </p>
          <div className="pt-2">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-base shadow-xl shadow-white/10 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Start Learning Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} AI Study Assistant • Powered by Advanced Gemini Intelligence</p>
      </footer>
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
      return GraduationCap;
  }
}
