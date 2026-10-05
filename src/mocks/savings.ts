import { mockStore } from './storage';
import {
  SavingGoal,
  CreateSavingGoalDTO,
  UpdateSavingGoalDTO,
  AddSavingContributionDTO,
  SavingContribution,
} from '@/src/types/saving';

export const mockSavingsApi = {
  async getSavings(includeArchived: boolean = false): Promise<SavingGoal[]> {
    await new Promise((r) => setTimeout(r, 200));
    const all = mockStore.getSavings();
    return includeArchived ? all : all.filter((s) => !s.isArchived);
  },

  async getSavingById(id: string): Promise<SavingGoal | null> {
    await new Promise((r) => setTimeout(r, 150));
    const goal = mockStore.getSavings().find((s) => s.id === id);
    return goal || null;
  },

  async createSaving(dto: CreateSavingGoalDTO): Promise<SavingGoal> {
    await new Promise((r) => setTimeout(r, 250));
    const list = mockStore.getSavings();
    const newGoal: SavingGoal = {
      id: `svg_${Date.now()}`,
      name: dto.name,
      targetAmount: dto.targetAmount,
      currentAmount: dto.currentAmount || 0,
      targetDate: dto.targetDate,
      category: dto.category || 'Tabungan Pribadi',
      color: dto.color || '#059669',
      icon: dto.icon || 'target',
      notes: dto.notes,
      isArchived: false,
      contributions: dto.currentAmount
        ? [
            {
              id: `cnt_${Date.now()}`,
              savingGoalId: `svg_${Date.now()}`,
              amount: dto.currentAmount,
              date: new Date().toISOString().slice(0, 10),
              notes: 'Saldo awal',
              createdAt: new Date().toISOString(),
            },
          ]
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockStore.setSavings([newGoal, ...list]);
    return newGoal;
  },

  async updateSaving(id: string, dto: UpdateSavingGoalDTO): Promise<SavingGoal> {
    await new Promise((r) => setTimeout(r, 200));
    const list = mockStore.getSavings();
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Target tabungan tidak ditemukan');

    const updated: SavingGoal = {
      ...list[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    mockStore.setSavings(list);
    return updated;
  },

  async addContribution(id: string, dto: AddSavingContributionDTO): Promise<SavingGoal> {
    await new Promise((r) => setTimeout(r, 250));
    const list = mockStore.getSavings();
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Target tabungan tidak ditemukan');

    const goal = list[index];
    const contribution: SavingContribution = {
      id: `cnt_${Date.now()}`,
      savingGoalId: id,
      amount: dto.amount,
      date: dto.date,
      notes: dto.notes,
      accountId: dto.accountId,
      createdAt: new Date().toISOString(),
    };

    const updatedContributions = [...(goal.contributions || []), contribution];
    const updatedCurrentAmount = goal.currentAmount + dto.amount;

    const updatedGoal: SavingGoal = {
      ...goal,
      currentAmount: updatedCurrentAmount,
      contributions: updatedContributions,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedGoal;
    mockStore.setSavings(list);

    // Deduct from account balance if accountId specified
    if (dto.accountId) {
      const accounts = mockStore.getAccounts();
      const acc = accounts.find((a) => a.id === dto.accountId);
      if (acc) {
        acc.currentBalance -= dto.amount;
        mockStore.setAccounts([...accounts]);
      }
    }

    return updatedGoal;
  },

  async deleteSaving(id: string): Promise<{ success: boolean }> {
    await new Promise((r) => setTimeout(r, 200));
    const list = mockStore.getSavings();
    const filtered = list.filter((s) => s.id !== id);
    mockStore.setSavings(filtered);
    return { success: true };
  },
};
