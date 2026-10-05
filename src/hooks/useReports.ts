import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/src/lib/api/reports';
import { ReportFilter } from '@/src/types/report';

export const REPORTS_KEY = ['reports'];

export function useReports(filter: ReportFilter) {
  return useQuery({
    queryKey: [...REPORTS_KEY, filter],
    queryFn: () => reportsService.getReportsSummary(filter),
  });
}
