import React, { useState, useEffect, useRef } from 'react';
import {
  getCurrentUser,
  setCurrentUser,
  getUserChats,
  saveOrUpdateChat,
  deleteChat,
  clearAllChats,
  getSavedTheme,
  saveTheme,
  logoutUser,
  recordStudyActivity,
} from './services/storage';
import {
  UserProfile,
  ChatSession,
  ChatMessage,
  SubjectId,
  StudyModeId,
} from './types';
import { SUBJECTS } from './constants/subjects';
import { askAIStudyAssistant } from './services/aiService';

import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthModal } from './components/AuthModal';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatMessageItem } from './components/ChatMessageItem';
import { ChatInput } from './components/ChatInput';
import { DoubtSolverModal } from './components/DoubtSolverModal';
import { QuizModal } from './components/QuizModal';
import { ProfileModal } from './components/ProfileModal';

import {
  Sparkles,
  HelpCircle,
  GraduationCap,
  Calculator,
  Atom,
  Cpu,
  Code2,
  BookOpen,
  Globe2,
  ArrowRight,
  Flame,
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(() => getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');

  const [theme, setTheme] = useState<'dark' | 'light'>(() => getSavedTheme());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals
  const [doubtModalOpen, setDoubtModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [quizTopic, setQuizTopic] = useState('Quadratic Equations');
  const [quizSubject, setQuizSubject] = useState<SubjectId>('Mathematics');

  // Chat Sessions & Active State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSubject, setActiveSubject] = useState<SubjectId>('Mathematics');
  const [activeMode, setActiveMode] = useState<StudyModeId>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync theme
  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  // Load chats when user is authenticated
  useEffect(() => {
    if (currentUser) {
      const userChats = getUserChats(currentUser.id);
      setSessions(userChats);
      if (userChats.length > 0) {
        setActiveSessionId(userChats[0].id);
        setActiveSubject(userChats[0].subject || 'Mathematics');
        setActiveMode(userChats[0].mode || 'general');
      } else {
        createNewChat('Mathematics', 'general');
      }
    } else {
      setSessions([]);
      setActiveSessionId(null);
    }
  }, [currentUser?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, isLoading]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUserState(user);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUserState(null);
    setProfileModalOpen(false);
  };

  const createNewChat = (
    subject: SubjectId = activeSubject,
    mode: StudyModeId = activeMode
  ) => {
    if (!currentUser) return;

    const newSession: ChatSession = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: `New ${subject} Session`,
      subject: subject,
      mode: mode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    const updated = saveOrUpdateChat(currentUser.id, newSession);
    setSessions(updated);
    setActiveSessionId(newSession.id);
    setActiveSubject(subject);
    setActiveMode(mode);
    setSidebarOpen(false);
    setApiError(null);
  };

  const handleDeleteSession = (chatId: string) => {
    if (!currentUser) return;
    const remaining = deleteChat(currentUser.id, chatId);
    setSessions(remaining);
    if (activeSessionId === chatId) {
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
        setActiveSubject(remaining[0].subject || 'Mathematics');
        setActiveMode(remaining[0].mode || 'general');
      } else {
        createNewChat('Mathematics', 'general');
      }
    }
  };

  const handleClearCurrentChat = () => {
    if (!currentUser || !activeSessionId) return;
    const current = sessions.find((s) => s.id === activeSessionId);
    if (!current) return;

    const cleared: ChatSession = {
      ...current,
      messages: [],
      updatedAt: new Date().toISOString(),
    };
    const updated = saveOrUpdateChat(currentUser.id, cleared);
    setSessions(updated);
  };

  const handleSelectSession = (id: string) => {
    const s = sessions.find((item) => item.id === id);
    if (s) {
      setActiveSessionId(s.id);
      setActiveSubject(s.subject || 'Mathematics');
      setActiveMode(s.mode || 'general');
      setSidebarOpen(false);
      setApiError(null);
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // Send message to AI Study Assistant
  const handleSendMessage = async (params: {
    message: string;
    subject: SubjectId;
    mode: StudyModeId;
    imageData?: string;
    imageMimeType?: string;
  }) => {
    if (!currentUser) return;
    setApiError(null);

    let session = activeSession;
    if (!session) {
      const newSession: ChatSession = {
        id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: params.message.slice(0, 32) || `${params.subject} Question`,
        subject: params.subject,
        mode: params.mode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      session = newSession;
    }

    // Generate nice title if first message
    const isFirstMessage = session.messages.length === 0;
    const sessionTitle = isFirstMessage
      ? params.message.slice(0, 36) || `${params.subject} Question`
      : session.title;

    const userMessage: ChatMessage = {
      id: `usr_msg_${Date.now()}`,
      role: 'user',
      content: params.message,
      timestamp: new Date().toISOString(),
      subject: params.subject,
      mode: params.mode,
      imageUrl: params.imageData,
    };

    // Optimistically update UI
    const updatedMessages = [...session.messages, userMessage];
    const interimSession: ChatSession = {
      ...session,
      title: sessionTitle,
      subject: params.subject,
      mode: params.mode,
      updatedAt: new Date().toISOString(),
      messages: updatedMessages,
    };

    const intermediateChats = saveOrUpdateChat(currentUser.id, interimSession);
    setSessions(intermediateChats);
    setActiveSessionId(interimSession.id);
    setIsLoading(true);

    try {
      // Format recent chat history for context
      const historyContext = updatedMessages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const aiResult = await askAIStudyAssistant({
        message: params.message,
        history: historyContext,
        subject: params.subject,
        mode: params.mode,
        imageData: params.imageData,
        imageMimeType: params.imageMimeType,
      });

      const assistantMessage: ChatMessage = {
        id: `ai_msg_${Date.now()}`,
        role: 'assistant',
        content: aiResult.reply,
        timestamp: new Date().toISOString(),
        subject: params.subject,
        mode: params.mode,
      };

      const finalSession: ChatSession = {
        ...interimSession,
        updatedAt: new Date().toISOString(),
        messages: [...updatedMessages, assistantMessage],
      };

      const finalChats = saveOrUpdateChat(currentUser.id, finalSession);
      setSessions(finalChats);

      // Record study stats
      recordStudyActivity(1, 4);
    } catch (err: any) {
      console.error('Error during chat request:', err);
      setApiError(err?.message || 'Could not complete study assistance request.');

      // Append error message from assistant
      const errorMsg: ChatMessage = {
        id: `err_msg_${Date.now()}`,
        role: 'assistant',
        content: `I encountered an issue processing your question: **${
          err?.message || 'Network or service timeout'
        }**. Please ensure your query is clear, or retry in a moment.`,
        timestamp: new Date().toISOString(),
        subject: params.subject,
        mode: params.mode,
      };

      const errorSession: ChatSession = {
        ...interimSession,
        messages: [...updatedMessages, errorMsg],
      };
      const finalChats = saveOrUpdateChat(currentUser.id, errorSession);
      setSessions(finalChats);
    } finally {
      setIsLoading(false);
    }
  };

  // Dedicated Doubt Solver action handler
  const handleSolveDoubtFromModal = (params: {
    question: string;
    subject: SubjectId;
    imageData?: string;
    imageMimeType?: string;
  }) => {
    if (!currentUser) return;

    // Create fresh doubt solver session
    const newSession: ChatSession = {
      id: `doubt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: params.question.slice(0, 36) || `Doubt: ${params.subject}`,
      subject: params.subject,
      mode: 'doubt_solver',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    saveOrUpdateChat(currentUser.id, newSession);
    setActiveSessionId(newSession.id);
    setActiveSubject(params.subject);
    setActiveMode('doubt_solver');

    handleSendMessage({
      message: params.question,
      subject: params.subject,
      mode: 'doubt_solver',
      imageData: params.imageData,
      imageMimeType: params.imageMimeType,
    });
  };

  // Practice Quiz launcher from chat message
  const handlePracticeTopic = (topic: string, subject: SubjectId) => {
    setQuizTopic(topic || 'Core Principles');
    setQuizSubject(subject || activeSubject);
    setQuizModalOpen(true);
  };

  // Explain Simpler (ELI5) follow up
  const handleExplainSimpler = (content: string) => {
    handleSendMessage({
      message: `Can you explain the previous explanation in even simpler terms with a vivid everyday analogy (ELI5)?`,
      subject: activeSubject,
      mode: 'concept_simplifier',
    });
  };

  // If user is not authenticated, render Welcome Screen
  if (!currentUser) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <WelcomeScreen
          onGetStarted={() => {
            setAuthInitialMode('signup');
            setAuthModalOpen(true);
          }}
          onLogin={() => {
            setAuthInitialMode('login');
            setAuthModalOpen(true);
          }}
          onTryDemo={() => {
            setAuthInitialMode('login');
            setAuthModalOpen(true);
          }}
        />

        <AuthModal
          isOpen={authModalOpen}
          initialMode={authInitialMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex transition-colors duration-200`}>
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={currentUser}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={(s, m) => createNewChat(s || activeSubject, m || activeMode)}
        onDeleteSession={handleDeleteSession}
        onOpenDoubtModal={() => setDoubtModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
        selectedSubject={activeSubject}
        onSelectSubject={(s) => {
          setActiveSubject(s);
          if (activeSession && activeSession.messages.length === 0) {
            const updated = { ...activeSession, subject: s };
            saveOrUpdateChat(currentUser.id, updated);
            setSessions(getUserChats(currentUser.id));
          }
        }}
        selectedMode={activeMode}
        onSelectMode={(m) => {
          setActiveMode(m);
          if (activeSession && activeSession.messages.length === 0) {
            const updated = { ...activeSession, mode: m };
            saveOrUpdateChat(currentUser.id, updated);
            setSessions(getUserChats(currentUser.id));
          }
        }}
      />

      {/* Main Study Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 sm:lg:pl-80 min-h-screen">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeTitle={activeSession?.title || `New ${activeSubject} Chat`}
          activeSubject={activeSubject}
          activeMode={activeMode}
          user={currentUser}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenDoubtModal={() => setDoubtModalOpen(true)}
          onNewChat={() => createNewChat(activeSubject, activeMode)}
          onOpenProfile={() => setProfileModalOpen(true)}
          onClearCurrentChat={handleClearCurrentChat}
        />

        {/* Chat / Content Viewport */}
        <main className="flex-1 flex flex-col overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto w-full">
          {/* Welcome Prompt / Blank state for fresh session */}
          {(!activeSession || activeSession.messages.length === 0) && (
            <div className="my-auto py-8 text-center max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/25 text-white">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
                    {activeSubject}
                  </span>{' '}
                  me koi bhi sawal poochhein!
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Hindi, Hinglish ya English me poochhein — bilkul <strong>aasan bhasha (simple language)</strong> aur real-life examples ke saath step-by-step samjhaya jayega.
                </p>
              </div>

              {/* Subject Quick Starters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {SUBJECTS.find((s) => s.id === activeSubject)?.sampleQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      handleSendMessage({
                        message: q,
                        subject: activeSubject,
                        mode: activeMode,
                      })
                    }
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm hover:shadow-md transition-all text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer flex items-center justify-between gap-2 group"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>

              {/* Solve Doubt Banner in Empty State */}
              <div className="pt-2">
                <button
                  onClick={() => setDoubtModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Have a tricky homework doubt or photo? Solve it step-by-step</span>
                </button>
              </div>
            </div>
          )}

          {/* Messages Stream */}
          {activeSession && activeSession.messages.length > 0 && (
            <div className="space-y-4 pb-4">
              {activeSession.messages.map((msg) => (
                <ChatMessageItem
                  key={msg.id}
                  message={msg}
                  onPracticeTopic={(topic, subj) => handlePracticeTopic(topic, subj)}
                  onExplainSimpler={() =>
                    handleSendMessage({
                      message: 'Isko aur bhi saral aur aasan bhasha me ek simple everyday example ke saath samjhao:',
                      subject: activeSubject,
                      mode: 'concept_simplifier',
                    })
                  }
                  onExplainInHindi={() =>
                    handleSendMessage({
                      message: 'Isko aasan Hindi / Hinglish bhasha me samjhao:',
                      subject: activeSubject,
                      mode: 'concept_simplifier',
                    })
                  }
                  onShowSteps={() =>
                    handleSendMessage({
                      message: 'Isko detail me step-by-step hal (working steps) ke saath solve karke dikhao:',
                      subject: activeSubject,
                      mode: 'doubt_solver',
                    })
                  }
                />
              ))}

              {/* Loading AI Pulse indicator */}
              {isLoading && (
                <div className="flex items-center gap-3 text-xs text-indigo-500 dark:text-indigo-400 py-3">
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md animate-pulse">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span>AI Teacher is deconstructing the answer</span>
                    <span className="flex gap-1 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Fixed Bottom Input Area */}
        <footer className="sticky bottom-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent dark:from-slate-950 dark:via-slate-950 dark:to-transparent pt-3 z-20">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            activeSubject={activeSubject}
            onChangeSubject={(s) => setActiveSubject(s)}
            activeMode={activeMode}
            onChangeMode={(m) => setActiveMode(m)}
          />
        </footer>
      </div>

      {/* Modals */}
      <DoubtSolverModal
        isOpen={doubtModalOpen}
        onClose={() => setDoubtModalOpen(false)}
        onSubmitDoubt={handleSolveDoubtFromModal}
        defaultSubject={activeSubject}
      />

      <QuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        topic={quizTopic}
        subject={quizSubject}
        gradeLevel={currentUser.gradeLevel}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={currentUser}
        onUpdateUser={(updated) => setCurrentUserState(updated)}
        onLogout={handleLogout}
      />
    </div>
  );
}
