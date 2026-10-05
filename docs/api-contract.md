# API CONTRACT — PERSONAL FINANCIAL TRACKER

Dokumen ini mendefinisikan seluruh kontrak API antara Frontend Finanku dan Backend (NestJS).
Seluruh interaksi frontend mengacu pada spesifikasi ini.

---

## 1. Konvensi Umum

- **Base URL**: `/api/v1` (atau konfigurasi `VITE_API_URL` / `NEXT_PUBLIC_API_URL`)
- **Format Pertukaran Data**: `application/json`
- **Mata Uang**: Nominal moneter dikirimkan dalam integer (Rupiah tanpa desimal, misal: `12500000`).
- **Tanggal & Waktu**: Format ISO 8601 (`YYYY-MM-DD` untuk tanggal murni, `YYYY-MM-DDTHH:mm:ss.sssZ` untuk timestamp).
- **Autentikasi**: Bearer Token via Header `Authorization: Bearer <access_token>` atau Secure HTTP-only Cookie.

### Format Standar Sukses
```json
{
  "success": true,
  "data": { ... },
  "message": "Operasi berhasil"
}
```

### Format Standar Error
```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Nominal harus lebih besar dari 0",
  "details": [
    {
      "field": "amount",
      "issue": "must be a positive number"
    }
  ]
}
```

### Format Standar Pagination
```json
{
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 128,
    "totalPages": 7
  }
}
```

---

## 2. Autentikasi (`/auth`)

### POST `/auth/login`
- **Tujuan**: Autentikasi pengguna dengan email dan password.
- **Auth**: None
- **Request Body**:
  ```json
  {
    "email": "user@finanku.id",
    "password": "password123"
  }
  ```
