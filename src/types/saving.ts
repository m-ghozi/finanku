export interface SavingContribution {
  id: string;
  savingGoalId: string;
  amount: number;
  date: string;
  notes?: string;
  accountId?: string;
  createdAt: string;
}

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  category?: string;
  color?: string;
  icon?: string;
  notes?: string;
  isArchived: boolean;
  contributions?: SavingContribution[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavingGoalDTO {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate: string;
  category?: string;
  color?: string;
  icon?: string;
  notes?: string;
}

export interface UpdateSavingGoalDTO extends Partial<CreateSavingGoalDTO> {
  isArchived?: boolean;
}

export interface AddSavingContributionDTO {
  amount: number;
  date: string;
  accountId?: string;
  notes?: string;
}
