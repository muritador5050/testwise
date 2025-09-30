import type { Role, User } from '../types/api';

const apiUrl = import.meta.env.VITE_API_URL;

export const getAuthToken = () => localStorage.getItem('authToken');

export const setToken = (token: string) =>
  localStorage.setItem('authToken', token);

export const clearToken = () => localStorage.removeItem('authToken');

export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${apiUrl}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `API error: ${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
      } catch {
        // Ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }

    if (
      response.status === 204 ||
      response.headers.get('Content-Length') === '0'
    ) {
      return {};
    }

    return response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }

    // Handle authentication errors
    if (
      error.message.includes('401') ||
      error.message.includes('Unauthorized')
    ) {
      clearToken();
      window.location.href = '/users/login';
    }

    throw error;
  }
}

// Get current user from token or API
export const getCurrentUser = (): User | null => {
  const token = getAuthToken();
  if (!token || !isAuthenticated()) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
};

// Navigate based on user role
export const navigateByRole = (role: Role): string => {
  const routes: Record<Role, string> = {
    ADMIN: '/admin',
    INSTRUCTOR: '/instructor',
    STUDENT: '/student',
  };
  return routes[role] || '/';
};
