import { mockStore } from './storage';
import { Budget, CreateBudgetDTO, UpdateBudgetDTO } from '@/src/types/budget';

export const mockBudgetsApi = {
  async getBudgets(period?: string): Promise<Budget[]> {
    await new Promise((r) => setTimeout(r, 200));
    const all = mockStore.getBudgets();
    if (period) {
      return all.filter((b) => b.period === period);
    }
    return all;
  },

  async createBudget(dto: CreateBudgetDTO): Promise<Budget> {
    await new Promise((r) => setTimeout(r, 250));
    const categories = mockStore.getCategories();
    const category = categories.find((c) => c.id === dto.categoryId);
    const budgets = mockStore.getBudgets();

    const newBudget: Budget = {
      id: `bdg_${Date.now()}`,
      categoryId: dto.categoryId,
      categoryName: category?.name || 'Kategori',
      categoryIcon: category?.icon || 'tag',
      categoryColor: category?.color || '#059669',
      period: dto.period,
      amount: dto.amount,
      spent: 0,
      remaining: dto.amount,
      percentage: 0,
      isRollover: !!dto.isRollover,
      notes: dto.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockStore.setBudgets([newBudget, ...budgets]);
    return newBudget;
  },

  async updateBudget(id: string, dto: UpdateBudgetDTO): Promise<Budget> {
    await new Promise((r) => setTimeout(r, 200));
    const budgets = mockStore.getBudgets();
    const index = budgets.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Anggaran tidak ditemukan');

    const prev = budgets[index];
    const amount = dto.amount !== undefined ? dto.amount : prev.amount;
    const remaining = amount - prev.spent;
    const percentage = amount > 0 ? (prev.spent / amount) * 100 : 0;

    const updated: Budget = {
      ...prev,
      ...dto,
      amount,
      remaining,
      percentage,
      updatedAt: new Date().toISOString(),
    };

    budgets[index] = updated;
    mockStore.setBudgets(budgets);
    return updated;
  },

  async deleteBudget(id: string): Promise<{ success: boolean }> {
    await new Promise((r) => setTimeout(r, 200));
    const budgets = mockStore.getBudgets();
    const filtered = budgets.filter((b) => b.id !== id);
    mockStore.setBudgets(filtered);
    return { success: true };
  },
};
