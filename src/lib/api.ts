// src/lib/api.ts

const API_URL = 'api.zabiya.com';
const TOKEN_KEY = 'zabiya_token';

/**
 * Standardized response handler.
 * Automatically catches 401s, clears invalid sessions, and safely parses errors.
 */

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    // FIX: Only hard-redirect if the 401 did NOT happen on an auth route
    if (!response.url.includes('/auth/')) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/'; 
    }
    // Throw the error so the modal stays open and shows the red text!
    throw new Error(data.error || 'Unauthorized');
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || 'An error occurred during the request.');
  }

  return data as T;
}

/**
 * Core fetch wrapper that automatically attaches the JWT and JSON headers.
 */
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  headers.set('Content-Type', 'application/json');

  const config: RequestInit = {
    ...options,
    headers,
  };

  return fetch(`${API_URL}${endpoint}`, config);
}

// ------------------------------------------------------------------
// 🚀 EXPORTED API METHODS
// ------------------------------------------------------------------

export const api = {
  get: async <T>(endpoint: string) => 
    handleResponse<T>(await fetchWithAuth(endpoint)),
    
  post: async <T>(endpoint: string, body?: any) => 
    handleResponse<T>(await fetchWithAuth(endpoint, { method: 'POST', body: JSON.stringify(body) })),
    
  put: async <T>(endpoint: string, body?: any) => 
    handleResponse<T>(await fetchWithAuth(endpoint, { method: 'PUT', body: JSON.stringify(body) })),
    
  delete: async <T>(endpoint: string) => 
    handleResponse<T>(await fetchWithAuth(endpoint, { method: 'DELETE' })),
};