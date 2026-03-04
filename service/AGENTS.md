# AGENTS.md — POS Restaurant Service (v18.0.1)

> Dokumentasi pengembangan untuk AI Agent. Berisi arsitektur, flow bisnis, database schema, endpoint API, dan konvensi kode.

---

## 1. Ringkasan Proyek

Sistem **Point of Sale (POS) untuk Restoran** berbasis Node.js + Express 5, dengan database MySQL/MariaDB. Mendukung:

- **Multi-outlet** (banyak cabang restoran)
- **Multi-terminal** (banyak perangkat POS per outlet)
- **Dine-in** (table map, floor plan) dan **Counter/Take-out** mode
- **Kitchen printing** via ESC/POS thermal printer (TCP/IP)
- **Real-time sync** via Socket.IO
- **Split bill, merge table, transfer items**
- **Cashback engine** terintegrasi
- **17+ laporan bisnis** (HTML/EJS rendered)
- **Dual-language UI** (EN/ID)

---

## 2. Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express 5.1 |
| Database | MySQL/MariaDB (via `mysql2` pool, async/await) |
| Auth | JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`) |
| Templating | Handlebars (`.hbs` — receipt/kitchen) + EJS (`.ejs` — reports) |
| Real-time | Socket.IO (server + client) |
| Printing | `escpos` + `escpos-network` (ESC/POS thermal, TCP/IP) |
| Logging | Winston (daily rotating file) |
| Barcode/QR | `jsbarcode`, `qrcode` |
| Lainnya | `csv-parser`, `dotenv` |

---

## 3. Struktur Direktori

```
service/
├── server.js              # Entry point — Express app + Socket.IO server
├── printWorker.js          # Background print queue worker (Socket.IO client)
├── token.js                # Utility: generate JWT license token
├── .env                    # Environment variables (lihat §4)
├── config/
│   └── db.js               # MySQL2 connection pool (async/await)
├── routes/
│   ├── admin/              # Admin panel routes
│   │   └── loginAdmin.js
│   ├── global/             # Shared global routes
│   │   └── global.js
│   ├── general/            # Master data CRUD routes
│   │   ├── employee.js
│   │   ├── payment.js
│   │   ├── discount.js
│   │   ├── cashback.js
│   │   ├── language.js
│   │   ├── dailySchedule.js
│   │   ├── workStation.js
│   │   └── other.js
│   ├── outlet/             # Outlet management routes
│   │   ├── outlet.js
│   │   ├── tableMap.js
│   │   ├── floorMap.js
│   │   └── tableMapTemplate.js
│   ├── menu/               # Menu management routes
│   │   └── menu.js
│   ├── report/             # Admin report routes
│   │   ├── dailyClose.js
│   │   ├── transaction.js
│   │   └── userLogin.js
│   └── terminal/           # POS terminal routes (17 files)
│       ├── loginPos.js
│       ├── tableMap.js
│       ├── menuItemPos.js
│       ├── bill.js
│       ├── payment.js
│       ├── daily.js
│       ├── transaction.js
│       ├── items.js
│       ├── printing.js
│       ├── printQueue.js
│       ├── cashier.js
│       ├── receipt.js
│       ├── userLog.js
│       ├── ux.js
│       ├── language.js
│       ├── menuReports.js
│       └── reports.js
├── controllers/
│   ├── admin/              # Admin controllers
│   │   └── login/
│   ├── terminal/           # POS terminal controllers (19 files)
│   │   ├── loginController.js
│   │   ├── tableMapController.js
│   │   ├── menuItemPosController.js   # 2826 baris — controller terbesar
│   │   ├── menuItemCartController.js
│   │   ├── menuItemFuncController.js
│   │   ├── billController.js
│   │   ├── paymentController.js
│   │   ├── dailyController.js
│   │   ├── transactionController.js
│   │   ├── cashierController.js
│   │   ├── printingController.js
│   │   ├── printQueueController.js
│   │   ├── receiptController.js
│   │   ├── itemsController.js
│   │   ├── reportsController.js       # 2649 baris — laporan terbesar
│   │   ├── userLogController.js
│   │   ├── uxFunctionController.js
│   │   ├── languageController.js
│   │   └── menuReportsController.js
│   ├── general/            # Master data CRUD controllers
│   ├── menu/               # Menu CRUD controllers
│   ├── outlet/             # Outlet CRUD controllers
│   └── report/             # Admin report controllers
├── helpers/
│   ├── IsAuth.js           # JWT middleware (validateToken, checkReportToken)
│   ├── autoNumber.js       # Auto-increment ID generator
│   ├── bill.js             # Core billing/cart calculation engine (1561 baris)
│   ├── cashcback.js        # Cashback calculation + QR code
│   ├── printer.js          # ESC/POS printing engine + print queue
│   ├── sendOrder.js        # Send order data assembly
│   ├── global.js           # Shared utilities (date, currency, text formatting)
│   ├── handlebarsFunction.js # Custom Handlebars helpers
│   ├── logger.js           # Winston daily file logger
│   ├── barcode.js          # Barcode generator (CODE128)
│   ├── convertToCsv.js     # Array → CSV file export
│   └── exportToFile.js     # Send order + table checker file export
├── public/
│   ├── template/           # Handlebars templates (.hbs)
│   │   ├── bill.hbs
│   │   ├── billPaid.hbs
│   │   ├── receipt.hbs
│   │   ├── receiptPaid.hbs
│   │   ├── kitchen.hbs
│   │   └── tableChecker.hbs
│   └── output/             # Generated output files
│       ├── *.csv           # Daily close exports
│       ├── bill/           # Bill text exports
│       ├── billClosed/     # Closed bill exports
│       ├── sendOrder/      # Kitchen order exports
│       ├── tableChecker/   # Table checker exports
│       └── dailyClose/     # Daily close exports
├── views/
│   └── reports/            # EJS templates for reports
│       ├── salesSummaryReport.ejs
│       ├── cashierReports.ejs
│       ├── itemizedSalesDetail.ejs
│       ├── itemizedSalesSummary.ejs
│       ├── itemizedSales.ejs
│       ├── itemCount.ejs
│       ├── checkDiscountListing.ejs
│       ├── salesHistoryReport.ejs
│       ├── salesReportPerHour.ejs
│       ├── closeCheckReports.ejs
│       ├── ccPayment.ejs
│       ├── scHistory.ejs
│       ├── taxHistory.ejs
│       ├── employeeItemizedSales.ejs
│       ├── managerClose.ejs
│       ├── serverCloseReport.ejs
│       └── dailyStartCloseHistory.ejs
└── backupDb/               # SQL backup files
```

---

## 4. Environment Variables (`.env`)

```env
PRODUCTION=false            # true = enforce JWT validation, false = bypass
SECRET_KEY=<jwt-secret>     # JWT signing key
NODE_ENV=development
PREFIX=/                    # API route prefix (all routes start with this)
TERMINAL=terminal/          # Terminal route sub-prefix
TO_LOCALE_STRING=id-ID      # Locale for number/date formatting
PORT=3000                   # HTTP server port
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pos_resto           # MySQL database name
TIMEZONE='+07:00'           # WIB (Western Indonesia Time)
LOCALHOST=http://localhost:3000  # Used by printWorker.js for Socket.IO connection
DUMMY_PRINTER=false         # true = simulate printing (no real printer)
```

---

## 5. Arsitektur & Flow Utama

### 5.1. High Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Angular SPA)                      │
│         admin18.0.1/ (Admin) + terminal18.0.1/ (POS)        │
└─────────────┬──────────────────────┬────────────────────────┘
              │ HTTP REST API        │ Socket.IO (real-time)
              ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     server.js (Express + Socket.IO)          │
│  Port: 3000                                                  │
│  ┌─────────────────┐  ┌──────────────────────────────────┐  │
│  │  Admin Routes     │  │  Terminal Routes                  │  │
│  │  /login           │  │  /terminal/login                  │  │
│  │  /global          │  │  /terminal/tableMap               │  │
│  │  /employee        │  │  /terminal/menuItemPos            │  │
│  │  /payment         │  │  /terminal/bill                   │  │
│  │  /discount        │  │  /terminal/payment                │  │
│  │  /menu            │  │  /terminal/daily                  │  │
│  │  /outlet          │  │  /terminal/transaction            │  │
│  │  /tableMap        │  │  /terminal/printing               │  │
│  │  /floorMap        │  │  /terminal/cashier                │  │
│  │  ...              │  │  /terminal/reports                │  │
│  └─────────────────┘  └──────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│                     ┌──────────────┐                         │
│                     │  helpers/     │                         │
│                     │  bill.js      │  (cart calculation)     │
│                     │  printer.js   │  (ESC/POS)             │
│                     │  IsAuth.js    │  (JWT middleware)       │
│                     └──────────────┘                         │
└─────────────────┬───────────────────────────────────────────┘
                  │                          │
                  ▼                          ▼ Socket.IO
┌──────────────────────┐        ┌──────────────────────┐
│   MySQL/MariaDB       │        │  printWorker.js       │
│   Database: pos_resto │        │  (Background process) │
│   ~50 tables          │        │  Polls print_queue    │
└──────────────────────┘        │  Sends to ESC/POS     │
                                 └──────────────────────┘
```

