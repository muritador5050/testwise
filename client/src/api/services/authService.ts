import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AuthResponse, User, UsersResponse } from '../../types/api';
import {
  apiClient,
  clearToken,
  getAuthToken,
  getCurrentUser,
  isAuthenticated,
} from '../apiClient';
import { uploadToCloudinary } from '../../utils/cloudinaryService';
import { useNavigate } from 'react-router-dom';

// Register user
export const useRegisterUser = () => {
  return useMutation<
    User,
    Error,
    { email: string; name: string; avatar: File; role: string }
  >({
    mutationFn: async (userData) => {
      let avatarUrl = '';

      if (userData.avatar) {
        avatarUrl = await uploadToCloudinary(userData.avatar);
      }

      return apiClient('users/signup', {
        method: 'POST',
        body: JSON.stringify({
          ...userData,
          avatar: avatarUrl,
        }),
      });
    },
  });
};

// Login user
export const useLoginUser = () => {
  return useMutation<AuthResponse, Error, { email: string }>({
    mutationFn: async (credentials) => {
      return apiClient('users/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },
  });
};

// Logout user
export const useLogoutUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      clearToken();
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      // Navigate to home
      navigate('/', { replace: true });
    },
  });
};

export const useCurrentUser = () => {
  return useQuery<User>({
    queryKey: ['current-user'],
    queryFn: async () => {
      const user = getCurrentUser();
      if (!user) throw new Error('Not authenticated');
      return apiClient(`users/${user.id}`);
    },
    enabled: isAuthenticated(),
  });
};

// Get all users (Admin only)
export const useGetAllUsers = ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}) => {
  return useQuery<UsersResponse>({
    queryKey: ['users', page, limit],
    queryFn: async () => {
      return apiClient(`users/?page=${page}&limit=${limit}`, {
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

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    User,
    Error,
    {
      id: number;
      userData: { email?: string; name?: string; avatar?: File; role?: string };
    }
  >({
    mutationFn: async ({ id, userData }) => {
      const updateData: {
        email?: string;
        name?: string;
        avatar?: string;
        role?: string;
      } = {
        email: userData.email,
        name: userData.name,
        role: userData.role,
      };

      if (userData.avatar) {
        const avatarUrl = await uploadToCloudinary(userData.avatar);
        updateData.avatar = avatarUrl;
      }

      return apiClient(`users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(updateData),
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
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
