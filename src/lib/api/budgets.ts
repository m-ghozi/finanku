import { apiClient } from './client';
import { Budget, CreateBudgetDTO, UpdateBudgetDTO } from '@/src/types/budget';

export const budgetsService = {
  async getBudgets(period?: string): Promise<Budget[]> {
    const query = period ? `?period=${period}` : '';
    const res = await apiClient<{ data: Budget[] }>(`/budgets${query}`);
    return res.data;
  },

  async createBudget(dto: CreateBudgetDTO): Promise<Budget> {
    const res = await apiClient<{ data: Budget }>('/budgets', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async updateBudget(id: string, dto: UpdateBudgetDTO): Promise<Budget> {
    const res = await apiClient<{ data: Budget }>(`/budgets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async deleteBudget(id: string): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`/budgets/${id}`, {
      method: 'DELETE',
    });
  },
};
