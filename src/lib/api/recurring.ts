import { USE_MOCK_API, apiClient } from './client';
import { mockRecurringApi } from '@/src/mocks/recurring';
import {
  RecurringTransaction,
  CreateRecurringDTO,
  UpdateRecurringDTO,
} from '@/src/types/recurring';

export const recurringService = {
  async getRecurring(): Promise<RecurringTransaction[]> {
    if (USE_MOCK_API) {
      return mockRecurringApi.getRecurring();
    }
    const res = await apiClient<{ data: RecurringTransaction[] }>('/recurring');
    return res.data;
  },

  async createRecurring(dto: CreateRecurringDTO): Promise<RecurringTransaction> {
    if (USE_MOCK_API) {
      return mockRecurringApi.createRecurring(dto);
    }
    const res = await apiClient<{ data: RecurringTransaction }>('/recurring', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async updateRecurring(id: string, dto: UpdateRecurringDTO): Promise<RecurringTransaction> {
    if (USE_MOCK_API) {
      return mockRecurringApi.updateRecurring(id, dto);
    }
    const res = await apiClient<{ data: RecurringTransaction }>(`/recurring/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async deleteRecurring(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK_API) {
      return mockRecurringApi.deleteRecurring(id);
    }
    return apiClient<{ success: boolean }>(`/recurring/${id}`, {
      method: 'DELETE',
    });
  },
};
