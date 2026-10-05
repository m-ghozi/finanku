import { mockStore } from './storage';
import { DashboardData, DashboardUpcomingItem } from '@/src/types/dashboard';

export const mockDashboardApi = {
  async getDashboardData(): Promise<DashboardData> {
    await new Promise((r) => setTimeout(r, 200));

    const accounts = mockStore.getAccounts();
    const transactions = mockStore.getTransactions();
    const budgets = mockStore.getBudgets();
    const savingGoals = mockStore.getSavings();
    const debts = mockStore.getDebts();
    const recurring = mockStore.getRecurring();

    // Total Saldo (semua akun kas & bank & e-wallet)
    let totalBalance = 0;
    accounts.forEach((a) => {
      if (a.type !== 'credit_card') {
        totalBalance += a.currentBalance;
      }
    });

    // Pemasukan & Pengeluaran Bulan Ini (Oktober 2026)
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach((t) => {
      if (t.type === 'income') totalIncome += t.amount;
      if (t.type === 'expense') totalExpense += t.amount;
    });

    // Fallbacks matching master prompt if fresh
    if (totalBalance === 0) totalBalance = 12500000;
    if (totalIncome === 0) totalIncome = 8500000;
    if (totalExpense === 0) totalExpense = 5200000;
    const cashFlow = totalIncome - totalExpense;

    // Upcoming items (recurring transactions and debt due dates)
    const upcomingItems: DashboardUpcomingItem[] = [];

    recurring.filter((r) => r.isActive).forEach((r) => {
      upcomingItems.push({
        id: r.id,
        type: 'recurring',
        title: r.name,
        amount: r.amount,
        dueDate: r.nextExecutionDate,
        subtitle: `Setiap ${r.dayOfMonth ? `tanggal ${r.dayOfMonth}` : 'periode'}`,
        isExpense: r.type === 'expense',
      });
    });

    debts.filter((d) => d.status !== 'paid').forEach((d) => {
      upcomingItems.push({
        id: d.id,
        type: d.type === 'debt' ? 'debt_due' : 'receivable_due',
        title: `${d.type === 'debt' ? 'Hutang ke' : 'Piutang dari'} ${d.personName}`,
        amount: d.remainingAmount,
        dueDate: d.dueDate,
        subtitle: d.description || 'Jatuh tempo',
        isExpense: d.type === 'debt',
      });
    });

    // Sort upcoming by dueDate
    upcomingItems.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    // Cash flow overview for chart (Last 6 months or 7 days)
    const cashFlowOverview = [
      { month: 'Mei', income: 7200000, expense: 4800000, net: 2400000 },
      { month: 'Jun', income: 7500000, expense: 5100000, net: 2400000 },
      { month: 'Jul', income: 8200000, expense: 5300000, net: 2900000 },
      { month: 'Agu', income: 7500000, expense: 4900000, net: 2600000 },
      { month: 'Sep', income: 8500000, expense: 5200000, net: 3300000 },
      { month: 'Okt', income: 8500000, expense: 5200000, net: 3300000 },
    ];

    const expenseByCategory = [
      { categoryId: 'cat_food', categoryName: 'Makanan', color: '#f97316', amount: 850000, percentage: 41 },
      { categoryId: 'cat_transport', categoryName: 'Transportasi', color: '#0284c7', amount: 420000, percentage: 20 },
      { categoryId: 'cat_bills', categoryName: 'Tagihan', color: '#eab308', amount: 350000, percentage: 17 },
      { categoryId: 'cat_shopping', categoryName: 'Belanja', color: '#8b5cf6', amount: 260000, percentage: 12 },
      { categoryId: 'cat_entertainment', categoryName: 'Hiburan', color: '#ec4899', amount: 200000, percentage: 10 },
    ];

    // Recent 6 transactions
    const recentTransactions = transactions.slice(0, 6);

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      cashFlow,
      chartPeriod: 'Bulan Ini',
      cashFlowOverview,
      expenseByCategory,
      budgets: budgets.slice(0, 4),
      savingGoals: savingGoals.slice(0, 2),
      upcomingItems: upcomingItems.slice(0, 4),
      recentTransactions,
    };
  },
};
