import { USE_MOCK_API, apiClient } from './client';
import { mockReportsApi } from '@/src/mocks/reports';
import { ReportsSummary, ReportFilter } from '@/src/types/report';

export const reportsService = {
  async getReportsSummary(filter: ReportFilter): Promise<ReportsSummary> {
    if (USE_MOCK_API) {
      return mockReportsApi.getReportsSummary(filter);
    }
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
