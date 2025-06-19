// logger.js
const winston = require('winston');
const fs = require('fs');
const path = require('path');

const getTodayDate = () => new Date().toISOString().split('T')[0];
const logDir = path.join(__dirname, 'public', 'userLog', getTodayDate());

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, message }) => `[${timestamp}] ${message}`)
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'user-actions.log') })
  ]
});

module.exports = logger;
