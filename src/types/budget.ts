export interface Budget {
  id: string;
  categoryId: string;
  categoryName?: string;
  categoryIcon?: string;
  categoryColor?: string;
  period: string; // e.g., "2026-10" (YYYY-MM)
  amount: number; // Allocated budget
  spent: number; // Current spending calculated by backend
  remaining: number; // amount - spent
  percentage: number; // (spent / amount) * 100
  isRollover: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetDTO {
  categoryId: string;
  period: string;
  amount: number;
  isRollover?: boolean;
  notes?: string;
}

export interface UpdateBudgetDTO extends Partial<CreateBudgetDTO> {}
