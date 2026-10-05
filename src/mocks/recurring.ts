import { mockStore } from './storage';
import {
  RecurringTransaction,
  CreateRecurringDTO,
  UpdateRecurringDTO,
} from '@/src/types/recurring';

export const mockRecurringApi = {
  async getRecurring(): Promise<RecurringTransaction[]> {
    await new Promise((r) => setTimeout(r, 200));
    return mockStore.getRecurring();
  },

  async createRecurring(dto: CreateRecurringDTO): Promise<RecurringTransaction> {
    await new Promise((r) => setTimeout(r, 250));
    const list = mockStore.getRecurring();
    const accounts = mockStore.getAccounts();
    const categories = mockStore.getCategories();

    const account = accounts.find((a) => a.id === dto.accountId);
    const category = dto.categoryId ? categories.find((c) => c.id === dto.categoryId) : undefined;

    // Calculate initial nextExecutionDate
    const today = new Date();
    let nextDate = new Date();
    if (dto.frequency === 'monthly' && dto.dayOfMonth) {
      if (today.getDate() > dto.dayOfMonth) {
        nextDate.setMonth(today.getMonth() + 1);
      }
      nextDate.setDate(dto.dayOfMonth);
    } else {
      nextDate.setDate(today.getDate() + 7);
    }

    const newRecurring: RecurringTransaction = {
      id: `rec_${Date.now()}`,
      name: dto.name,
      type: dto.type,
      amount: dto.amount,
      frequency: dto.frequency,
      interval: dto.interval,
      dayOfMonth: dto.dayOfMonth,
      dayOfWeek: dto.dayOfWeek,
      startDate: dto.startDate,
      endDate: dto.endDate,
      nextExecutionDate: nextDate.toISOString().slice(0, 10),
      accountId: dto.accountId,
      accountName: account?.name || 'Rekening',
      categoryId: dto.categoryId,
      categoryName: category?.name,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
      notes: dto.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockStore.setRecurring([newRecurring, ...list]);
    return newRecurring;
  },

  async updateRecurring(id: string, dto: UpdateRecurringDTO): Promise<RecurringTransaction> {
    await new Promise((r) => setTimeout(r, 200));
    const list = mockStore.getRecurring();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Data transaksi berulang tidak ditemukan');

    const updated: RecurringTransaction = {
      ...list[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    mockStore.setRecurring(list);
    return updated;
  },

  async deleteRecurring(id: string): Promise<{ success: boolean }> {
    await new Promise((r) => setTimeout(r, 200));
    const list = mockStore.getRecurring();
    const filtered = list.filter((r) => r.id !== id);
    mockStore.setRecurring(filtered);
    return { success: true };
  },
};
