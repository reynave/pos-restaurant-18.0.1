# TROUBLESHOOTING.md - Common Issues and Solutions

Diagnostic guide for resolving common POS system errors and issues.

---

## 1. Login Issues

### 1.1 "Invalid credentials" on terminal employee login

**Symptom:** Terminal displays "Invalid credentials" after entering username/password at `/login`.

**Possible causes:**
1. Username/password typo
2. Employee account disabled (presence=0 in DB)
3. Employee not assigned to outlet
4. Wrong outlet selected

**Debug steps:**
1. Check `employee` table: `SELECT * FROM employee WHERE username='john.doe'`
2. Verify presence=1 and password not null
3. Verify `employee_auth_level` has entry for this employee
4. Check terminal sent correct `outletId` in POST `/terminal/login/signin`

**Fix:**
- Recreate employee via admin panel
- Verify employee department and auth level assigned
- Ensure password hashed with bcryptjs (NOT plain text)

**Server endpoint:** `POST /api/terminal/login/signin`
**Backend file:** `routes/terminal/loginPos.js` → `controllers/terminal/loginController.js`

---

### 1.2 "Terminal license invalid" at `/login/terminal`

**Symptom:** Terminal redirected to `/login/terminal`, user enters terminal id, gets error "KEY SIGNATURE IS NOT VALID".

**Possible causes:**
1. License JWT signature mismatch
2. License expired
3. Terminal id in payload doesn't match input id
4. JwtVerifyService has wrong embedded secret

**Debug steps:**
1. Check license JWT payload: decode at jwt.io (copy from response)
2. Verify `payload.terminalId` matches input terminal id
3. Check `payload.expired` date is >= today
4. Verify backend `token.js` uses same client name + secret as embedded in JwtVerifyService

**Fix:**
```bash
# Regenerate license key with correct params:
node token.js
# Update TERMINAL_ID, CLIENT_NAME, EXPIRED_DATE in token.js first
```

**Frontend file:** `src/app/login/terminal-login/terminal-login.component.ts` (JwtVerifyService)
**Backend file:** `service/token.js`

---

### 1.3 "Route to /daily/start unexpectedly" after login

**Symptom:** After successful login, terminal navigates to `/daily/start` instead of `/tables` or `/cashier`.

**Possible causes:**
1. No active daily check in DB
2. `dailyCheck` returned null from POST `/terminal/login/signin`
3. Employee does not have dailyAccess permission

**Debug steps:**
1. Check `daily_check` table for today: `SELECT * FROM daily_check WHERE DATE(startDate)=CURDATE() AND outletId=?`
2. Verify response from POST `/terminal/login/signin` includes `dailyCheck` array
3. Check JWT token payload has `"dailyAccess": 1`

**Fix:**
- User must click "Start Daily" at `/daily/start` to open daily check
- Or admin manually creates `daily_check` record if DB corrupted

**Frontend logic:** `src/app/login/login.component.ts` lines 121-136
**Backend query:** `controllers/terminal/loginController.js`

---

## 2. Menu and Ordering Issues

### 2.1 "Menu items not appearing" after admin adds new item

**Symptom:** Admin creates menu item via `/menu/item` in admin panel. Terminal app still shows old menu (new item missing).

**Possible causes:**
1. Menu cached in terminal (not expired)
2. Terminal didn't receive socket broadcast
3. Backend returned success but DB insert failed
4. Menu filter doesn't include new item category

**Debug steps:**
1. Admin: verify POST `/menu/item/create` returned `error: false`
2. Admin: check DB `SELECT * FROM menu WHERE plu='...'` (exists?)
3. Terminal: check Network tab → `menuItemPos/lookUpMenu` request
4. Terminal: check if socket event `printing` received (indicates broadcasts working)

**Fix:**
- Terminal: manual page refresh (F5) or logout/login
- Admin: verify menu category assigned to item
- Verify item `presence=1`

**Terminal flow:**
- Startup: GET `terminal/menuItemPos/` (loads into memory)
- Socket broadcast `printing` (may not include menu changes)
- On-demand: GET `terminal/menuItemPos/lookUpMenu` (user navigates to menu)

