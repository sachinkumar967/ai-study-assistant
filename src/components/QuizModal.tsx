import React, { useState, useEffect } from 'react';
import {
  X,
  GraduationCap,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Loader2,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, SubjectId } from '../types';
import { fetchGeneratedQuiz } from '../services/aiService';
import { recordStudyActivity } from '../services/storage';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  subject: SubjectId;
  gradeLevel: string;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  topic,
  subject,
  gradeLevel,
}) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && topic) {
      loadQuiz();
    }
  }, [isOpen, topic]);

  const loadQuiz = async () => {
    setLoading(true);
    setError(null);
    setSelectedAnswers({});
    setShowHint({});
    setQuizFinished(false);
    setCurrentIndex(0);

    try {
      const generated = await fetchGeneratedQuiz(`${subject}: ${topic}`, gradeLevel);
      if (generated && generated.length > 0) {
        setQuestions(generated);
      } else {
        // Fallback default sample question if API returned empty
        setQuestions([
          {
            id: 1,
            question: `Which fundamental principle is central to understanding ${topic}?`,
            options: [
              'Conservation of energy and systemic equilibrium',
              'Random variable dispersion with no boundary conditions',
              'Static constant coefficient invariant logic',
              'Non-deterministic polynomial time independence',
            ],
            correctIndex: 0,
            hint: 'Think about physical balance and invariant rules.',
            explanation: 'Systemic conservation and equilibrium underpin the primary laws in this domain.',
          },
        ]);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to generate practice quiz.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const hasAnsweredCurrent = selectedAnswers[currentIndex] !== undefined;
  const isCorrect = hasAnsweredCurrent && selectedAnswers[currentIndex] === currentQ?.correctIndex;

  const handleSelectOption = (index: number) => {
    if (hasAnsweredCurrent) return;
    const updated = { ...selectedAnswers, [currentIndex]: index };
    setSelectedAnswers(updated);

    if (index === currentQ.correctIndex) {
      // Little mini celebration
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 },
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizFinished(true);
      // Calculate total score
      const totalCorrect = Object.entries(selectedAnswers).filter(
        ([qIdx, ansIdx]) => questions[Number(qIdx)]?.correctIndex === ansIdx
      ).length;

      recordStudyActivity(questions.length, 10);

      if (totalCorrect >= Math.ceil(questions.length * 0.7)) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const calculateScore = () => {
    return Object.entries(selectedAnswers).filter(
      ([qIdx, ansIdx]) => questions[Number(qIdx)]?.correctIndex === ansIdx
    ).length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl shadow-indigo-950/80 p-6 sm:p-8 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white">Interactive Practice Quiz</h3>
            <p className="text-xs text-indigo-300">
              {subject} • <span className="text-slate-400">{topic}</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-4">
            <Loader2 className="w-9 h-9 text-indigo-400 animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="font-semibold text-white text-base">Generating Quiz Questions with AI...</p>
              <p className="text-xs text-slate-400">Crafting targeted challenges to test your understanding</p>
            </div>
          </div>
        ) : error ? (
          <div className="py-10 text-center space-y-4">
            <p className="text-sm text-rose-400">{error}</p>
            <button
              onClick={loadQuiz}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        ) : quizFinished ? (
          /* Finished Score Card */
          <div className="py-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-indigo-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-extrabold text-white">Quiz Completed!</h4>
              <p className="text-sm text-slate-300">
                You scored{' '}
                <span className="font-bold text-indigo-300 text-lg">
                  {calculateScore()} / {questions.length}
                </span>{' '}
                correct answers.
              </p>
              <p className="text-xs text-emerald-400 font-medium">
                + {questions.length * 10} XP added to your study statistics!
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={loadQuiz}
                className="px-5 py-2.5 rounded-xl border border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Back to Study Chat
              </button>
            </div>
          </div>
        ) : currentQ ? (
          /* Active Question */
          <div className="space-y-5">
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="font-mono text-indigo-400">
                {Math.round(((currentIndex + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-sm sm:text-base font-semibold text-white leading-relaxed">
              {currentQ.question}
            </div>

            {/* Hint toggle */}
            {currentQ.hint && (
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() =>
                    setShowHint({ ...showHint, [currentIndex]: !showHint[currentIndex] })
                  }
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint[currentIndex] ? 'Hide Hint' : 'Need a hint?'}</span>
                </button>
              </div>
            )}

            {showHint[currentIndex] && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
                💡 <span className="font-medium">Hint:</span> {currentQ.hint}
              </div>
            )}

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                const isRightAnswer = optIdx === currentQ.correctIndex;

                let optClass =
                  'bg-slate-950/60 border-slate-800 hover:border-indigo-500/40 text-slate-200';

                if (hasAnsweredCurrent) {
                  if (isRightAnswer) {
                    optClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                  } else if (isSelected) {
                    optClass = 'bg-rose-950/60 border-rose-500 text-rose-200';
                  } else {
                    optClass = 'bg-slate-950/40 border-slate-900 opacity-50';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={hasAnsweredCurrent}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${optClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-300 shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {hasAnsweredCurrent && isRightAnswer && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {hasAnsweredCurrent && isSelected && !isRightAnswer && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {hasAnsweredCurrent && (
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 ${
                  isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
                }`}
              >
                <div className="font-semibold flex items-center gap-1.5">
                  {isCorrect ? '✅ Well done!' : 'ℹ️ Explanation:'}
                </div>
                <p className="text-slate-200">{currentQ.explanation}</p>
              </div>
            )}

            {/* Bottom action */}
            {hasAnsweredCurrent && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
