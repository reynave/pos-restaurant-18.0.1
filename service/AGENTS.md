# AGENTS.md — POS Restaurant Service (v18.0.1)

> Development documentation for AI Agents. Contains architecture, business flows, database schema, API endpoints, and code conventions.

---

## 1. Project Overview

A **Point of Sale (POS) system for Restaurants** built with Node.js + Express 5, using MySQL/MariaDB database. Supports:

- **Multi-outlet** (multiple restaurant branches)
- **Multi-terminal** (multiple POS devices per outlet)
- **Dine-in** (table map, floor plan) and **Counter/Take-out** mode
- **Kitchen printing** via ESC/POS thermal printer (TCP/IP)
- **Real-time sync** via Socket.IO
- **Split bill, merge table, transfer items**
- **Integrated cashback engine**
- **17+ business reports** (HTML/EJS rendered)
- **Dual-language UI** (EN/ID)

---

## 2. Tech Stack

| Layer | Technology |
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
| Other | `csv-parser`, `dotenv` |

---

## 3. Directory Structure

```
service/
├── server.js              # Entry point — Express app + Socket.IO server
├── printWorker.js          # Background print queue worker (Socket.IO client)
├── token.js                # CLI utility: generate JWT terminal license key (see §8.5)
├── .env                    # Environment variables (see §4)
├── pos/                    # Angular SPA frontend (served at /pos)
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
│   │   ├── menuItemPosController.js   # 2826 lines — largest controller
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
│   │   ├── reportsController.js       # 2649 lines — largest report file
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
│   ├── bill.js             # Core billing/cart calculation engine (1561 lines)
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
PREFIX=/api/                # API route prefix (all routes start with this)
TERMINAL=terminal/          # Terminal route sub-prefix
TO_LOCALE_STRING=id-ID      # Locale for number/date formatting
PORT=3000                   # HTTP server port
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pos_resto           # MySQL database name
LOCALHOST=http://localhost:3000  # Used by printWorker.js for Socket.IO connection
DUMMY_PRINTER=false         # true = simulate printing (no real printer)
```

**URL Path Layout:**
| Path | Serves | Description |
|------|--------|-------------|
| `/pos` | Angular SPA | Frontend HTML app (static files from `pos/` folder) |
| `/api/*` | REST API | All backend API endpoints (PREFIX = `/api/`) |
| `/api/terminal/*` | Terminal API | POS terminal endpoints (PREFIX + TERMINAL) |
| `/api/public/*` | Static assets | Public files (templates, output) |

---

## 5. Architecture & Main Flows