---

### 2.2 "Cannot add item to cart" → 404 or validation error

**Symptom:** Terminal shows "Error adding item to cart" after user clicks menu item.

**Possible causes:**
1. Menu item deleted (presence=0)
2. Menu item price is 0
3. Cart doesn't exist (closed already)
4. Modifier required but not selected

**Debug steps:**
1. Terminal: verify item clicked has `id` > 0 (not undefined)
2. Admin: check menu item `presence=1` and `price > 0`
3. Terminal: check Network tab → POST `menuItemPos/addToCart` → response status/message
4. Check `cart` table: `SELECT * FROM cart WHERE id='{cartId}'` (exists, close != 20?)

**Fix:**
- Create new order: terminal navigates to `/tables` → clicks table → "New Order"
- Verify menu item in admin panel

**Terminal file:** `src/app/pos/menu/menu.component.ts` lines 530-570 (addToCart method)
**Backend file:** `controllers/terminal/menuItemPosController.js` lines ~400

---

### 2.3 "Modifier price not applied" on bill

**Symptom:** Item with modifier shows in menu, user selects it, but bill doesn't show modifier charge.

**Possible causes:**
1. Modifier price is 0 in DB
2. Modifier not linked to menu item
3. Frontend didn't send modifier to backend
4. Backend validation rejected modifier price

**Debug steps:**
1. Admin: check `modifier` table: `SELECT * FROM modifier WHERE id=?` → `price > 0?`
2. Admin: check `menu` table has `modifierGroupId > 0`
3. Terminal: Network tab → POST `menuItemPos/addModifier` → verify modifier price in request
4. Check `cart_item_modifier` table: `SELECT * FROM cart_item_modifier WHERE cartItemId=?` (has price field?)

**Fix:**
- Admin: set modifier price > 0
- Terminal: re-add item and reselect modifier
- Frontend: refresh cache (logout/login)

---

## 3. Bill and Payment Issues

### 3.1 "Discount cap exceeded" error on payment

**Symptom:** Terminal applies discount at `/bill`, but on `/payment` shows error "Discount amount exceeds maximum".

**Possible causes:**
1. Discount percent exceeds allowed max (helper/bill.js enforces cap)
2. Discount rule changed after item added
3. Multiple discounts applied to same item exceeding total

**Debug steps:**
1. Check `discount` table: `SELECT * FROM discount WHERE id=?` → `maxAmount`
2. Check `cart_item_discount` table: sum all discount amounts for item
3. Backend helper: `helpers/bill.js` → `discountMaxPerItem()` logic

**Fix:**
- Reduce discount amount or percentage
- Apply discount to different items instead of one item
- Admin: increase discount cap in admin panel

**Backend validation:** `helpers/bill.js` lines 800-850 (discount cap enforcement)

---

### 3.2 "Service charge or tax not calculated" on bill

**Symptom:** Bill shows item price but no service charge or tax.

**Possible causes:**
1. Menu item not linked to tax/SC profile
2. `menu_tax_sc` record missing or has 0% rates
3. Item marked as take-away (SC disabled for TA)
4. Tax/SC status set to "included" but rates are 0

**Debug steps:**
1. Check menu item: `SELECT menuTaxScId FROM menu WHERE id=?`
2. Check tax profile: `SELECT * FROM menu_tax_sc WHERE id=?` → verify taxRate, scRate > 0
3. Terminal: check if item has "TA" (take-away) flag set
4. Backend: `helpers/bill.js` → `cart()` function (calculate SC and tax)

**Fix:**
- Admin: assign tax/SC profile to menu item
- Admin: ensure profile has rates > 0
- Terminal: uncheck "Take Away" if SC should apply

---

### 3.3 "Payment processing error" on close

**Symptom:** Terminal shows "Error processing payment" after clicking "Pay" at `/payment`.

**Possible causes:**
1. Payment type invalid or deleted
2. Payment amount doesn't match bill total
3. Token expired
4. Network timeout

