export type Role = 'STUDENT' | 'ADMIN' | 'INSTRUCTOR';
export type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'MULTIPLE_ANSWER'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'ESSAY';
export type AttemptStatus = 'IN_PROGRESS' | 'COMPLETED' | 'TIMED_OUT';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
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

export interface CreateOption {
  text: string;
  isCorrect: boolean;
  order: number;
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

export interface CreateQuestion {
  text: string;
  questionType: QuestionType;
  points: number;
  order: number;
  options: CreateOption[];
}

export interface CreateTest {
  title: string;
  description: string;
  duration: number;
  maxAttempts: number;
  isPublished: boolean;
  availableFrom: string | null;
  availableUntil: string | null;
}

// export interface Test {
//   id: number;
//   title: string;
//   description: string;
//   duration: number;
//   maxAttempts: number;
//   isPublished: boolean;
//   availableFrom?: string | null;
//   availableUntil?: string | null;
//   createdAt: string;
//   updatedAt: string;
//   _count?: {
//     questions: number;
//     attempts: number;
//   };
// }

export interface Test {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  maxAttempts: number;
  isPublished: boolean;
  availableFrom?: string | null;
  availableUntil?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    questions?: number;
    attempts: number;
  };
  questions?: Question[];
  attempts?: Attempt[];
}

export interface TestResponse {
  tests: Test[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

export interface UserAnalytics {
  total: number;
  instructors: number;
  students: number;
  admins: number;
}

export interface RecentActivity {
  testTitle: string;
  status: AttemptStatus;
  score: number;
  startedAt: string;
}

export interface UserActivityStats {
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  inProgressAttempts: number;
  recentActivity: RecentActivity[];
}
