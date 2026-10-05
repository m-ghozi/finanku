import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/src/lib/api/dashboard';

export const DASHBOARD_KEY = ['dashboard'];

export function useDashboard() {
  return useQuery({
    queryKey: DASHBOARD_KEY,
    queryFn: () => dashboardService.getDashboardData(),
  });
}