**Debug steps:**
1. Terminal: Network tab → POST `payment/addPaid` → response error message
2. Terminal: check total amount matches sum of payments
3. Terminal: verify JWT token not expired (check browser console)
4. Check `check_payment_type` table: payment type exists?

**Fix:**
- Terminal: logout/login (refresh token)
- Terminal: verify payment amount = bill total
- Admin: recreate payment type if deleted
- Check internet connection (network timeout)

**Backend file:** `controllers/terminal/paymentController.js` → `addPaid` method

---

## 4. Printing Issues

### 4.1 "Print queue stuck" (showing 0 pending)

**Symptom:** Terminal shows print queue empty, but kitchen claims they didn't receive order.

**Possible causes:**
1. Order sent but status stuck at 0 (PENDING)
2. Printer offline or TCP connection failed
3. printWorker.js not running
4. Print queue message malformed

**Debug steps:**
1. Check `print_queue` table: `SELECT * FROM print_queue WHERE status=0 ORDER BY inputDate DESC LIMIT 5`
2. Terminal: check Network tab → POST `menuItemPos/sendOrder` → response has `printQueue`?
3. Check printWorker running: `ps aux | grep printWorker`
4. Check printer connectivity: telnet {printerIp} {printerPort}

**Fix:**
- Restart printWorker: `node printWorker.js`
- Verify printer IP/port in outlet config
- Resend order: terminal navigate back to `/menu` → click item again → "Send Order"

**Backend files:**
- `printWorker.js` (background process)
- `helpers/printer.js` (TCP printing logic)
- `routes/terminal/printQueue.js` (queue endpoints)

---

### 4.2 "Receipt not printing" after payment

**Symptom:** Payment successful, but thermal printer didn't print receipt.

**Possible causes:**
1. Receipt print queue not inserted
2. Printer offline
3. printWorker crashed
4. Receipt template malformed

**Debug steps:**
1. Check `print_queue` table: recent entry with receipt message?
2. Check printer: `netcat {ip} {port}` → send test command
3. Check printWorker logs: `tail -f logs/printWorker.log`
4. Verify outlet has printer assigned: admin `/workStation/printer`

**Fix:**
- Reprint receipt: terminal `/transaction` → select transaction → "Reprint"
- Restart printWorker: `node printWorker.js`
- Verify printer online and TCP port open

---

## 5. Authentication and Token Issues

### 5.1 "Token expired" during transaction

**Symptom:** Terminal works fine, but on `/payment` gets "Token expired" error.

**Possible causes:**
1. JWT token has short expiry (e.g., 1 hour)
2. Server time skew
3. Token not refreshed on login

**Debug steps:**
1. Terminal: check token payload: decode JWT in console
2. Check payload `"exp"` field (expiry timestamp)
3. Verify server time vs terminal time match

**Fix:**
- Terminal: logout and re-login (get new token)
- Backend: increase JWT expiry duration if too short
- Sync server/terminal time (NTP)

**Backend file:** `routes/terminal/loginPos.js` → token generation

---

### 5.2 "Invalid Authorization header" error

**Symptom:** Terminal shows "Unauthorized" on random API calls.

**Possible causes:**
1. Token header missing or malformed
2. Token value corrupted
3. PRODUCTION env var set (enforces auth validation)

**Debug steps:**
1. Terminal: Network tab → check request headers
2. Verify header format: `Authorization: Bearer {token}`
3. Backend: check `.env` PRODUCTION=true|false
4. Token validity: decode and check signature

**Fix:**
- Terminal: clear localStorage, logout/login fresh
- Backend: set PRODUCTION=false for dev (disables auth check)
- Verify server SECRET_KEY matches token signing key

**Frontend file:** `src/app/service/config.service.ts` (headers method)
**Backend file:** `helpers/IsAuth.js` (middleware)

---

## 6. Database Issues

### 6.1 "Table locked" or "Deadlock" error

**Symptom:** Backend returns error "Database deadlock" or "Table locked". Terminal shows "Server error".

**Possible causes:**
1. Long-running query blocking others
2. Concurrent updates to same row
3. Transaction isolation issue

