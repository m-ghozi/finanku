import { apiClient } from './client';
import { ReportsSummary, ReportFilter } from '@/src/types/report';

export const reportsService = {
  async getReportsSummary(filter: ReportFilter): Promise<ReportsSummary> {
    const params = new URLSearchParams();
    params.append('period', filter.period);
    if (filter.startDate) params.append('startDate', filter.startDate);
    if (filter.endDate) params.append('endDate', filter.endDate);

    const res = await apiClient<{ data: ReportsSummary }>(
      `/reports/summary?${params.toString()}`
    );
    return res.data;
  },
};
