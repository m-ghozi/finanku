import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private accounts: AccountsService,
  ) {}

  async getDashboard(userId: string) {
    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

    const [accounts, monthAggRaw, expenseByCategoryRows, budgets, savingGoals, upcomingRecurrings, upcomingDebts, recent] =
      await Promise.all([
        this.accounts.findAll(userId),
        this.prisma.transaction.aggregate({
          where: { userId, status: 'completed', date: { gte: monthStart, lt: nextMonth } },
          _sum: { amount: true },
        }),
        this.prisma.transaction.groupBy({
          by: ['categoryId'],
          where: {
            userId,
            type: 'expense',
            status: 'completed',
            date: { gte: monthStart, lt: nextMonth },
            categoryId: { not: null },
          },
          _sum: { amount: true },
        }),
        this.prisma.budget.findMany({
          where: {
            userId,
            period: `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`,
          },
          include: { category: { select: { name: true, icon: true, color: true } } },
          take: 4,
        }),
        this.prisma.savingGoal.findMany({ where: { userId }, orderBy: { createdAt: 'asc' }, take: 2 }),
        this.prisma.recurring.findMany({
          where: { userId, isActive: true },
          orderBy: { dayOfMonth: 'asc' },
          take: 4,
        }),
        this.prisma.debt.findMany({
          where: { userId, status: { not: 'paid' } },
          orderBy: { dueDate: 'asc' },
          take: 4,
        }),
        this.prisma.transaction.findMany({
          where: { userId },
          orderBy: { date: 'desc' },
          take: 6,
          include: {
            account: { select: { name: true } },
            toAccount: { select: { name: true } },
            category: { select: { name: true, icon: true, color: true } },
          },
        }),
      ]);
    void monthAggRaw;

    // totalBalance = sum of currentBalance across non-credit-card accounts
    const totalBalance = accounts
      .filter((a) => a.type !== 'credit_card')
      .reduce((sum, a) => sum + a.currentBalance, 0);

    const { income: totalIncome, expense: totalExpense } = await monthTypeSums(
      this.prisma,
      userId,
      monthStart,
      nextMonth,
    );

    const cashFlow = totalIncome - totalExpense;

    // Cash flow overview: last 6 months income/expense
    const sixMonthsAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));
    const flowRows = await this.prisma.$queryRaw<{ month: string; type: string; total: bigint }[]>`
      SELECT to_char(date, 'YYYY-MM') AS month, type::text AS type, SUM(amount) AS total
      FROM "Transaction"
      WHERE "userId" = ${userId} AND status = 'completed' AND date >= ${sixMonthsAgo}
      GROUP BY 1, 2 ORDER BY 1`;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const cashFlowOverview = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + i, 1));
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
      const income = Number(flowRows.find((r) => r.month === key && r.type === 'income')?.total ?? 0);
      const expense = Number(flowRows.find((r) => r.month === key && r.type === 'expense')?.total ?? 0);
      return {
        month: monthNames[d.getUTCMonth()],
        income,
        expense,
        net: income - expense,
      };
    });

    // Expense by category this month
    const catIds = new Map(
      expenseByCategoryRows.map((r) => [r.categoryId as string, r._sum.amount ?? 0]),
    );
    const categories = catIds.size
      ? await this.prisma.category.findMany({
          where: { id: { in: [...catIds.keys()] } },
          select: { id: true, name: true, color: true },
        })
      : [];
    const totalCatExpense = [...catIds.values()].reduce((s, v) => s + v, 0) || 1;
    const expenseByCategory = categories
      .map((c) => {
        const amount = catIds.get(c.id) ?? 0;
        return {
          categoryId: c.id,
          categoryName: c.name,
          color: c.color,
          amount,
          percentage: Math.round((amount / totalCatExpense) * 100),
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // Budget rows with spent from this month's category totals
    const budgetsDto = budgets.map((b) => {
      const spent = catIds.get(b.categoryId) ?? 0;
      const remaining = b.amount - spent;
      return {
        id: b.id,
        categoryId: b.categoryId,
        categoryName: b.category.name,
        categoryIcon: b.category.icon,
        categoryColor: b.category.color,
        period: b.period,
        amount: b.amount,
        spent,
        remaining,
        percentage: b.amount > 0 ? Math.round((spent / b.amount) * 1000) / 10 : 0,
        isRollover: b.isRollover,
      };
    });

    const upcomingItems = [
      ...upcomingRecurrings.map((r) => ({
        id: r.id,
        type: 'recurring' as const,
        title: r.name,
        amount: r.amount,
        dueDate: nextOccurrenceDate(r),
        subtitle: `Setiap ${r.dayOfMonth ? `tanggal ${r.dayOfMonth}` : 'periode'}`,
        isExpense: r.type === 'expense',
      })),
      ...upcomingDebts
        .filter((d) => d.dueDate)
        .map((d) => ({
          id: d.id,
          type: d.type === 'debt' ? ('debt_due' as const) : ('receivable_due' as const),
          title: `${d.type === 'debt' ? 'Hutang ke' : 'Piutang dari'} ${d.name}`,
          amount: d.principalAmount - d.paidAmount,
          dueDate: d.dueDate as Date,
          subtitle: d.notes || 'Jatuh tempo',
          isExpense: d.type === 'debt',
        })),
    ]
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 4);

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      cashFlow,
      chartPeriod: 'Bulan Ini',
      cashFlowOverview,
      expenseByCategory,
      budgets: budgetsDto,
      savingGoals,
      upcomingItems,
      recentTransactions: recent.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        date: t.date,
        accountId: t.accountId,
        accountName: t.account.name,
        toAccountId: t.toAccountId,
        toAccountName: t.toAccount?.name,
        categoryId: t.categoryId,
        categoryName: t.category?.name,
        categoryIcon: t.category?.icon,
        categoryColor: t.category?.color,
        description: t.description,
        merchant: t.merchant,
        tags: t.tags,
        notes: t.notes,
        status: t.status,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
    };
  }
}

async function monthTypeSums(
  prisma: PrismaService,
  userId: string,
  start: Date,
  end: Date,
): Promise<{ income: number; expense: number }> {
  const [incomeRow, expenseRow] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, type: 'income', status: 'completed', date: { gte: start, lt: end } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: 'expense', status: 'completed', date: { gte: start, lt: end } },
      _sum: { amount: true },
    }),
  ]);
  return { income: incomeRow._sum.amount ?? 0, expense: expenseRow._sum.amount ?? 0 };
}

function nextOccurrenceDate(r: {
  frequency: string;
  dayOfMonth: number | null;
  dayOfWeek: number | null;
  startDate: Date;
  lastRunDate: Date | null;
}): Date {
  const now = new Date();
  const base = r.lastRunDate ?? r.startDate;
  if (r.frequency === 'weekly') {
    const d = new Date(base);
    while (d <= now || d < r.startDate) d.setUTCDate(d.getUTCDate() + 7);
    return d;
  }
  const day = r.dayOfMonth ?? 1;
  let candidate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), day));
  if (candidate <= now) candidate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, day));
  return candidate;
}
