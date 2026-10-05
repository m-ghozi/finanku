/**
 * Centralized API Client
 * Seamlessly toggles between Mock In-Memory API and Real Backend API
 */

export const USE_MOCK_API = (() => {
  // Vite env vars
  const viteMock = import.meta.env.VITE_USE_MOCK_API;
  const nextMock = (import.meta.env as Record<string, string | undefined>).NEXT_PUBLIC_USE_MOCK_API;

  if (viteMock !== undefined) return String(viteMock) === 'true';
  if (nextMock !== undefined) return String(nextMock) === 'true';
  return true; // Default to mock mode for full standalone preview
})();

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env as Record<string, string | undefined>).NEXT_PUBLIC_API_URL ||
  'http://localhost:3001/api/v1';

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

/**
 * Standard HTTP Fetcher for real backend mode
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
      let errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi.';
      let details;
      try {
        const errorJson = await res.json();
        errorMessage = errorJson.message || errorMessage;
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
