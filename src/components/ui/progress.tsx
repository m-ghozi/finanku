import { cn } from '@/src/lib/utils';

interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
  indicatorClassName?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function Progress({ value, className, indicatorClassName, variant = 'default' }: ProgressProps) {
  const clamped = Math.min(Math.max(value, 0), 100);

  const variantColors = {
    default: 'bg-emerald-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
  };

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800', className)}
    >
      <div
        className={cn('h-full w-full flex-1 transition-all duration-300', variantColors[variant], indicatorClassName)}
        style={{ transform: `translateX(-${100 - clamped}%)` }}
      />
    </div>
  );
}