### 5.2. Lifecycle: Hari Operasional Restoran

```
1. DAILY START (Buka Hari)
   ├── Employee login → POST /terminal/login/signin
   ├── Terminal license check → POST /terminal/login/terminal
   ├── Daily start → POST /terminal/daily/start
   │   ├── Lookup daily_schedule (hari ini)
   │   ├── Reset auto_number running counter
   │   └── Insert daily_check record
   └── Cash opening balance → POST /terminal/daily/addCashIn

2. ORDERING FLOW (Pesan Makanan)
   ├── View floor plan + tables → GET /terminal/tableMap/
   ├── Select table → new order → POST /terminal/tableMap/newOrder
   │   ├── Create `cart` record
   │   ├── Assign period, overDue timer
   │   └── Generate auto-number cart ID
   ├── Browse menu → GET /terminal/menuItemPos/
   ├── Add item to cart → POST /terminal/menuItemPos/addToCart
   │   ├── Insert cart_item
   │   ├── Insert cart_item_sc (service charge)
   │   └── Insert cart_item_tax
   ├── Add modifiers → POST /terminal/menuItemPos/addModifier
   ├── Apply discount → POST /terminal/menuItemPos/addDiscountGroup
   ├── Update qty → POST /terminal/menuItemPos/updateQty
   └── Send to kitchen → POST /terminal/menuItemPos/sendOrder
       ├── Auto-number cart ID (if first send)
       ├── Stamp sendOrder on cart_item rows
       ├── Insert send_order record
       ├── Insert print_queue records (per printer group)
       ├── Export CSV/TXT files
       └── Socket.IO broadcast → triggers printWorker.js

3. KITCHEN PRINTING (Cetak Pesanan)
   ├── printWorker.js polls print_queue (status=0)
   ├── Status flow: 0 (PENDING) → 1 (PRINTING) → 2 (DONE) / 3 (ERROR)
   ├── Renders kitchen.hbs template via Handlebars
   └── Sends ESC/POS commands via TCP socket to thermal printer

4. BILLING (Cetak Bill)
   ├── View bill → GET /terminal/bill/
   ├── Bill update (increment version) → POST /terminal/bill/billUpdate
   ├── Split bill → GET /terminal/bill/splitBill
   │   ├── Assign items to subgroup → POST /terminal/bill/updateGroup
   │   └── Reset grouping → POST /terminal/bill/resetGroup
   ├── Print bill → GET /terminal/bill/printing (renders bill.hbs)
   └── Mark print bill → POST /terminal/payment/markPrintBill

5. PAYMENT (Pembayaran)
   ├── View cart for payment → GET /terminal/payment/cart
   ├── Select payment type → GET /terminal/payment/paymentType
   ├── Add payment → POST /terminal/payment/addPayment
   ├── Submit all payments → POST /terminal/payment/addPaid
   │   ├── For each payment: check cashback eligibility
   │   └── Insert cart_cashback if eligible
   ├── Close check (auto) → when total paid ≥ grand total
   │   ├── Set cart.close = 20 (PAID)
   │   ├── Record summary amounts on cart
   │   ├── Calculate change
   │   ├── Insert daily_cash_balance (for cash payments)
   │   └── Open cash drawer if payment type requires
   └── Print receipt → GET /terminal/receipt/ (renders receipt.hbs)

6. POST-PAYMENT
   ├── View transactions → GET /terminal/transaction/
   ├── Void paid transaction → POST /terminal/transaction/voidPaid
   │   ├── Insert cart_payment_void_reason
   │   ├── Reopen cart (close=0, clear paymentId)
   │   ├── Mark payments as void
   │   └── Remove daily_cash_balance entries
   └── Reprint bill → POST /terminal/transaction/addCopyBill

7. DAILY CLOSE (Tutup Hari)
   ├── Close daily → POST /terminal/daily/close
   │   ├── Mark daily_check as closed
   │   └── Export daily summary CSV
   └── Reports available via /terminal/reports/*
```

