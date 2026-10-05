import { TransactionType } from '@/src/types/transaction';

export interface ParsedTransactionDraft {
  type: TransactionType;
  amount: number;
  description: string;
  suggestedCategory?: string;
  suggestedAccount?: string;
  rawInput: string;
}

/**
 * Parses quick input text like "makan siang 35000", "gaji 7500000", "kopi 25k", "transfer bca 100rb"
 * Rules-based without external AI requirement.
 */
export function parseTransactionInput(input: string): ParsedTransactionDraft | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();

  // 1. Detect Type
  let type: TransactionType = 'expense';
  if (
    lower.includes('gaji') ||
    lower.includes('pemasukan') ||
    lower.includes('income') ||
    lower.includes('bonus') ||
    lower.includes('terima') ||
    lower.includes('proyek') ||
    lower.includes('dividen')
  ) {
    type = 'income';
  } else if (
    lower.includes('transfer') ||
    lower.includes('tf ') ||
    lower.startsWith('tf') ||
    lower.includes('kirim ke')
  ) {
    type = 'transfer';
  }

  // 2. Extract Amount
  // Matches patterns: 35000, 35.000, 35k, 50rb, 1.5jt, 2jt, 100000
  let amount = 0;
  let matchedAmountString = '';

  const millionRegex = /(\d+(?:[.,]\d+)?)\s*(?:jt|juta|m)/i;
  const thousandRegex = /(\d+(?:[.,]\d+)?)\s*(?:k|rb|ribu)/i;
  const standardNumRegex = /(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+|\d+)/i;

  const millionMatch = lower.match(millionRegex);
  const thousandMatch = lower.match(thousandRegex);

  if (millionMatch) {
    const rawVal = parseFloat(millionMatch[1].replace(',', '.'));
    amount = Math.round(rawVal * 1_000_000);
    matchedAmountString = millionMatch[0];
  } else if (thousandMatch) {
    const rawVal = parseFloat(thousandMatch[1].replace(',', '.'));
    amount = Math.round(rawVal * 1_000);
    matchedAmountString = thousandMatch[0];
  } else {
    // Try standard numbers, prioritize largest digit sequence
    const matches = Array.from(trimmed.matchAll(/(\d{1,3}(?:\.\d{3})+|\d{4,})/g));
    if (matches.length > 0) {
      // Pick the last number often representing the price
      const lastMatch = matches[matches.length - 1];
      const cleanNum = lastMatch[0].replace(/\./g, '');
      amount = parseInt(cleanNum, 10);
      matchedAmountString = lastMatch[0];
    } else {
      // Fallback for smaller digits like 500
      const smallMatch = trimmed.match(/\b\d+\b/);
      if (smallMatch) {
        amount = parseInt(smallMatch[0], 10);
        matchedAmountString = smallMatch[0];
      }
    }
  }

  // 3. Clean Description
  let description = trimmed;
  if (matchedAmountString) {
    description = description.replace(matchedAmountString, '');
  }
  // Clean up prefix symbols like "rp", "Rp.", "-"
  description = description
    .replace(/^rp\.?\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If description became empty, use reasonable fallback
  if (!description) {
    description = type === 'income' ? 'Pemasukan' : type === 'transfer' ? 'Transfer' : 'Pengeluaran';
  } else {
    // Capitalize first letter
    description = description.charAt(0).toUpperCase() + description.slice(1);
  }

  // 4. Category Suggestion
  let suggestedCategory: string | undefined;
  if (/makan|lunch|dinner|sarapan|kopi|coffee|resto|bakso|ayam|mie|snack/i.test(lower)) {
    suggestedCategory = 'Makanan & Minuman';
  } else if (/bensin|pertalite|pertamax|grab|gojek|ojol|tol|parkir|kereta|busway/i.test(lower)) {
    suggestedCategory = 'Transportasi';
  } else if (/listrik|pln|pdam|air|wifi|indihome|pulsa|paket data|iuran/i.test(lower)) {
    suggestedCategory = 'Tagihan & Utilitas';
  } else if (/belanja|supermarket|indomaret|alfamart|tokopedia|shopee/i.test(lower)) {
    suggestedCategory = 'Belanja Harian';
  } else if (/nonton|bioskop|game|steam|netflix|spotify/i.test(lower)) {
    suggestedCategory = 'Hiburan';
  } else if (/gaji|salary|payroll/i.test(lower)) {
    suggestedCategory = 'Gaji Bulanan';
  }

  // 5. Account Suggestion
  let suggestedAccount: string | undefined;
  if (/bca/i.test(lower)) suggestedAccount = 'BCA';
  else if (/mandiri/i.test(lower)) suggestedAccount = 'Mandiri';
  else if (/bri/i.test(lower)) suggestedAccount = 'BRI';
  else if (/dana/i.test(lower)) suggestedAccount = 'DANA';
  else if (/gopay/i.test(lower)) suggestedAccount = 'GoPay';
  else if (/cash|tunai/i.test(lower)) suggestedAccount = 'Cash';

  return {
    type,
    amount: amount || 0,
    description,
    suggestedCategory,
    suggestedAccount,
    rawInput: input,
  };
}
