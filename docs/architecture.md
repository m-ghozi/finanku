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
│   │   ├── client.ts   # Fetch wrapper: Bearer token, envelope unwrap, 401 handling
│   │   ├── accounts.ts
│   │   ├── transactions.ts
│   │   └── ...
│   ├── utils.ts        # formatCurrency, formatDate, formatNumber, cn()
│   ├── privacy.ts      # Privacy toggle (Hide/Show balance)
│   └── parser.ts       # Text input parser ("makan siang 35000")
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

## 3. Integrasi Backend

Frontend tidak lagi memiliki lapisan mock. Seluruh data mengalir melalui:

```
View → Hook (TanStack Query) → Service (src/lib/api/*) → apiClient → NestJS /api/v1
```

Konfigurasi cukup satu variabel di `.env`:

```env
VITE_API_URL=http://localhost:3001/api/v1
```

- Autentikasi memakai Bearer JWT (`fintrack_token` di localStorage). Respons 401
  otomatis menghapus sesi dan mengarahkan ulang ke `/login`.
- Respons sukses mengikuti envelope `{ success, data }`; service layer membuka
  `data` sehingga komponen UI tidak perlu tahu bentuk amplopnya.
- Hook TanStack Query tetap identik dengan kontrak service DTO, jadi penambahan
  endpoint baru hanya menyentuh service + backend, bukan komponen UI.