### 5.3. Counter/Cashier Mode

Alternatif mode untuk restoran counter (tanpa table map):

```
POST /terminal/cashier/newOrder  → Buat order counter baru (auto-number counter no)
GET  /terminal/cashier/queue     → List antrian counter aktif
POST /terminal/cashier/deleteOrder → Hapus order counter
```

### 5.4. Print Queue Architecture

```
┌──────────┐    INSERT      ┌──────────────┐    Socket.IO     ┌────────────────┐
│sendOrder()│ ──────────►   │ print_queue   │ ──broadcast──►  │ printWorker.js  │
│addToCart()│   status=0    │ (DB table)    │   'printing'    │                 │
└──────────┘                └──────────────┘                  │ processQueue()  │
                                                              │ polls DB        │
                              status flow:                    │ renders .hbs    │
                              0=PENDING                       │ sends ESC/POS   │
                              1=PRINTING                      │ via TCP socket  │
                              2=DONE                          └────────────────┘
                              3=ERROR (with retry)
```

---

## 6. Database Schema (pos_resto)

### 6.1. Entity-Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          MASTER DATA                                 │
├─────────────────────────────────────────────────────────────────────┤
│ outlet ──< outlet_floor_plan ──< outlet_table_map                   │
│ outlet ──< outlet_discount                                          │
│ employee ──> employee_auth_level ──< employee_access_right >── module│
│ employee ──> employee_dept                                          │
│ employee ──> employee_order_level                                    │
│ menu ──> menu_lookup, menu_category, menu_department, menu_class    │
│ menu ──> menu_tax_sc (tax & service charge profile)                 │
│ menu ──> modifier_group ──< modifier ──> modifier_list              │
│ menu ──< menu_set (combo/package items)                             │
│ discount ──> discount_group  ──< discount_level                     │
│ check_payment_type ──> check_payment_group                          │
│ printer ──> printer_group                                           │
│ cashback ──< cashback_amount, cashback_payment, cashback_outlet     │
│ daily_schedule                                                      │
│ period (time-based meal periods)                                    │
│ void_reason, pantry_message                                         │
│ auto_number (ID generator config)                                   │
│ language (i18n key-value pairs)                                     │
│ ux (UI button configuration)                                        │
│ template_table_map (table icon templates)                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        TRANSACTIONAL DATA                            │
├─────────────────────────────────────────────────────────────────────┤
│ daily_check (hari operasional)                                      │
│ daily_cash_balance (cash in/out per hari)                            │
│ cart (order/transaksi utama)                                         │
│   ├── cart_item (item dalam order)                                   │
│   │   ├── cart_item_modifier (modifier per item)                    │
│   │   ├── cart_item_discount (diskon per item)                      │
│   │   ├── cart_item_sc (service charge per item)                    │
│   │   ├── cart_item_tax (pajak per item)                            │
│   │   ├── cart_item_group (split bill grouping)                     │
│   │   └── cart_item_void_reason                                     │
│   ├── cart_payment (pembayaran per transaksi)                       │
│   ├── cart_cashback (cashback yang diberikan)                       │
│   ├── cart_copy_bill (log reprint bill)                             │
│   ├── cart_void_reason (alasan void transaksi)                      │
│   ├── cart_payment_void_reason (alasan void pembayaran)             │
│   ├── cart_merge_log (log merge meja)                               │
│   └── cart_transfer_items (log transfer item antar meja)            │
│ send_order (kitchen order batches)                                   │
│ print_queue (antrian cetak printer)                                  │
│ bill (bill versioning)                                              │
│ adjust_items (stock tracking)                                       │
│ logs (user activity log)                                            │
│ reports + reports_token (report access)                              │
│ employee_token (login sessions)                                     │
│ terminal + terminal_token (terminal license)                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          DATABASE VIEWS                              │
├─────────────────────────────────────────────────────────────────────┤
│ view_cart     — Flat view: cart items + modifiers + discounts +     │
│                 SC + tax via UNION ALL, ordered by cartMenuId       │
│ view_discount — Flat view: discounts per item with totals           │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2. Tabel Kunci & Kolom Penting

