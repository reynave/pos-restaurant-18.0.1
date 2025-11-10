const db = require('../config/db'); // sesuaikan path kalau perlu 
const { today, formatDateOnly } = require('./global'); 
const QRCode = require('qrcode');


async function cashback(cartId = '', line=33, whereCardPayment = '') {
  let where = '';
  let qrCode = '';
  if(whereCardPayment != ''){
    where += ` AND  ( ${whereCardPayment} ) `;
  }
  const q = `
      SELECT c.id , b.name, b.description, b.redeemStartDate, b.redeemEndDate, 
      c.cashbackMax, c.paymentId, c.cartPaymentId
      FROM cart_cashback AS c
      JOIN cashback AS b ON b.id = c.cashbackId 
      WHERE c.presence = 1 AND c.cartId = '${cartId}' ${where}
    `;
   
  const [cashbackData] = await db.query(q);

  
  if (cashbackData.length > 0) {
    cashbackData.forEach(item => {
      item['redeemStartDate'] = formatDateOnly(item['redeemStartDate'], '.');
      item['redeemEndDate'] = formatDateOnly(item['redeemEndDate'], '.');
      //tolong cut line jadi 33  karater maka di enter kebawah unutk descirpiton nya
      item['description'] = item['description'].replace(new RegExp(`(.{${line}})`, 'g'), "$1\n");
    });
  }
 if (cashbackData.length > 0) {
   qrCode = await generateQRCode(`https://example.com/?id=${cartId}&data=${cashbackData[0]['id']}`); // QR code dengan URL
 }


  return { 
    cashbackData: cashbackData,
    qrCode: qrCode
  }
}
async function generateQRCode(data) {
  return QRCode.toDataURL(data, { width: 200 }); // Lebar QR code
}
module.exports = {
  cashback,
  generateQRCode
};