import { apiClient } from './client';
import { DashboardData } from '@/src/types/dashboard';

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const res = await apiClient<{ data: DashboardData }>('/dashboard');
    return res.data;
  },
};