#### `cart` — Tabel Utama Transaksi
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `id` | varchar(50) | ID transaksi (generated via auto_number, format: prefix+yymmdd+seq) |
| `counterNo` | smallint | Nomor antrian (mode counter) |
| `billNo` | tinyint | Versi bill (increment setiap bill update) |
| `printBill` | tinyint | Flag bill sudah dicetak |
| `paymentId` | varchar(10) | Kode pembayaran saat close |
| `dailyCheckId` | varchar(50) | FK → daily_check.id |
| `sendOrder` | tinyint | Jumlah send order yang sudah dilakukan |
| `outletId` | int | FK → outlet.id |
| `outletTableMapId` | int | FK → outlet_table_map.id |
| `lockBy` | varchar(10) | Terminal ID yang mengunci transaksi |
| `cover` | int | Jumlah tamu |
| `close` | tinyint | **Status: 0=open, 20=paid, 41=void** |
| `periodId` | tinyint | FK → period.id (breakfast/lunch/dinner) |
| `summaryItemTotal` | int | Total harga item |
| `summaryDiscount` | int | Total diskon |
| `summarySc` | int | Total service charge |
| `summaryTax` | int | Total pajak |
| `grandTotal` | int | Grand total (computed on close) |
| `startDate` | datetime | Waktu order dibuat |
| `overDue` | datetime | Waktu overdue (dari outlet.overDue) |
| `void` | tinyint | 0=normal, 1=voided |
| `presence` | tinyint | Soft delete flag (1=active) |

#### `cart_item` — Item dalam Order
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `id` | int(11) | Auto-increment PK |
| `cartId` | varchar(50) | FK → cart.id |
| `subgroup` | smallint | Split bill group (default 1) |
| `qty` | smallint | Jumlah |
| `menuId` | int | FK → menu.id |
| `adjustItemsId` | varchar(50) | FK → adjust_items.id (stock tracking) |
| `ta` | tinyint | Take-away flag (1=TA, disables SC) |
| `price` | int | Harga satuan |
| `debit` | int | Harga yang dicharge |
| `credit` | int | Pengurangan harga |
| `sendOrder` | varchar(50) | FK → send_order.id (empty if not yet sent) |
| `void` | tinyint | 0=normal, 1=voided |
| `menuCategoryId` | int | Denormalized from menu |
| `menuDepartmentId` | int | Denormalized from menu |

#### `menu` — Daftar Menu
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `id` | int | Auto-increment PK |
| `plu` | varchar(50) | PLU/SKU code |
| `menuSet` | varchar(50) | Menu set type: '' (normal), 'FIXED', 'SELECT' |
| `menuSetMinQty` | tinyint | Minimum qty untuk menu set |
| `name` | varchar(200) | Nama menu |
| `menuLookupId` | smallint | FK → menu_lookup.id (kategori navigasi) |
| `discountGroupId` | smallint | FK → discount_group.id |
| `menuTaxScId` | tinyint | FK → menu_tax_sc.id (profil pajak & SC) |
| `price1`–`price5` | decimal(9,2) | Harga per price-level (outlet/terminal specific) |
| `specialPrice1`–`specialPrice5` | decimal(9,2) | Harga spesial |
| `printerGroupId` | smallint | FK → printer_group.id (printer tujuan kitchen) |
| `modifierGroupId` | smallint | FK → modifier_group.id |
| `openPrice` | tinyint | 1=harga bisa diisi manual |
| `menuDepartmentId` | int | FK → menu_department.id |
| `menuCategoryId` | int | FK → menu_category.id |

#### `menu_tax_sc` — Profil Pajak & Service Charge
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `taxRate` | tinyint | Persentase pajak (e.g., 10 = 10%) |
| `taxStatus` | tinyint | 1=tax included in price, 2=tax excluded |
| `scRate` | tinyint | Persentase service charge |
| `scStatus` | tinyint | 1=SC included in price, 2=SC excluded |
| `scTaxIncluded` | tinyint | SC dikenakan pajak? |

#### `daily_check` — Hari Operasional
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `id` | varchar(50) | Generated ID (auto_number) |
| `dailyScheduleId` | smallint | FK → daily_schedule.id |
| `outletId` | tinyint | FK → outlet.id |
| `closed` | tinyint | 0=open, 1=closed |
| `startDate` | datetime | Waktu buka |
| `closeDate` | datetime | Waktu tutup |
| `closeDateLimit` | datetime | Batas waktu auto-close |

---

## 7. API Endpoints — Lengkap

### 7.1. Authentication

| Auth Method | Digunakan Pada | Mekanisme |
|-------------|----------------|-----------|
| **None** | `/terminal/login/*`, `/terminal/printing/*`, `/terminal/log/*`, `/terminal/language/*` | No authentication |
| **validateToken** | Semua terminal route lainnya | JWT Bearer token di header `Authorization` |
| **checkReportToken** | `/terminal/reports/*` | Query param `?t=<token>`, validated against `reports_token` table |
| **Admin routes** | `/login/*`, `/employee/*`, dll. | Saat ini belum enforce auth (lihat catatan) |

**Catatan:** Saat `PRODUCTION=false`, `validateToken` middleware di-bypass (langsung `next()`).

### 7.2. Terminal Routes (POS)

Base: `/{PREFIX}{TERMINAL}` = `/terminal/`

#### Login & Setup
```
GET  /terminal/login/outlet          → Daftar outlet + employee untuk login screen
POST /terminal/login/signin          → Login employee (username/password)
POST /terminal/login/terminal        → Validasi license terminal (key file)
GET  /terminal/login/checkTerminal   → Cek session terminal masih valid
```

#### Daily Operation
```
GET  /terminal/daily/                → Cek ada daily check open
GET  /terminal/daily/getDailyStart   → Detail daily check aktif + schedule info
POST /terminal/daily/start           → Buka hari operasional baru
POST /terminal/daily/close           → Tutup hari operasional + export CSV
GET  /terminal/daily/cashbalance     → Cash in/out entries per daily check
GET  /terminal/daily/checkCashType   → Daftar denominasi uang
POST /terminal/daily/addCashIn       → Input kas masuk/keluar
GET  /terminal/daily/checkItems      → Cek item yang belum di-close
```

#### Table Map
```
GET  /terminal/tableMap/             → Floor plan + table status (occupied/available/overdue)
GET  /terminal/tableMap/detail       → Detail meja + total cart
POST /terminal/tableMap/newOrder     → Buat order baru untuk meja
```

