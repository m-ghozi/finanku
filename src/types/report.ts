export interface MonthlyCashFlow {
  month: string; // e.g. "2026-05" or "Mei"
  income: number;
  expense: number;
  net: number;
}

export interface ExpenseByCategoryReport {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
  percentage: number;
}

export interface NetWorthReport {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  assetsBreakdown: {
    category: string;
    amount: number;
  }[];
  liabilitiesBreakdown: {
    category: string;
    amount: number;
  }[];
}

export interface ReportsSummary {
  period: string;
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  savingsRate: number; // percentage
  cashFlowHistory: MonthlyCashFlow[];
  expenseByCategory: ExpenseByCategoryReport[];
  incomeByCategory: ExpenseByCategoryReport[];
  netWorth: NetWorthReport;
}

export interface ReportFilter {
  period: 'this_month' | '3_months' | '6_months' | 'this_year' | 'custom';
  startDate?: string;
  endDate?: string;
}
