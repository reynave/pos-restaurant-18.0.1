# INTEGRATION-GUIDE.md - Admin ↔ Terminal Data Sync

This document maps data flow between admin panel and in-store POS terminals.

---

## 1. Overview

Admin panel is the **configuration source** for master data. POS terminals are **consumers** that fetch and cache config at startup/daily basis.

```
┌─────────────────────┐
│   ADMIN PANEL       │
│ (admin18.0.1)       │
│ - Master data CRUD  │
│ - Menu, pricing     │
│ - Outlets, tables   │
│ - Employees, rules  │
└──────────┬──────────┘
           │ REST API (POST/PUT/DELETE)
           ▼
┌─────────────────────────────────────────────────┐
│         BACKEND DATABASE (pos_resto)            │
│ - Menu items, categories, modifiers             │
│ - Outlets, tables, floor plans                  │
│ - Employees, auth levels, permissions          │
│ - Discounts, cashback, payment types           │
└──────────┬────────────────────┬─────────────────┘
           │ REST API (GET)     │ Socket.IO broadcast
           ▼                    ▼
┌──────────────────────────────────────────┐
│    POS TERMINAL (terminal18.0.1)         │
│ - Cache master data on startup           │
│ - Display menu, process orders           │
│ - Real-time listen for changes           │
└──────────────────────────────────────────┘
```

---

## 2. Data Sync Flow by Feature

### 2.1 Menu & Pricing

**Path:** Admin → Backend → Terminal

| Step | Actor | Action | Endpoint | Payload |
|---|---|---|---|---|
| 1 | Admin | Add/edit menu item | POST/PUT `/menu/item/create\|update` | `{ plu, name, price, category, dept, modifierGroup }` |
| 2 | Backend | Insert/update `menu` table | DB write | - |
| 3 | Backend | Broadcast change | Socket.IO `printing` | `{ menuId, action: 'updated' }` |
| 4 | Terminal | Receive broadcast | Socket listener | Invalidate menu cache |
| 5 | Terminal | Refresh on next action | GET `terminal/menuItemPos/` | Re-fetch menu tree |

**Cache strategy on terminal:**
- Load menu on app startup via `GET terminal/login/outlet`
- Cache in memory (component property)
- On socket broadcast, mark cache stale
- Lazy reload on next page access (tables → menu)

**Important:** Terminals cache menu; changes visible only after:
- Terminal reconnects or navigates
- Manual cache clear (localStorage or page reload)
- Broadcast forces client update (not always sent for all changes)

---

### 2.2 Table Map & Floor Plan

**Path:** Admin → Backend → Terminal

| Step | Actor | Action | Endpoint | Payload |
|---|---|---|---|---|
| 1 | Admin | Create/edit table | POST/PUT `/tableMap/table/create\|update` | `{ tableName, outletId, x, y, status }` |
| 2 | Backend | Update `outlet_table_map` table | DB write | - |
| 3 | Terminal | Load on session start | GET `terminal/tableMap/` | Fetch all tables for outlet |
| 4 | Terminal | Render table floor plan | In-memory | Real-time table status via order cart state |

**Terminal receives:**
- Table list with positions
- Floor plan image from `outlet_floor_plan`
- Table status (occupied/free/overdue) computed from active orders

**Admin adds floor plan image:**
- Upload via `/floorMap/map/` (not detailed in code; assumed file upload)
- Terminal fetches image via `public/floorMap/{filename}.jpg`

---

### 2.3 Employee & Authorization

**Path:** Admin → Backend → Terminal (at login)

| Step | Actor | Action | Endpoint | Payload |
|---|---|---|---|---|
| 1 | Admin | Create employee, set auth level | POST `/employee/create` + assign auth level | `{ name, username, password, authLevelId, deptId }` |
| 2 | Backend | Hash password, insert `employee` table | DB write | - |
| 3 | Terminal | Fetch employee list at login | GET `terminal/login/outlet` | List employees for outlet |
| 4 | Terminal | Employee logs in | POST `terminal/login/signin` | `{ username, password, outletId }` |
| 5 | Backend | Validate credentials, return JWT token | - | `{ token, employee: {...}, accessRight: [...] }` |
| 6 | Terminal | Store token + access rights | localStorage + memory | Token for all subsequent requests |

**Auth levels in terminal:**
- Stored in JWT payload from backend
- Terminal does **not** fetch auth dynamically; relies on token expiry
- If permissions changed in admin, terminal sees new perms only after re-login

---

### 2.4 Discount & Cashback Rules

**Path:** Admin → Backend → Terminal (per transaction)

