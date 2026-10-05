/**
 * Centralized API Client
 * Talks to the NestJS backend at VITE_API_URL.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('fintrack_token');
  localStorage.removeItem('fintrack_user');
}

/**
 * Standard HTTP fetcher. Adds the Bearer token, unwraps error envelopes, and
 * clears the session + bounces to /login when the token is no longer valid.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('fintrack_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      // Invalid/expired token: drop the session and return to login.
      if (res.status === 401 && typeof window !== 'undefined' && !endpoint.startsWith('/auth/login')) {
        clearSession();
        if (window.location.pathname !== '/login') window.location.href = '/login';
      }
      let errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi.';
      let details;
      try {
        const errorJson = await res.json();
        // Nest's ValidationPipe returns message as a string[]; surface the first.
        errorMessage = Array.isArray(errorJson.message)
          ? errorJson.message[0]
          : errorJson.message || errorMessage;
        details = errorJson.details;
      } catch {
        // use default
      }
      throw new ApiError(errorMessage, res.status, details);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', 0);
  }
}