- **Response 200**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "usr_01",
        "name": "Budi Santoso",
        "email": "user@finanku.id",
        "role": "user",
        "createdAt": "2026-01-01T00:00:00Z"
      },
      "token": "jwt_token_sample",
      "expiresIn": 86400
    }
  }
  ```

### POST `/auth/logout`
- **Tujuan**: Mengakhiri sesi pengguna.
- **Auth**: Bearer Token
- **Response 200**:
  ```json
  {
    "success": true,
    "message": "Logout berhasil"
  }
  ```

### GET `/auth/me`
- **Tujuan**: Mengambil data profil pengguna yang sedang login.
- **Auth**: Bearer Token
- **Response 200**:
  ```json
  {
    "success": true,
    "data": {
      "id": "usr_01",
      "name": "Budi Santoso",
      "email": "user@finanku.id",
      "role": "user",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  }
  ```

---

## 3. Rekening & Sumber Uang (`/accounts`)

### GET `/accounts`
- **Tujuan**: Mengambil seluruh daftar rekening aktif pengguna.
- **Query Params**: `includeArchived=true|false`
- **Response 200**:
  ```json
  {
    "data": [
      {
        "id": "acc_01",
        "name": "BCA Tahapan",
        "type": "bank",
        "bankName": "Bank Central Asia",
        "accountNumber": "8801928371",
        "openingBalance": 2000000,
        "currentBalance": 5500000,
        "currency": "IDR",
        "color": "#0284c7",
        "icon": "building-2",
        "isArchived": false,
        "createdAt": "2026-01-01T00:00:00Z",
        "updatedAt": "2026-10-01T00:00:00Z"
      }
    ]
  }
  ```

### POST `/accounts`
- **Tujuan**: Membuat rekening baru.
- **Request Body**:
  ```json
  {
    "name": "Kartu Kredit BCA Everyday",
    "type": "credit_card",
    "bankName": "BCA",
    "openingBalance": 0,
    "creditLimit": 15000000,
    "billingCycleDay": 15,
    "dueDateDay": 5,
    "color": "#dc2626"
  }
  ```

### PATCH `/accounts/:id`
- **Tujuan**: Mengubah data rekening atau melakukan pengarsipan (`isArchived: true`).

### DELETE `/accounts/:id`
- **Tujuan**: Menghapus rekening (hanya jika belum ada transaksi terkait, jika ada gunakan archive).

---

## 4. Kategori Transaksi (`/categories`)

### GET `/categories`
- **Query Params**: `type=income|expense`
- **Response 200**:
  ```json
  {
    "data": [
      {
        "id": "cat_food",
        "name": "Makanan & Minuman",
        "type": "expense",
        "icon": "utensils",
        "color": "#f97316",
        "subcategories": [
          { "id": "cat_food_resto", "name": "Restoran", "parentId": "cat_food" },
          { "id": "cat_food_coffee", "name": "Kopi & Kafe", "parentId": "cat_food" }
        ]
      }
    ]
  }
  ```

### POST `/categories` & PATCH `/categories/:id` & DELETE `/categories/:id`

---

## 5. Transaksi (`/transactions`)

### GET `/transactions`
- **Query Params**:
  - `page`: number (default: 1)
  - `limit`: number (default: 20)
  - `search`: string
  - `type`: `income` | `expense` | `transfer` | `all`
  - `accountId`: string
  - `categoryId`: string
  - `startDate`: string (`YYYY-MM-DD`)
  - `endDate`: string (`YYYY-MM-DD`)
  - `minAmount`: number
  - `maxAmount`: number
  - `sortBy`: `date` | `amount` | `createdAt`
  - `sortOrder`: `asc` | `desc`
- **Response 200**:
  ```json
  {
    "data": [
      {
        "id": "trx_01",
        "type": "expense",
        "amount": 45000,
        "date": "2026-10-04T12:30:00Z",
        "accountId": "acc_01",
        "accountName": "BCA Tahapan",
        "categoryId": "cat_food",
        "categoryName": "Makanan & Minuman",
        "description": "Makan Siang Nasi Padang",
        "merchant": "Resto Padang Sederhana",
        "tags": ["lunch", "kantor"],
        "status": "completed"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 128,
      "totalPages": 7
    }
  }
  ```

### POST `/transactions`
- **Request Body (Expense/Income)**:
  ```json
  {
    "type": "expense",
    "amount": 45000,
    "date": "2026-10-04",
    "accountId": "acc_01",
    "categoryId": "cat_food",
    "description": "Makan Siang Nasi Padang",
    "merchant": "Resto Padang Sederhana",
    "notes": "Bayar pakai QRIS"
  }
  ```
- **Request Body (Transfer)**:
  ```json
  {
    "type": "transfer",
    "amount": 500000,
    "date": "2026-10-04",
    "accountId": "acc_01",
    "toAccountId": "acc_ewallet",
    "description": "Top up Gopay"
  }
  ```

---

## 6. Anggaran / Budgets (`/budgets`)

### GET `/budgets`
- **Query Params**: `period=YYYY-MM` (default: bulan berjalan)
- **Response 200**:
  ```json
  {
    "data": [
      {
        "id": "bdg_01",
        "categoryId": "cat_food",
        "categoryName": "Makanan & Minuman",
        "period": "2026-10",
        "amount": 1500000,
        "spent": 850000,
        "remaining": 650000,
        "percentage": 56.6,
        "isRollover": false
      }
    ]
  }
  ```

---

## 7. Tabungan / Saving Goals (`/savings`)

### GET `/savings` & POST `/savings`
### POST `/savings/:id/contributions`
- **Request Body**:
  ```json
  {
    "amount": 500000,
    "date": "2026-10-04",
    "accountId": "acc_01",
    "notes": "Tabungan bulanan"
  }
  ```

---

## 8. Hutang & Piutang (`/debts`)

### GET `/debts` & POST `/debts`
- **Query Params**: `type=debt|receivable`, `status=active|paid|overdue`
### POST `/debts/:id/payments`
- **Request Body**:
  ```json
  {
    "amount": 500000,
    "date": "2026-10-04",
    "accountId": "acc_01",
    "notes": "Cicilan ke-1"
  }
  ```

---

## 9. Recurring Transactions (`/recurring`)

### GET `/recurring` & POST `/recurring`
- **Request Body**:
  ```json
  {
    "name": "Langganan Internet Indihome",
    "type": "expense",
    "amount": 350000,
    "frequency": "monthly",
    "dayOfMonth": 1,
    "startDate": "2026-01-01",
    "accountId": "acc_01",
    "categoryId": "cat_bills"
  }
  ```

---

## 10. Dashboard & Laporan (`/dashboard`, `/reports`)

### GET `/dashboard`
- Mengembalikan data ringkas:
  - `totalBalance`, `totalIncome`, `totalExpense`, `cashFlow`
  - `cashFlowOverview` (7 hari / bulan ini)
  - `expenseByCategory`
  - `budgets`
  - `savingGoals`
  - `upcomingItems` (recurring + hutang jatuh tempo)
  - `recentTransactions` (5-10 transaksi terakhir)

### GET `/reports/summary`
- Mengembalikan rincian per periode (Bulan ini, 3 Bulan, 6 Bulan, 1 Tahun, Custom):
  - Perbandingan Income vs Expense
  - Breakdown Kategori
  - Trend Arus Kas
  - Kalkulasi Net Worth (Aset - Liabilitas)
