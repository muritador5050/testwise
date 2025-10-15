import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, getAuthToken } from '../apiClient';
import type {
  Attempt,
  Answer,
  AttemptAnalytics,
  TestPerformance,
  QuestionPerformance,
  UserPerformanceHistory,
  ScoreDistribution,
  LiveAttemptResponse,
  TestAttempt,
} from '../../types/api';

// Get user attempts
export const useGetUserAttempts = (testId?: number) => {
  return useQuery<Attempt[]>({
    queryKey: ['user-attempts', testId],
    queryFn: async () => {
      return apiClient(`attempts/user`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
  });
};

export const useGetAllAttempts = () => {
  return useQuery<TestAttempt[]>({
    queryKey: ['all-attempts'],
    queryFn: async () => {
      return apiClient(`attempts/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
  });
};

// Start attempt
export const useStartAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation<Attempt, Error, number>({
    mutationFn: async (testId) => {
      return apiClient(`attempts/test/${testId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-attempts'] });
      queryClient.setQueryData(['attempt', data.id], data);
    },
  });
};

// Get attempt by ID
export const useGetAttemptById = (id: number) => {
  return useQuery<Attempt>({
    queryKey: ['attempt', id],
    queryFn: async () => {
      return apiClient(`attempts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export const useGetRemainingTime = (attemptId: number) => {
  return useQuery<{ remainingTime: number }>({
    queryKey: ['remaining-time', attemptId],
    queryFn: async () => {
      return apiClient(`attempts/${attemptId}/remaining-time`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
    enabled: !!attemptId,
    refetchInterval: 30000,
  });
};

export const useGetLiveAttempts = () => {
  return useQuery<LiveAttemptResponse[]>({
    queryKey: ['live-attempts'],
    queryFn: async () => {
      return apiClient(`attempts/live`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
    refetchInterval: 5000,
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      attemptId,
      status,
    }: {
      attemptId: number;
      status: 'IN_PROGRESS' | 'COMPLETED' | 'TIMED_OUT';
    }) => {
      return apiClient(`attempts/${attemptId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attempts'] });
    },
  });
};

// Submit answer
export const useSubmitAnswer = () => {
  return useMutation<
    Answer,
    Error,
    {
      attemptId: number;
      questionId: number;
      textAnswer?: string;
      optionId?: number;
    }
  >({
    mutationFn: async ({ attemptId, ...answerData }) => {
      return apiClient(`attempts/${attemptId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(answerData),
      });
    },
  });
};

// Complete attempt
export const useCompleteAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation<Attempt, Error, number>({
    mutationFn: async (attemptId) => {
      return apiClient(`attempts/${attemptId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
    onSuccess: (_data, attemptId) => {
      queryClient.invalidateQueries({ queryKey: ['user-attempts'] });
      queryClient.invalidateQueries({ queryKey: ['attempt', attemptId] });
    },
  });
};

// Get attempt analytics (Admin/Instructor only)
export const useGetAttemptAnalytics = () => {
  return useQuery<AttemptAnalytics>({
    queryKey: ['attempt-analytics'],
    queryFn: async () => {
      return apiClient(`attempts/analytics`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
  });
};

// Get test performance by user (Admin/Instructor only)
export const useGetTestPerformance = (testId: number) => {
  return useQuery<TestPerformance[]>({
    queryKey: ['test-performance', testId],
    queryFn: async () => {
      return apiClient(`attempts/test/${testId}/performance`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
    enabled: !!testId,
  });
};

// Get question analytics for a test (Admin/Instructor only)
export const useGetQuestionAnalytics = (testId: number) => {
  return useQuery<QuestionPerformance[]>({
    queryKey: ['question-analytics', testId],
    queryFn: async () => {
      return apiClient(`attempts/test/${testId}/questions/analytics`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
    enabled: !!testId,
  });
};

// Get user performance history
export const useGetUserPerformance = () => {
  return useQuery<UserPerformanceHistory>({
    queryKey: ['user-performance'],
    queryFn: async () => {
      return apiClient(`attempts/user/performance`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
  });
};

// Get score distribution for a test (Admin/Instructor only)
export const useGetScoreDistribution = (testId: number) => {
  return useQuery<ScoreDistribution[]>({
    queryKey: ['score-distribution', testId],
    queryFn: async () => {
      return apiClient(`attempts/test/${testId}/score-distribution`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
    enabled: !!testId,
  });
};
