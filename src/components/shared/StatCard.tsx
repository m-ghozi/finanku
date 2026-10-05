import React from 'react';
import { Card } from '@/src/components/ui/card';
import { MoneyDisplay } from './MoneyDisplay';
import { cn } from '@/src/lib/utils';

interface StatCardProps {
  title: string;
  amount: number;
  type: 'balance' | 'income' | 'expense' | 'neutral';
  icon: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  type,
  icon,
  subtitle,
  className,
}) => {
  const iconBg = {
    balance: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
    income: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    expense: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
    neutral: 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400',
  };

  return (
    <Card className={cn('p-5 transition-all hover:border-zinc-300 dark:hover:border-zinc-700', className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', iconBg[type])}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-xl sm:text-2xl font-bold tracking-tight">
          <MoneyDisplay amount={amount} type={type} />
        </div>
        {subtitle && (
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{subtitle}</p>
        )}
      </div>
    </Card>
  );
};