| Step | Actor | Action | Endpoint | Payload |
|---|---|---|---|---|
| 1 | Admin | Define discount rule | POST `/discount/create` | `{ name, type: 'fixed'\|'percent', amount, maxAmount, appliable }` |
| 2 | Backend | Insert `discount` table | DB write | - |
| 3 | Terminal | Fetch available discounts | GET `terminal/menuItemPos/discountGroup` | List discount groups per outlet |
| 4 | Terminal | Apply discount to item | POST `terminal/menuItemPos/addDiscountGroup` | `{ cartId, cartItemId, discountId, amount }` |
| 5 | Backend | Validate discount cap, insert `cart_item_discount` | DB write | - |
| 6 | Backend | Recalculate bill (helper/bill.js) | In-memory logic | `discountMaxAmountByPercent()` enforces cap |

**Cashback (after payment):**
- Backend checks `cashback` + `cashback_outlet` rules at close
- Generates random cashback within `cashback_amount` tier
- Terminal receives QR code in receipt
- No terminal-side cashback rule logic; only display

---

### 2.5 Payment Types & Methods

**Path:** Admin → Backend → Terminal (per transaction)

| Step | Actor | Action | Endpoint | Payload |
|---|---|---|---|---|
| 1 | Admin | Create payment type | POST `/payment/paymentType/create` | `{ name, code, cashless: true\|false }` |
| 2 | Backend | Insert `check_payment_type` table | DB write | - |
| 3 | Terminal | Fetch payment methods | GET `terminal/payment/paymentType` | List available payment types |
| 4 | Terminal | Select payment method | POST `terminal/payment/addPayment` | `{ cartId, paymentTypeId, amount }` |
| 5 | Backend | Insert `cart_payment` record | DB write | - |

**Terminal rendering:**
- Payment types fetched once per session
- Terminal does not cache payment types; re-fetches on payment screen
- Payment groups for grouping methods (rare feature, depends on outlet config)

---

### 2.6 Outlet Configuration

**Path:** Admin → Backend → Terminal (at login)

| Step | Actor | Action | Endpoint | Payload |
|---|---|---|---|---|
| 1 | Admin | Create/edit outlet | POST/PUT `/outlet/create\|update` | `{ name, outletId, posMode: 'table'\|'cashier', timezone, priceNo, overDue }` |
| 2 | Backend | Insert/update `outlet` table | DB write | - |
| 3 | Terminal | Fetch outlet on login | GET `terminal/login/outlet` | List outlets employee can access |
| 4 | Terminal | User selects outlet, logs in | POST `terminal/login/signin` | `{ username, password, outletId }` |
| 5 | Backend | Return outlet config + printer info | Response payload | `{ outlet: {...}, printer: {...}, dailyCheck: [...] }` |
| 6 | Terminal | Cache outlet + printer config | localStorage `pos3.config.mitralink` | Used for all orders in that outlet |

**Outlet config used by terminal:**
- `posMode` (table vs cashier ordering)
- `priceNo` (which price level to use: price1, price2, etc)
- `overDue` (time limit before table marked overdue)
- Printer IP/port for sending orders

---

### 2.7 Modifiers (Toppings, Size, Options)

**Path:** Admin → Backend → Terminal (per order)

| Step | Actor | Action | Endpoint | Payload |
|---|---|---|---|---|
| 1 | Admin | Create modifier group (e.g., "Size") | POST `/modifier/group/create` | `{ name, required: true\|false }` |
| 2 | Admin | Add modifiers to group (S, M, L, XL) | POST `/modifier/create` + assign group | `{ name, price, modifierGroupId }` |
| 3 | Backend | Insert `modifier_group`, `modifier`, `modifier_list` | DB write | - |
| 4 | Menu item links modifier group | POST `/menu/item/update` | `{ modifierGroupId: X }` | Menu knows which modifiers apply |
| 5 | Terminal | User adds item to cart | POST `terminal/menuItemPos/addToCart` | `{ menuId, qty, cartId }` |
| 6 | Terminal | Fetch modifier options | GET `terminal/menuItemPos/getModifier` | Return modifiers for that item |
| 7 | Terminal | User selects modifiers | POST `terminal/menuItemPos/addModifier` | `{ cartItemId, modifierId, price }` |
| 8 | Backend | Insert `cart_item_modifier` record | DB write | - |

---

### 2.8 Terminal License & Device Binding

**Path:** Admin (one-time setup) → Backend → Terminal

