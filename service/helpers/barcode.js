const { createCanvas } = require('canvas');
const JsBarcode = require('jsbarcode');

// Fungsi untuk membuat barcode
async function generateBarcode(data) {
  const canvas = createCanvas(); // Buat canvas untuk menggambar barcode
  JsBarcode(canvas, data, {
    format: 'CODE128', // Format barcode
    displayValue: true, // Tampilkan teks di bawah barcode
    fontSize: 14, // Ukuran font teks
    height: 50, // Tinggi barcode
    width: 2, // Lebar garis barcode
  });
  return canvas.toDataURL(); // Konversi canvas ke base64
}