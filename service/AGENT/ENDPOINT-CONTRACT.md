# ENDPOINT-CONTRACT.md - Request/Response Specifications

Complete request and response schema for all POS backend endpoints.

---

## 1. Overview

All endpoints return JSON response with this structure:

```json
{
  "error": false|true,
  "message": "Success or error description",
  "data": { ... }
}
```

All timestamps in `YYYY-MM-DD HH:MM:SS` format (no timezone, offset by `TIMEZONE` env var in DB session).

---

## 2. Authentication

### 2.1 Terminal Endpoints

**Header:** `Authorization: Bearer {token}`

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-Terminal: {"terminalId":"0001","address":""}
```

### 2.2 Admin Endpoints

**Header:** `Token: {token}`

```
Token: testDev2025
Content-Type: application/json
```

---

## 3. Terminal Authentication Endpoints

### 3.1 GET `/terminal/login/outlet`

**Purpose:** Fetch outlet and employee list for login screen.

**Request:**
```
GET /api/terminal/login/outlet
```

**Response:**
```json
{
  "error": false,
  "data": {
    "outletSelect": [
      {
        "id": 1,
        "outletId": "O001",
        "name": "Main Branch",
        "presence": 1
      },
      { "id": 2, "outletId": "O002", "name": "Downtown", "presence": 1 }
    ],
    "employeeSelect": [
      {
        "id": "EMP001",
        "name": "John Doe",
        "username": "john.doe",
        "authLevelId": 2
      }
    ]
  }
}
```

---

### 3.2 POST `/terminal/login/signin`

**Purpose:** Authenticate employee with username/password and return JWT token.

**Request:**
```json
{
  "username": "john.doe",
  "password": "password123",
  "outletId": 1
}
```

**Response:**
```json
{
  "error": false,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkVNUDAwMSIsIm5hbWUiOiJKb2huIERvZSIsImF1dGhMZXZlbElkIjoyLCJkYWlseUFjY2VzcyI6MSwiZXhwIjoiMjAyNS0xMi0zMSJ9...",
    "outlet": [
      {
        "id": 1,
        "outletId": "O001",
        "name": "Main Branch",
        "posMode": "table",
        "timezone": "+07:00",
        "priceNo": 1,
        "overDue": "00:45:00"
      }
    ],
    "printer": {
      "con": "network",
      "address": "192.168.1.100",
      "port": 9100,
      "name": "Kitchen Printer 1"
    },
    "dailyCheck": [
      {
        "id": "DC20250512000001",
        "dailyScheduleId": 1,
        "outletId": 1,
        "closed": 0,
        "startDate": "2025-05-12 06:00:00",
        "closeDate": null
      }
    ]
  }
}
```

**JWT Payload decoded:**
```json
{
  "id": "EMP001",
  "name": "John Doe",
  "authLevelId": 2,
  "dailyAccess": 1,
  "exp": "2025-12-31"
}
```

---

### 3.3 POST `/terminal/login/terminal`

**Purpose:** Validate terminal license key (JWT).

**Request:**
```json
{
  "terminalId": "0001"
}
```

**Response:**
```json
{
  "error": false,
  "message": "Terminal license valid",
  "data": {
    "fileContent": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXJtaW5hbElkIjoiMDAwMSIsImV4cGlyZWQiOiIyMDI3LTAxLTAxIn0...",
    "address": "192.168.1.50",
    "error": false
  }
}
```

---

### 3.4 GET `/terminal/login/checkTerminal`

**Purpose:** Verify terminal is still valid (hourly check).

**Request:**
```
GET /api/terminal/login/checkTerminal?terminalId=0001&address=192.168.1.50
```

**Response:**
```json
{
  "error": false,
  "data": {
    "valid": true,
    "terminalId": "0001",
    "address": "192.168.1.50"
  }
}
```

---

## 4. Terminal Daily Endpoints

### 4.1 GET `/terminal/daily/`

**Purpose:** Check if daily check is open.

**Request:**
```
GET /api/terminal/daily/
Headers: Authorization: Bearer {token}
```

**Response:**
```json
{
  "error": false,
  "data": {
    "open": true,
    "dailyCheckId": "DC20250512000001"
  }
}
```

---

### 4.2 POST `/terminal/daily/start`

**Purpose:** Open new business day.

**Request:**
```json
{
  "outletId": 1
}
```

**Headers:**
```
Authorization: Bearer {token}
X-Terminal: {"terminalId":"0001","address":""}
```

**Response:**
```json
{
  "error": false,
  "message": "Daily started",
  "data": {
    "insertId": "DC20250512000001",
    "startDate": "2025-05-12 06:00:00"
  }
}
```

---

### 4.3 POST `/terminal/daily/close`

**Purpose:** Close business day and export summary.

**Request:**
```json
{
  "outletId": 1,
  "dailyCheckId": "DC20250512000001"
}
```

**Response:**
```json
{
  "error": false,
  "message": "Daily closed successfully",
  "data": {
    "summary": {
      "totalSales": 5000000,
      "totalDiscount": 250000,
      "totalTax": 500000,
      "totalServiceCharge": 300000,
      "totalItemsSold": 145,
      "totalTransactions": 23
    },
    "exportFile": "public/output/20250512-daily.csv",
    "closedDate": "2025-05-12 22:00:00"
  }
}
```

---

### 4.4 GET `/terminal/daily/getDailyStart`

**Purpose:** Fetch active daily check details and schedule.

**Request:**
```
GET /api/terminal/daily/getDailyStart
Headers: Authorization: Bearer {token}
```

**Response:**
```json
{
  "error": false,
  "data": {
    "dailyCheckId": "DC20250512000001",
    "outletId": 1,
    "closed": 0,
    "startDate": "2025-05-12 06:00:00",
    "schedule": {
      "id": 1,
      "scheduleName": "Weekday",
      "openTime": "06:00:00",
      "closeTime": "23:00:00"
    }
  }
}
```

---

### 4.5 GET `/terminal/daily/checkItems`

**Purpose:** Check open transactions not yet closed.

**Request:**
```
GET /api/terminal/daily/checkItems
Headers: Authorization: Bearer {token}
```

**Response:**
```json
{
  "error": false,
  "data": {
    "openItems": [
      {
        "id": "CART202505120001",
        "tableMapId": 5,
        "tableName": "A1",
        "itemCount": 3,
        "startTime": "2025-05-12 12:30:00",
        "grandTotal": 250000
      }
    ],
    "count": 1
  }
}
```

---

### 4.6 GET `/terminal/daily/cashBalance`

**Purpose:** Fetch cash in/out entries.

**Request:**
```
GET /api/terminal/daily/cashBalance?dailyCheckId=DC20250512000001
Headers: Authorization: Bearer {token}
```

**Response:**
```json
{
  "error": false,
  "data": [
    {
      "id": 1,
      "dailyCheckId": "DC20250512000001",
      "cashType": "Opening Balance",
      "amount": 1000000,
      "inputDate": "2025-05-12 06:05:00",
      "inputBy": "Manager"
    },
    {
      "id": 2,
      "cashType": "Customer Payment",
      "amount": 250000,
      "inputDate": "2025-05-12 12:35:00",
      "inputBy": "EMP001"
    }
  ]
}
```

---

### 4.7 POST `/terminal/daily/addCashIn`

**Purpose:** Record cash in or cash out.

**Request:**
```json
{
  "dailyCheckId": "DC20250512000001",
  "cashType": "Opening Balance",
  "amount": 1000000,
  "remark": "Cashier opening"
}
```

**Response:**
```json
{
  "error": false,
  "message": "Cash balance recorded",
  "data": {
    "insertId": 1,
    "balance": 1000000
  }
}
```

---

## 5. Terminal Table & Menu Endpoints

### 5.1 GET `/terminal/tableMap/`

**Purpose:** Fetch all tables for outlet with status.

**Request:**
```
GET /api/terminal/tableMap/?outletId=1
Headers: Authorization: Bearer {token}
```

**Response:**
```json
{
  "error": false,
  "data": [
    {
      "id": 1,
      "tableName": "A1",
      "outletTableMapId": 1,
      "capacity": 4,
      "x": 100,
      "y": 100,
      "status": "Available",
      "tableMapStatusId": 1,
      "cardId": "",
      "bgn": "bg-success"
    },
    {
      "id": 2,
      "tableName": "A2",
      "status": "Occupied",
      "tableMapStatusId": 12,
      "cardId": "CART202505120001",
      "bgn": "bg-warning"
    }
  ]
}
```

---

### 5.2 POST `/terminal/tableMap/newOrder`

**Purpose:** Create new order for table.

**Request:**
```json
{
  "outletTableMapId": 1,
  "cover": 4,
  "outletId": 1
}
```

**Response:**
```json
{
  "error": false,
  "message": "Order created",
  "data": {
    "cardId": "CART202505120001",
    "tableMapId": 1,
    "cover": 4
  }
}
```

---

### 5.3 GET `/terminal/menuItemPos/`

**Purpose:** Browse menu items by category.

**Request:**
```
GET /api/terminal/menuItemPos/?menuLookupId=1&outletId=1
Headers: Authorization: Bearer {token}
```

**Response:**
```json
{
  "error": false,
  "data": [
    {
      "id": 101,
      "plu": "MAIN001",
      "name": "Grilled Steak",
      "price": 150000,
      "menuLookupId": 1,
      "modifierGroupId": 5,
      "printerGroupId": 1,
      "openPrice": 0
    },
    {
      "id": 102,
      "plu": "MAIN002",
      "name": "Fried Chicken",
      "price": 85000,
      "modifierGroupId": 0,
      "printerGroupId": 1
    }
  ]
}
```

---

### 5.4 POST `/terminal/menuItemPos/addToCart`

**Purpose:** Add item to cart (single transaction entry).

**Request:**
```json
{
  "cartId": "CART202505120001",
  "menuId": 101,
  "qty": 2,
  "price": 150000,
  "note": ""
}
```

**Response:**
```json
{
  "error": false,
  "message": "Item added",
  "data": {
    "cartItemId": 1,
    "cartId": "CART202505120001",
    "menuId": 101,
    "qty": 2,
    "debit": 300000
  }
}
```

---

### 5.5 POST `/terminal/menuItemPos/sendOrder`

**Purpose:** Send order to kitchen (create send_order batch).

**Request:**
```json
{
  "cartId": "CART202505120001",
  "outletTableMapId": 1
}
```

**Response:**
```json
{
  "error": false,
  "message": "Order sent to kitchen",
  "data": {
    "sendOrderId": "SO20250512000001",
    "printQueue": [
      {
        "id": 1,
        "printerGroupId": 1,
        "message": "Grilled Steak x2",
        "status": 0
      }
    ],
    "itemsCount": 2
  }
}
```

---

## 6. Terminal Payment Endpoints

### 6.1 GET `/terminal/payment/cart`

**Purpose:** Fetch cart for payment (items + totals).

**Request:**
```
GET /api/terminal/payment/cart?cartId=CART202505120001
Headers: Authorization: Bearer {token}
```

**Response:**
```json
{
  "error": false,
  "data": {
    "cartId": "CART202505120001",
    "items": [
      {
        "id": 1,
        "menuId": 101,
        "name": "Grilled Steak",
        "qty": 2,
        "price": 150000,
        "debit": 300000,
        "modifiers": [ { "id": 1, "name": "Well Done", "price": 0 } ]
      }
    ],
    "summary": {
      "itemTotal": 300000,
      "discount": 0,
      "serviceCharge": 18000,
      "tax": 30000,
      "grandTotal": 348000
    }
  }
}
```

---

### 6.2 POST `/terminal/payment/addPayment`

**Purpose:** Add payment method row.

**Request:**
```json
{
  "cartId": "CART202505120001",
  "paymentTypeId": 1,
  "amount": 348000
}
```

**Response:**
```json
{
  "error": false,
  "message": "Payment method added",
  "data": {
    "paymentId": 1,
    "paymentType": "Cash",
    "amount": 348000
  }
}
```

---

### 6.3 POST `/terminal/payment/addPaid`

**Purpose:** Submit all payments (close transaction).

**Request:**
```json
{
  "cartId": "CART202505120001",
  "payments": [
    { "paymentTypeId": 1, "amount": 348000 }
  ]
}
```

**Response:**
```json
{
  "error": false,
  "message": "Payment processed",
  "data": {
    "cartId": "CART202505120001",
    "status": "closed",
    "grandTotal": 348000,
    "cashback": {
      "earned": 5000,
      "qrCode": "data:image/png;base64,..."
    }
  }
}
```

---

### 6.4 GET `/terminal/receipt/`

**Purpose:** Render receipt (HTML).

**Request:**
```
GET /api/terminal/receipt/?cartId=CART202505120001
Headers: Authorization: Bearer {token}
```

**Response:**
```
Content-Type: text/html

