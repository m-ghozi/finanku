import { USE_MOCK_API, apiClient } from './client';
import { User, LoginCredentials, AuthResponse } from '@/src/types/auth';

const MOCK_USER: User = {
  id: 'usr_01',
  name: 'Budi Santoso',
  email: 'budi.santoso@fintrack.id',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
  role: 'user',
  createdAt: '2026-01-01T00:00:00Z',
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = USE_MOCK_API
      ? await (async () => {
          await new Promise((r) => setTimeout(r, 400));
          return {
            user: { ...MOCK_USER, email: credentials.email },
            token: 'mock_jwt_token_' + Date.now(),
            expiresIn: 86400,
          } as AuthResponse;
        })()
      : await apiClient<AuthResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
    if (typeof window !== 'undefined') {
      localStorage.setItem('fintrack_token', res.token);
      localStorage.setItem('fintrack_user', JSON.stringify(res.user));
    }
    return res;
  },

  async logout(): Promise<void> {
    if (USE_MOCK_API) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fintrack_token');
        localStorage.removeItem('fintrack_user');
      }
      return;
    }
    await apiClient('/auth/logout', { method: 'POST' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fintrack_token');
      localStorage.removeItem('fintrack_user');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (USE_MOCK_API) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('fintrack_user');
        if (stored) return JSON.parse(stored);
      }
      return MOCK_USER;
    }
    try {
      const res = await apiClient<{ data: User }>('/auth/me');
      return res.data;
    } catch {
      return null;
    }
  },
};
