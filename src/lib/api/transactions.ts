import { USE_MOCK_API, apiClient } from './client';
import { mockTransactionsApi } from '@/src/mocks/transactions';
import {
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionFilters,
  PaginatedTransactionsResponse,
} from '@/src/types/transaction';

export const transactionsService = {
  async getTransactions(filters: TransactionFilters = {}): Promise<PaginatedTransactionsResponse> {
    if (USE_MOCK_API) {
      return mockTransactionsApi.getTransactions(filters);
    }

    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.accountId) params.append('accountId', filters.accountId);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.minAmount !== undefined) params.append('minAmount', filters.minAmount.toString());
    if (filters.maxAmount !== undefined) params.append('maxAmount', filters.maxAmount.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient<PaginatedTransactionsResponse>(`/transactions${query}`);
  },

  async getTransactionById(id: string): Promise<Transaction | null> {
    if (USE_MOCK_API) {
      return mockTransactionsApi.getTransactionById(id);
    }
    const res = await apiClient<{ data: Transaction }>(`/transactions/${id}`);
    return res.data;
  },

  async createTransaction(dto: CreateTransactionDTO): Promise<Transaction> {
    if (USE_MOCK_API) {
      return mockTransactionsApi.createTransaction(dto);
    }
    const res = await apiClient<{ data: Transaction }>('/transactions', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async updateTransaction(id: string, dto: UpdateTransactionDTO): Promise<Transaction> {
    if (USE_MOCK_API) {
      return mockTransactionsApi.updateTransaction(id, dto);
    }
    const res = await apiClient<{ data: Transaction }>(`/transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async deleteTransaction(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK_API) {
      return mockTransactionsApi.deleteTransaction(id);
    }
    return apiClient<{ success: boolean }>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};
