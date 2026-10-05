# UI Architecture & Design System — Finanku

## 1. Filosofi Desain
Finanku mengusung estetika minimalis finansial modern:
- **Tone & Palette**: Netral monokromatik (Zinc/Slate) dengan aksen hijau emerald (`emerald-600`) sebagai warna identitas finansial.
- **Semantic Feedback**:
  - Pemasukan (Income) / Laba: `text-emerald-600 dark:text-emerald-400`, `bg-emerald-50 dark:bg-emerald-950/30`
  - Pengeluaran (Expense) / Defisit: `text-rose-600 dark:text-rose-400`, `bg-rose-50 dark:bg-rose-950/30`
  - Peringatan Anggaran (>80%): `text-amber-600 dark:text-amber-400`, `bg-amber-50`
  - Anggaran Terlampaui (>100%): `text-rose-700 font-semibold`
  - Netral / Transfer: `text-sky-600 dark:text-sky-400`, `bg-sky-50`

## 2. Privacy Mode (Hide Balance)
Sesuai kebutuhan privasi pengguna di ruang publik:
- Global state `isBalanceHidden` disimpan di `localStorage` (`finanku_hide_balance`).
- Komponen terpusat `<MoneyDisplay />` merender `Rp ••••••••` ketika mode aktif.
- Tombol toggle mata terlihat di top bar / header untuk akses satu sentuhan.

## 3. Responsive Shell
- **Desktop (>= 1024px)**: Sidebar tetap di sisi kiri dengan daftar rute lengkap, ruang konten leluasa, dan tabel data tabular.
- **Tablet (768px - 1023px)**: Sidebar collapsible atau ikon ringkas.
- **Mobile (< 768px)**:
  - Header ramping dengan logo, toggle privasi, dan tombol notifikasi.
  - Bottom navigation bar dengan 5 aksi utama: Dashboard, Transaksi, Tambah Cepat (+), Rekening, Lainnya/Menu.
  - Tabel desktop diubah secara otomatis menjadi card view mobile yang ramah sentuhan.

## 4. Aksesibilitas & Micro-interactions
- Semua tombol aksi ikon memiliki `aria-label` atau tooltip.
- Form feedback interaktif dengan pesan kesalahan ramah bahasa Indonesia via Zod.
- Konfirmasi penghapusan (destructive action) menggunakan modal dialog terverifikasi.
