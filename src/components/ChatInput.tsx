import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  Mic,
  MicOff,
  X,
  HelpCircle,
  Lightbulb,
  Terminal,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';
import { SubjectId, StudyModeId } from '../types';
import { SUBJECTS, STUDY_MODES } from '../constants/subjects';

interface ChatInputProps {
  onSendMessage: (params: {
    message: string;
    subject: SubjectId;
    mode: StudyModeId;
    imageData?: string;
    imageMimeType?: string;
  }) => void;
  isLoading: boolean;
  activeSubject: SubjectId;
  onChangeSubject: (s: SubjectId) => void;
  activeMode: StudyModeId;
  onChangeMode: (m: StudyModeId) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  activeSubject,
  onChangeSubject,
  activeMode,
  onChangeMode,
}) => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [isRecording, setIsRecording] = useState(false);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  // Voice speech-to-text setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleToggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch {
        setIsRecording(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    setImageMime(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = () => {
    if ((!text.trim() && !imagePreview) || isLoading) return;

    onSendMessage({
      message: text.trim(),
      subject: activeSubject,
      mode: activeMode,
      imageData: imagePreview || undefined,
      imageMimeType: imageMime,
    });

    setText('');
    setImagePreview(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentSubjectMeta = SUBJECTS.find((s) => s.id === activeSubject);
  const currentModeMeta = STUDY_MODES.find((m) => m.id === activeMode);

  const [isSimpleMode, setIsSimpleMode] = useState(true);

  return (
    <div className="relative max-w-4xl mx-auto w-full px-4 pb-4">
      {/* Quick Suggestion Chips based on subject & simple language */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setIsSimpleMode(!isSimpleMode)}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer border ${
            isSimpleMode
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/40 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-500 border-slate-300 dark:border-slate-800'
          }`}
          title="Toggle Super Simple Language Mode"
        >
          <Lightbulb className={`w-3.5 h-3.5 ${isSimpleMode ? 'text-amber-500 fill-amber-500/30' : ''}`} />
          <span>{isSimpleMode ? '⚡ Saral Bhasha Mode (ON)' : 'Standard Mode'}</span>
        </button>

        <span className="text-[11px] font-semibold text-slate-400 shrink-0 ml-1">Quick prompts:</span>
        <button
          onClick={() => {
            setText('Isko bilkul aasan bhasha me real-life example ke saath samjhao: ');
            textareaRef.current?.focus();
          }}
          className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-500/40 transition-all shrink-0 cursor-pointer text-left truncate shadow-xs"
        >
          💡 Aasan bhasha me samjhao
        </button>
        <button
          onClick={() => {
            setText('Isko step-by-step poora hal karke samjhao: ');
            textareaRef.current?.focus();
          }}
          className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-500/40 transition-all shrink-0 cursor-pointer text-left truncate shadow-xs"
        >
          📝 Step-by-Step Solve karo
        </button>

        {currentSubjectMeta?.sampleQuestions.slice(0, 2).map((q, idx) => (
          <button
            key={idx}
            onClick={() => {
              setText(q);
              textareaRef.current?.focus();
            }}
            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-500/40 transition-all shrink-0 cursor-pointer text-left truncate max-w-xs shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Main Input Box */}
      <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 shadow-xl shadow-slate-200/50 dark:shadow-indigo-950/40 transition-all p-3">
        {/* Attached image preview */}
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <div className="rounded-xl overflow-hidden border border-indigo-500/50 max-h-32 bg-slate-950">
              <img src={imagePreview} alt="Upload preview" className="h-28 w-auto object-cover" />
            </div>
            <button
              onClick={() => setImagePreview(null)}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-slate-900 text-rose-400 hover:text-rose-300 border border-slate-700 shadow-md cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isSimpleMode
              ? `Apna sawal Hindi, Hinglish ya English me poochhein (Aasan bhasha & step-by-step example milega)...`
              : `Ask anything in ${activeSubject} or paste a problem... (Press Enter to send)`
          }
          rows={1}
          disabled={isLoading}
          className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none text-sm sm:text-base leading-relaxed px-1 py-1"
        />

        {/* Bottom Toolbar */}
        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          {/* Subject & Mode Dropdowns */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Subject Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowSubjectMenu(!showSubjectMenu);
                  setShowModeMenu(false);
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <span>{activeSubject}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showSubjectMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-30 space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                    Select Subject
                  </div>
                  {SUBJECTS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onChangeSubject(s.id);
                        setShowSubjectMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                        activeSubject === s.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{s.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mode Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowModeMenu(!showModeMenu);
                  setShowSubjectMenu(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition-colors ${
                  activeMode === 'doubt_solver'
                    ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{currentModeMeta?.badge || 'Tutor'}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showModeMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-30 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                    Learning Mode
                  </div>
                  {STUDY_MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        onChangeMode(m.id);
                        setShowModeMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        activeMode === m.id
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-semibold">{m.name}</div>
                      <div className={`text-[10px] ${activeMode === m.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {m.tagline}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Media & Send buttons */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Image attachment */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload problem photo or diagram"
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Voice Dictation */}
            <button
              type="button"
              onClick={handleToggleVoice}
              title={isRecording ? 'Stop recording voice' : 'Dictate question with voice'}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={(!text.trim() && !imagePreview) || isLoading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Thinking...</span>
                </>
              ) : (
                <>
                  <span>Ask AI</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