| Step | Actor | Action | Endpoint | Payload |
|---|---|---|---|---|
| 1 | Admin | Generate license key | Manual: `node token.js` (offline) | Input: client name, terminalId, expiry date |
| 2 | Admin | Distribute license key file to device | Manual file copy | Key is JWT signed with client+password |
| 3 | Terminal | User enters terminalId | Input screen `/login/terminal` | `{ terminalId: "0001" }` |
| 4 | Terminal | Submit terminal login | POST `terminal/login/terminal` | `{ terminalId }` |
| 5 | Backend | Fetch license key file, return JWT | Response | `{ fileContent: <JWT>, address: <ip>, error: false }` |
| 6 | Terminal | Verify JWT signature client-side | JwtVerifyService | Check payload.terminalId matches input |
| 7 | Terminal | Store terminal keys | localStorage `pos3.terminal.mitralink`, `pos3.address.mitralink` | Used for header `X-Terminal` in all requests |

**Key insight:** License binding is one-time per device. If terminal IP changes, device must re-login to update address.

---

### 2.9 Daily Close & Reporting

**Path:** Terminal → Backend ← Admin

| Step | Actor | Action | Endpoint | Payload |
|---|---|---|---|---|
| 1 | Terminal | Employee initiates close | POST `terminal/daily/close` | `{ dailyCheckId, outletId }` |
| 2 | Backend | Calculate totals, insert records | SQL aggregation | Summarize all carts for day |
| 3 | Backend | Generate CSV export | File write | `public/output/{yyyymmdd}-daily.csv` |
| 4 | Admin | View daily close report | GET `report/dailyClose` | Fetch `daily_check` + `cart` summary |
| 5 | Admin | Export to Excel/PDF | Client-side or server render | EJS template render (views/reports/) |

**Reporting lag:** Terminals close throughout the day; admin sees partial data until all outlets close.

---

## 3. Real-Time Synchronization (Socket.IO)

Backend broadcasts changes via Socket.IO to trigger terminal cache invalidation.

### 3.1 Socket Events (from server.js)

| Event | Direction | Trigger | Consumer |
|---|---|---|---|
| `printing` | Server → All terminals | Print queue status change (print_queue.status updated) | Terminal: invalidate printQueue cache, refresh queue view |
| `reload` | Server → All terminals | Manual admin action or config change broadcast | Terminal: if terminalId changed, redirect to rebind |
| `message-from-server` | Server → All (except sender) | Client sends `message-from-client` | Admin: propagate reload to other instances |

### 3.2 When Socket Broadcast Occurs

- **Print queue changes:** printWorker.js updates status → emits `printing` → terminals listening refresh queue
- **Terminal rebind:** admin broadcasts terminalId change → app detects new address → forces `/terminalRelogin`
- **Config reload:** admin may manually trigger reload broadcast (not automatic for all changes)

**Important:** Not all admin changes trigger broadcast. Menu, discounts, modifiers require terminal to:
1. Wait for broadcast (if sent)
2. Or lazy-load on next user interaction
3. Or wait for terminal reconnect/restart

---

## 4. Data Consistency Risks

### 4.1 Menu & Pricing

**Risk:** Admin changes menu price, but terminal already cached old price. Old price used until:
- Cache invalidated by broadcast
- Terminal logs out/in
- Page reload

**Mitigation:** Menu price changes should be communicated to staff before going live. Consider server-side enforcement of pricing rules (not just terminal validation).

### 4.2 Discount & Cashback

**Risk:** Admin disables discount rule after terminal has partially applied it. Backend validation at close-time catches invalid discounts (soft delete with `presence` flag). Terminal can't undo already-submitted discount.

**Mitigation:** Soft delete approach (presence=0) ensures old discounts not applied retroactively. Any audit re-calculates from raw items.

### 4.3 Employee Permissions

**Risk:** Admin changes employee auth level, but terminal still has old JWT token (valid until expiry). Employee has old permissions.

**Mitigation:** JWT typically short-lived (hours); terminal re-login needed for new perms. No real-time permission sync.

### 4.4 Table Status & Overdue

**Risk:** Table marked overdue by terminal based on outlet.overDue config. If admin changes overDue timing during day, in-progress tables may miscalculate.

**Mitigation:** Table overdue is computed per transaction; changing config mid-day affects only new orders. Acceptable for restaurant operations.

---

## 5. Data Flow Diagram (By Scenario)

### 5.1 Admin adds new menu item

```
Admin: POST /menu/item/create
  ↓
Backend: INSERT into menu, menu_category, menu_tax_sc
  ↓
Backend: (Optional) Broadcast socket 'reload' to all terminals
  ↓
Terminal 1: Receives 'reload' or next user navigates to /menu
  ↓
Terminal 1: GET terminal/menuItemPos/lookUpMenu (re-fetch tree)
  ↓
Terminal 1: Display new item in menu
```

