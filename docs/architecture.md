# Arsitektur Frontend — Fintrack Personal Financial Tracker

## 1. Prinsip Desain & Batasan Tanggung Jawab

Aplikasi Fintrack dirancang mengikuti prinsip Clean Architecture pada layer Frontend:

### Tanggung Jawab Frontend:
- Menghadirkan antarmuka pengguna yang minimalis, modern, dan intuitif.
- Menjaga state antarmuka lokal (modal dialog, filter pencarian, preferensi privasi saldo).
- Validasi input tingkat pertama menggunakan Zod dan React Hook Form.
- Komunikasi API terpusat melalui API Client (`src/lib/api/client.ts`) dan hook TanStack Query.
- Penanganan visual yang ramah: Skeleton loading, error boundary yang manusiawi, dan konfirmasi modal sebelum aksi destruktif.
- Pemformatan mata uang Rupiah (`Rp 1.500.000`), tanggal, dan persentase terpusat.
- PWA (Progressive Web App) dengan offline shell & caching.

### Tanggung Jawab Backend (NestJS):
- Aturan bisnis finansial (financial business rules, pembukuan berimbang).
- Rekonsiliasi transaksi recurring secara berkala.
- Kalkulasi aktual real-time untuk budget, rollover saldo, dan total net worth.
- Otentikasi dan otorisasi aman (JWT / HTTP-only session cookies).
- Integritas data dan pencatatan audit.

---

## 2. Struktur Modul & Folder

```
src/
├── types/              # Type definition TypeScript (domain models & DTOs)
├── lib/
│   ├── api/            # Centralized API service layer
│   │   ├── client.ts   # Axios/Fetch wrapper dengan switchable mock mode
│   │   ├── accounts.ts
│   │   ├── transactions.ts
│   │   └── ...
│   ├── utils.ts        # formatCurrency, formatDate, formatNumber, cn()
│   ├── privacy.ts      # Privacy toggle (Hide/Show balance)
│   └── parser.ts       # Text input parser ("makan siang 35000")
├── mocks/              # Mock data & mock in-memory mutation layer
├── hooks/              # Custom React hooks (TanStack Query mutations & queries)
├── components/
│   ├── ui/             # Primitif UI (Button, Input, Modal, Badge, Card, dll.)
│   ├── shared/         # MoneyDisplay, StatCard, EmptyState, ConfirmDialog, dll.
│   ├── layout/         # AppLayout, Sidebar, Header, MobileNav
│   ├── dashboard/      # Widget dashboard
│   ├── transactions/   # Tabel, filter bar, modal form transaksi
│   ├── accounts/       # Kartu akun, detail kartu kredit
│   ├── categories/     # Hierarki kategori
│   ├── budgets/        # Monitoring anggaran & warning
│   ├── savings/        # Target tabungan & progress
│   ├── debts/          # Catatan hutang & piutang
│   ├── recurring/      # Manajemen transaksi berkala
│   └── reports/        # Grafik analitik arus kas & net worth
└── docs/               # Dokumentasi kontrak API & arsitektur
```

---

## 3. Strategi Transisi Mock API ke Backend

Aplikasi dikontrol oleh Environment Variable:
- `VITE_USE_MOCK_API=true` (Default untuk preview/pengembangan mandiri tanpa backend)
- `VITE_API_URL=http://localhost:3001`

Ketika backend NestJS telah selesai dibangun:
1. Ganti konfigurasi ke `VITE_USE_MOCK_API=false`.
2. Seluruh hook TanStack Query (`useTransactions`, `useAccounts`, dll.) tetap identik karena menggunakan antarmuka service DTO yang sama.
3. Tidak diperlukan penulisan ulang pada komponen UI.
