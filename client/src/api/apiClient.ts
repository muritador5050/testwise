const apiUrl = import.meta.env.VITE_API_URL;

export const getAuthToken = () => localStorage.getItem('authToken');
export const setToken = (token: string) =>
  localStorage.setItem('authToken', token);
export const clearToken = () => localStorage.removeItem('authToken');

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const response = await fetch(`${apiUrl}/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    let errorMessage = `API error: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } catch {
      // Ignore JSON parsing error if response body is empty or not JSON
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
}
