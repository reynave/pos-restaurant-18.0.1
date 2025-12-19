const db = require('../../config/db');
const { headerUserId, today, formatDateOnly, formatDateTime } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');
const { cart, cartGrouping } = require('../../helpers/bill');
const { cashback } = require('../../helpers/cashcback');
 
const path = require('path');
const fs = require('fs');
const Handlebars = require("handlebars");
const QRCode = require('qrcode');
require("../../helpers/handlebarsFunction")(Handlebars);
 

exports.index = async (req, res) => {
  let totalItem = 0;
  let closePayment = 0;
  const userId = headerUserId(req);
  try {
    const cartId = req.query.id;
    const isGrouping = req.query.isGrouping || 0;

    // Ambil semua data grouping yang ada di cart_item_group
    const [groupRows] = await db.query(`
      SELECT subgroup
      FROM cart_item_group
      WHERE cartId = '${cartId}'
      GROUP BY subgroup
      ORDER BY subgroup ASC
    `);
    // Pastikan selalu ada subgroup 1 
    const subgroups = [1, ...groupRows.map(row => row.subgroup).filter(sg => sg !== 1)];
    // Ambil data untuk semua subgroup
    const dataArr = [];
    for (const subgroup of subgroups) {
      const data = await cartGrouping(cartId, subgroup);
      dataArr.push({ subgroup, data });
    }
    // dataArr sekarang berisi semua hasil cartGrouping per subgroup
    // Jika ingin mengirim semua ke client:
    const data = dataArr;

    let [cartData] = await db.query(`
       SELECT  c.* , e.name as inputBy 
       from cart as c
       left JOIN employee AS e ON e.id = c.closeBy
       where c.presence = 1 and c.id = '${cartId}' 
    `);
    let [employeeData] = await db.query(`
       SELECT id, name , username
       from  employee 
       where presence = 1 and id = '${userId}' 
    `);

    cartData = cartData.map(row => ({
      ...row,
      bill: row.id,
      startDate: formatDateTime(row.startDate),
      endDate: row.close == 0 ? '' : formatDateTime(row.endDate),
      employeeName: employeeData[0] ? employeeData[0]['name'] : 'POST/GET Request required',
    }));

    const summary = {
      itemTotal: 0,
      discount: 0,
      sc: 0,
      tax: 0,
      grandTotal: 0,
    }

    data.forEach(element => {
      summary.itemTotal += element.data.itemTotal || 0;
      summary.discount += element.data.discount || 0;

      summary.sc += element.data.sc || 0;
      summary.tax += element.data.tax || 0;
      summary.grandTotal += element.data.total || 0;

    });



    let paid = 0;
    const [cartPayment] = await db.query(`
          SELECT  c.id, p.name,  c.paid, c.tips, c.submit
          FROM  cart_payment as c
          JOIN check_payment_type AS p ON p.id = c.checkPaymentTypeId
          WHERE c.presence= 1   and c.cartId = '${cartId}' and c.submit = 1
          ORDER BY c.id 
      `);
    let tips = 0;
    let whereCardPayment = '';
    let or = ""
    cartPayment.forEach(element => {
      paid += element['paid'];
      tips += element['tips'];
      whereCardPayment += ` ${or} c.cartPaymentId = ${element['id']} `;
      or = "OR";
    });

    const [outlet] = await db.query(`
        SELECT  * 
        FROM outlet  
        WHERE id = '${cartData[0]['outletId']}'
      `);

    const unpaid = (summary.grandTotal - paid) < 0 ? 0 : (summary.grandTotal - paid);
    const line = 33;

    // Cashback
    const resultData = await cashback(cartId, line, whereCardPayment);
    let cashbackData = resultData['cashbackData'];
    let qrCode = resultData['qrCode'];


    let result = '';
    const templateSource = fs.readFileSync("public/template/receipt.hbs", "utf8");

    let [billVersion] = await db.query(`
      SELECT billNo
      FROM cart
      WHERE id = '${cartId}'
    `);

    let [copyBill] = await db.query(`
      SELECT COUNT(id) AS total
      FROM cart_copy_bill
      WHERE cartId = '${cartId}'
    `);
    console.log(copyBill);
    let statusPrint = 'ORIGINAL';
    if (copyBill[0]['total'] > 0) {
      statusPrint = 'COPY RECEIPTS (' + copyBill[0]['total'] + ')';
    }

 

    for (let i = 0; i < subgroups.length; i++) {
      const template = Handlebars.compile(templateSource);
      const jsonData = {
        line: line,
        data: data[i]['data'],
        billVersion: billVersion[0]['billNo'].toString().padStart(2, '0'),
        transaction: cartData[0],
        company: outlet[0],
        cashbackData: cashbackData,
        // subgroup: subgroup,
          cart : cartData[0],
          copyBill : copyBill[0]['total'],
        group: subgroups[i],
        totalGroup: subgroups.length,
        statusPrint: statusPrint
      };
      console.log(jsonData);

      result += template(jsonData);
    }
    const templatePayment = fs.readFileSync("public/template/receiptPaid.hbs", "utf8");
    const templatePay = Handlebars.compile(templatePayment);
    const jsonPayment = {
      line: line,
      billVersion: billVersion[0]['billNo'].toString().padStart(2, '0'),
      summary: summary,
      cart : cartData[0],
      cartPayment: cartPayment,
      copyBill : copyBill[0]['total'],
      unpaid: unpaid,
      change: cartData[0]['changePayment'] || 0,
      cashbackData: cashbackData,
      qrCode: qrCode,
      statusPrint: statusPrint
    };

    result += templatePay(jsonPayment);
 
    res.json({
      data: data,
      cashbackData: cashbackData,
      cartPayment: cartPayment,
      paid: paid,
      unpaid: unpaid,
      summary: summary,
      groups: subgroups,
      qrCode: qrCode,   // Tambahkan QR code
      cart: cartData[0],
      copyBill : copyBill[0]['total'],
      statusPrint : statusPrint,
      htmlBill: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
async function generateQRCode(data) {
  return QRCode.toDataURL(data, { width: 200 }); // Lebar QR code
}


async function exportTxtBill(cartId, htmlBill, folder = 'logs') {
  const results = [];
  try {

    const result = htmlBill; //template(jsonData);

    // Buat folder export jika belum ada
    const dateFolder = formatDateOnly(new Date());
    const exportDir = path.join(__dirname, '../../public/output/' + folder, dateFolder);
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Tulis hasil render ke file txt
    fs.writeFileSync(
      path.join(exportDir, `${cartId}.txt`), result
    );
    results.push({ status: 'TXT exported', file: `${dateFolder}/${cartId}.txt` });

  } catch (txtErr) {
    console.error('TXT export error:', txtErr);
    results.push({ status: 'TXT export failed', error: txtErr.message });
  }
}
