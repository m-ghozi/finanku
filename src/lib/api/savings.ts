import { USE_MOCK_API, apiClient } from './client';
import { mockSavingsApi } from '@/src/mocks/savings';
import {
  SavingGoal,
  CreateSavingGoalDTO,
  UpdateSavingGoalDTO,
  AddSavingContributionDTO,
} from '@/src/types/saving';

export const savingsService = {
  async getSavings(includeArchived: boolean = false): Promise<SavingGoal[]> {
    if (USE_MOCK_API) {
      return mockSavingsApi.getSavings(includeArchived);
    }
    const res = await apiClient<{ data: SavingGoal[] }>(
      `/savings?includeArchived=${includeArchived}`
    );
    return res.data;
  },

  async getSavingById(id: string): Promise<SavingGoal | null> {
    if (USE_MOCK_API) {
      return mockSavingsApi.getSavingById(id);
    }
    const res = await apiClient<{ data: SavingGoal }>(`/savings/${id}`);
    return res.data;
  },

  async createSaving(dto: CreateSavingGoalDTO): Promise<SavingGoal> {
    if (USE_MOCK_API) {
      return mockSavingsApi.createSaving(dto);
    }
    const res = await apiClient<{ data: SavingGoal }>('/savings', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async updateSaving(id: string, dto: UpdateSavingGoalDTO): Promise<SavingGoal> {
    if (USE_MOCK_API) {
      return mockSavingsApi.updateSaving(id, dto);
    }
    const res = await apiClient<{ data: SavingGoal }>(`/savings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async addContribution(id: string, dto: AddSavingContributionDTO): Promise<SavingGoal> {
    if (USE_MOCK_API) {
      return mockSavingsApi.addContribution(id, dto);
    }
    const res = await apiClient<{ data: SavingGoal }>(`/savings/${id}/contributions`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async deleteSaving(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK_API) {
      return mockSavingsApi.deleteSaving(id);
    }
    return apiClient<{ success: boolean }>(`/savings/${id}`, {
      method: 'DELETE',
    });
  },
};