**Debug steps:**
1. Backend: check active queries: `SHOW PROCESSLIST;`
2. Check for locked tables: `SHOW OPEN TABLES WHERE In_use > 0;`
3. Check error log: `tail -f logs/error.log`

**Fix:**
- Restart MySQL: `systemctl restart mysql`
- Kill long query: `KILL {process_id}`
- Increase max_connections if too many concurrent

---

### 6.2 "Duplicate entry" on cart insert

**Symptom:** Backend error "Duplicate entry for key 'PRIMARY'" when adding to cart.

**Possible causes:**
1. Cart ID collision (auto_number generator error)
2. Duplicate insert attempt (retransmission)
3. Concurrent requests from two terminals for same table

**Debug steps:**
1. Check `cart` table: `SELECT * FROM cart WHERE id='{cartId}'` (already exists?)
2. Check `auto_number` table: verify runningNumber increment logic
3. Terminal: Network tab → check if request sent twice (accidental double-click)

**Fix:**
- Terminal: clear cache, logout/login, try again
- Backend: investigate auto_number generator in `helpers/autoNumber.js`

---

### 6.3 "Foreign key constraint violated"

**Symptom:** Backend error "Cannot add or update a child row: foreign key constraint fails".

**Possible causes:**
1. Referenced record deleted (e.g., menu item, outlet)
2. menuId or outletId in request doesn't exist
3. Employee auth level deleted

**Debug steps:**
1. Identify which foreign key: check error message
2. Query referenced table: `SELECT * FROM {table} WHERE id={value}`
3. Verify all dependencies exist

**Fix:**
- Recreate referenced record via admin panel
- Verify data consistency: don't delete items with active orders

---

## 7. Network and Connectivity Issues

### 7.1 "Cannot connect to server" on terminal startup

**Symptom:** Terminal shows "Cannot connect to backend" at app startup.

**Possible causes:**
1. Backend server not running
2. Server URL configured wrong in terminal setup
3. Firewall blocking port
4. Network unreachable

**Debug steps:**
1. Terminal: check `pos3.env.server` in localStorage
2. Backend: verify running: `ps aux | grep "node server.js"`
3. Test connectivity: `curl -v http://{server}:{port}/api/`
4. Check firewall: `netstat -tlnp | grep 3000`

**Fix:**
- Start backend: `cd service && npm start`
- Terminal: setup page → correct server URL
- Check firewall rules

**Terminal file:** `src/environments/environment.ts` (api base URL)

---

### 7.2 "Socket.IO connection timeout"

**Symptom:** Terminal doesn't receive real-time updates (print queue, menu changes).

**Possible causes:**
1. Socket.IO not running on backend
2. Socket connection URL wrong
3. Firewall blocking WebSocket

**Debug steps:**
1. Backend: verify Socket.IO initialized in `server.js`
2. Terminal: check socket connection: browser DevTools → Console → type `window.location.href` → check for websocket connections
3. Network tab: check for `socket.io` upgrade request (WebSocket)

**Fix:**
- Backend: ensure Socket.IO server running on same port as HTTP
- Terminal: refresh page to reconnect socket
- Check firewall: allow WebSocket traffic

**Backend file:** `server.js` (Socket.IO setup)
**Frontend file:** `src/app/service/socket.service.ts`

---

## 8. Reporting Issues

### 8.1 "Report token expired" error

**Symptom:** Admin or terminal tries to view report, gets "Report token expired".

**Possible causes:**
1. Token older than 24 hours
2. Report token not generated for this session

**Debug steps:**
1. Check `reports_token` table: `SELECT * FROM reports_token WHERE token=?` → check `createdDate`
2. Generate new token: terminal `/reports` → "Generate Report Token"

**Fix:**
- Generate fresh report token (valid for 24h)
- Try report again within 24h window

**Backend file:** `controllers/terminal/menuReportsController.js` → `createReportToken`

---

### 8.2 "No data in report" (empty report)

**Symptom:** Report renders but shows 0 transactions, 0 sales.

**Possible causes:**
1. Date range has no orders
2. Outlet filter excludes actual outlet
3. Report query error (no error shown, just empty)

