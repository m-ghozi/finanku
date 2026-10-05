# Panduan Pengembangan (Development Guide)

## 1. Menjalankan Fintrack

### Prasyarat
- Node.js versi 18+ (atau Bun / NPM)
- PostgreSQL (lokal atau Supabase) untuk backend

### Instalasi Dependensi
```bash
npm install
```

### Menjalankan Backend (NestJS)
```bash
# Siapkan backend/.env (lihat backend/.env.example), lalu:
npm run prisma:migrate -w backend   # buat/Update skema database
npm run dev:api                     # API aktif di http://localhost:3001/api/v1
```

### Menjalankan Frontend
```bash
npm run dev
```
Aplikasi akan aktif pada `http://localhost:3000`.

### Verifikasi Build
```bash
npm run build
npm run build:api
```

---

## 2. Konfigurasi API

Frontend selalu berbicara dengan backend NestJS. Atur URL API di `.env`:

```env
VITE_API_URL=http://localhost:3001/api/v1
```

> Catatan: `VITE_API_URL` harus menyertakan prefiks `/api/v1`. Tidak ada lagi
> mode mock — seluruh data dibaca/ditulis ke database melalui API.

---

## 3. Fitur Utama yang Tersedia

1. **Dashboard Komprehensif**: Saldo total, pemasukan bulanan, pengeluaran bulanan, arus kas bersih, grafik Income vs Expense, Donut kategori, anggaran & tabungan aktif, serta transaksi terakhir.
2. **Transaksi Multi-filter**: Filter rentang tanggal, jenis (Pemasukan, Pengeluaran, Transfer), akun, kategori, pencarian teks dengan debounce.
3. **Quick Input Parser**: Mendukung format cepat (misal: `makan siang 35000` atau `kopi 25000`) dengan pratinjau konfirmasi sebelum tersimpan.
4. **Rekening & Kartu Kredit**: Dukungan multi-rekening (Bank, Kas, E-Wallet, Kartu Kredit dengan limit & sisa kredit).
5. **Kategori Berjenjang**: Kategori induk dan sub-kategori kustom dengan warna dan ikon.
6. **Anggaran / Budgets**: Peringatan visual (warna kuning saat >80%, merah saat >100%).
7. **Target Tabungan**: Progress bar persentase, tanggal target, penambahan setoran langsung.
8. **Hutang & Piutang**: Tracking tanggal jatuh tempo, status belum lunas/lunas, dan riwayat pembayaran cicilan.
9. **Recurring / Berulang**: Pengaturan transaksi berkala mingguan/bulanan.
10. **Laporan & Net Worth**: Visualisasi interaktif Recharts untuk arus kas, breakdown kategori, dan kalkulasi kekayaan bersih.
11. **Perencanaan Finansial**: Kalkulator alokasi 50/30/20 dan estimasi pengeluaran mendatang.
12. **Privasi Saldo**: Sembunyikan saldo hanya dengan 1 klik.
13. **PWA**: PWA install button dan offline indicator banner.
