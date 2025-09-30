export type Role = 'STUDENT' | 'ADMIN' | 'INSTRUCTOR';
export type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'ESSAY';
export type AttemptStatus = 'IN_PROGRESS' | 'COMPLETED' | 'TIMED_OUT';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  avatar: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  _count: {
    attempts: number;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersResponse {
  users: User[];
  pagination: Pagination;
}
export interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
  order: number;
  questionId: number;
}
export interface Question {
  id: number;
  text: string;
  questionType: QuestionType;
  points: number;
  order: number;
  testId: number;
  options: Option[];
}
export interface Test {
  id: number;
  title: string;
  description: string;
  duration: number;
  maxAttempts: number;
  isPublished: boolean;
  availableFrom?: string;
  availableUntil?: string;
  questions: Question[];
}
export interface Attempt {
  id: number;
  score: number;
  maxScore: number;
  percentScore?: number;
  status: AttemptStatus;
  startedAt: string;
  completedAt?: string;
  timeSpent?: number;
  attemptNumber: number;
  userId: number;
  testId: number;
}
export interface Answer {
  id: number;
  textAnswer?: string;
  isCorrect: boolean;
  pointsEarned: number;
  attemptId: number;
  questionId: number;
  optionId?: number;
}
export interface AuthResponse {
  user: User;
  token: string;
}
