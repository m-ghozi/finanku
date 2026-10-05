# Fintrack — Personal Financial Tracker Frontend

Fintrack adalah aplikasi frontend modern, minimalis, dan berbasis data untuk pengelolaan keuangan pribadi (Personal Financial Tracker). Dibangun dengan fokus pada kejelasan data, responsivitas tinggi (desktop & mobile-first), serta kepatuhan standar Progressive Web App (PWA).

Aplikasi ini menggunakan **Bahasa Indonesia** dan mata uang **Rupiah (IDR)** sebagai standar utama.

---

## Fitur Utama

1. **Dashboard Eksekutif**:
   - Saldo Total, Pemasukan Bulanan, Pengeluaran Bulanan, dan Arus Kas Bersih (Net Cash Flow).
   - Visualisasi Spending Overview (Income vs Expense) dengan filter periode waktu (7 Hari, Bulan Ini, 3 Bulan, 6 Bulan, 1 Tahun).
   - Donut Chart alokasi pengeluaran per kategori.
   - Ringkasan progress Anggaran (Budget) dan Target Tabungan (Saving Goals).
   - Daftar transaksi terkini dan pengingat tagihan/hutang mendatang (Upcoming).

2. **Manajemen Transaksi Komprehensif**:
   - Tab filter cepat: Semua, Pemasukan, Pengeluaran, dan Transfer.
   - Pencarian instan dengan debounce (350ms) dan filter multi-kriteria (rentang tanggal, akun, kategori, limit nominal).
   - Tampilan adaptif: Tabel data profesional pada desktop (≥ 768px) dan Card list yang ramah sentuhan pada smartphone (< 768px).
   - Dukungan pagination server-side.

3. **Quick Input Parser**:
   - Pencatatan transaksi secepat kilat menggunakan kalimat natural berbasis aturan, contoh:
     - `makan siang 35000`
     - `kopi starbucks 55k`
     - `bensin pertamax 50rb`
     - `gaji bulanan 7.5jt`
   - Disertai konfirmasi pratinjau sebelum transaksi disimpan.

4. **Multi-Rekening & Kartu Kredit**:
   - Mendukung rekening Bank (BCA, Mandiri, BRI, dll.), Kas Dompet, Dompet Digital (DANA, GoPay, OVO), dan Kartu Kredit.
   - UI khusus Kartu Kredit: Credit Limit, Outstanding Terpakai, Sisa Limit Tersedia, tanggal billing cycle, dan tanggal jatuh tempo pembayaran.

5. **Kategori Berjenjang (Hierarki)**:
   - Pengelompokan Kategori Induk dan Sub-kategori (misal: *Makanan* &rarr; *Restoran*, *Makan Siang*, *Kopi*).
   - Kustomisasi warna visual dan tipe (Pemasukan / Pengeluaran).

6. **Anggaran Keuangan (Budgets)**:
   - Batas pengeluaran per kategori dengan indikator visual:
     - Hijau: Kondisi aman (< 80%)
     - Kuning (Warning): Mendekati batas (≥ 80%)
     - Merah (Exceeded): Melebihi limit (≥ 100%)
   - Opsi rollover sisa anggaran ke bulan berikutnya.

7. **Target Tabungan (Saving Goals)**:
   - Pelacakan tujuan finansial (laptop kerja, dana darurat, liburan).
   - Riwayat setoran parsial bertahap dengan kalkulasi persentase dan sisa target.

8. **Hutang & Piutang**:
   - Pemisahan jelas antara **Hutang** (kewajiban saya) dan **Piutang** (hak tagih dari orang lain).
   - Pelunasan bertahap (cicilan) dan pemantauan tanggal jatuh tempo.

9. **Transaksi Berulang (Recurring)**:
   - Pengaturan jadwal autodebet dan payroll rutin (bulanan, mingguan, harian).

10. **Laporan & Net Worth (Kekayaan Bersih)**:
    - Analisis arus kas bulanan berbasis grafik Recharts.
    - Kalkulasi **Net Worth**: Total Aset (Aktiva) dikurangi Total Liabilitas (Pasiva).

11. **Perencanaan Finansial (Financial Planning)**:
    - Kalkulator kerangka alokasi 50/30/20 (Kebutuhan 50%, Keinginan 30%, Tabungan/Investasi 20%).
    - Tolok ukur dana darurat 6 bulan pengeluaran pokok.

12. **Mode Sensor Privasi (Hide Balance)**:
    - Sembunyikan saldo hanya dengan 1 sentuhan (ikon mata pada top bar).
    - Nilai disamarkan menjadi `Rp ••••••••` dan tersimpan persisten di penyimpanan lokal.

13. **PWA (Progressive Web App)**:
    - Manifest, service worker auto-update, icon maskable, tombol instalasi in-app, serta panduan untuk perangkat iOS Safari.

---

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (Clean Financial Theme)
- **Data Fetching & Caching**: TanStack Query (React Query)
- **Form Management & Validation**: React Hook Form + Zod
- **Visualisasi Grafik**: Recharts
- **Tanggal & Waktu**: date-fns (Indonesian Locale)
- **Ikonografi**: Lucide React
- **PWA Tooling**: vite-plugin-pwa

---

## Memulai Pengembangan

### 1. Prasyarat
- Node.js versi 18 ke atas
- NPM / Bun / Yarn

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (`.env`)
Salin file `.env.example` menjadi `.env`:
```env
# URL backend NestJS (wajib menyertakan prefiks /api/v1)
VITE_API_URL=http://localhost:3001/api/v1
```

### 4. Jalankan Backend & Frontend
```bash
# Terminal 1 — API NestJS (butuh PostgreSQL; atur backend/.env dari backend/.env.example)
npm run prisma:migrate -w backend
npm run dev:api

# Terminal 2 — Frontend Vite
npm run dev
```
Buka browser pada alamat `http://localhost:3000`.

### 5. Kompilasi & Build Produksi
```bash
npm run build
```

---

## Arsitektur & Integrasi Backend NestJS

Frontend ini menerapkan layer API terpusat (`src/lib/api/`) dengan DTO dan tipe TypeScript lengkap. Tidak ada mode mock — seluruh data dibaca dan ditulis melalui REST API backend NestJS (`backend/`).

Konfigurasi hanya memerlukan `VITE_API_URL` yang mengarah ke API. Autentikasi menggunakan Bearer JWT; sesi kedaluwarsa (401) otomatis mengembalikan pengguna ke halaman login.

Dokumentasi spesifikasi lengkap dapat dilihat pada:
- [`docs/api-contract.md`](./docs/api-contract.md)
- [`docs/architecture.md`](./docs/architecture.md)
- [`docs/ui-architecture.md`](./docs/ui-architecture.md)
- [`docs/development.md`](./docs/development.md)