#### Menu & Ordering (menuItemPos) — *Controller terbesar*
```
GET  /terminal/menuItemPos/          → Browse menu items by lookup category
GET  /terminal/menuItemPos/lookUpMenu → Menu lookup categories
GET  /terminal/menuItemPos/menuLookUp → Hierarchical menu navigation
GET  /terminal/menuItemPos/selectMenuSet → Sub-items untuk combo/package
GET  /terminal/menuItemPos/discountGroup → Daftar grup diskon
GET  /terminal/menuItemPos/cart      → Full cart view (items, modifiers, discounts, SC, tax)
GET  /terminal/menuItemPos/cartDetail → Detail single item + semua detailnya
GET  /terminal/menuItemPos/getModifier → Daftar modifier dengan harga
GET  /terminal/menuItemPos/printQueue → Status print queue
GET  /terminal/menuItemPos/voidReason → Daftar alasan void
GET  /terminal/menuItemPos/mergeLog  → History merge meja (recursive)
GET  /terminal/menuItemPos/transferItems → Items available for transfer
GET  /terminal/menuItemPos/transferItemsGroup → Transfer items grouped
GET  /terminal/menuItemPos/transferLog → Transfer history log
GET  /terminal/menuItemPos/tableChecker → Send order history per table
GET  /terminal/menuItemPos/tableCheckerDetail → Detail send order

POST /terminal/menuItemPos/addToCart → Tambah item ke cart (+ SC & tax rows)
POST /terminal/menuItemPos/updateQty → Update jumlah item
POST /terminal/menuItemPos/updateCover → Update jumlah tamu
POST /terminal/menuItemPos/addModifier → Tambah modifier ke item
POST /terminal/menuItemPos/removeDetailModifier → Hapus modifier
POST /terminal/menuItemPos/addToItemModifier → Bulk add modifiers ke checked items
POST /terminal/menuItemPos/addDiscountGroup → Apply discount ke selected items
POST /terminal/menuItemPos/addCustomNotes → Tambah catatan kustom
POST /terminal/menuItemPos/addCustomNotesDetail → Catatan per item detail
POST /terminal/menuItemPos/sendOrder → **KIRIM KE DAPUR** (critical flow)
POST /terminal/menuItemPos/lockTable → Lock cart untuk terminal ini
POST /terminal/menuItemPos/clearLockTable → Unlock cart
POST /terminal/menuItemPos/exitWithoutOrder → Keluar tanpa order
POST /terminal/menuItemPos/voidItem → Void item (unsent only)
POST /terminal/menuItemPos/voidItemSo → Void item yang sudah sent
POST /terminal/menuItemPos/voidItemDetail → Void item detail
POST /terminal/menuItemPos/voidTransaction → Void seluruh transaksi
POST /terminal/menuItemPos/transferTable → Transfer items antar meja
POST /terminal/menuItemPos/mergerCheck → Merge 2 meja jadi 1
POST /terminal/menuItemPos/takeOut → Toggle take-away flag
POST /terminal/menuItemPos/takeOutDetail → Toggle TA per item detail
POST /terminal/menuItemPos/changeTable → Pindah meja
```

#### Bill
```
GET  /terminal/bill/                 → Cart items grouped (by menu+price+modifiers)
GET  /terminal/bill/printing         → Render bill HTML (Handlebars: bill.hbs)
GET  /terminal/bill/splitBill        → Items available for split + current groups
GET  /terminal/bill/getCartCopyBill  → Log reprint bill
POST /terminal/bill/ipPrint          → Send text to network printer
POST /terminal/bill/billUpdate       → Increment bill version + update summary
POST /terminal/bill/copyBill         → Record bill reprint
POST /terminal/bill/updateGroup      → Assign items to split bill group
POST /terminal/bill/resetGroup       → Reset split bill grouping
POST /terminal/bill/createTxtBill    → Export bill as .txt file
POST /terminal/bill/createPayment    → Counter mode: transition to payment
```

#### Payment
```
GET  /terminal/payment/cart          → Cart data for payment screen
GET  /terminal/payment/bill          → Rendered bill HTML with QR/cashback
GET  /terminal/payment/paymentType   → Available payment methods
GET  /terminal/payment/paymentGroup  → Payment groups
GET  /terminal/payment/paid          → Current payment status
POST /terminal/payment/addPayment    → Tambah payment row
POST /terminal/payment/deletePayment → Hapus payment row
POST /terminal/payment/updateRow     → Edit payment row
POST /terminal/payment/addPaid       → **SUBMIT SEMUA PEMBAYARAN** (triggers close check)
POST /terminal/payment/submit        → Assign send-order ke unsent items
POST /terminal/payment/markPrintBill → Tandai bill sudah dicetak
POST /terminal/payment/createTxt     → Export bill as .txt
```

#### Receipt
```
GET  /terminal/receipt/              → Render receipt HTML (receipt.hbs + receiptPaid.hbs)
```

#### Transaction History
```
GET  /terminal/transaction/          → List closed transactions
GET  /terminal/transaction/detail    → Itemized transaction detail
GET  /terminal/transaction/cart      → Full cart breakdown
GET  /terminal/transaction/getCopyBill → Check reprint count
POST /terminal/transaction/addCopyBill → Record reprint
POST /terminal/transaction/voidPaid  → **VOID PAID TRANSACTION** (reopen cart)
```

#### Printing & Print Queue
```
GET  /terminal/printing/tableChecker → Render table checker receipt
GET  /terminal/printing/kitchen      → Render kitchen order ticket
GET  /terminal/printing/viewPrinters → All active printers + groups
GET  /terminal/printing/viewPrintersLogs → Recent print queue logs
POST /terminal/printing/test         → Test print to specific printer
POST /terminal/printing/print        → Send ESC/POS message to printer
POST /terminal/printing/printQueue   → Insert message into print queue
POST /terminal/printing/cashDrawer   → Open cash drawer
GET  /terminal/printQueue/queue      → View print queue entries
POST /terminal/printQueue/fnReprint  → Reprint (reset status to 0)
POST /terminal/printQueue/fnRushPrint → Rush reprint (with rush flag)
POST /terminal/printQueue/template   → Render single print template
```

