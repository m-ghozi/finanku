export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionStatus = 'completed' | 'pending' | 'cancelled';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // ISO 8601 (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)
  accountId: string;
  accountName?: string;
  toAccountId?: string; // used for transfer
  toAccountName?: string; // used for transfer
  categoryId?: string; // used for income and expense
  categoryName?: string;
  categoryIcon?: string;
  categoryColor?: string;
  description: string;
  merchant?: string;
  tags?: string[];
  notes?: string;
  attachmentUrl?: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number;
  date: string;
  accountId: string;
  toAccountId?: string;
  categoryId?: string;
  description: string;
  merchant?: string;
  tags?: string[];
  notes?: string;
  attachmentUrl?: string;
}

export interface UpdateTransactionDTO extends Partial<CreateTransactionDTO> {
  status?: TransactionStatus;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: TransactionType | 'all';
  accountId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'date' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedTransactionsResponse {
  data: Transaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