<!DOCTYPE html>
<html>
  <head><title>Receipt</title></head>
  <body>
    <h2>PT. Mitrasys Bisnis Sinergi</h2>
    <p>Order: CART202505120001</p>
    <table>
      <tr><td>Grilled Steak x2</td><td>300,000</td></tr>
      <tr><td>Service Charge</td><td>18,000</td></tr>
      <tr><td>Tax</td><td>30,000</td></tr>
      <tr><td colspan="2"><b>Total: 348,000</b></td></tr>
    </table>
  </body>
</html>
```

---

## 7. Terminal Report Endpoints

### 7.1 POST `/terminal/menuReports/createReportToken`

**Purpose:** Generate temporary token for report access (24h).

**Request:**
```json
{
  "createdName": "John Doe",
  "inputBy": "EMP001"
}
```

**Response:**
```json
{
  "error": false,
  "message": "Report token created",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

---

### 7.2 GET `/terminal/reports/salesSummaryReport`

**Purpose:** Fetch sales summary (requires report token).

**Request:**
```
GET /api/terminal/reports/salesSummaryReport?startDate=2025-05-01&endDate=2025-05-12&view=printable&outletId=1&userId=EMP001&t=<token>
```

**Response:**
```json
{
  "error": false,
  "data": {
    "report": "<html>...rendered report...</html>",
    "filters": {
      "startDate": "2025-05-01",
      "endDate": "2025-05-12",
      "outlet": "Main Branch",
      "user": "All"
    },
    "summary": {
      "totalSales": 15000000,
      "transactionCount": 85,
      "avgTransaction": 176470
    }
  }
}
```

---

## 8. Admin Endpoints (Common Pattern)

All admin endpoints follow CRUD pattern:

### 8.1 GET `/{module}/`

**Purpose:** List all records.

**Response:**
```json
{
  "error": false,
  "data": [
    { "id": 1, "name": "...", "presence": 1, "inputDate": "..." },
    { "id": 2, "name": "...", "presence": 1 }
  ]
}
```

---

### 8.2 POST `/{module}/create`

**Purpose:** Insert new record.

**Response:**
```json
{
  "error": false,
  "message": "Record created",
  "data": {
    "insertId": 1,
    "newRecord": { "id": 1, "name": "..." }
  }
}
```

---

### 8.3 POST `/{module}/update`

**Purpose:** Update existing record.

**Response:**
```json
{
  "error": false,
  "message": "Record updated",
  "data": {
    "updatedRecord": { "id": 1, "name": "..." }
  }
}
```

---

### 8.4 POST `/{module}/delete`

**Purpose:** Soft-delete record (set presence=0).

**Response:**
```json
{
  "error": false,
  "message": "Record deleted",
  "data": {
    "id": 1
  }
}
```

---

## 9. Error Response Format

All errors follow same structure:

```json
{
  "error": true,
  "message": "Error description",
  "code": "VALIDATION_ERROR|AUTH_ERROR|NOT_FOUND|DB_ERROR|..."
}
```

**Examples:**

```json
{
  "error": true,
  "message": "Token expired",
  "code": "AUTH_ERROR"
}
```

```json
{
  "error": true,
  "message": "Discount amount exceeds limit",
  "code": "VALIDATION_ERROR"
}
```

```json
{
  "error": true,
  "message": "Table not found",
  "code": "NOT_FOUND"
}
```

---

## 10. HTTP Status Codes

| Code | Meaning | Response |
|---|---|---|
| 200 | Success | `{ "error": false, "data": {...} }` |
| 400 | Bad request | `{ "error": true, "message": "..." }` |
| 401 | Unauthorized | `{ "error": true, "message": "Invalid token" }` |
| 403 | Forbidden | `{ "error": true, "message": "Access denied" }` |
| 404 | Not found | `{ "error": true, "message": "Resource not found" }` |
| 500 | Server error | `{ "error": true, "message": "Internal error" }` |

---

This is the authoritative contract for all POS endpoints. Use for integration testing and debugging.