### 5.1. High Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Angular SPA)                      │
│  Served at /pos  (admin18.0.1 + terminal18.0.1)             │
└─────────────┬──────────────────────┬────────────────────────┘
              │ HTTP REST /api/*     │ Socket.IO (real-time)
              ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     server.js (Express + Socket.IO)          │
│  Port: 3000                                                  │
│  Static: /pos → Angular SPA                                  │
│  ┌─────────────────────┐  ┌──────────────────────────────┐  │
│  │  Admin Routes /api/   │  │  Terminal Routes               │  │
│  │  /api/login           │  │  /api/terminal/login           │  │
│  │  /api/global          │  │  /api/terminal/tableMap        │  │
│  │  /api/employee        │  │  /api/terminal/menuItemPos     │  │
│  │  /api/payment         │  │  /api/terminal/bill            │  │
│  │  /api/discount        │  │  /api/terminal/payment         │  │
│  │  /api/menu            │  │  /api/terminal/daily           │  │
│  │  /api/outlet          │  │  /api/terminal/transaction     │  │
│  │  /api/tableMap        │  │  /api/terminal/printing        │  │
│  │  /api/floorMap        │  │  /api/terminal/cashier         │  │
│  │  ...                  │  │  /api/terminal/reports         │  │
│  └─────────────────────┘  └──────────────────────────────┘  │
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
│   ~74 tables          │        │  Polls print_queue    │
└──────────────────────┘        │  Sends to ESC/POS     │
                                 └──────────────────────┘
```

### 5.2. Lifecycle: Restaurant Daily Operation

```
1. DAILY START (Open Day)
   ├── Employee login → POST /terminal/login/signin
   ├── Terminal license check → POST /terminal/login/terminal
   ├── Daily start → POST /terminal/daily/start
   │   ├── Lookup daily_schedule (today)
   │   ├── Reset auto_number running counter
   │   └── Insert daily_check record
   └── Cash opening balance → POST /terminal/daily/addCashIn

2. ORDERING FLOW (Place Orders)
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

3. KITCHEN PRINTING (Print Orders)
   ├── printWorker.js polls print_queue (status=0)
   ├── Status flow: 0 (PENDING) → 1 (PRINTING) → 2 (DONE) / 3 (ERROR)
   ├── Renders kitchen.hbs template via Handlebars
   └── Sends ESC/POS commands via TCP socket to thermal printer

4. BILLING (Print Bill)
   ├── View bill → GET /terminal/bill/
   ├── Bill update (increment version) → POST /terminal/bill/billUpdate
   ├── Split bill → GET /terminal/bill/splitBill
   │   ├── Assign items to subgroup → POST /terminal/bill/updateGroup
   │   └── Reset grouping → POST /terminal/bill/resetGroup
   ├── Print bill → GET /terminal/bill/printing (renders bill.hbs)
   └── Mark print bill → POST /terminal/payment/markPrintBill

5. PAYMENT (Process Payment)
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

7. DAILY CLOSE (Close Day)
   ├── Close daily → POST /terminal/daily/close
   │   ├── Mark daily_check as closed
   │   └── Export daily summary CSV
   └── Reports available via /terminal/reports/*
```

### 5.3. Counter/Cashier Mode

Alternative mode for counter-service restaurants (no table map):

```
POST /terminal/cashier/newOrder  → Create new counter order (auto-number counter no)
GET  /terminal/cashier/queue     → List active counter queue
POST /terminal/cashier/deleteOrder → Delete counter order
```

### 5.4. Print Queue Architecture

```
┌───────────┐    INSERT      ┌───────────────┐    Socket.IO    ┌─────────────────┐
│sendOrder()│ ──────────►    │ print_queue   │ ──broadcast──►  │ printWorker.js  │
│addToCart()│   status=0     │ (DB table)    │   'printing'    │                 │
└───────────┘                └───────────────┘                 │ processQueue()  │
                                                               │ polls DB        │
                              status flow:                     │ renders .hbs    │
                              0=PENDING                        │ sends ESC/POS   │
                              1=PRINTING                       │ via TCP socket  │
                              2=DONE                           └─────────────────┘
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
│ daily_check (business day)                                          │
│ daily_cash_balance (daily cash in/out)                               │
│ cart (main order/transaction)                                        │
│   ├── cart_item (items in an order)                                  │
│   │   ├── cart_item_modifier (modifier per item)                    │
│   │   ├── cart_item_discount (discount per item)                    │
│   │   ├── cart_item_sc (service charge per item)                    │
│   │   ├── cart_item_tax (tax per item)                              │
│   │   ├── cart_item_group (split bill grouping)                     │
│   │   └── cart_item_void_reason                                     │
│   ├── cart_payment (payments per transaction)                       │
│   ├── cart_cashback (cashback awarded)                              │
│   ├── cart_copy_bill (bill reprint log)                             │
│   ├── cart_void_reason (transaction void reason)                    │
│   ├── cart_payment_void_reason (payment void reason)                │
│   ├── cart_merge_log (table merge log)                              │
│   └── cart_transfer_items (item transfer log between tables)        │
│ send_order (kitchen order batches)                                   │
│ print_queue (printer queue)                                          │
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

### 6.2. Key Tables & Important Columns

#### `cart` — Main Transaction Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | varchar(50) | Transaction ID (generated via auto_number, format: prefix+yymmdd+seq) |
| `counterNo` | smallint | Queue number (counter mode) |
| `billNo` | tinyint | Bill version (incremented on each bill update) |
| `printBill` | tinyint | Flag: bill has been printed |
| `paymentId` | varchar(10) | Payment code on close |
| `dailyCheckId` | varchar(50) | FK → daily_check.id |
| `sendOrder` | tinyint | Number of send orders placed |
| `outletId` | int | FK → outlet.id |
| `outletTableMapId` | int | FK → outlet_table_map.id |
| `lockBy` | varchar(10) | Terminal ID that locked the transaction |
| `cover` | int | Guest count |
| `close` | tinyint | **Status: 0=open, 20=paid, 41=void** |
| `periodId` | tinyint | FK → period.id (breakfast/lunch/dinner) |
| `summaryItemTotal` | int | Total item price |
| `summaryDiscount` | int | Total discount |
| `summarySc` | int | Total service charge |
| `summaryTax` | int | Total tax |
| `grandTotal` | int | Grand total (computed on close) |
| `startDate` | datetime | Order creation time |
| `overDue` | datetime | Overdue time (from outlet.overDue) |
| `void` | tinyint | 0=normal, 1=voided |
| `presence` | tinyint | Soft delete flag (1=active) |

#### `cart_item` — Items in an Order
| Column | Type | Description |
|--------|------|-------------|
| `id` | int(11) | Auto-increment PK |
| `cartId` | varchar(50) | FK → cart.id |
| `subgroup` | smallint | Split bill group (default 1) |
| `qty` | smallint | Quantity |
| `menuId` | int | FK → menu.id |
| `adjustItemsId` | varchar(50) | FK → adjust_items.id (stock tracking) |
| `ta` | tinyint | Take-away flag (1=TA, disables SC) |
| `price` | int | Unit price |
| `debit` | int | Amount charged |
| `credit` | int | Amount deducted |
| `sendOrder` | varchar(50) | FK → send_order.id (empty if not yet sent) |
| `void` | tinyint | 0=normal, 1=voided |
| `menuCategoryId` | int | Denormalized from menu |
| `menuDepartmentId` | int | Denormalized from menu |

#### `menu` — Menu Items
| Column | Type | Description |
|--------|------|-------------|
| `id` | int | Auto-increment PK |
| `plu` | varchar(50) | PLU/SKU code |
| `menuSet` | varchar(50) | Menu set type: '' (normal), 'FIXED', 'SELECT' |
| `menuSetMinQty` | tinyint | Minimum qty for menu set |
| `name` | varchar(200) | Menu name |
| `menuLookupId` | smallint | FK → menu_lookup.id (navigation category) |
| `discountGroupId` | smallint | FK → discount_group.id |
| `menuTaxScId` | tinyint | FK → menu_tax_sc.id (tax & SC profile) |
| `price1`–`price5` | decimal(9,2) | Price per price-level (outlet/terminal specific) |
| `specialPrice1`–`specialPrice5` | decimal(9,2) | Special prices |
| `printerGroupId` | smallint | FK → printer_group.id (target kitchen printer) |
| `modifierGroupId` | smallint | FK → modifier_group.id |
| `openPrice` | tinyint | 1=price can be entered manually |
| `menuDepartmentId` | int | FK → menu_department.id |
| `menuCategoryId` | int | FK → menu_category.id |

#### `menu_tax_sc` — Tax & Service Charge Profile
| Column | Type | Description |
|--------|------|-------------|
| `taxRate` | tinyint | Tax percentage (e.g., 10 = 10%) |
| `taxStatus` | tinyint | 1=tax included in price, 2=tax excluded |
| `scRate` | tinyint | Service charge percentage |
| `scStatus` | tinyint | 1=SC included in price, 2=SC excluded |
| `scTaxIncluded` | tinyint | Is SC subject to tax? |

#### `daily_check` — Business Day
| Column | Type | Description |
|--------|------|-------------|
| `id` | varchar(50) | Generated ID (auto_number) |
| `dailyScheduleId` | smallint | FK → daily_schedule.id |
| `outletId` | tinyint | FK → outlet.id |
| `closed` | tinyint | 0=open, 1=closed |
| `startDate` | datetime | Opening time |
| `closeDate` | datetime | Closing time |
| `closeDateLimit` | datetime | Auto-close time limit |

---

## 7. API Endpoints — Complete Reference

### 7.1. Authentication

| Auth Method | Used On | Mechanism |
|-------------|---------|-----------|
| **None** | `/api/terminal/login/*`, `/api/terminal/printing/*`, `/api/terminal/log/*`, `/api/terminal/language/*` | No authentication |
| **validateToken** | All other terminal routes | JWT Bearer token in `Authorization` header |
| **checkReportToken** | `/api/terminal/reports/*` | Query param `?t=<token>`, validated against `reports_token` table |
| **Admin routes** | `/api/login/*`, `/api/employee/*`, etc. | Currently not enforcing auth (see notes) |

**Note:** When `PRODUCTION=false`, the `validateToken` middleware is bypassed (calls `next()` directly).

### 7.2. Terminal Routes (POS)

Base: `/{PREFIX}{TERMINAL}` = `/api/terminal/`

> **Note:** All endpoint paths below show the route-level path (e.g., `/terminal/...`). The actual full URL includes the PREFIX: `http://localhost:3000/api/terminal/...`

#### Login & Setup
```
GET  /terminal/login/outlet          → List of outlets + employees for login screen
POST /terminal/login/signin          → Employee login (username/password)
POST /terminal/login/terminal        → Validate terminal license (key file)
GET  /terminal/login/checkTerminal   → Check if terminal session is still valid
```

#### Daily Operation
```
GET  /terminal/daily/                → Check if a daily check is open
GET  /terminal/daily/getDailyStart   → Active daily check details + schedule info
POST /terminal/daily/start           → Open a new business day
POST /terminal/daily/close           → Close the business day + export CSV
GET  /terminal/daily/cashbalance     → Cash in/out entries per daily check
GET  /terminal/daily/checkCashType   → List of cash denominations
POST /terminal/daily/addCashIn       → Record cash in/out
GET  /terminal/daily/checkItems      → Check items not yet closed
```

#### Table Map
```
GET  /terminal/tableMap/             → Floor plan + table status (occupied/available/overdue)
GET  /terminal/tableMap/detail       → Table details + cart total
POST /terminal/tableMap/newOrder     → Create a new order for a table
```

#### Menu & Ordering (menuItemPos) — *Largest controller*
```
GET  /terminal/menuItemPos/          → Browse menu items by lookup category
GET  /terminal/menuItemPos/lookUpMenu → Menu lookup categories
GET  /terminal/menuItemPos/menuLookUp → Hierarchical menu navigation
GET  /terminal/menuItemPos/selectMenuSet → Sub-items for combo/package
GET  /terminal/menuItemPos/discountGroup → List of discount groups
GET  /terminal/menuItemPos/cart      → Full cart view (items, modifiers, discounts, SC, tax)
GET  /terminal/menuItemPos/cartDetail → Single item detail + all related data
GET  /terminal/menuItemPos/getModifier → Modifier list with prices
GET  /terminal/menuItemPos/printQueue → Print queue status
GET  /terminal/menuItemPos/voidReason → List of void reasons
GET  /terminal/menuItemPos/mergeLog  → Table merge history (recursive)
GET  /terminal/menuItemPos/transferItems → Items available for transfer
GET  /terminal/menuItemPos/transferItemsGroup → Transfer items grouped
GET  /terminal/menuItemPos/transferLog → Transfer history log
GET  /terminal/menuItemPos/tableChecker → Send order history per table
GET  /terminal/menuItemPos/tableCheckerDetail → Send order detail

POST /terminal/menuItemPos/addToCart → Add item to cart (+ SC & tax rows)
POST /terminal/menuItemPos/updateQty → Update item quantity
POST /terminal/menuItemPos/updateCover → Update guest count
POST /terminal/menuItemPos/addModifier → Add modifier to item
POST /terminal/menuItemPos/removeDetailModifier → Remove modifier
POST /terminal/menuItemPos/addToItemModifier → Bulk add modifiers to checked items
POST /terminal/menuItemPos/addDiscountGroup → Apply discount to selected items
POST /terminal/menuItemPos/addCustomNotes → Add custom notes
POST /terminal/menuItemPos/addCustomNotesDetail → Notes per item detail
POST /terminal/menuItemPos/sendOrder → **SEND TO KITCHEN** (critical flow)
POST /terminal/menuItemPos/lockTable → Lock cart for this terminal
POST /terminal/menuItemPos/clearLockTable → Unlock cart
POST /terminal/menuItemPos/exitWithoutOrder → Exit without ordering
POST /terminal/menuItemPos/voidItem → Void item (unsent only)
POST /terminal/menuItemPos/voidItemSo → Void already-sent item
POST /terminal/menuItemPos/voidItemDetail → Void item detail
POST /terminal/menuItemPos/voidTransaction → Void entire transaction
POST /terminal/menuItemPos/transferTable → Transfer items between tables
POST /terminal/menuItemPos/mergerCheck → Merge 2 tables into 1
POST /terminal/menuItemPos/takeOut → Toggle take-away flag
POST /terminal/menuItemPos/takeOutDetail → Toggle TA per item detail
POST /terminal/menuItemPos/changeTable → Move to a different table
```

#### Bill
```
GET  /terminal/bill/                 → Cart items grouped (by menu+price+modifiers)
GET  /terminal/bill/printing         → Render bill HTML (Handlebars: bill.hbs)
GET  /terminal/bill/splitBill        → Items available for split + current groups
GET  /terminal/bill/getCartCopyBill  → Bill reprint log
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
POST /terminal/payment/addPayment    → Add payment row
POST /terminal/payment/deletePayment → Delete payment row
POST /terminal/payment/updateRow     → Edit payment row
POST /terminal/payment/addPaid       → **SUBMIT ALL PAYMENTS** (triggers close check)
POST /terminal/payment/submit        → Assign send-order to unsent items
POST /terminal/payment/markPrintBill → Mark bill as printed
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

Base: `/{PREFIX}` = `/api/`

Follows a consistent CRUD pattern: `GET /` (list), `POST /create`, `POST /update`, `POST /delete`, `POST /duplicate`

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

### 8.1. Billing Engine (`helpers/bill.js` — 1561 lines)

This is the **heart of transaction calculation**. Called by many controllers.

**Main functions:**

| Function | Description |
|----------|-------------|
| `cart(cartId)` | Full cart assembly: items + modifiers + discounts → compute itemTotal, discount, subTotal, SC, tax, grandTotal |
| `cartGrouping(cartId, subgroup)` | Same as `cart()` but filtered per split-bill subgroup |
| `cartHistory(cartId)` | Aggregated view including void items, payment status, tips, change |
| `summary(cartId)` | Lightweight per-item subtotal via UNION (item + modifier + discount) |
| `scTaxUpdate2(cartId)` | **Recalculate & UPDATE** all SC/tax rows in DB |
| `discountMaxAmountByPercent(cartId)` | Enforce max discount cap for percentage discounts |
| `discountMaxPerItem(cartId)` | Enforce max discount cap for fixed-amount discounts |

**Calculation Logic:**
```
Per Item:
  itemTotal = price × qty
  modifierTotal = Σ(modifier.debit - modifier.credit) × qty
  discountAmount = based on rate(%) or fixed amount
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

| Function | Description |
|----------|-------------|
| `printToPrinter(message, ip, port)` | Raw TCP socket print → ESC/POS commands + paper cut |
| `printerEsc(message, printerData)` | `escpos` library formatted print |
| `openCashDrawer(ip, port)` | ESC/POS cash drawer kick (pulse pin 2+5) |
| `printQueueInternal(db, sendOrder, userId)` | Create print queue entries per menu item printer group |
| `inputPrintQueue(db, message, printers, ...)` | Insert generic messages into print_queue |
| `sendToPrinter(data)` | TCP socket print (used by printWorker.js) |
| `sendToPrinterDummy(data)` | Simulated print (2s delay, no real output) |

### 8.3. Auto Number Generator (`helpers/autoNumber.js`)

Generates sequential IDs based on configuration in the `auto_number` table:

```
Configuration:
  name: "cartId"
  prefix: "yymmdd" (or static string)
  digit: 6 (number of digits)
  runningNumber: auto-increment

Example result: "250304000001" (250304 = 2025-03-04, 000001 = sequence)
```

### 8.4. Cashback Engine (`helpers/cashcback.js`)

After payment:
1. Find active cashback rules per outlet → `cashback` + `cashback_outlet`
2. Check if payment method is eligible → `cashback_payment`
3. Match payment amount to `cashback_amount` tier (earnMin–earnMax)
4. Generate random cashback (cashbackMin–cashbackMax range)
5. Insert `cart_cashback` record
6. Generate QR code for redemption

### 8.5. Terminal License Key Generator (`token.js`)

A standalone CLI utility for generating **JWT license tokens** for each POS terminal deployed to a client site. This is **not** part of the running server — it is run manually by the developer/admin to produce a license key file for each terminal installation.

**How it works:**
```
1. Define client name (e.g., 'MITRALINK')
2. Define payload: { terminalId: '0005', expired: '2027-01-01' }
3. Signing key = clientName + secretPassword
4. Generate JWT with 1-hour signing expiry (but actual license validity is in payload.expired)
5. Output: JWT string → saved as terminal key file
```

**Signing key construction:**
```javascript
const matchPass = client + myPassword;
// e.g., 'MITRALINK' + 'gXXjLL9M9P1lyTg49nJ32GvwMT09rl30IgJWoo712T4IL8CREV'
```

**Token payload:**
| Field | Description |
|-------|-------------|
| `terminalId` | Unique terminal identifier (e.g., '0001', '0005') |
| `expired` | License expiry date (e.g., '2027-01-01') |

**Usage flow:**
1. Admin runs `node token.js` (after editing client/terminalId/expired values)
2. Copy the generated JWT string
3. Save it as the terminal's license key file
4. Terminal app sends this key via `POST /api/terminal/login/terminal` to validate
5. Server verifies the JWT signature using the same client+password combination

**Important:** The `myPassword` in token.js is a **separate secret** from `.env SECRET_KEY`. The `SECRET_KEY` is for employee login JWT tokens, while `myPassword` in token.js is specifically for terminal license keys.

---

## 9. Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `message-from-client` | Client → Server | Generic message from client |
| `message-from-server` | Server → All (broadcast, exclude sender) | Forward message to all other clients |
| `broadcast-reload` | Client → Server | Trigger reload |
| `reload` | Server → All (broadcast) | Notify all terminals to reload data |
| `printing-reload` | Client → Server | Printer status update |
| `printing` | Server → All (broadcast) | Notify terminals: print queue status changed |

**Used by `printWorker.js`:** Sends `printing-reload` event when print status changes (PENDING→PRINTING→DONE/ERROR).

---

## 10. Code Conventions

### 10.1. Common Patterns

- **Soft delete**: All tables have a `presence` column (1=active, 0=deleted). Queries always filter `WHERE presence = 1`.
- **Audit trail**: All tables have `inputDate`, `inputBy`, `updateDate`, `updateBy`.
- **Void flag**: Transactional tables have a `void` column (0=normal, 1=voided).
- **Database**: All queries use `mysql2` promise pool with `async/await` pattern.
- **ID Generation**: Uses `helpers/autoNumber.js` for IDs like cartId, dailyCheckId, sendOrder.
- **Naming**: Controller files: `*Controller.js`, Route files: no suffix. camelCase for variables and functions.
- **Response format**: `res.json({ error: false/true, data: ..., message: '...' })`.
- **Currency**: All prices stored as **integers** (Rupiah without decimals, except `menu.price*` which uses `decimal(9,2)`).

### 10.2. Cart Close Status Values

| `cart.close` | Meaning |
|--------------|---------|
| 0 | Open (still active) |
| 20 | Paid (payment completed) |
| 41 | Void (cancelled) |

### 10.3. Print Queue Status Values

| `print_queue.status` | Meaning |
|----------------------|---------|
| 0 | PENDING (not yet processed) |
| 1 | PRINTING (currently printing) |
| 2 | DONE (completed) |
| 3 | ERROR (failed, will retry) |

### 10.4. Menu Set Types

| `menu.menuSet` | Type |
|----------------|------|
| `''` (empty) | Regular menu item |
| `'FIXED'` | Fixed combo — all sub-items automatically included |
| `'SELECT'` | Select combo — customer chooses sub-items |

### 10.5. Tax/SC Status Values

| Value | Meaning |
|-------|---------|
| 1 | Included in price (price already includes tax/SC) |
| 2 | Excluded from price (tax/SC added on top) |

### 10.6. Price Levels

Menu has `price1`–`price5` and `specialPrice1`–`specialPrice5`. The price level is determined by `outlet.priceNo` or `terminal.priceNo`.

---

## 11. File Output

| File Type | Location | Trigger |
|-----------|----------|---------|
| Daily close CSV | `public/output/{yyyymmdd}-daily.csv` | POST /terminal/daily/close |
| Bill text | `public/output/bill/{yyyymmdd}/` | POST /terminal/bill/createTxtBill |
| Closed bill text | `public/output/billClosed/{yyyymmdd}/` | Payment close |
| Send order files | `public/output/sendOrder/{yyyymmdd}/` | POST /terminal/menuItemPos/sendOrder |
| Table checker text | `public/output/tableChecker/{yyyymmdd}/` | GET /terminal/printing/tableChecker |
| Daily close export | `public/output/dailyClose/` | POST /terminal/daily/close |
| User action logs | CSV via Winston logger | POST /terminal/log/ |

---

## 12. Development Notes

### Known Issues / Technical Debt
1. **SQL Injection risk**: Some queries use string concatenation instead of parameterized queries (especially in `IsAuth.checkReportToken`).
2. **Typo**: `voidTransacton` (missing 'i') in menuItemPos.js route.
3. **Duplicate route**: `/global` route is mounted twice in server.js.
4. **`bill copy.js`**: Helper file that has not been cleaned up.
5. **`cashcback.js`**: Typo in filename (should be `cashback.js`).
6. **Production auth**: Admin routes currently do not enforce authentication.
7. **Currency precision**: Mix of `int` (whole Rupiah) and `decimal(9,2)` in the database can cause rounding issues.

### How to Run
```bash
# Development
cd service
cp env .env         # Setup environment
npm install
npm run run         # nodemon server.js (auto-reload)

# Print Worker (separate process)
node printWorker.js

# Production
npm start           # node server.js
```

### Testing Database
- `dbPos-for-AI.sql` — Schema only (no data) for AI reference
- `dbPos-dummy-data.sql` — Schema + dummy data for testing
- `backupDb/` — Full production backup

---

## 13. Quick Reference — Complete Database Tables

| # | Table | Description | Type |
|---|-------|-------------|------|
| 1 | `adjust_items` | Stock tracking records | Transactional |
| 2 | `auto_number` | ID generator configuration | Config |
| 3 | `bill` | Bill versioning per cart | Transactional |
| 4 | `cart` | **Main order/transaction** | Transactional |
| 5 | `cart_cashback` | Cashback per payment | Transactional |
| 6 | `cart_copy_bill` | Bill reprint log | Transactional |
| 7 | `cart_item` | **Items in an order** | Transactional |
| 8 | `cart_item_discount` | Discount per item | Transactional |
| 9 | `cart_item_group` | Split bill grouping | Transactional |
| 10 | `cart_item_modifier` | Modifier per item | Transactional |
| 11 | `cart_item_sc` | Service charge per item | Transactional |
| 12 | `cart_item_tax` | Tax per item | Transactional |
| 13 | `cart_item_void_reason` | Item void reason | Transactional |
| 14 | `cart_merge_log` | Table merge log | Transactional |
| 15 | `cart_payment` | Payments per transaction | Transactional |
| 16 | `cart_payment_void_reason` | Payment void reason | Transactional |
| 17 | `cart_transfer_items` | Item transfer log | Transactional |
| 18 | `cart_void_reason` | Transaction void reason | Transactional |
| 19 | `cashback` | Cashback rules | Master |
| 20 | `cashback_amount` | Cashback tiers | Master |
| 21 | `cashback_outlet` | Cashback per outlet | Master |
| 22 | `cashback_payment` | Cashback per payment type | Master |
| 23 | `check_cash_type` | Cash denominations | Master |
| 24 | `check_payment_group` | Payment groups | Master |
| 25 | `check_payment_type` | Payment types | Master |
| 26 | `check_payment_type_popup` | Payment popup config | Master |
| 27 | `daily_cash_balance` | Daily cash in/out | Transactional |
| 28 | `daily_check` | Business day | Transactional |
| 29 | `daily_schedule` | Open/close schedule | Master |
| 30 | `discount` | Discount rules | Master |
| 31 | `discount_group` | Discount groups | Master |
| 32 | `discount_level` | Discount level per auth level | Master |
| 33 | `employee` | Employee data | Master |
| 34 | `employee_access_right` | Access rights per auth level | Master |
| 35 | `employee_auth_level` | Authorization levels | Master |
| 36 | `employee_dept` | Employee departments | Master |
| 37 | `employee_order_level` | Employee order levels | Master |
| 38 | `employee_token` | Login sessions | Transactional |
| 39 | `foreign_currency_type` | Foreign currencies | Master |
| 40 | `language` | i18n key-value | Master |
| 41 | `logs` | User activity log | Transactional |
| 42 | `member_class` | Member classes | Master |
| 43 | `member_transaction_type` | Member transaction types | Master |
| 44 | `menu` | **Menu items** | Master |
| 45 | `menu_category` | Menu categories | Master |
| 46 | `menu_class` | Menu classes | Master |
| 47 | `menu_department` | Menu departments | Master |
| 48 | `menu_lookup` | Menu navigation (tree) | Master |
| 49 | `menu_set` | Combo/package items | Master |
| 50 | `menu_tax_sc` | Tax & SC profile | Master |
| 51 | `menu_tax_sc_status` | Tax/SC status labels | Master |
| 52 | `modifier` | Modifier items | Master |
| 53 | `modifier_group` | Modifier groups | Master |
| 54 | `modifier_list` | Modifier lists | Master |
| 55 | `module` | System modules (for access rights) | Master |
| 56 | `outlet` | Outlet/branch data | Master |
| 57 | `outlet_discount` | Discounts per outlet | Master |
| 58 | `outlet_floor_plan` | Floor plans per outlet | Master |
| 59 | `outlet_table_map` | Table layout per outlet | Master |
| 60 | `outlet_table_map_status` | Table status (color, label) | Master |
| 61 | `pantry_message` | Pantry/kitchen messages | Master |
| 62 | `period` | Time periods (breakfast/lunch/dinner) | Master |
| 63 | `print_queue` | Print queue | Transactional |
| 64 | `print_queue_status` | Print status labels | Master |
| 65 | `printer` | Printer data | Master |
| 66 | `printer_group` | Printer groups | Master |
| 67 | `reports` | Report list (menu hierarchy) | Master |
| 68 | `reports_token` | Report access tokens | Transactional |
| 69 | `send_order` | Kitchen order batches | Transactional |
| 70 | `template_table_map` | Table icon templates | Master |
| 71 | `terminal` | POS terminal data | Master |
| 72 | `terminal_token` | Terminal sessions | Transactional |
| 73 | `ux` | POS UI configuration | Master |
| 74 | `void_reason` | Void reasons | Master |
| V1 | `view_cart` | View: cart items flat | View |
| V2 | `view_discount` | View: discounts flat | View |

---

*This documentation was generated based on source code analysis. Update this file whenever there are significant changes to architecture, endpoints, or database schema.*
