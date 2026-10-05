import { mockStore } from './storage';
import {
  Debt,
  CreateDebtDTO,
  UpdateDebtDTO,
  RecordDebtPaymentDTO,
  DebtPayment,
  DebtType,
  DebtStatus,
} from '@/src/types/debt';

export const mockDebtsApi = {
  async getDebts(type?: DebtType, status?: DebtStatus): Promise<Debt[]> {
    await new Promise((r) => setTimeout(r, 200));
    let all = mockStore.getDebts();
    if (type) {
      all = all.filter((d) => d.type === type);
    }
    if (status) {
      all = all.filter((d) => d.status === status);
    }
    return all;
  },

  async createDebt(dto: CreateDebtDTO): Promise<Debt> {
    await new Promise((r) => setTimeout(r, 250));
    const debts = mockStore.getDebts();

    const newDebt: Debt = {
      id: `dbt_${Date.now()}`,
      type: dto.type,
      personName: dto.personName,
      totalAmount: dto.totalAmount,
      remainingAmount: dto.totalAmount,
      startDate: dto.startDate || new Date().toISOString().slice(0, 10),
      dueDate: dto.dueDate,
      status: 'active',
      description: dto.description,
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockStore.setDebts([newDebt, ...debts]);
    return newDebt;
  },

  async recordPayment(id: string, dto: RecordDebtPaymentDTO): Promise<Debt> {
    await new Promise((r) => setTimeout(r, 250));
    const debts = mockStore.getDebts();
    const index = debts.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Catatan hutang/piutang tidak ditemukan');

    const debt = debts[index];
    const payment: DebtPayment = {
      id: `pay_${Date.now()}`,
      debtId: id,
      amount: dto.amount,
      date: dto.date,
      notes: dto.notes,
      accountId: dto.accountId,
      createdAt: new Date().toISOString(),
    };

    const remaining = Math.max(0, debt.remainingAmount - dto.amount);
    let status: DebtStatus = debt.status;
    if (remaining === 0) {
      status = 'paid';
    } else {
      status = 'partially_paid';
    }

    const updated: Debt = {
      ...debt,
      remainingAmount: remaining,
      status,
      payments: [...(debt.payments || []), payment],
      updatedAt: new Date().toISOString(),
    };

    debts[index] = updated;
    mockStore.setDebts(debts);

    // Adjust account balance if accountId passed
    if (dto.accountId) {
      const accounts = mockStore.getAccounts();
      const acc = accounts.find((a) => a.id === dto.accountId);
      if (acc) {
        if (debt.type === 'debt') {
          // Bayar hutang -> uang keluar
          acc.currentBalance -= dto.amount;
        } else {
          // Terima piutang -> uang masuk
          acc.currentBalance += dto.amount;
        }
        mockStore.setAccounts([...accounts]);
      }
    }

    return updated;
  },

  async updateDebt(id: string, dto: UpdateDebtDTO): Promise<Debt> {
    await new Promise((r) => setTimeout(r, 200));
    const debts = mockStore.getDebts();
    const index = debts.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Data tidak ditemukan');

    const updated: Debt = {
      ...debts[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    debts[index] = updated;
    mockStore.setDebts(debts);
    return updated;
  },

  async deleteDebt(id: string): Promise<{ success: boolean }> {
    await new Promise((r) => setTimeout(r, 200));
    const debts = mockStore.getDebts();
    const filtered = debts.filter((d) => d.id !== id);
    mockStore.setDebts(filtered);
    return { success: true };
  },
};
