import { mockStore } from './storage';
import { ReportsSummary, ReportFilter } from '@/src/types/report';

export const mockReportsApi = {
  async getReportsSummary(filter: ReportFilter): Promise<ReportsSummary> {
    await new Promise((r) => setTimeout(r, 250));
    const transactions = mockStore.getTransactions();
    const accounts = mockStore.getAccounts();
    const debts = mockStore.getDebts();

    // Calculate income and expense from transactions
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === 'income') totalIncome += t.amount;
      if (t.type === 'expense') totalExpense += t.amount;
    });

    const netCashFlow = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    // Monthly cash flow history
    const cashFlowHistory = [
      { month: 'Mei 2026', income: 7200000, expense: 4800000, net: 2400000 },
      { month: 'Jun 2026', income: 7500000, expense: 5100000, net: 2400000 },
      { month: 'Jul 2026', income: 8200000, expense: 5300000, net: 2900000 },
      { month: 'Agu 2026', income: 7500000, expense: 4900000, net: 2600000 },
      { month: 'Sep 2026', income: 8500000, expense: 5200000, net: 3300000 },
      { month: 'Okt 2026', income: 8500000, expense: 5200000, net: 3300000 },
    ];

    // Expense by Category Breakdown
    const expenseByCategory = [
      { categoryId: 'cat_food', categoryName: 'Makanan & Minuman', color: '#f97316', amount: 1850000, percentage: 35.6 },
      { categoryId: 'cat_transport', categoryName: 'Transportasi', color: '#0284c7', amount: 920000, percentage: 17.7 },
      { categoryId: 'cat_bills', categoryName: 'Tagihan & Utilitas', color: '#eab308', amount: 850000, percentage: 16.3 },
      { categoryId: 'cat_shopping', categoryName: 'Belanja Harian', color: '#8b5cf6', amount: 680000, percentage: 13.1 },
      { categoryId: 'cat_entertainment', categoryName: 'Hiburan', color: '#ec4899', amount: 450000, percentage: 8.7 },
      { categoryId: 'cat_health', categoryName: 'Kesehatan & Lainnya', color: '#10b981', amount: 450000, percentage: 8.6 },
    ];

    const incomeByCategory = [
      { categoryId: 'cat_salary', categoryName: 'Gaji Bulanan', color: '#059669', amount: 7500000, percentage: 88.2 },
      { categoryId: 'cat_freelance', categoryName: 'Proyek Sampingan', color: '#0284c7', amount: 1000000, percentage: 11.8 },
    ];

    // Net Worth Calculation: Total Assets (Bank + Cash + Ewallet + Piutang) - Total Liabilities (Hutang + Tagihan CC)
    let totalAssets = 0;
    accounts.forEach((a) => {
      if (a.type !== 'credit_card' && a.currentBalance > 0) {
        totalAssets += a.currentBalance;
      }
    });

    let totalPiutang = 0;
    debts.forEach((d) => {
      if (d.type === 'receivable' && d.status !== 'paid') {
        totalPiutang += d.remainingAmount;
      }
    });
    totalAssets += totalPiutang;

    let totalLiabilities = 0;
    accounts.forEach((a) => {
      if (a.type === 'credit_card' && a.currentBalance < 0) {
        totalLiabilities += Math.abs(a.currentBalance);
      }
    });
    debts.forEach((d) => {
      if (d.type === 'debt' && d.status !== 'paid') {
        totalLiabilities += d.remainingAmount;
      }
    });

    const netWorth = totalAssets - totalLiabilities;

    return {
      period: filter.period,
      totalIncome,
      totalExpense,
      netCashFlow,
      savingsRate,
      cashFlowHistory,
      expenseByCategory,
      incomeByCategory,
      netWorth: {
        totalAssets,
        totalLiabilities,
        netWorth,
        assetsBreakdown: [
          { category: 'Rekening Bank', amount: 11400000 },
          { category: 'Uang Tunai (Cash)', amount: 750000 },
          { category: 'Dompet Digital (E-Wallet)', amount: 350000 },
          { category: 'Piutang Orang Lain', amount: totalPiutang },
        ],
        liabilitiesBreakdown: [
          { category: 'Penggunaan Kartu Kredit', amount: 2500000 },
          { category: 'Hutang Pribadi', amount: 1000000 },
        ],
      },
    };
  },
};