#### Items (Stock)
```
GET  /terminal/items/                → Menu items with remaining stock
POST /terminal/items/resetAdjust     → Remove stock limit from items
POST /terminal/items/addQty          → Set limited qty for items
```

#### Cashier (Counter Mode)
```
GET  /terminal/cashier/queue         → List active counter orders
POST /terminal/cashier/newOrder      → Create counter order
POST /terminal/cashier/deleteOrder   → Delete counter order + all related
```

#### Reports
```
POST /terminal/menuReports/createReportToken → Generate 24h access token
GET  /terminal/menuReports/selectReports     → Report menu hierarchy
GET  /terminal/menuReports/getUsers          → Employee list for filter
GET  /terminal/menuReports/getOutlets        → Outlet list for filter

# Reports (require ?t=<token>):
GET  /terminal/reports/salesSummaryReport    → Overall sales summary
GET  /terminal/reports/cashierReports        → Per-employee report
GET  /terminal/reports/itemizedSalesDetail   → Per-item sales detail
GET  /terminal/reports/itemizedSalesSummary  → Sales summary per item
GET  /terminal/reports/itemizedSales         → Itemized sales flat
GET  /terminal/reports/itemCount             → Item count report
GET  /terminal/reports/checkDiscountListing  → Discount listing
GET  /terminal/reports/salesHistoryReport    → Sales history
GET  /terminal/reports/salesReportPerHour    → Hourly sales
GET  /terminal/reports/closeCheckReports     → Closed check listing
GET  /terminal/reports/ccPayment             → Credit card payments
GET  /terminal/reports/scHistory             → Service charge history
GET  /terminal/reports/taxHistory            → Tax history
GET  /terminal/reports/employeeItemizedSales → Per-employee item sales
GET  /terminal/reports/managerClose          → Manager close report
GET  /terminal/reports/serverCloseReport     → Server close report
GET  /terminal/reports/dailyStartCloseHistory → Daily start/close log
```

#### Other Terminal Routes
```
GET  /terminal/ux/                   → UI button config (ux table)
GET  /terminal/language/             → i18n labels (en/id dictionaries)
POST /terminal/log/                  → Submit user action log
GET  /terminal/log/getLog            → Query user logs
GET  /terminal/log/downloadLog       → Download log as CSV
```

### 7.3. Admin Routes

Base: `/{PREFIX}` = `/`

Mengikuti pola CRUD konsisten: `GET /` (list), `POST /create`, `POST /update`, `POST /delete`, `POST /duplicate`

```
POST /login/admin                    → Admin sign-in

GET  /global/menu                    → All menu data
GET  /global/uxFunction              → UX function config
POST /global/uxFunction/onSaveOrder  → Save UX function order
POST /global/uxFunction/onSaveStatus → Save UX function status

/employee/*                          → Employee CRUD + auth levels + access rights + dept + order levels
/payment/*                           → Payment types, groups, cash types, tax types, foreign currency
/discount/*                          → Discounts, discount groups, levels, outlet mappings
/menu/*                              → Categories, departments, classes, items, sets, lookups, modifiers
/outlet/*                            → Outlets, outlet payments, cash types, function authorities
/tableMap/table/*                    → Table CRUD + positioning
/floorMap/map/*                      → Floor plan CRUD
/tableMapTemplate/*                  → Table icon templates
/workStation/*                       → Terminals, printers, printer groups
/cashback/*                          → Cashback rules, amounts, payment links
/language/*                          → i18n labels
/dailySchedule/*                     → Daily open/close schedules
/other/*                             → Void codes, pantry messages, function authorities, shortcuts

/dailyClose/                         → Daily close history
/transaction/                        → Transaction + detail views
/userLogin/                          → User login history
```

---

## 8. Core Business Logic

### 8.1. Billing Engine (`helpers/bill.js` — 1561 baris)

Ini adalah **jantung kalkulasi** transaksi. Dipanggil oleh banyak controller.

**Fungsi utama:**

| Function | Deskripsi |
|----------|-----------|
| `cart(cartId)` | Full cart assembly: items + modifiers + discounts → compute itemTotal, discount, subTotal, SC, tax, grandTotal |
| `cartGrouping(cartId, subgroup)` | Sama seperti `cart()` tapi filter per split-bill subgroup |
| `cartHistory(cartId)` | View aggregat termasuk void items, payment status, tips, change |
| `summary(cartId)` | Lightweight per-item subtotal via UNION (item + modifier + discount) |
| `scTaxUpdate2(cartId)` | **Recalculate & UPDATE** semua SC/tax rows di DB |
| `discountMaxAmountByPercent(cartId)` | Enforce max discount cap untuk percentage discounts |
| `discountMaxPerItem(cartId)` | Enforce max discount cap untuk fixed-amount discounts |

**Logika Kalkulasi:**
```
Per Item:
  itemTotal = price × qty
  modifierTotal = Σ(modifier.debit - modifier.credit) × qty
  discountAmount = berdasarkan rate(%) atau fixed amount
  subTotalBeforeSC = itemTotal + modifierTotal - discountAmount

  SC (Service Charge):
    if scStatus=1 (included): scAmount = subTotal × scRate / (100 + scRate)
    if scStatus=2 (excluded): scAmount = subTotal × scRate / 100
    if ta=1 (take-away): scAmount = 0

  Tax:
    if taxStatus=1 (included): taxAmount = (subTotal + scIfTaxable) × taxRate / (100 + taxRate)
    if taxStatus=2 (excluded): taxAmount = (subTotal + scIfTaxable) × taxRate / 100

Grand Total = Σ(itemTotal + modifierTotal - discountAmount + sc + tax)
```

### 8.2. Print Engine (`helpers/printer.js`)

