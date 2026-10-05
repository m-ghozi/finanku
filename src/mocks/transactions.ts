import { mockStore } from './storage';
import {
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionFilters,
  PaginatedTransactionsResponse,
} from '@/src/types/transaction';

export const mockTransactionsApi = {
  async getTransactions(filters: TransactionFilters = {}): Promise<PaginatedTransactionsResponse> {
    await new Promise((r) => setTimeout(r, 200));
    let items = [...mockStore.getTransactions()];

    // 1. Filter by Type
    if (filters.type && filters.type !== 'all') {
      items = items.filter((t) => t.type === filters.type);
    }

    // 2. Filter by Account
    if (filters.accountId) {
      items = items.filter(
        (t) => t.accountId === filters.accountId || t.toAccountId === filters.accountId
      );
    }

    // 3. Filter by Category
    if (filters.categoryId) {
      items = items.filter((t) => t.categoryId === filters.categoryId);
    }

    // 4. Filter by Date range
    if (filters.startDate) {
      items = items.filter((t) => t.date.slice(0, 10) >= filters.startDate!);
    }
    if (filters.endDate) {
      items = items.filter((t) => t.date.slice(0, 10) <= filters.endDate!);
    }

    // 5. Filter by Amount
    if (filters.minAmount !== undefined) {
      items = items.filter((t) => t.amount >= filters.minAmount!);
    }
    if (filters.maxAmount !== undefined) {
      items = items.filter((t) => t.amount <= filters.maxAmount!);
    }

    // 6. Search query (description, merchant, categoryName, notes)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      items = items.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          (t.merchant && t.merchant.toLowerCase().includes(q)) ||
          (t.categoryName && t.categoryName.toLowerCase().includes(q)) ||
          (t.accountName && t.accountName.toLowerCase().includes(q)) ||
          (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    // 7. Sorting
    const sortBy = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder || 'desc';

    items.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'amount') {
        cmp = a.amount - b.amount;
      } else if (sortBy === 'createdAt') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        // default 'date'
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    // 8. Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginatedItems = items.slice(offset, offset + limit);

    return {
      data: paginatedItems,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  async getTransactionById(id: string): Promise<Transaction | null> {
    await new Promise((r) => setTimeout(r, 150));
    const trx = mockStore.getTransactions().find((t) => t.id === id);
    return trx || null;
  },

  async createTransaction(dto: CreateTransactionDTO): Promise<Transaction> {
    await new Promise((r) => setTimeout(r, 300));
    const accounts = mockStore.getAccounts();
    const categories = mockStore.getCategories();
    const transactions = mockStore.getTransactions();

    const account = accounts.find((a) => a.id === dto.accountId);
    const toAccount = dto.toAccountId ? accounts.find((a) => a.id === dto.toAccountId) : undefined;
    const category = dto.categoryId ? categories.find((c) => c.id === dto.categoryId) : undefined;

    // Adjust Account Balance in Mock state
    if (account) {
      if (dto.type === 'expense') {
        account.currentBalance -= dto.amount;
      } else if (dto.type === 'income') {
        account.currentBalance += dto.amount;
      } else if (dto.type === 'transfer' && toAccount) {
        account.currentBalance -= dto.amount;
        toAccount.currentBalance += dto.amount;
      }
      mockStore.setAccounts([...accounts]);
    }

    // Adjust Budget spent if expense
    if (dto.type === 'expense' && dto.categoryId) {
      const budgets = mockStore.getBudgets();
      const currentPeriod = dto.date.slice(0, 7); // YYYY-MM
      const budget = budgets.find(
        (b) => b.categoryId === dto.categoryId && b.period === currentPeriod
      );
      if (budget) {
        budget.spent += dto.amount;
        budget.remaining = budget.amount - budget.spent;
        budget.percentage = (budget.spent / budget.amount) * 100;
        mockStore.setBudgets([...budgets]);
      }
    }

    const newTrx: Transaction = {
      id: `trx_${Date.now()}`,
      type: dto.type,
      amount: dto.amount,
      date: dto.date.includes('T') ? dto.date : `${dto.date}T12:00:00Z`,
      accountId: dto.accountId,
      accountName: account?.name || 'Rekening',
      toAccountId: dto.toAccountId,
      toAccountName: toAccount?.name,
      categoryId: dto.categoryId,
      categoryName: category?.name,
      categoryIcon: category?.icon,
      categoryColor: category?.color,
      description: dto.description,
      merchant: dto.merchant,
      tags: dto.tags || [],
      notes: dto.notes,
      attachmentUrl: dto.attachmentUrl,
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockStore.setTransactions([newTrx, ...transactions]);
    return newTrx;
  },

  async updateTransaction(id: string, dto: UpdateTransactionDTO): Promise<Transaction> {
    await new Promise((r) => setTimeout(r, 250));
    const transactions = mockStore.getTransactions();
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Transaksi tidak ditemukan');

    const updated: Transaction = {
      ...transactions[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    transactions[index] = updated;
    mockStore.setTransactions(transactions);
    return updated;
  },

  async deleteTransaction(id: string): Promise<{ success: boolean }> {
    await new Promise((r) => setTimeout(r, 200));
    const transactions = mockStore.getTransactions();
    const trx = transactions.find((t) => t.id === id);
    if (trx) {
      // Revert account balance
      const accounts = mockStore.getAccounts();
      const account = accounts.find((a) => a.id === trx.accountId);
      if (account) {
        if (trx.type === 'expense') account.currentBalance += trx.amount;
        else if (trx.type === 'income') account.currentBalance -= trx.amount;
        mockStore.setAccounts([...accounts]);
      }
    }
    const filtered = transactions.filter((t) => t.id !== id);
    mockStore.setTransactions(filtered);
    return { success: true };
  },
};
