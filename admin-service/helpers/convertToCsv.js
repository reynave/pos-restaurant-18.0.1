const fs = require('fs');
const path = require('path');

async function convertToCsv(dataArray, filename = 'daily.csv') {
  try {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return { success: false, message: 'Data kosong', filePath: null };
    }

    const headers = Object.keys(dataArray[0]).join(',');
    const rows = dataArray.map(row =>
      Object.values(row)
        .map(value => `${String(value).replace(/"/g, '""')}`)
        .join(',')
    );
    const csvContent = [headers, ...rows].join('\n');

    const filePath = path.join(__dirname, '../public/output', filename);

    // Pastikan folder 'output' ada
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    await fs.promises.writeFile(filePath, csvContent, 'utf8');

    return { success: true, filePath };
  } catch (err) {
    console.error('Gagal convert ke CSV:', err);
    return { success: false, message: err.message, filePath: null };
  }
}

module.exports = convertToCsv;
