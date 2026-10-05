export type DebtType = 'debt' | 'receivable'; // Hutang (saya berhutang) vs Piutang (orang lain berhutang ke saya)
export type DebtStatus = 'active' | 'partially_paid' | 'paid' | 'overdue';

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
  notes?: string;
  accountId?: string;
  createdAt: string;
}

export interface Debt {
  id: string;
  type: DebtType;
  personName: string;
  totalAmount: number;
  remainingAmount: number;
  dueDate: string; // YYYY-MM-DD
  startDate: string; // YYYY-MM-DD
  status: DebtStatus;
  description?: string;
  payments?: DebtPayment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDebtDTO {
  type: DebtType;
  personName: string;
  totalAmount: number;
  dueDate: string;
  startDate?: string;
  description?: string;
}

export interface UpdateDebtDTO extends Partial<CreateDebtDTO> {
  status?: DebtStatus;
}

export interface RecordDebtPaymentDTO {
  amount: number;
  date: string;
  accountId?: string;
  notes?: string;
}
