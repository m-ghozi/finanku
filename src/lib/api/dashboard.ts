import { USE_MOCK_API, apiClient } from './client';
import { mockDashboardApi } from '@/src/mocks/dashboard';
import { DashboardData } from '@/src/types/dashboard';

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    if (USE_MOCK_API) {
      return mockDashboardApi.getDashboardData();
    }
    const res = await apiClient<{ data: DashboardData }>('/dashboard');
    return res.data;
  },
};
