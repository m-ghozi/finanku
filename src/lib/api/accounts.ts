import { USE_MOCK_API, apiClient } from './client';
import { mockAccountsApi } from '@/src/mocks/accounts';
import { Account, CreateAccountDTO, UpdateAccountDTO } from '@/src/types/account';

export const accountsService = {
  async getAccounts(includeArchived: boolean = false): Promise<Account[]> {
    if (USE_MOCK_API) {
      return mockAccountsApi.getAccounts(includeArchived);
    }
    const res = await apiClient<{ data: Account[] }>(
      `/accounts?includeArchived=${includeArchived}`
    );
    return res.data;
  },

  async getAccountById(id: string): Promise<Account | null> {
    if (USE_MOCK_API) {
      return mockAccountsApi.getAccountById(id);
    }
    const res = await apiClient<{ data: Account }>(`/accounts/${id}`);
    return res.data;
  },

  async createAccount(dto: CreateAccountDTO): Promise<Account> {
    if (USE_MOCK_API) {
      return mockAccountsApi.createAccount(dto);
    }
    const res = await apiClient<{ data: Account }>('/accounts', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async updateAccount(id: string, dto: UpdateAccountDTO): Promise<Account> {
    if (USE_MOCK_API) {
      return mockAccountsApi.updateAccount(id, dto);
    }
    const res = await apiClient<{ data: Account }>(`/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async deleteAccount(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK_API) {
      return mockAccountsApi.deleteAccount(id);
    }
    return apiClient<{ success: boolean }>(`/accounts/${id}`, {
      method: 'DELETE',
    });
  },
};
