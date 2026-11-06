import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  GraduationCap,
  Bookmark,
  Share2,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { ChatMessage, SubjectId } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessageItemProps {
  message: ChatMessage;
  onPracticeTopic?: (topic: string, subject: SubjectId) => void;
  onExplainSimpler?: (content: string) => void;
  onExplainInHindi?: (content: string) => void;
  onShowSteps?: (content: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onPracticeTopic,
  onExplainSimpler,
  onExplainInHindi,
  onShowSteps,
}) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [saved, setSaved] = useState(Boolean(message.isSaved));

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown formatting symbols for smooth text-to-speech
    const cleanText = message.content
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/```[\s\S]*?```/g, 'Code block omitted for reading.')
      .replace(/\$\$[\s\S]*?\$\$/g, 'Formula')
      .replace(/\$/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div
      className={`group flex items-start gap-3.5 sm:gap-4 my-4 ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/25 border border-indigo-400/20 text-white mt-1">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div
        className={`relative max-w-3xl rounded-2xl p-4 sm:p-5 transition-all ${
          isAssistant
            ? 'w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-indigo-500/20 shadow-md shadow-slate-200/50 dark:shadow-indigo-950/40 text-slate-800 dark:text-slate-100'
            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
        }`}
      >
        {/* Header line for Assistant */}
        {isAssistant && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                AI Study Teacher
              </span>
              {message.mode && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-medium text-[10px] uppercase border border-indigo-500/20">
                  {message.mode === 'doubt_solver'
                    ? 'Step-by-Step Doubt Solver'
                    : message.mode === 'concept_simplifier'
                    ? 'Concept Simplifier'
                    : message.mode === 'code_tutor'
                    ? 'Code Mentor'
                    : message.mode === 'quiz_generator'
                    ? 'Quiz Master'
                    : 'Study Mentoring'}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">{formatTimestamp(message.timestamp)}</span>
          </div>
        )}

        {/* User uploaded image preview if exists */}
        {message.imageUrl && (
          <div className="mb-3 rounded-xl overflow-hidden border border-white/20 bg-black/20 max-w-sm">
            <img
              src={message.imageUrl}
              alt="Uploaded problem"
              className="max-h-60 w-auto object-contain rounded-lg"
            />
          </div>
        )}

        {/* Message Content */}
        {isAssistant ? (
          <MarkdownRenderer content={message.content} />
        ) : (
          <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal">
            {message.content}
          </div>
        )}

        {/* Assistant Bottom Action Bar */}
        {isAssistant && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                title="Copy to clipboard"
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {'speechSynthesis' in window && (
                <button
                  onClick={handleSpeak}
                  title={isSpeaking ? 'Stop speaking' : 'Read explanation aloud'}
                  className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                    isSpeaking
                      ? 'bg-indigo-500/20 text-indigo-400 font-medium'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                      <span>Speaking...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => setSaved(!saved)}
                title="Bookmark explanation"
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  saved
                    ? 'text-amber-500'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-amber-500' : ''}`} />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            {/* Quick follow-up actions */}
            <div className="flex flex-wrap items-center gap-1.5">
              {onExplainSimpler && (
                <button
                  onClick={() => onExplainSimpler(message.content)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer border border-amber-500/30"
                  title="Explain in even simpler terms with fun real-world example"
                >
                  <Lightbulb className="w-3 h-3 text-amber-500" />
                  <span>💡 Aur aasan bhasha me samjhao</span>
                </button>
              )}

              {onExplainInHindi && (
                <button
                  onClick={() => onExplainInHindi(message.content)}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer border border-blue-500/30"
                  title="Explain in conversational Hindi / Hinglish"
                >
                  <span>🇮🇳 Hindi / Hinglish me</span>
                </button>
              )}

              {onShowSteps && (
                <button
                  onClick={() => onShowSteps(message.content)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer border border-indigo-500/30"
                  title="Show step-by-step solution"
                >
                  <HelpCircle className="w-3 h-3 text-indigo-500" />
                  <span>📝 Step-by-Step Hal</span>
                </button>
              )}

              {onPracticeTopic && (
                <button
                  onClick={() =>
                    onPracticeTopic(
                      message.content.slice(0, 40).replace(/[^a-zA-Z0-9 ]/g, ''),
                      message.subject || 'Mathematics'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer border border-purple-500/30"
                >
                  <GraduationCap className="w-3 h-3 text-purple-500" />
                  <span>Practice Quiz</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* User message timestamp */}
        {!isAssistant && (
          <div className="text-[10px] text-indigo-200 mt-1.5 text-right font-medium">
            {formatTimestamp(message.timestamp)}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-indigo-400/40 flex items-center justify-center shrink-0 text-white mt-1">
          <User className="w-4 h-4 text-indigo-300" />
        </div>
      )}
    </div>
  );
};
