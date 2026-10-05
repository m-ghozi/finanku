import { apiClient } from './client';
import {
  RecurringTransaction,
  CreateRecurringDTO,
  UpdateRecurringDTO,
} from '@/src/types/recurring';

export const recurringService = {
  async getRecurring(): Promise<RecurringTransaction[]> {
    const res = await apiClient<{ data: RecurringTransaction[] }>('/recurring');
    return res.data;
  },

  async createRecurring(dto: CreateRecurringDTO): Promise<RecurringTransaction> {
    const res = await apiClient<{ data: RecurringTransaction }>('/recurring', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async updateRecurring(id: string, dto: UpdateRecurringDTO): Promise<RecurringTransaction> {
    const res = await apiClient<{ data: RecurringTransaction }>(`/recurring/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async deleteRecurring(id: string): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`/recurring/${id}`, {
      method: 'DELETE',
    });
  },
};
