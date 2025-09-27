// queries/attemptQueries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, getAuthToken } from '../apiClient';
import type { Attempt, Answer } from '../../types/api';

// Get user attempts
export const useGetUserAttempts = (testId?: number) => {
  return useQuery<Attempt[]>({
    queryKey: ['user-attempts', testId],
    queryFn: async () => {
      const params = testId ? `?testId=${testId}` : '';
      return apiClient(`attempts/user${params}`, {
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
  return useQuery<
    Attempt & {
      test: {
        id: number;
        title: string;
        questions: Array<{
          id: number;
          text: string;
          questionType: string;
          points: number;
          order: number;
          options: Array<{
            id: number;
            text: string;
            isCorrect: boolean;
            order: number;
          }>;
        }>;
      };
      answers: Answer[];
      user: { id: number; name: string; email: string };
    }
  >({
    queryKey: ['attempt', id],
    queryFn: async () => {
      return apiClient(`attempts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
    enabled: !!id,
  });
};

// Submit answer
export const useSubmitAnswer = () => {
  const queryClient = useQueryClient();

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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['attempt', variables.attemptId],
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
    onSuccess: (data, attemptId) => {
      queryClient.invalidateQueries({ queryKey: ['user-attempts'] });
      queryClient.invalidateQueries({ queryKey: ['attempt', attemptId] });
    },
  });
};
