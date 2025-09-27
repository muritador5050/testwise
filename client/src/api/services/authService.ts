import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AuthResponse, User } from '../../types/api';
import { apiClient, getAuthToken } from '../apiClient';

export const useRegisterUser = () => {
  return useMutation<
    User,
    Error,
    { email: string; name: string; role: string }
  >({
    mutationFn: async (userData) => {
      return apiClient('users/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
  });
};

// Login user
export const useLoginUser = () => {
  return useMutation<AuthResponse, Error, { email: string; password: string }>({
    mutationFn: async (credentials) => {
      return apiClient('users/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },
  });
};

// Get all users (Admin only)
export const useGetAllUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      return apiClient('users', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
  });
};

// Get user by ID
export const useGetUserById = (id: number) => {
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: async () => {
      return apiClient(`users/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
    enabled: !!id,
  });
};

// Update user (Admin only)
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: number; userData: Partial<User> }>({
    mutationFn: async ({ id, userData }) => {
      return apiClient(`users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(userData),
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
};

// Delete user (Admin only)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      return apiClient(`users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
