import { apiClient } from './client';
import {
  Debt,
  CreateDebtDTO,
  UpdateDebtDTO,
  RecordDebtPaymentDTO,
  DebtType,
  DebtStatus,
} from '@/src/types/debt';

export const debtsService = {
  async getDebts(type?: DebtType, status?: DebtStatus): Promise<Debt[]> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient<{ data: Debt[] }>(`/debts${query}`);
    return res.data;
  },

  async createDebt(dto: CreateDebtDTO): Promise<Debt> {
    const res = await apiClient<{ data: Debt }>('/debts', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async recordPayment(id: string, dto: RecordDebtPaymentDTO): Promise<Debt> {
    const res = await apiClient<{ data: Debt }>(`/debts/${id}/payments`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async updateDebt(id: string, dto: UpdateDebtDTO): Promise<Debt> {
    const res = await apiClient<{ data: Debt }>(`/debts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async deleteDebt(id: string): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`/debts/${id}`, {
      method: 'DELETE',
    });
  },
};