**Debug steps:**
1. Check date range: start date before first order, end date after last order
2. Check outlet selected: verify orders exist for that outlet
3. Check `cart` table: `SELECT COUNT(*) FROM cart WHERE DATE(startDate) BETWEEN ? AND ? AND outletId=?`

**Fix:**
- Adjust date range (widen it)
- Select correct outlet
- Verify orders exist in system

---

## 9. Performance Issues

### 9.1 "Bill calculation taking 30+ seconds"

**Symptom:** Terminal hangs at `/bill` screen, then bill finally displays.

**Possible causes:**
1. Cart has many items (100+) → complex calculation
2. Backend query slow (missing index on cart_item)
3. Network latency high

**Debug steps:**
1. Check cart item count: `SELECT COUNT(*) FROM cart_item WHERE cartId=?`
2. Backend: monitor query execution time (MySQL slow query log)
3. Terminal: check Network tab → POST `bill/` request time

**Fix:**
- Split large orders into multiple carts
- Add DB index on `cart_item.cartId`
- Optimize helper/bill.js calculation logic

**Backend file:** `helpers/bill.js` (cart calculation)
**Config:** `service/.env` (PRODUCTION mode, connection pool size)

---

### 9.2 "Terminal app sluggish" during lunch rush

**Symptom:** Terminal app slow, menu loads slowly, buttons unresponsive.

**Possible causes:**
1. Too many components in memory
2. Menu tree rendering 1000+ items
3. Browser memory leak

**Debug steps:**
1. Terminal: DevTools → Performance tab → record interaction
2. Check Network tab: are many requests pending?
3. Browser console: any JS errors?

**Fix:**
- Terminal: logout/login (refresh app state)
- Terminal: close unused browser tabs
- Backend: scale (add more backend instances if many terminals)

---

## 10. Common Error Messages and Meanings

| Error Message | Cause | Action |
|---|---|---|
| "Invalid credentials" | Wrong username/password | Re-enter, verify in admin |
| "Token expired" | JWT token past expiry | Re-login |
| "Access denied" | Insufficient permissions | Check employee auth level |
| "Table not found" | Table ID invalid or deleted | Refresh table list |
| "Item out of stock" | Item presence=0 | Admin re-enable item |
| "Printer offline" | TCP connection failed | Check printer IP/port |
| "Discount cap exceeded" | Discount % > max allowed | Reduce discount |
| "Daily check not found" | No active daily_check | Click "Start Daily" |
| "Database deadlock" | Concurrent transaction conflict | Retry or restart backend |
| "Foreign key constraint" | Referenced record missing | Recreate referenced record |

---

## 11. How to Read Error Logs

### 11.1 Backend error log

```
tail -f service/logs/error.log
```

Look for:
- Timestamp, error level (ERROR, WARN, INFO)
- Stack trace (file, line number)
- Error message (what went wrong)
- Context (user id, request url)

### 11.2 Browser console (terminal/admin)

DevTools → Console tab:
- Red error messages (failed network requests, JS errors)
- Network issues → check Network tab
- Auth issues → check localStorage keys

### 11.3 MySQL slow query log

```
tail -f /var/log/mysql/slow.log
```

Shows queries taking > 2 seconds, helps identify bottlenecks.

---

## 12. Reset Procedures

### 12.1 Full terminal app reset

```javascript
// In browser console on terminal app:
localStorage.clear();
window.location.reload();
```

Then user must:
1. Setup → enter server URL
2. Terminal login → enter terminal id
3. Employee login → username/password
4. Daily start

### 12.2 Reset daily session (without full logout)

```sql
DELETE FROM daily_check WHERE DATE(startDate) = CURDATE() AND outletId = ?;
DELETE FROM cart WHERE DATE(startDate) = CURDATE() AND outletId = ?;
```

Then terminal refresh page.

### 12.3 Clear print queue

```sql
DELETE FROM print_queue WHERE status != 2;
```

Restart printWorker after.

---

This guide is a living document. Add new issues as discovered, with root cause and fix.
