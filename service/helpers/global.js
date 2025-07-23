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
function nextDay( addDay = 1, hour = '00:00:00' ) {
  var date = new Date();
 
  const now = new Date(date.setDate(date.getDate() + addDay));


  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // bulan dari 0
  const day = String(now.getDate()).padStart(2, '0');
 

  return `${year}-${month}-${day} ${hour}`;
}
function formatDateOnly(dateInput) {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function formatDateTime(dateInput) {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
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

module.exports = {
  today, nextDay,
  formatDateOnly,
  formatDateTime,
parseTimeString, addTime,
  formatCurrency,
  formatLine,
  centerText,
  convertCustomDateTime
};