import { TransactionType } from './transaction';

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface RecurringTransaction {
  id: string;
  name: string;
  type: TransactionType;
  amount: number;
  frequency: RecurringFrequency;
  interval?: number; // e.g. every 2 weeks
  dayOfMonth?: number; // e.g. 25
  dayOfWeek?: number; // 0 = Sunday, 1 = Monday
  startDate: string;
  endDate?: string;
  nextExecutionDate: string;
  accountId: string;
  accountName?: string;
  categoryId?: string;
  categoryName?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecurringDTO {
  name: string;
  type: TransactionType;
  amount: number;
  frequency: RecurringFrequency;
  interval?: number;
  dayOfMonth?: number;
  dayOfWeek?: number;
  startDate: string;
  endDate?: string;
  accountId: string;
  categoryId?: string;
  isActive?: boolean;
  notes?: string;
}

export interface UpdateRecurringDTO extends Partial<CreateRecurringDTO> {}
