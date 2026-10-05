import React, { useState } from 'react';
import { useReports } from '@/src/hooks/useReports';
import { useAccounts } from '@/src/hooks/useAccounts';
import { PageHeader } from '@/src/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { MoneyDisplay } from '@/src/components/shared/MoneyDisplay';
import { LoadingState } from '@/src/components/shared/LoadingState';
import { ErrorState } from '@/src/components/shared/ErrorState';
import { Badge } from '@/src/components/ui/badge';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Scale, TrendingUp, TrendingDown, ShieldAlert, Landmark, Wallet } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [period, setPeriod] = useState<'this_month' | '3_months' | '6_months' | 'this_year'>('6_months');
  const { data: report, isLoading, error, refetch } = useReports({ period });
  const { data: accounts } = useAccounts();

  if (isLoading) return <LoadingState rows={6} />;
  if (error || !report) return <ErrorState message="Gagal memuat laporan finansial" onRetry={() => refetch()} />;

  const periodOptions = [
    { key: 'this_month', label: 'Bulan Ini' },
    { key: '3_months', label: '3 Bulan' },
    { key: '6_months', label: '6 Bulan' },
    { key: 'this_year', label: '1 Tahun' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <PageHeader
          title="Laporan Keuangan & Net Worth"
          description="Analisis komprehensif arus kas masuk, keluar, dan kalkulasi total kekayaan bersih Anda."
          className="mb-0"
        />

        {/* Period Filter */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg self-start sm:self-auto">
          {periodOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setPeriod(opt.key as typeof period)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                period === opt.key
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Net Worth Hero Card */}
      <Card className="p-6 bg-gradient-to-br from-zinc-900 via-zinc-850 to-zinc-900 text-white dark:from-zinc-900 dark:to-zinc-950 border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-semibold text-emerald-400 tracking-wider">
              Total Kekayaan Bersih (Net Worth)
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold mt-1 tracking-tight">
              <MoneyDisplay amount={report.netWorth.netWorth} forceShow className="text-white" />
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Dihitung dari Total Aset dikurangi Kewajiban & Hutang.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-zinc-800 md:pl-8">
            <div>
              <span className="text-xs text-zinc-400 block">Total Aset (Aktiva)</span>
              <MoneyDisplay amount={report.netWorth.totalAssets} type="income" forceShow className="text-lg font-bold" />
              <p className="text-[10px] text-zinc-500">Bank, Kas, E-Wallet, Piutang</p>
            </div>
            <div>
              <span className="text-xs text-zinc-400 block">Total Liabilitas (Pasiva)</span>
              <MoneyDisplay amount={report.netWorth.totalLiabilities} type="expense" forceShow className="text-lg font-bold" />
              <p className="text-[10px] text-zinc-500">Hutang & Tagihan Kartu Kredit</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Cash Flow Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Tren Arus Kas (Cash Flow Trend)</CardTitle>
          <p className="text-xs text-zinc-500">Pertumbuhan pemasukan vs pengeluaran dari waktu ke waktu</p>
        </CardHeader>
        <CardContent className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={report.cashFlowHistory} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}jt`}
              />
              <RechartsTooltip
                formatter={(val: any) => [
                  `Rp ${Number(val || 0).toLocaleString('id-ID')}`,
                  '',
                ]}
                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="income" name="Pemasukan" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="expense" name="Pengeluaran" stroke="#e11d48" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="net" name="Net Cash Flow" stroke="#0284c7" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Breakdown & Account Balances Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Distribusi Pengeluaran</CardTitle>
            <p className="text-xs text-zinc-500">Breakdown per kategori pengeluaran</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={report.expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {report.expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(val: any) => [
                      `Rp ${Number(val || 0).toLocaleString('id-ID')}`,
                      'Nominal',
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              {report.expenseByCategory.map((c) => (
                <div key={c.categoryId} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{c.categoryName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MoneyDisplay amount={c.amount} className="font-semibold" />
                    <span className="text-zinc-400 text-[11px]">({c.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Balances Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Ringkasan Saldo per Rekening</CardTitle>
            <p className="text-xs text-zinc-500">Kondisi likuiditas masing-masing sumber dana</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {accounts?.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600">
                    <Landmark className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{acc.name}</p>
                    <p className="text-[11px] text-zinc-400">{acc.bankName || acc.type.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <MoneyDisplay
                    amount={acc.currentBalance}
                    type={acc.currentBalance < 0 ? 'expense' : 'balance'}
                    className="font-bold text-xs"
                  />
                  {acc.type === 'credit_card' && (
                    <span className="block text-[10px] text-zinc-400">
                      Limit: {Number(acc.creditLimit || 0).toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