### 5.2 Customer places order on terminal

```
Terminal: POST terminal/menuItemPos/addToCart
  ↓
Backend: INSERT into cart, cart_item, cart_item_modifier, ...
  ↓
Backend: Helper bill.js calculates totals (itemTotal, sc, tax, discount)
  ↓
Backend: Response includes { cartId, grandTotal, printQueue }
  ↓
Terminal: Display bill preview
```

### 5.3 Employee completes payment

```
Terminal: POST terminal/payment/addPaid
  ↓
Backend: INSERT into cart_payment, update cart.close = 20
  ↓
Backend: Calculate and INSERT cart_cashback
  ↓
Backend: Generate receipt via Handlebars (bill.hbs)
  ↓
Backend: INSERT into printQueue for thermal printer
  ↓
Backend: Emit socket 'printing' to notify print status
  ↓
printWorker.js: Poll print_queue, send to printer via TCP/IP
  ↓
Terminal: Receive 'printing' socket event, update UI
```

### 5.4 Admin exports daily report

```
Admin: GET report/dailyClose (with filters: date range, outlet)
  ↓
Backend: Query daily_check, cart, cart_item, aggregate totals
  ↓
Backend: Render EJS template (views/reports/summary.ejs)
  ↓
Admin: Receives HTML report, print or export
```

---

## 6. Change Detection Strategy Per App

### 6.1 Admin Panel

Admin always fetches fresh data via REST (no cache). Every CRUD operation is synchronous:
- User submits form
- Backend validates and saves
- Response confirms success/failure
- No polling needed

### 6.2 POS Terminal

Terminal caches master data aggressively. Changes detected via:

1. **On-demand (lazy):** Terminal fetches fresh when user navigates
2. **Socket broadcast:** Backend notifies terminals in real-time
3. **Session restart:** On daily start or re-login, cache cleared

**Terminal startup:**
```
Terminal loads → checkToken() → if valid, skip daily start
              → httpCheckKey() every 1 hour (verify terminal still valid)
              → Listen socket 'reload' events
              → On any interaction (menu, bill, payment), use cached data
              → On socket 'printing', refresh print queue
```

---

## 7. Testing Sync Flows

### 7.1 Test Admin → Terminal Menu Update

1. Terminal: Load menu via GET `terminal/menuItemPos/`
2. Admin: Create new menu item via POST `/menu/item/create`
3. Terminal: Wait 5 sec (socket latency) or navigate to refresh
4. Terminal: Verify new item appears in menu

### 7.2 Test Terminal Order → Admin Report

1. Terminal: Place order, apply discount, close payment
2. Admin: GET `report/dailyClose` (same day)
3. Verify order total and discount appear in report

### 7.3 Test Terminal License Binding

1. Terminal: Submit terminalId via POST `terminal/login/terminal`
2. Backend: Return license JWT
3. Terminal: Verify JWT signature, check payload.terminalId
4. Verify `pos3.terminal.mitralink` stored in localStorage

---

## 8. Troubleshooting Sync Issues

### 8.1 "Menu not updated on terminal after admin change"

**Root cause:** Socket broadcast not sent, or terminal cache not cleared.

**Check:**
1. Admin successfully saved (no error in POST)
2. Backend inserted record into `menu` table (check DB)
3. Terminal listening for socket events: DevTools → Application → pos3.env.server should have valid server URL
4. Terminal last navigation: check if user navigated to /menu after change (lazy load)

**Fix:**
- Manually refresh terminal page (F5)
- Or log out and back in (clears all cache)
- Or wait for broadcast and navigate

### 8.2 "Payment discount not applied, shows error on close"

**Root cause:** Discount rule disabled/deleted in admin, but terminal already applied it.

**Check:**
1. Discount exists in `discount` table (presence=1)
2. Discount amount doesn't exceed `discountMaxAmount` cap
3. Backend validation in `bill.js` (discountMaxAmountByPercent/discountMaxPerItem)

**Fix:**
- Re-enable discount (update presence=1)
- Or void transaction and re-do order with valid discount

### 8.3 "Terminal license invalid, can't login"

**Root cause:** JWT signature mismatch or payload.terminalId doesn't match input.

**Check:**
1. Terminal submits correct terminalId (check console log)
2. License JWT generated with correct client name + secret
3. JwtVerifyService has correct embedded secret matching backend token.js

**Fix:**
- Regenerate license key: `node token.js`
- Verify client name and terminalId match
- Restart terminal app

---

This document is the integration reference for debugging cross-component issues and understanding data flow between admin and terminal.
