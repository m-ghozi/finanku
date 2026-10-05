import { apiClient } from './client';
import {
  SavingGoal,
  CreateSavingGoalDTO,
  UpdateSavingGoalDTO,
  AddSavingContributionDTO,
} from '@/src/types/saving';

export const savingsService = {
  async getSavings(includeArchived: boolean = false): Promise<SavingGoal[]> {
    const res = await apiClient<{ data: SavingGoal[] }>(
      `/savings?includeArchived=${includeArchived}`
    );
    return res.data;
  },

  async getSavingById(id: string): Promise<SavingGoal | null> {
    const res = await apiClient<{ data: SavingGoal }>(`/savings/${id}`);
    return res.data;
  },

  async createSaving(dto: CreateSavingGoalDTO): Promise<SavingGoal> {
    const res = await apiClient<{ data: SavingGoal }>('/savings', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async updateSaving(id: string, dto: UpdateSavingGoalDTO): Promise<SavingGoal> {
    const res = await apiClient<{ data: SavingGoal }>(`/savings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async addContribution(id: string, dto: AddSavingContributionDTO): Promise<SavingGoal> {
    const res = await apiClient<{ data: SavingGoal }>(`/savings/${id}/contributions`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async deleteSaving(id: string): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`/savings/${id}`, {
      method: 'DELETE',
    });
  },
};