| Function | Deskripsi |
|----------|-----------|
| `printToPrinter(message, ip, port)` | Raw TCP socket print → ESC/POS commands + paper cut |
| `printerEsc(message, printerData)` | `escpos` library formatted print |
| `openCashDrawer(ip, port)` | ESC/POS cash drawer kick (pulse pin 2+5) |
| `printQueueInternal(db, sendOrder, userId)` | Create print queue entries per menu item printer group |
| `inputPrintQueue(db, message, printers, ...)` | Insert generic messages into print_queue |
| `sendToPrinter(data)` | TCP socket print (used by printWorker.js) |
| `sendToPrinterDummy(data)` | Simulated print (2s delay, no real output) |

### 8.3. Auto Number Generator (`helpers/autoNumber.js`)

Menghasilkan ID berurutan berdasarkan konfigurasi di tabel `auto_number`:

```
Konfigurasi:
  name: "cartId"
  prefix: "yymmdd" (atau string statis)
  digit: 6 (jumlah digit angka)
  runningNumber: auto-increment

Hasil contoh: "250304000001" (250304 = 2025-03-04, 000001 = sequence)
```

### 8.4. Cashback Engine (`helpers/cashcback.js`)

Setelah pembayaran:
1. Cari cashback rules aktif per outlet → `cashback` + `cashback_outlet`
2. Cek payment method eligible → `cashback_payment`
3. Match payment amount ke `cashback_amount` tier (earnMin–earnMax)
4. Generate random cashback (cashbackMin–cashbackMax range)
5. Insert `cart_cashback` record
6. Generate QR code untuk redemption

---

## 9. Socket.IO Events

| Event | Direction | Deskripsi |
|-------|-----------|-----------|
| `message-from-client` | Client → Server | Generic message dari client |
| `message-from-server` | Server → All (broadcast, exclude sender) | Forward pesan ke semua client lain |
| `broadcast-reload` | Client → Server | Trigger reload |
| `reload` | Server → All (broadcast) | Notify semua terminal untuk reload data |
| `printing-reload` | Client → Server | Printer status update |
| `printing` | Server → All (broadcast) | Notify terminal: print queue status changed |

**Digunakan oleh `printWorker.js`:** Mengirim `printing-reload` event saat status print berubah (PENDING→PRINTING→DONE/ERROR).

---

## 10. Konvensi Kode

### 10.1. Pola Umum

- **Soft delete**: Semua tabel punya kolom `presence` (1=active, 0=deleted). Query selalu filter `WHERE presence = 1`.
- **Audit trail**: Semua tabel punya `inputDate`, `inputBy`, `updateDate`, `updateBy`.
- **Void flag**: Tabel transaksional punya kolom `void` (0=normal, 1=voided).
- **Database**: Semua query menggunakan `mysql2` promise pool, `async/await` pattern.
- **ID Generation**: Menggunakan `helpers/autoNumber.js` untuk ID seperti cartId, dailyCheckId, sendOrder.
- **Naming**: Controller files: `*Controller.js`, Route files: tanpa suffix. camelCase untuk variable dan function.
- **Response format**: `res.json({ error: false/true, data: ..., message: '...' })`.
- **Currency**: Semua harga disimpan sebagai **integer** (Rupiah tanpa desimal, kecuali `menu.price*` yang `decimal(9,2)`).

### 10.2. Cart Close Status Values

| `cart.close` | Arti |
|--------------|------|
| 0 | Open (masih aktif) |
| 20 | Paid (sudah bayar) |
| 41 | Void (dibatalkan) |

### 10.3. Print Queue Status Values

| `print_queue.status` | Arti |
|----------------------|------|
| 0 | PENDING (belum diproses) |
| 1 | PRINTING (sedang cetak) |
| 2 | DONE (selesai) |
| 3 | ERROR (gagal, akan retry) |

### 10.4. Menu Set Types

| `menu.menuSet` | Tipe |
|----------------|------|
| `''` (empty) | Regular menu item |
| `'FIXED'` | Fixed combo — semua sub-items otomatis masuk |
| `'SELECT'` | Select combo — customer pilih sub-items |

### 10.5. Tax/SC Status Values

| Value | Arti |
|-------|------|
| 1 | Included in price (harga sudah termasuk) |
| 2 | Excluded from price (harga belum termasuk) |

### 10.6. Price Levels

Menu memiliki `price1`–`price5` dan `specialPrice1`–`specialPrice5`. Price level ditentukan oleh `outlet.priceNo` atau `terminal.priceNo`.

---

## 11. File Output

| Tipe File | Lokasi | Trigger |
|-----------|--------|---------|
| Daily close CSV | `public/output/{yyyymmdd}-daily.csv` | POST /terminal/daily/close |
| Bill text | `public/output/bill/{yyyymmdd}/` | POST /terminal/bill/createTxtBill |
| Closed bill text | `public/output/billClosed/{yyyymmdd}/` | Payment close |
| Send order files | `public/output/sendOrder/{yyyymmdd}/` | POST /terminal/menuItemPos/sendOrder |
| Table checker text | `public/output/tableChecker/{yyyymmdd}/` | GET /terminal/printing/tableChecker |
| Daily close export | `public/output/dailyClose/` | POST /terminal/daily/close |
| User action logs | CSV via Winston logger | POST /terminal/log/ |

---

## 12. Catatan Pengembangan

### Known Issues / Technical Debt
1. **SQL Injection risk**: Beberapa query menggunakan string concatenation alih-alih parameterized queries (terutama di `IsAuth.checkReportToken`).
2. **Typo**: `voidTransacton` (missing 'i') di route menuItemPos.js.
3. **Duplikat route**: `/global` route di-mount 2x di server.js.
4. **`bill copy.js`**: File helper yang belum di-cleanup.
5. **`cashcback.js`**: Typo di nama file (seharusnya `cashback.js`).
6. **Production auth**: Admin routes saat ini tidak enforce authentication.
7. **Currency precision**: Mix antara `int` (Rupiah bulat) dan `decimal(9,2)` di database bisa menyebabkan rounding issues.

