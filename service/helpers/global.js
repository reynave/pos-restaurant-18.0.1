const db = require('../config/db');

const DEFAULT_TIME_ZONE = 'Asia/Jakarta';
const DEFAULT_DATE_LOCALE = 'en-CA';

function today() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // bulan dari 0
  const day = String(now.getDate()).padStart(2, '0');

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function nextDay(addDay = 1, hour = '00:00:00') {
  var date = new Date();

  const now = new Date(date.setDate(date.getDate() + addDay));


  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // bulan dari 0
  const day = String(now.getDate()).padStart(2, '0');


  return `${year}-${month}-${day} ${hour}`;
}
function formatDateOnly(dateInput, separator = '-') {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${separator}${month}${separator}${day}`;
}
function formatDateTime(dateInput) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
}

function formatDateTimeID(dateInput, timeZone = DEFAULT_TIME_ZONE) {
  if (!dateInput) {
    return '-';
  }
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  const formatter = new Intl.DateTimeFormat(DEFAULT_DATE_LOCALE, {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const parts = formatter.formatToParts(date);
  const map = {};
  parts.forEach(part => {
    map[part.type] = part.value;
  });
  return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second}`;
}

function formatDateOnlyID(dateInput, timeZone = DEFAULT_TIME_ZONE) {
  if (!dateInput) {
    return '-';
  }
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  const formatter = new Intl.DateTimeFormat(DEFAULT_DATE_LOCALE, {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date);
}


function convertCustomDateTime(inputString) {
  // Pisahkan tanggal dan waktu
  const [datePart, timePart] = inputString.split(', ');

  // Pecah bagian tanggal dan waktu
  const [day, month, year] = datePart.split('/');
  const [hour, minute, second] = timePart.split('.');

  // Format menjadi YYYY-MM-DD HH:mm:ss
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
}

function formatCurrency(num, symbol = '') {
  num = parseInt(num);
  num = num.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, });
  return symbol + num.replace(/Rp/g, '');
}

function formatLine(leftText, rightText, lineLength = 50) {
  const totalLength = leftText.length + rightText.length;

  if (totalLength >= lineLength) {
    // Jika terlalu panjang, potong teks kiri
    const trimmedLeft = leftText.slice(0, lineLength - rightText.length - 1);
    return trimmedLeft + ' ' + rightText;
  }

  const spaces = lineLength - totalLength;
  return leftText + ' '.repeat(spaces) + rightText;
}

function centerText(str, width = 50) {
  if (str.length >= width) return str; // jika string lebih panjang, tidak diubah

  const totalSpaces = width - str.length;
  const paddingLeft = Math.floor(totalSpaces / 2);
  const paddingRight = totalSpaces - paddingLeft;

  return ' '.repeat(paddingLeft) + str + ' '.repeat(paddingRight);
}

function parseTimeString(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return { hours, minutes, seconds };
}

function addTime(dateStr, hoursToAdd, minutesToAdd, secondsToAdd) {
  const date = new Date(dateStr);

  const totalMilliseconds =
    (hoursToAdd * 60 * 60 + minutesToAdd * 60 + secondsToAdd) * 1000;

  const newDate = new Date(date.getTime() + totalMilliseconds);
  return newDate;
}

// ...existing code...
function getBearerToken(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return null;


  const parts = authHeader.split(' ');

  if (parts.length === 2 && parts[0] === 'Bearer') {
    try {
      // Decode base64 string (assume token is base64 encoded JSON array)
      const decoded = parts[1].split('.');
      const data = Buffer.from(decoded[1], 'base64').toString('utf8');
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }
  return null;
}
function sanitizeText(text) {
  let note = text || '';
  // Remove single quotes, double quotes, and common SQL injection characters
  note = note.replace(/['";\\]/g, '');
  // Optionally, remove other special characters (keep alphanumeric and spaces)
  note = note.replace(/[^a-zA-Z0-9\s]/g, '');
  return note;
}
// ...existing code...
function headerUserId(req) {
  const token = getBearerToken(req);
  return token ? token.id : null;
}
// ...existing code...

async function fetchReportToken(tokenValue) {
  if (!tokenValue) {
    return null;
  }
  
    const timestamp = Math.floor(Date.now() / 1000); // waktu sekarang dalam detik
 
  const q = `SELECT
          id, token, createdName, presence, FROM_UNIXTIME(expTime) AS 'expTime',
           now() AS 'currentTime', inputDate
        FROM reports_token
        WHERE token = '${tokenValue}' and expTime > ${timestamp}`;
  const [rows] = await db.query(q);

  if (!rows.length) {
    return null;
  } 
  return rows[0];
}
async function employeeDb(userId = '') {
  let employee = 'All Users';
      if (userId !== '') {
        const employeeQuery = `SELECT name FROM employee WHERE id = ${userId} LIMIT 1`;
        const [employeeResult] = await db.query(employeeQuery);
        if (employeeResult.length > 0) {
          employee = employeeResult[0]['name'] || 'All Users';
        }
      }
  
  return employee;
}
async function mapUpdateByName(db, table) {
  return Promise.all(table.map(async row => {
    let inputByName = null;
    let updateByName = null;


    if (row.inputBy) {
      const [userRows] = await db.query(`SELECT name FROM employee WHERE id = ${row.inputBy}`);
      inputByName = userRows.length > 0 ? userRows[0].name : null;
    }
    if (row.updateBy) {
      const [userRows] = await db.query(`SELECT name FROM employee WHERE id = ${row.updateBy}`);
      updateByName = userRows.length > 0 ? userRows[0].name : null;
    }
    return {
      ...row,
      updateBy: updateByName,
      inputBy: inputByName
    };
  }));
}

 function formatNumber(value) {
    return Number(value || 0).toLocaleString('id-ID');
  };
  

module.exports = {
  today, nextDay,
  formatNumber,
  formatDateOnly,
  formatDateTime,
  formatDateTimeID,
  formatDateOnlyID,
  parseTimeString, addTime,
  formatCurrency,
  formatLine,
  centerText,
  convertCustomDateTime,
  getBearerToken,
  headerUserId,
  fetchReportToken,
  mapUpdateByName,
  sanitizeText,
  employeeDb
};
