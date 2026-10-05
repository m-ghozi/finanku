import { apiClient } from './client';
import { Account, CreateAccountDTO, UpdateAccountDTO } from '@/src/types/account';

export const accountsService = {
  async getAccounts(includeArchived: boolean = false): Promise<Account[]> {
    const res = await apiClient<{ data: Account[] }>(
      `/accounts?includeArchived=${includeArchived}`
    );
    return res.data;
  },

  async getAccountById(id: string): Promise<Account | null> {
    const res = await apiClient<{ data: Account }>(`/accounts/${id}`);
    return res.data;
  },

  async createAccount(dto: CreateAccountDTO): Promise<Account> {
    const res = await apiClient<{ data: Account }>('/accounts', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async updateAccount(id: string, dto: UpdateAccountDTO): Promise<Account> {
    const res = await apiClient<{ data: Account }>(`/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async deleteAccount(id: string): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`/accounts/${id}`, {
      method: 'DELETE',
    });
  },
};
