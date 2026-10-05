export type AccountType = 'cash' | 'bank' | 'ewallet' | 'credit_card' | 'investment' | 'other';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  accountNumber?: string;
  bankName?: string;
  openingBalance: number;
  currentBalance: number;
  currency: string;
  color?: string;
  icon?: string;
  isArchived: boolean;
  creditLimit?: number; // only for credit_card
  billingCycleDay?: number; // 1-31
  dueDateDay?: number; // 1-31
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDTO {
  name: string;
  type: AccountType;
  accountNumber?: string;
  bankName?: string;
  openingBalance: number;
  color?: string;
  icon?: string;
  creditLimit?: number;
  billingCycleDay?: number;
  dueDateDay?: number;
}

export interface UpdateAccountDTO extends Partial<CreateAccountDTO> {
  isArchived?: boolean;
}
