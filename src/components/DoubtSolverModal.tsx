import React, { useState, useRef } from 'react';
import {
  X,
  HelpCircle,
  Sparkles,
  Camera,
  UploadCloud,
  ArrowRight,
  Calculator,
  Atom,
  Cpu,
  Code2,
  BookOpen,
  Globe2,
  Trash2,
} from 'lucide-react';
import { SubjectId } from '../types';
import { SUBJECTS } from '../constants/subjects';

interface DoubtSolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDoubt: (params: {
    question: string;
    subject: SubjectId;
    imageData?: string;
    imageMimeType?: string;
  }) => void;
  defaultSubject?: SubjectId;
}

export const DoubtSolverModal: React.FC<DoubtSolverModalProps> = ({
  isOpen,
  onClose,
  onSubmitDoubt,
  defaultSubject = 'Mathematics',
}) => {
  const [subject, setSubject] = useState<SubjectId>(defaultSubject);
  const [question, setQuestion] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageMime(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() && !imagePreview) return;

    onSubmitDoubt({
      question: question.trim(),
      subject,
      imageData: imagePreview || undefined,
      imageMimeType: imageMime,
    });
    onClose();
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

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Step-by-Step Doubt Solver (Saral Hal)
            </h2>
            <p className="text-xs text-slate-400">
              Mushkil se mushkil sawal ka aasan bhasha me step-by-step hal aur real-life example
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Subject (Subject Chunein)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUBJECTS.map((s) => {
                const isSelected = subject === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSubject(s.id)}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{s.id === 'Mathematics' ? '📐' : s.id === 'Science' ? '🔬' : s.id === 'Computer Science' ? '💻' : s.id === 'Programming' ? '⚡' : s.id === 'English' ? '📚' : '🌍'}</span>
                    <span className="truncate">{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Apna Doubt / Question Yahan Likhein ya Paste Karein
            </label>
            <textarea
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. 3x² - 5x - 2 = 0 ko quadratic formula se solve karke aasan bhasha me samjhao, ya momentum conservation kya hai simple example do..."
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Image Attachment (For photo of problem) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Or Upload Problem Photo / Diagram (Optional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-indigo-500/40 bg-slate-950 p-2 max-h-48 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Doubt attachment"
                  className="max-h-44 object-contain rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/90 text-rose-400 hover:text-rose-300 border border-slate-700 cursor-pointer shadow"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-950/40 flex items-center justify-center gap-3 text-slate-400 hover:text-indigo-300"
              >
                <UploadCloud className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-medium">Click to upload photo of textbook, worksheet, or math equation</span>
              </div>
            )}
          </div>

          {/* Quick Suggestions for Selected Subject */}
          <div>
            <span className="text-[11px] text-slate-400 font-medium mb-1.5 block">
              Quick Doubt Examples:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUBJECTS.find((s) => s.id === subject)?.sampleQuestions.slice(0, 2).map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQuestion(q)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/30 transition-all text-left truncate max-w-full cursor-pointer"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!question.trim() && !imagePreview}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Solve Step-by-Step with AI Teacher</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
