import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, getAuthToken } from '../apiClient';
import type {
  CreateTest,
  Test,
  TestResponse,
  TestStatistics,
} from '../../types/api';

export const useCreateTest = () => {
  const queryClient = useQueryClient();

  return useMutation<Test, Error, CreateTest>({
    mutationFn: async (testData) => {
      return apiClient('tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(testData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
};

// Get all tests
export const useGetAllTests = () => {
  return useQuery<TestResponse>({
    queryKey: ['tests'],
    queryFn: async () => {
      return apiClient('tests');
    },
  });
};

export const useGetTestById = (id: number) => {
  return useQuery<Test>({
    queryKey: ['test', id],
    queryFn: async () => {
      return apiClient(`tests/${id}`);
    },
    enabled: !!id,
  });
};

// Check test availability
export const useCheckTestAvailability = (id: number) => {
  return useQuery<{ available: boolean; reason?: string }>({
    queryKey: ['test-availability', id],
    queryFn: async () => {
      return apiClient(`tests/${id}/availability`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
    enabled: !!id,
  });
};

// Update test (Admin/Instructor only)
export const useUpdateTest = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Test,
    Error,
    { id: number; testData: Partial<CreateTest> }
  >({
    mutationFn: async ({ id, testData }) => {
      return apiClient(`tests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(testData),
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      queryClient.invalidateQueries({ queryKey: ['test', variables.id] });
    },
  });
};

// Publish test (Admin/Instructor only)
export const usePublishTest = () => {
  const queryClient = useQueryClient();

  return useMutation<Test, Error, number>({
    mutationFn: async (id) => {
      return apiClient(`tests/${id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      queryClient.invalidateQueries({ queryKey: ['test', id] });
    },
  });
};

// Delete test (Admin/Instructor only)
export const useDeleteTest = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      return apiClient(`tests/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
};

export const useTestsStats = () => {
  return useQuery<TestStatistics[]>({
    queryKey: ['testsAnalytics'],
    queryFn: async () => {
      return apiClient(`tests/statistics`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
  });
};
