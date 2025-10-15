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

export interface Attempt {
  id: number;
  score: number;
  maxScore: number | null;
  percentScore: number | null;
  status: AttemptStatus;
  startedAt: string;
  expiresAt?: string;
  completedAt: string | null;
  timeSpent: number | null;
  attemptNumber: number;
  ipAddress: string | null;
  userId: number;
  testId: number;
  test: Test;
  answers: Answer[];
  user: User;
}

export interface TestAttempt {
  id: number;
  score: number;
  maxScore: number | null;
  percentScore: number | null;
  status: string;
  startedAt: string;
  expiresAt: string | null;
  completedAt: string | null;
  timeSpent: number | null;
  attemptNumber: number;
  ipAddress: string;
  userId: number;
  testId: number;
  user: User;
  test: Test;
}

export interface AttemptAnalytics {
  totalAttempts: number;
  completedAttempts: number;
  inProgressAttempts: number;
  timedOutAttempts: number;
  averageScore: number;
  averageTimeSpent: number;
  passRate: number;
}

export interface TestStatistics {
  testId: number;
  title: string;
  totalAttempts: number;
  totalQuestions: number;
  totalPoints: number;
  averageScore: number;
  averageTimeSpent: number;
  highestScore: number;
  lowestScore: number;
}

export interface TestPerformance {
  userId: number;
  userName: string;
  email: string;
  attemptNumber: number;
  score: number;
  percentScore: number | null;
  timeSpent: number | null;
  completedAt: string | null;
}

export interface QuestionPerformance {
  questionId: number;
  text: string;
  questionType: string;
  totalAttempts: number;
  correctCount: number;
  accuracyRate: number;
  averagePointsEarned: number;
  maxPoints: number;
}

export interface UserPerformanceHistory {
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  attempts: Array<{
    testTitle: string;
    score: number;
    percentScore: number | null;
    timeSpent: number | null;
    completedAt: string | null;
  }>;
}

export interface ScoreDistribution {
  range: string;
  count: number;
}

export type LiveAttemptResponse = {
  attemptId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  test: {
    id: number;
    title: string;
    duration: number;
  };
  startedAt: string; // ISO date string
  expiresAt: string; // ISO date string
  answeredQuestions: number;
  correctAnswers: number;
};

// For WebSocket events
export interface StudentStartedEvent {
  attemptId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  test: {
    id: number;
    title: string;
    duration: number;
  };
  startedAt: string;
}

export interface StudentAnsweredEvent {
  attemptId: number;
  questionId: number;
  answeredQuestions: number;
}

export interface StudentCompletedEvent {
  attemptId: number;
  percentScore: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface StudentTimeoutEvent {
  attemptId: number;
  percentScore: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface ActivityFeedItem {
  type: 'started' | 'completed' | 'answered' | 'timed_out';
  message: string;
  timestamp: Date;
}
