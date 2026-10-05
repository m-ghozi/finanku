import React from 'react';
import { formatCurrency, cn } from '@/src/lib/utils';
import { useBalancePrivacy } from '@/src/lib/privacy';

export interface MoneyDisplayProps {
  amount: number | null | undefined;
  type?: 'income' | 'expense' | 'transfer' | 'balance' | 'neutral';
  compact?: boolean;
  showSign?: boolean;
  className?: string;
  forceShow?: boolean; // bypass privacy if explicitly requested
}

export const MoneyDisplay: React.FC<MoneyDisplayProps> = ({
  amount = 0,
  type = 'neutral',
  compact = false,
  showSign = false,
  className,
  forceShow = false,
}) => {
  const { isHidden } = useBalancePrivacy();

  if (isHidden && !forceShow) {
    return (
      <span
        className={cn(
          'inline-flex items-center font-mono tracking-widest text-zinc-400 dark:text-zinc-500 select-none',
          className
        )}
        title="Saldo disembunyikan"
      >
        Rp ••••••••
      </span>
    );
  }

  const effectiveShowSign = showSign || type === 'income' || type === 'expense';

  const typeStyles = {
    balance: 'text-zinc-950 dark:text-zinc-50 font-bold',
    income: 'text-emerald-600 dark:text-emerald-400 font-semibold',
    expense: 'text-rose-600 dark:text-rose-400 font-semibold',
    transfer: 'text-sky-600 dark:text-sky-400 font-medium',
    neutral: 'text-zinc-800 dark:text-zinc-200 font-medium',
  };

  const formatted = formatCurrency(amount, {
    showSign: effectiveShowSign,
    compact,
  });

  return (
    <span className={cn(typeStyles[type], className)}>
      {formatted}
    </span>
  );
};
