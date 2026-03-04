# POS Restaurant 18.0.1 — Installation Guide

> Step-by-step instructions to download, install, and run the POS Restaurant system on your local machine.

---

## Prerequisites

Make sure you have the following installed on your computer before proceeding:

| Software | Minimum Version | Download Link |
|----------|----------------|---------------|
| **Node.js** | v24.14.0 (LTS)   | https://nodejs.org/ |
| **npm** | v9 or higher (comes with Node.js) | — |
| **MySQL / MariaDB** | MySQL 8+ or MariaDB 10.4+ | https://mariadb.org/download/ |
| **Git** | Any recent version | https://git-scm.com/downloads |
| **XAMPP** *(optional)* | v8.2+ | https://www.apachefriends.org/ |

> **Note:** If you use XAMPP, MySQL/MariaDB is already included. Just start the MySQL service from the XAMPP Control Panel.

---

## 1. Clone the Repository

Open your terminal (Command Prompt, PowerShell, or Git Bash) and run:

```bash
git clone https://github.com/reynave/pos-restaurant-18.0.1.git
```

Navigate into the project folder:

```bash
cd pos-restaurant-18.0.1
```

---

## 2. Install Dependencies

Go to the `service` folder and install the Node.js packages:

```bash
cd service
npm install
```

This will install all required dependencies (Express, MySQL2, Socket.IO, etc.)

---

## 3. Set Up the Database

### 3.1. Create the Database

Open your MySQL client (HeidiSQL, phpMyAdmin, MySQL Workbench, or terminal) and create a new database:

```sql
CREATE DATABASE pos_resto CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

### 3.2. Import the Database Schema

Import the SQL file provided in the `service/backupDb/` folder. You can do this via:

**Option A — Using MySQL command line:**

```bash
mysql -u root -p pos_resto < backupDb/dbPos-dummy-data.sql
```

**Option B — Using phpMyAdmin:**

1. Open phpMyAdmin (usually at `http://localhost/phpmyadmin`)
2. Select the `pos_resto` database
3. Click the **Import** tab
4. Choose the file `service/backupDb/dbPos-dummy-data.sql`
5. Click **Go**

**Option C — Using HeidiSQL:**

1. Connect to your MySQL server
2. Select the `pos_resto` database
3. Go to **File → Run SQL file...**
4. Select `service/backupDb/dbPos-dummy-data.sql`

---

## 4. Configure Environment Variables

In the `service` folder, create a `.env` file (or edit the existing one):

```bash
# filepath: service/.env
PRODUCTION=false
SECRET_KEY=your-secret-key-here
NODE_ENV=development
PREFIX=/
TERMINAL=terminal/
TO_LOCALE_STRING=id-ID
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pos_resto
TIMEZONE='+07:00'
LOCALHOST=http://localhost:3000
DUMMY_PRINTER=true
```

> **Important:**
> - Set `DB_PASSWORD` to your MySQL root password (leave empty if no password).
> - Set `DUMMY_PRINTER=true` if you don't have a thermal printer connected. This will simulate printing.
> - Change `SECRET_KEY` to any random string for JWT token signing.

---

## 5. Start the Server

From the `service` folder, run:

```bash
npm start
```

Or for development mode with auto-reload (requires `nodemon` installed globally):

```bash
npm run run
```

You should see output similar to:

```
Server is running on port 3000
```

---

## 6. Access the Application

Open your web browser and navigate to:

| Application | URL |
|------------|-----|
| **POS** | `http://localhost:3000/pos/` |
| **API Health Check** | `http://localhost:3000/api/checkdb` |

---

## 7. Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin` |

> **Note:** Change the default password after your first login.

---

## 8. Start the Print Worker (Optional)

If you want to enable kitchen printing, open a **second terminal window** and run:

```bash
cd service
node printWorker.js
```

This starts the background print queue worker that sends orders to thermal printers via TCP/IP.

> **Tip:** If you set `DUMMY_PRINTER=true` in `.env`, the print worker will simulate printing without a real printer.

---

## 9. Project Folder Structure

```
pos-restaurant-18.0.1/
├── admin18.0.1/        # Admin Panel (Angular SPA - frontend)
├── terminal18.0.1/     # POS Terminal (Angular SPA - frontend)
├── service/            # Backend API Server (Node.js + Express)
│   ├── server.js       # Main entry point
│   ├── printWorker.js  # Print queue background worker
│   ├── .env            # Environment configuration
│   ├── config/         # Database connection config
│   ├── routes/         # API route definitions
│   ├── controllers/    # Business logic controllers
│   ├── helpers/        # Utility functions & shared logic
│   ├── public/         # Static files & templates
│   ├── views/          # EJS report templates
│   └── backupDb/       # Database backup SQL files
└── INSTRUCTIONS.md     # This file
```

---

## Troubleshooting

### ❌ `Error: connect ECONNREFUSED 127.0.0.1:3306`
**Cause:** MySQL/MariaDB is not running.
**Fix:** Start the MySQL service. If using XAMPP, open the XAMPP Control Panel and click **Start** next to MySQL.

### ❌ `Error: ER_ACCESS_DENIED_ERROR`
**Cause:** Wrong MySQL username or password.
**Fix:** Check `DB_USER` and `DB_PASSWORD` in your `.env` file.

### ❌ `Error: ER_BAD_DB_ERROR`
**Cause:** Database `pos_resto` does not exist.
**Fix:** Create the database first (see Step 3.1).

### ❌ `EADDRINUSE: address already in use :::3000`
**Cause:** Port 3000 is already in use by another process.
**Fix:** Either stop the other process or change `PORT` in `.env` to another port (e.g., `3001`).

### ❌ Printer not working
**Cause:** No thermal printer connected or misconfigured.
**Fix:** Set `DUMMY_PRINTER=true` in `.env` to simulate printing, or configure your thermal printer IP in the admin panel.

---

## Support

For issues and questions, please open an issue on GitHub:
https://github.com/reynave/pos-restaurant-18.0.1/issues