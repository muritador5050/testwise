import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, getAuthToken } from '../apiClient';
import type { Question, CreateQuestion } from '../../types/api';

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Question,
    Error,
    { testId: number; questionData: CreateQuestion }
  >({
    mutationFn: async ({ testId, questionData }) => {
      return apiClient(`questions/${testId}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(questionData),
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.testId],
      });
    },
  });
};

// Get all questions for a specific test
export const useGetQuestionsByTest = (testId: number) => {
  return useQuery<Question[]>({
    queryKey: ['questions', testId],
    queryFn: async () => {
      return apiClient(`questions/${testId}/test`);
    },
    enabled: !!testId,
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Question,
    Error,
    { id: number; questionData: Partial<CreateQuestion>; testId: number }
  >({
    mutationFn: async ({ id, questionData }) => {
      return apiClient(`questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(questionData),
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.testId],
      });
      queryClient.invalidateQueries({ queryKey: ['question', variables.id] });
    },
  });
};

// Delete question (Admin/Instructor only)
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; testId: number }>({
    mutationFn: async ({ id }) => {
      return apiClient(`questions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.testId],
      });
    },
  });
};