### Cara Menjalankan
```bash
# Development
cd service
cp env .env         # Setup environment
npm install
npm run run         # nodemon server.js (auto-reload)

# Print Worker (terpisah)
node printWorker.js

# Production
npm start           # node server.js
```

### Testing Database
- `dbPos-for-AI.sql` — Schema saja (tanpa data) untuk referensi AI
- `dbPos-dummy-data.sql` — Schema + dummy data untuk testing
- `backupDb/` — Full production backup

---

## 13. Quick Reference — Tabel Database Lengkap

| # | Tabel | Deskripsi | Tipe |
|---|-------|-----------|------|
| 1 | `adjust_items` | Stock tracking records | Transactional |
| 2 | `auto_number` | ID generator configuration | Config |
| 3 | `bill` | Bill versioning per cart | Transactional |
| 4 | `cart` | **Order/transaksi utama** | Transactional |
| 5 | `cart_cashback` | Cashback per payment | Transactional |
| 6 | `cart_copy_bill` | Bill reprint log | Transactional |
| 7 | `cart_item` | **Item dalam order** | Transactional |
| 8 | `cart_item_discount` | Diskon per item | Transactional |
| 9 | `cart_item_group` | Split bill grouping | Transactional |
| 10 | `cart_item_modifier` | Modifier per item | Transactional |
| 11 | `cart_item_sc` | Service charge per item | Transactional |
| 12 | `cart_item_tax` | Pajak per item | Transactional |
| 13 | `cart_item_void_reason` | Alasan void item | Transactional |
| 14 | `cart_merge_log` | Log merge meja | Transactional |
| 15 | `cart_payment` | Pembayaran per transaksi | Transactional |
| 16 | `cart_payment_void_reason` | Alasan void payment | Transactional |
| 17 | `cart_transfer_items` | Log transfer item | Transactional |
| 18 | `cart_void_reason` | Alasan void transaksi | Transactional |
| 19 | `cashback` | Cashback rules | Master |
| 20 | `cashback_amount` | Cashback tiers | Master |
| 21 | `cashback_outlet` | Cashback per outlet | Master |
| 22 | `cashback_payment` | Cashback per payment type | Master |
| 23 | `check_cash_type` | Denominasi uang | Master |
| 24 | `check_payment_group` | Grup payment | Master |
| 25 | `check_payment_type` | Tipe pembayaran | Master |
| 26 | `check_payment_type_popup` | Popup config payment | Master |
| 27 | `daily_cash_balance` | Cash in/out harian | Transactional |
| 28 | `daily_check` | Hari operasional | Transactional |
| 29 | `daily_schedule` | Jadwal buka/tutup | Master |
| 30 | `discount` | Aturan diskon | Master |
| 31 | `discount_group` | Grup diskon | Master |
| 32 | `discount_level` | Level diskon per auth level | Master |
| 33 | `employee` | Data karyawan | Master |
| 34 | `employee_access_right` | Hak akses per auth level | Master |
| 35 | `employee_auth_level` | Level otorisasi | Master |
| 36 | `employee_dept` | Departemen karyawan | Master |
| 37 | `employee_order_level` | Level order karyawan | Master |
| 38 | `employee_token` | Login session | Transactional |
| 39 | `foreign_currency_type` | Mata uang asing | Master |
| 40 | `language` | i18n key-value | Master |
| 41 | `logs` | User activity log | Transactional |
| 42 | `member_class` | Kelas member | Master |
| 43 | `member_transaction_type` | Tipe transaksi member | Master |
| 44 | `menu` | **Daftar menu** | Master |
| 45 | `menu_category` | Kategori menu | Master |
| 46 | `menu_class` | Kelas menu | Master |
| 47 | `menu_department` | Departemen menu | Master |
| 48 | `menu_lookup` | Navigasi menu (tree) | Master |
| 49 | `menu_set` | Combo/package items | Master |
| 50 | `menu_tax_sc` | Profil pajak & SC | Master |
| 51 | `menu_tax_sc_status` | Status label tax/SC | Master |
| 52 | `modifier` | Modifier items | Master |
| 53 | `modifier_group` | Grup modifier | Master |
| 54 | `modifier_list` | Daftar modifier list | Master |
| 55 | `module` | Modul sistem (untuk access rights) | Master |
| 56 | `outlet` | Data outlet/cabang | Master |
| 57 | `outlet_discount` | Diskon per outlet | Master |
| 58 | `outlet_floor_plan` | Floor plan per outlet | Master |
| 59 | `outlet_table_map` | Denah meja per outlet | Master |
| 60 | `outlet_table_map_status` | Status meja (warna, label) | Master |
| 61 | `pantry_message` | Pesan pantry/kitchen | Master |
| 62 | `period` | Periode waktu (breakfast/lunch/dinner) | Master |
| 63 | `print_queue` | Antrian cetak | Transactional |
| 64 | `print_queue_status` | Label status print | Master |
| 65 | `printer` | Data printer | Master |
| 66 | `printer_group` | Grup printer | Master |
| 67 | `reports` | Daftar laporan (menu hierarchy) | Master |
| 68 | `reports_token` | Token akses laporan | Transactional |
| 69 | `send_order` | Batch kitchen order | Transactional |
| 70 | `template_table_map` | Template icon meja | Master |
| 71 | `terminal` | Data terminal POS | Master |
| 72 | `terminal_token` | Terminal session | Transactional |
| 73 | `ux` | Konfigurasi UI POS | Master |
| 74 | `void_reason` | Alasan void | Master |
| V1 | `view_cart` | View: cart items flat | View |
| V2 | `view_discount` | View: discounts flat | View |

---

*Dokumentasi ini di-generate berdasarkan analisis kode sumber pada 2026-03-04. Update file ini setiap ada perubahan signifikan pada arsitektur, endpoint, atau schema database.*
