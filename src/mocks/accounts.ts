import { mockStore } from './storage';
import { Account, CreateAccountDTO, UpdateAccountDTO } from '@/src/types/account';

export const mockAccountsApi = {
  async getAccounts(includeArchived: boolean = false): Promise<Account[]> {
    await new Promise((r) => setTimeout(r, 200));
    const all = mockStore.getAccounts();
    return includeArchived ? all : all.filter((a) => !a.isArchived);
  },

  async getAccountById(id: string): Promise<Account | null> {
    await new Promise((r) => setTimeout(r, 150));
    const account = mockStore.getAccounts().find((a) => a.id === id);
    return account || null;
  },

  async createAccount(dto: CreateAccountDTO): Promise<Account> {
    await new Promise((r) => setTimeout(r, 300));
    const accounts = mockStore.getAccounts();
    const newAccount: Account = {
      id: `acc_${Date.now()}`,
      name: dto.name,
      type: dto.type,
      bankName: dto.bankName,
      accountNumber: dto.accountNumber,
      openingBalance: dto.openingBalance,
      currentBalance: dto.openingBalance,
      currency: 'IDR',
      color: dto.color || '#059669',
      icon: dto.icon || 'wallet',
      creditLimit: dto.creditLimit,
      billingCycleDay: dto.billingCycleDay,
      dueDateDay: dto.dueDateDay,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStore.setAccounts([newAccount, ...accounts]);
    return newAccount;
  },

  async updateAccount(id: string, dto: UpdateAccountDTO): Promise<Account> {
    await new Promise((r) => setTimeout(r, 250));
    const accounts = mockStore.getAccounts();
    const index = accounts.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Rekening tidak ditemukan');

    const updated: Account = {
      ...accounts[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    accounts[index] = updated;
    mockStore.setAccounts(accounts);
    return updated;
  },

  async deleteAccount(id: string): Promise<{ success: boolean }> {
    await new Promise((r) => setTimeout(r, 200));
    const accounts = mockStore.getAccounts();
    const filtered = accounts.filter((a) => a.id !== id);
    mockStore.setAccounts(filtered);
    return { success: true };
  },
};
