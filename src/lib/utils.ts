import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';
import { id } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency into standard Rupiah format
 * e.g., 1500000 -> "Rp 1.500.000"
 * -50000 -> "-Rp 50.000"
 */
export function formatCurrency(
  amount: number | null | undefined,
  options?: {
    showSign?: boolean;
    compact?: boolean;
  }
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp 0';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (options?.compact) {
    if (absAmount >= 1_000_000_000) {
      const val = (absAmount / 1_000_000_000).toFixed(1).replace(/\.0$/, '');
      return `${isNegative ? '-' : options?.showSign ? '+' : ''}Rp ${val} M`;
    }
    if (absAmount >= 1_000_000) {
      const val = (absAmount / 1_000_000).toFixed(1).replace(/\.0$/, '');
      return `${isNegative ? '-' : options?.showSign ? '+' : ''}Rp ${val} jt`;
    }
    if (absAmount >= 1_000) {
      const val = (absAmount / 1_000).toFixed(0);
      return `${isNegative ? '-' : options?.showSign ? '+' : ''}Rp ${val} rb`;
    }
  }

  const formattedNum = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(absAmount);

  if (isNegative) {
    return `-Rp ${formattedNum}`;
  }

  if (options?.showSign && amount > 0) {
    return `+Rp ${formattedNum}`;
  }

  return `Rp ${formattedNum}`;
}

/**
 * Format date string or Date object using Indonesian locale
 */
export function formatDate(
  dateInput: string | Date | null | undefined,
  formatString: string = 'dd MMM yyyy'
): string {
  if (!dateInput) return '-';

  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (!isValid(date)) return '-';
    return format(date, formatString, { locale: id });
  } catch {
    return '-';
  }
}

/**
 * Format standard number with Indonesian separators
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return '0';
  return new Intl.NumberFormat('id-ID').format(value);
}

/**
 * Format percentage
 * e.g., 57.4 -> "57.4%"
 */
export function formatPercentage(
  value: number | null | undefined,
  decimals: number = 0
): string {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}
