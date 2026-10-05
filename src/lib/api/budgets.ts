import { USE_MOCK_API, apiClient } from './client';
import { mockBudgetsApi } from '@/src/mocks/budgets';
import { Budget, CreateBudgetDTO, UpdateBudgetDTO } from '@/src/types/budget';

export const budgetsService = {
  async getBudgets(period?: string): Promise<Budget[]> {
    if (USE_MOCK_API) {
      return mockBudgetsApi.getBudgets(period);
    }
    const query = period ? `?period=${period}` : '';
    const res = await apiClient<{ data: Budget[] }>(`/budgets${query}`);
    return res.data;
  },

  async createBudget(dto: CreateBudgetDTO): Promise<Budget> {
    if (USE_MOCK_API) {
      return mockBudgetsApi.createBudget(dto);
    }
    const res = await apiClient<{ data: Budget }>('/budgets', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async updateBudget(id: string, dto: UpdateBudgetDTO): Promise<Budget> {
    if (USE_MOCK_API) {
      return mockBudgetsApi.updateBudget(id, dto);
    }
    const res = await apiClient<{ data: Budget }>(`/budgets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async deleteBudget(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK_API) {
      return mockBudgetsApi.deleteBudget(id);
    }
    return apiClient<{ success: boolean }>(`/budgets/${id}`, {
      method: 'DELETE',
    });
  },
};
