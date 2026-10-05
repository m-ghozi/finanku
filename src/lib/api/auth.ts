import { apiClient } from './client';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/src/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // /auth/login responds with the standard envelope: { success, data: AuthResponse }
    const res = await apiClient<{ data: AuthResponse }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    persistSession(res.data);
    return res.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const res = await apiClient<{ data: AuthResponse }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    persistSession(res.data);
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch {
      // Token may already be invalid — clearing locally is enough.
    }
    clearSession();
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await apiClient<{ data: User }>('/auth/me');
      if (typeof window !== 'undefined') {
        localStorage.setItem('fintrack_user', JSON.stringify(res.data));
      }
      return res.data;
    } catch {
      return null;
    }
  },

  async updateProfile(dto: { name?: string; email?: string }): Promise<User> {
    const res = await apiClient<{ data: User }>('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('fintrack_user', JSON.stringify(res.data));
    }
    return res.data;
  },
};

function persistSession(res: AuthResponse) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('fintrack_token', res.token);
  localStorage.setItem('fintrack_user', JSON.stringify(res.user));
}

function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('fintrack_token');
  localStorage.removeItem('fintrack_user');
}
