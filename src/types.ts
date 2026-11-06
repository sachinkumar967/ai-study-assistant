export type SubjectId =
  | 'Mathematics'
  | 'Science'
  | 'Computer Science'
  | 'Programming'
  | 'English'
  | 'General Knowledge';

export type StudyModeId =
  | 'general'
  | 'doubt_solver'
  | 'concept_simplifier'
  | 'code_tutor'
  | 'quiz_generator';

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  shortDesc: string;
  icon: string;
  gradient: string;
  badgeColor: string;
  sampleQuestions: string[];
}

export interface StudyModeMeta {
  id: StudyModeId;
  name: string;
  tagline: string;
  icon: string;
  badge: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  gradeLevel: string;
  targetGoal: string;
  streakDays: number;
  doubtsSolved: number;
  minutesStudied: number;
  favoriteSubjects: SubjectId[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  subject?: SubjectId;
  mode?: StudyModeId;
  imageUrl?: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  subject: SubjectId;
  mode: StudyModeId;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
}
