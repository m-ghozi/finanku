import { Account } from '@/src/types/account';
import { Category } from '@/src/types/category';
import { Transaction } from '@/src/types/transaction';
import { Budget } from '@/src/types/budget';
import { SavingGoal } from '@/src/types/saving';
import { Debt } from '@/src/types/debt';
import { RecurringTransaction } from '@/src/types/recurring';
import { AppNotification } from '@/src/types/notification';

const STORAGE_PREFIX = 'fintrack_mock_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// Initial Mock Accounts
export const initialAccounts: Account[] = [
  {
    id: 'acc_bca',
    name: 'BCA Tahapan',
    type: 'bank',
    bankName: 'Bank Central Asia',
    accountNumber: '8801928371',
    openingBalance: 2000000,
    currentBalance: 5500000,
    currency: 'IDR',
    color: '#0284c7',
    icon: 'landmark',
    isArchived: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'acc_mandiri',
    name: 'Mandiri Payroll',
    type: 'bank',
    bankName: 'Bank Mandiri',
    accountNumber: '1370018928391',
    openingBalance: 1500000,
    currentBalance: 3400000,
    currency: 'IDR',
    color: '#0d9488',
    icon: 'landmark',
    isArchived: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'acc_bri',
    name: 'BRI BritAma',
    type: 'bank',
    bankName: 'Bank Rakyat Indonesia',
    accountNumber: '020601002918301',
    openingBalance: 1000000,
    currentBalance: 2500000,
    currency: 'IDR',
    color: '#0284c7',
    icon: 'landmark',
    isArchived: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'acc_cash',
    name: 'Uang Tunai / Dompet',
    type: 'cash',
    openingBalance: 500000,
    currentBalance: 750000,
    currency: 'IDR',
    color: '#16a34a',
    icon: 'wallet',
    isArchived: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'acc_dana',
    name: 'DANA E-Wallet',
    type: 'ewallet',
    accountNumber: '081234567890',
    openingBalance: 200000,
    currentBalance: 350000,
    currency: 'IDR',
    color: '#2563eb',
    icon: 'smartphone',
    isArchived: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'acc_cc_bca',
    name: 'Kartu Kredit BCA Everyday',
    type: 'credit_card',
    bankName: 'BCA',
    accountNumber: '4556 **** **** 9012',
    openingBalance: 0,
    currentBalance: -2500000, // outstanding used
    currency: 'IDR',
    color: '#e11d48',
    icon: 'credit-card',
    creditLimit: 10000000,
    billingCycleDay: 15,
    dueDateDay: 5,
    isArchived: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
];

// Initial Categories
export const initialCategories: Category[] = [
  // Expense
  {
    id: 'cat_food',
    name: 'Makanan & Minuman',
    type: 'expense',
    icon: 'utensils',
    color: '#f97316',
    isArchived: false,
    subcategories: [
      { id: 'cat_food_resto', name: 'Restoran & Kafe', type: 'expense', parentId: 'cat_food', isArchived: false, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'cat_food_lunch', name: 'Makan Siang Kantor', type: 'expense', parentId: 'cat_food', isArchived: false, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'cat_food_coffee', name: 'Kopi & Snack', type: 'expense', parentId: 'cat_food', isArchived: false, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat_transport',
    name: 'Transportasi',
    type: 'expense',
    icon: 'car',
    color: '#0284c7',
    isArchived: false,
    subcategories: [
      { id: 'cat_transport_fuel', name: 'Bensin & Tol', type: 'expense', parentId: 'cat_transport', isArchived: false, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'cat_transport_ride', name: 'Ojek / Taksi Online', type: 'expense', parentId: 'cat_transport', isArchived: false, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat_bills',
    name: 'Tagihan & Utilitas',
    type: 'expense',
    icon: 'zap',
    color: '#eab308',
    isArchived: false,
    subcategories: [
      { id: 'cat_bills_electricity', name: 'Listrik PLN', type: 'expense', parentId: 'cat_bills', isArchived: false, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'cat_bills_internet', name: 'Internet & WiFi', type: 'expense', parentId: 'cat_bills', isArchived: false, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'cat_bills_water', name: 'Air PDAM', type: 'expense', parentId: 'cat_bills', isArchived: false, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat_shopping',
    name: 'Belanja',
    type: 'expense',
    icon: 'shopping-bag',
    color: '#8b5cf6',
    isArchived: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat_entertainment',
    name: 'Hiburan',
    type: 'expense',
    icon: 'film',
    color: '#ec4899',
    isArchived: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat_health',
    name: 'Kesehatan',
    type: 'expense',
    icon: 'activity',
    color: '#10b981',
    isArchived: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  // Income
  {
    id: 'cat_salary',
    name: 'Gaji & Pendapatan Tetap',
    type: 'income',
    icon: 'briefcase',
    color: '#059669',
    isArchived: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat_freelance',
    name: 'Proyek Sampingan',
    type: 'income',
    icon: 'laptop',
    color: '#0284c7',
    isArchived: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat_investment',
    name: 'Investasi & Dividen',
    type: 'income',
    icon: 'trending-up',
    color: '#8b5cf6',
    isArchived: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

// Initial Transactions
export const initialTransactions: Transaction[] = [
  {
    id: 'trx_01',
    type: 'expense',
    amount: 35000,
    date: '2026-10-05T08:30:00Z',
    accountId: 'acc_dana',
    accountName: 'DANA E-Wallet',
    categoryId: 'cat_food',
    categoryName: 'Makanan & Minuman',
    categoryIcon: 'utensils',
    categoryColor: '#f97316',
    description: 'Sarapan Bubur Ayam',
    merchant: 'Bubur Barito',
    tags: ['makan', 'sarapan'],
    status: 'completed',
    createdAt: '2026-10-05T08:30:00Z',
    updatedAt: '2026-10-05T08:30:00Z',
  },
  {
    id: 'trx_02',
    type: 'expense',
    amount: 150000,
    date: '2026-10-04T19:00:00Z',
    accountId: 'acc_bca',
    accountName: 'BCA Tahapan',
    categoryId: 'cat_transport',
    categoryName: 'Transportasi',
    categoryIcon: 'car',
    categoryColor: '#0284c7',
    description: 'Isi Pertamax Mobil',
    merchant: 'SPBU Pertamina',
    tags: ['bensin', 'transport'],
    status: 'completed',
    createdAt: '2026-10-04T19:00:00Z',
    updatedAt: '2026-10-04T19:00:00Z',
  },
  {
    id: 'trx_03',
    type: 'expense',
    amount: 350000,
    date: '2026-10-03T10:15:00Z',
    accountId: 'acc_bca',
    accountName: 'BCA Tahapan',
    categoryId: 'cat_bills',
    categoryName: 'Tagihan & Utilitas',
    categoryIcon: 'zap',
    categoryColor: '#eab308',
    description: 'Tagihan Indihome Oktober',
    merchant: 'Telkom Indonesia',
    tags: ['tagihan', 'wifi'],
    status: 'completed',
    createdAt: '2026-10-03T10:15:00Z',
    updatedAt: '2026-10-03T10:15:00Z',
  },
  {
    id: 'trx_04',
    type: 'income',
    amount: 7500000,
    date: '2026-10-01T09:00:00Z',
    accountId: 'acc_mandiri',
    accountName: 'Mandiri Payroll',
    categoryId: 'cat_salary',
    categoryName: 'Gaji & Pendapatan Tetap',
    categoryIcon: 'briefcase',
    categoryColor: '#059669',
    description: 'Gaji Bulanan Oktober',
    merchant: 'PT Solusi Teknologi',
    tags: ['gaji', 'utama'],
    status: 'completed',
    createdAt: '2026-10-01T09:00:00Z',
    updatedAt: '2026-10-01T09:00:00Z',
  },
  {
    id: 'trx_05',
    type: 'income',
    amount: 1000000,
    date: '2026-10-02T14:20:00Z',
    accountId: 'acc_bca',
    accountName: 'BCA Tahapan',
    categoryId: 'cat_freelance',
    categoryName: 'Proyek Sampingan',
    categoryIcon: 'laptop',
    categoryColor: '#0284c7',
    description: 'Pembayaran Desain UI Klien',
    merchant: 'Freelance Studio',
    tags: ['sidehustle'],
    status: 'completed',
    createdAt: '2026-10-02T14:20:00Z',
    updatedAt: '2026-10-02T14:20:00Z',
  },
  {
    id: 'trx_06',
    type: 'transfer',
    amount: 500000,
    date: '2026-10-02T16:00:00Z',
    accountId: 'acc_bca',
    accountName: 'BCA Tahapan',
    toAccountId: 'acc_dana',
    toAccountName: 'DANA E-Wallet',
    description: 'Top up Saldo DANA',
    status: 'completed',
    createdAt: '2026-10-02T16:00:00Z',
    updatedAt: '2026-10-02T16:00:00Z',
  },
  {
    id: 'trx_07',
    type: 'expense',
    amount: 185000,
    date: '2026-09-30T13:00:00Z',
    accountId: 'acc_cash',
    accountName: 'Uang Tunai / Dompet',
    categoryId: 'cat_shopping',
    categoryName: 'Belanja',
    categoryIcon: 'shopping-bag',
    categoryColor: '#8b5cf6',
    description: 'Belanja Sabun & Perlengkapan Mandi',
    merchant: 'Superindo',
    tags: ['kebutuhan'],
    status: 'completed',
    createdAt: '2026-09-30T13:00:00Z',
    updatedAt: '2026-09-30T13:00:00Z',
  },
  {
    id: 'trx_08',
    type: 'expense',
    amount: 75000,
    date: '2026-09-29T20:30:00Z',
    accountId: 'acc_dana',
    accountName: 'DANA E-Wallet',
    categoryId: 'cat_entertainment',
    categoryName: 'Hiburan',
    categoryIcon: 'film',
    categoryColor: '#ec4899',
    description: 'Tiket Bioskop XXI',
    merchant: 'Cinema XXI',
    tags: ['nonton', 'weekend'],
    status: 'completed',
    createdAt: '2026-09-29T20:30:00Z',
    updatedAt: '2026-09-29T20:30:00Z',
  },
];

// Initial Budgets for current month (2026-10)
export const initialBudgets: Budget[] = [
  {
    id: 'bdg_01',
    categoryId: 'cat_food',
    categoryName: 'Makanan & Minuman',
    categoryIcon: 'utensils',
    categoryColor: '#f97316',
    period: '2026-10',
    amount: 1500000,
    spent: 850000,
    remaining: 650000,
    percentage: 56.6,
    isRollover: false,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'bdg_02',
    categoryId: 'cat_transport',
    categoryName: 'Transportasi',
    categoryIcon: 'car',
    categoryColor: '#0284c7',
    period: '2026-10',
    amount: 500000,
    spent: 420000,
    remaining: 80000,
    percentage: 84.0, // Warning threshold!
    isRollover: false,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'bdg_03',
    categoryId: 'cat_entertainment',
    categoryName: 'Hiburan',
    categoryIcon: 'film',
    categoryColor: '#ec4899',
    period: '2026-10',
    amount: 500000,
    spent: 200000,
    remaining: 300000,
    percentage: 40.0,
    isRollover: false,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'bdg_04',
    categoryId: 'cat_bills',
    categoryName: 'Tagihan & Utilitas',
    categoryIcon: 'zap',
    categoryColor: '#eab308',
    period: '2026-10',
    amount: 800000,
    spent: 750000,
    remaining: 50000,
    percentage: 93.75, // Warning threshold!
    isRollover: false,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
];

// Initial Saving Goals
export const initialSavings: SavingGoal[] = [
  {
    id: 'svg_laptop',
    name: 'Upgrade Laptop Kerja',
    targetAmount: 15000000,
    currentAmount: 8500000,
    targetDate: '2026-12-31',
    category: 'Elektronik & Gadget',
    color: '#0284c7',
    icon: 'laptop',
    notes: 'Untuk produktivitas programming & desain',
    isArchived: false,
    contributions: [
      { id: 'cnt_01', savingGoalId: 'svg_laptop', amount: 3500000, date: '2026-08-01', notes: 'Setoran awal', createdAt: '2026-08-01T00:00:00Z' },
      { id: 'cnt_02', savingGoalId: 'svg_laptop', amount: 2500000, date: '2026-09-01', notes: 'Alokasi gaji September', createdAt: '2026-09-01T00:00:00Z' },
      { id: 'cnt_03', savingGoalId: 'svg_laptop', amount: 2500000, date: '2026-10-01', notes: 'Alokasi gaji Oktober', createdAt: '2026-10-01T00:00:00Z' },
    ],
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'svg_emergency',
    name: 'Dana Darurat 6 Bulan',
    targetAmount: 20000000,
    currentAmount: 12000000,
    targetDate: '2027-03-31',
    category: 'Keamanan Finansial',
    color: '#059669',
    icon: 'shield-check',
    notes: 'Disimpan di deposito/Reksadana Pasar Uang',
    isArchived: false,
    contributions: [
      { id: 'cnt_e01', savingGoalId: 'svg_emergency', amount: 10000000, date: '2026-07-01', notes: 'Tabungan awal', createdAt: '2026-07-01T00:00:00Z' },
      { id: 'cnt_e02', savingGoalId: 'svg_emergency', amount: 2000000, date: '2026-09-25', notes: 'Bonus kuartal', createdAt: '2026-09-25T00:00:00Z' },
    ],
    createdAt: '2026-07-01T00:00:00Z',
    updatedAt: '2026-09-25T00:00:00Z',
  },
];

// Initial Debts & Receivables
export const initialDebts: Debt[] = [
  {
    id: 'dbt_andi',
    type: 'debt', // Saya berhutang ke Andi
    personName: 'Andi Pratama',
    totalAmount: 1000000,
    remainingAmount: 1000000,
    startDate: '2026-09-20',
    dueDate: '2026-10-20',
    status: 'active',
    description: 'Pinjaman talangan tiket pesawat',
    payments: [],
    createdAt: '2026-09-20T00:00:00Z',
    updatedAt: '2026-09-20T00:00:00Z',
  },
  {
    id: 'dbt_budi',
    type: 'receivable', // Budi berhutang ke saya (Piutang)
    personName: 'Budi Hartono',
    totalAmount: 1500000,
    remainingAmount: 500000,
    startDate: '2026-09-01',
    dueDate: '2026-10-15',
    status: 'partially_paid',
    description: 'Patungan servis motor',
    payments: [
      { id: 'pay_01', debtId: 'dbt_budi', amount: 1000000, date: '2026-09-25', notes: 'Cicilan transfer BCA', createdAt: '2026-09-25T00:00:00Z' },
    ],
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-25T00:00:00Z',
  },
];

// Initial Recurring Transactions
export const initialRecurring: RecurringTransaction[] = [
  {
    id: 'rec_salary',
    name: 'Gaji Bulanan',
    type: 'income',
    amount: 7500000,
    frequency: 'monthly',
    dayOfMonth: 25,
    startDate: '2026-01-01',
    nextExecutionDate: '2026-10-25',
    accountId: 'acc_mandiri',
    accountName: 'Mandiri Payroll',
    categoryId: 'cat_salary',
    categoryName: 'Gaji & Pendapatan Tetap',
    isActive: true,
    notes: 'Payroll otomatis tanggal 25',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'rec_internet',
    name: 'Internet Indihome',
    type: 'expense',
    amount: 350000,
    frequency: 'monthly',
    dayOfMonth: 1,
    startDate: '2026-01-01',
    nextExecutionDate: '2026-11-01',
    accountId: 'acc_bca',
    accountName: 'BCA Tahapan',
    categoryId: 'cat_bills',
    categoryName: 'Tagihan & Utilitas',
    isActive: true,
    notes: 'Autodebet setiap tanggal 1',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

// Initial Notifications
export const initialNotifications: AppNotification[] = [
  {
    id: 'notif_01',
    type: 'budget_warning',
    title: 'Peringatan Anggaran: Tagihan & Utilitas',
    message: 'Pengeluaran kategori Tagihan telah mencapai 93.8% dari limit anggaran.',
    date: '2026-10-04T12:00:00Z',
    isRead: false,
    link: '/budgets',
  },
  {
    id: 'notif_02',
    type: 'debt_due',
    title: 'Piutang Mendekati Jatuh Tempo',
    message: 'Budi Hartono memiliki sisa piutang Rp 500.000 jatuh tempo 15 Oktober 2026.',
    date: '2026-10-04T09:00:00Z',
    isRead: false,
    link: '/debts',
  },
  {
    id: 'notif_03',
    type: 'recurring_upcoming',
    title: 'Transaksi Berulang Mendatang',
    message: 'Gaji Bulanan Rp 7.500.000 dijadwalkan pada 25 Oktober 2026.',
    date: '2026-10-03T08:00:00Z',
    isRead: true,
    link: '/recurring',
  },
];

// State Store with localStorage persistence
class MockStore {
  getAccounts(): Account[] {
    return loadFromStorage('accounts', initialAccounts);
  }
  setAccounts(accounts: Account[]) {
    saveToStorage('accounts', accounts);
  }

  getCategories(): Category[] {
    return loadFromStorage('categories', initialCategories);
  }
  setCategories(categories: Category[]) {
    saveToStorage('categories', categories);
  }

  getTransactions(): Transaction[] {
    return loadFromStorage('transactions', initialTransactions);
  }
  setTransactions(transactions: Transaction[]) {
    saveToStorage('transactions', transactions);
  }

  getBudgets(): Budget[] {
    return loadFromStorage('budgets', initialBudgets);
  }
  setBudgets(budgets: Budget[]) {
    saveToStorage('budgets', budgets);
  }

  getSavings(): SavingGoal[] {
    return loadFromStorage('savings', initialSavings);
  }
  setSavings(savings: SavingGoal[]) {
    saveToStorage('savings', savings);
  }

  getDebts(): Debt[] {
    return loadFromStorage('debts', initialDebts);
  }
  setDebts(debts: Debt[]) {
    saveToStorage('debts', debts);
  }

  getRecurring(): RecurringTransaction[] {
    return loadFromStorage('recurring', initialRecurring);
  }
  setRecurring(recurring: RecurringTransaction[]) {
    saveToStorage('recurring', recurring);
  }

  getNotifications(): AppNotification[] {
    return loadFromStorage('notifications', initialNotifications);
  }
  setNotifications(notifications: AppNotification[]) {
    saveToStorage('notifications', notifications);
  }
}

export const mockStore = new MockStore();
