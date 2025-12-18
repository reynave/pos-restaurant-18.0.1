const db = require('../../config/db');
const { headerUserId, today, formatDateOnly, formatDateTime } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');
const { cart, cartGrouping } = require('../../helpers/bill');
const { cashback } = require('../../helpers/cashcback');

const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const Handlebars = require("handlebars");
const QRCode = require('qrcode');
require("../../helpers/handlebarsFunction")(Handlebars);

exports.cart = async (req, res) => {
  let totalItem = 0;
  let closePayment = 0;
  const userId = headerUserId(req);
  try {
    const cartId = req.query.id;
    const isGrouping = req.query.isGrouping || 0;
    const data = await cart(cartId);

    const [cartData] = await db.query(`
       SELECT  c.* , e.name as inputBy 
       from cart as c
       left JOIN employee AS e ON e.id = c.closeBy
       where c.presence = 1 and c.id = '${cartId}' 
    `);
    const [groups] = await db.query(`
      SELECT   subgroup
      FROM cart_item_group
      Where cartId = '${cartId}'
      GROUP BY subgroup 
      order by subgroup asc
    `);
    res.json({
      data: data,
      closePayment: data['unpaid'],
      cart: cartData[0],
      groups: [{ subgroup: 1 }, ...groups],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.bill = async (req, res) => {
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
    const templateSource = fs.readFileSync("public/template/bill.hbs", "utf8");

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
          copyBill : copyBill[0]['total'],
        group: subgroups[i],
        totalGroup: subgroups.length,
      };
      console.log(jsonData);

      result += template(jsonData);
    }
    const templatePayment = fs.readFileSync("public/template/billPaid.hbs", "utf8");
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
      qrCode: qrCode
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

exports.paymentGroup = async (req, res) => {
  try {
    const [formattedRows] = await db.query(`
       SELECT  * from check_payment_group 
       where presence = 1 
       order by name asc
    `);
    res.json({
      error: false,
      items: formattedRows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.paymentType = async (req, res) => {

  const paymentGroupId = req.query.paymentGroupId;
  try {
    const [formattedRows] = await db.query(`
       SELECT  * from check_payment_type 
       where presence = 1 and paymentGroupId = ${paymentGroupId}
       order by name asc
    `);
    res.json({
      error: false,
      items: formattedRows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.paid = async (req, res) => {
  const cartId = req.query.id;
  const userId = headerUserId(req);
  const dailyCheckId = req.query.dailyCheckId;
  const results = [];
  try {
    const [formattedRows] = await db.query(` 
       SELECT p.* , c.name
        FROM cart_payment AS p
         JOIN check_payment_type AS c ON c.id = p.checkPaymentTypeId
        WHERE p.presence = 1 and   p.cartId =  '${cartId}'
      ORDER BY  p.inputDate ASC
    `);

    const c = `
      SELECT  grandTotal, tableMapStatusId
      FROM cart
      WHERE presence = 1 and id =  '${cartId}' `;

    const [grandTotalRow] = await db.query(c);
    let grandTotal = grandTotalRow[0]['grandTotal'];
    let tableMapStatusId = grandTotalRow[0]['tableMapStatusId'];

    // if (tableMapStatusId != 20) {


    const qq = `
      SELECT 
        COALESCE(SUM(paid), 0) AS 'paid', 
        ${grandTotal} AS grandTotal,
        (${grandTotal} - COALESCE(SUM(paid), 0)) AS 'unpaid',  
        (${grandTotal} - COALESCE(SUM(paid), 0)) AS 'change'
        
      FROM cart_payment 
      WHERE presence = 1 and  submit = 1 and cartId =  '${cartId}' `;
    console.log(qq);
    const [cartPayment] = await db.query(qq);

    if (cartPayment[0]['paid'] >= cartPayment[0]['grandTotal']) {

      cartPayment[0]['unpaid'] = 0;
    }


    let closePayment = 0;

    let changePayment = 0;
    if (cartPayment[0]['paid'] >= cartPayment[0]['grandTotal']) {
      closePayment = 1;
      changePayment = cartPayment[0]['paid'] - cartPayment[0]['grandTotal'];
    }

    if (closePayment == 1) {

      const data = await cart(cartId);

      const q = `UPDATE cart
            SET
              endDate = '${today()}',
              updateDate = '${today()}',
              close = 1,
              tableMapStatusId = 20,
              summaryTotalGroup = ${data['groups'].length},
              summaryItemTotal  = ${data.summary['itemTotal']},  
              summaryDiscount  = ${data.summary['discount']},
              summarySc  = ${data.summary['sc']},
              summaryTax  = ${data.summary['tax']},
              grandTotal  = ${data.summary['grandTotal']},
              changePayment = ${Math.abs(changePayment)},
              closeBy = ${userId},
              updateBy = ${userId}
              
          WHERE id = '${cartId}' and close = 0`;
      const [result] = await db.query(q);

      if (result.affectedRows === 0) {
        results.push({ status: 'cart not found / Payment closed' });
      } else {
        closePayment = 1;
        results.push({ status: 'cart close payment updated' });
      }



      // CASHBACK INSERT 
      const resultData = await cashback(cartId, data.summary, 0, 33);
      const cashbackData = resultData['cashbackData'];

      if (cashbackData.length > 0) {
        for (const item of cashbackData) {
          const q3 = `INSERT INTO 
            cart_cashback(
            presence, inputDate, updateDate, 
            cartId, cashbackId)
            SELECT 1, '${today()}', '${today()}', '${cartId}', '${item.cashbackId}'
            WHERE NOT EXISTS (
            SELECT 1 FROM cart_cashback
            WHERE cartId = '${cartId}' AND cashbackId = '${item.cashbackId}' AND presence = 1
            )`;

          const [result3] = await db.query(q3);

          if (result3.affectedRows === 0) {
            results.push({ status: 'cart not found / Payment closed' });
          } else {
            results.push({ status: 'cart changePayment payment updated' });
          }
        }
      }

      const q2 = `
        SELECT sum( p.openDrawer) AS 'openDrawer', SUM(c.paid) AS 'totalPaid'
        FROM cart_payment AS c
        JOIN check_payment_type AS p ON p.id = c.checkPaymentTypeId
        WHERE c.cartId = '${cartId}'
        AND c.presence = 1   
      `;
      const [openDrawer] = await db.query(q2);

      if (openDrawer[0]['openDrawer'] >= 1) {
        let change = parseInt(openDrawer[0]['totalPaid']) - parseInt(data.summary['grandTotal']);
        change = Math.abs(change);
        const q = `UPDATE cart
            SET 
              changePayment = ${change}
          WHERE id = '${cartId}' `;
        const [result2] = await db.query(q);

        if (result2.affectedRows === 0) {
          results.push({ status: 'cart not found / Payment closed' });
        } else {
          closePayment = 1;
          results.push({ status: 'cart changePayment payment updated' });
        }

        const q5 = ` 
        SELECT p.openDrawer, c.paid
          FROM cart_payment AS c
          JOIN check_payment_type AS p ON p.id = c.checkPaymentTypeId
          WHERE c.cartId = '${cartId}'
          AND c.presence = 1 AND  p.openDrawer = 1;   
        `;
        const [cartPayment] = await db.query(q5);

        for (const row of cartPayment) {
          const q3 = `INSERT INTO 
          daily_cash_balance(
            presence, inputDate, updateDate, 
            cartId, dailyCheckId, cashIn)
        value(1, '${today()}', '${today()}' , '${cartId}', '${dailyCheckId}',  ${row['paid']} ) `;
          const [result3] = await db.query(q3);

          if (result3.affectedRows === 0) {
            results.push({ status: 'cart not found / Payment closed' });
          } else {
            closePayment = 1;
            results.push({ status: 'cart changePayment payment updated' });
          }
        }



        const q3 = `INSERT INTO 
          daily_cash_balance(
            presence, inputDate, updateDate, 
            cartId, dailyCheckId, cashOut)
        value(1, '${today()}', '${today()}' , '${cartId}', '${dailyCheckId}',  ${change} ) `;
        const [result3] = await db.query(q3);

        if (result3.affectedRows === 0) {
          results.push({ status: 'Cart not found / Payment closed' });
        } else {
          closePayment = 1;
          results.push({ status: 'cart changePayment payment updated' });
        }

      }


    }
    const [selectOutlet] = await db.query(`
        SELECT  outletTableMapId 
        FROM cart  
        WHERE id = '${cartId}'
      `);



    res.json({
      error: false,
      outletTableMapId: selectOutlet[0]['outletTableMapId'],
      closePayment: closePayment,
      cartPayment: cartPayment[0],
      items: formattedRows,
      results: results,
    });

    /* }else{
       res.json({
         error: false,
         closePayment: -1,
         note :'Close payment already done',
       });
     }*/

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.markPrintBill = async (req, res) => {
  const cartId = req.body.id;
  try {
    const q = `UPDATE cart
        SET
          printBill = 1,
          updateDate = '${today()}'
      WHERE id = '${cartId}' `;
    const [result] = await db.query(q);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Cart not found' });
    } else {
        // Insert a record into cart_copy_bill to mark this bill as printed
      const insertCopyBill = `
        INSERT INTO cart_copy_bill (cartId, inputDate, updateDate, presence)
        VALUES ('${cartId}', '${today()}', '${today()}', 1)
      `;
      await db.query(insertCopyBill);

      res.json({ message: 'Cart printBill updated' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};



exports.addPayment = async (req, res) => {
  const cartId = req.body['cartId'];
  const payment = req.body['payment'];
  const unpaid = req.body['unpaid'];
  let amount = 0;
  const userId = headerUserId(req);
  const results = [];
  try {
    if (payment['autoMatchAmount'] == 1) {
      amount = unpaid;
    }
    const [result] = await db.query(
      `INSERT INTO cart_payment (
          presence, inputDate,  updateDate,
          cartId,  checkPaymentTypeId, paid, tips,
          inputBy, updateBy
           ) 
        VALUES (1, '${today()}',  '${today()}',
          '${cartId}',  ${payment['id']}, ${amount}, 0, ${userId}, ${userId}
        )`
    );


    if (result.affectedRows === 0) {
      results.push({ cartId, status: 'not found' });
    } else {
      results.push({ cartId, status: 'cart_payment updated' });
    }

    res.status(201).json({
      error: false,
      message: 'cart_payment created',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.deletePayment = async (req, res) => {
  const connection = await db.getConnection();
  const cartId = req.body['cartId'];
  const paid = req.body['paid'];
  const userId = headerUserId(req);
  const results = [];
  try {
    await connection.beginTransaction();
    const q = `UPDATE cart_payment
      SET
        presence = 0,
        updateDate = '${today()}',
        updateBy = ${userId}
    WHERE cartId = ${cartId} and id = '${paid['id']}' `;
    const [result] = await db.query(q);


    if (result.affectedRows === 0) {
      results.push({ cartId, status: 'not found' });
    } else {
      results.push({ cartId, status: 'cart_payment updated' });
    }

    const q2 = `UPDATE cart_cashback
      SET
        presence = 0,
        updateDate = '${today()}',
        updateBy = ${userId}
    WHERE cartId = ${cartId} and cartPaymentId = '${paid['id']}' `;
    const [result2] = await db.query(q2);



    await connection.commit();
    res.status(201).json({
      error: false,
      message: 'cart_payment updated',

    });

  } catch (err) {
    await connection.rollback(); // rollback jika ada error
    console.error('Transaction failed:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    connection.release(); // kembalikan koneksi ke pool
  }
};

exports.updateRow = async (req, res) => {
  const connection = await db.getConnection();
  const item = req.body['item'];
  const userId = headerUserId(req);
  const results = [];
  try {
    await connection.beginTransaction();
    const q = `UPDATE cart_payment
      SET
        tips = ${item['tips']}, 
        paid = ${item['paid']}, 
        updateDate = '${today()}',
        updateBy = ${userId}
    WHERE  id = ${item['id']} and submit = 0 `;
    const [result] = await db.query(q);


    if (result.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'cart_payment updated' });
    }
    await connection.commit();
    res.status(201).json({
      error: false,
      message: 'cart_payment updated',

    });

  } catch (err) {
    await connection.rollback(); // rollback jika ada error
    console.error('Transaction failed:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    connection.release(); // kembalikan koneksi ke pool
  }
};

exports.submit = async (req, res) => {

  const cartId = req.body['id'];
  const results = [];
  const userId = headerUserId(req);
  try {
    const { insertId } = await autoNumber('sendOrder');
    const sendOrder = insertId;
    const q = `UPDATE cart_item
            SET
              sendOrder = '${sendOrder}', 
              updateDate = '${today()}',
              updateBy = ${userId}
          WHERE cartId = ${cartId} and void = 0 and presence = 1 and sendOrder = '' `;
    const [result] = await db.query(q);

    if (result.affectedRows === 0) {
      results.push({ cartId, status: 'cart_item cartId not found', query: q, });
    } else {
      results.push({ cartId, status: 'cart_item sendOrder updated', query: q, });
    }


    const q1 = `
        UPDATE cart SET
          tableMapStatusId = 18, 
          updateDate = '${today()}',
          updateBy = ${userId}
        WHERE id = ${cartId}  `;
    const [result23] = await db.query(q1);

    if (result23.affectedRows === 0) {
      results.push({ cartId, status: 'not found', });
    } else {
      results.push({ cartId, status: 'cart updated', });
    }



    const q2 = `UPDATE cart_item_modifier
            SET
              sendOrder = '${sendOrder}', 
              updateDate = '${today()}',
              updateBy = ${userId}
          WHERE cartId = ${cartId} and void = 0 and presence = 1 and sendOrder = ''`;
    const [result2] = await db.query(q2);


    if (result2.affectedRows === 0) {
      results.push({ cartId, status: 'cart_item_modifier cartId not found', query: q, });
    } else {
      results.push({ cartId, status: 'cart_item_modifier sendOrder updated', query: q, });
    }


    res.json({
      error: false,
      id: cartId,
      results: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.addPaid = async (req, res) => {

  const paid = req.body['paid'];

  const results = [];
  const userId = headerUserId(req);
  try {
    for (const emp of paid) {
      const { id, cartId, paid, tips, checkPaymentTypeId } = emp;

      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const q = `UPDATE cart_payment
                SET
                  paid = ${paid}, 
                  tips = ${tips},  
                  submit = 1,
                  updateDate = '${today()}',
                  updateBy = ${userId}
              WHERE id = ${id}   and cartId = '${cartId}'`;

      const [result] = await db.query(q);
      const cartPaymentId = id;
      if (result.affectedRows === 0) {
        results.push({ id, status: 'cart_payment not found', query: q, });
      } else {
        results.push({ id, status: 'cart_payment updated', query: q, });
      }

      // INSERT CASHBACK IF AVAILABLE
      const q2 = `SELECT a.cashbackId,   p.paymentId, c.name, c.description, a.earnMax, 
        a.cashbackMax,  c.status, c.redeemStartDate, c.redeemEndDate
        FROM cashback_amount as a
        JOIN cashback AS c ON a.cashbackId = c.id
        JOIN cashback_payment AS p ON p.cashbackId = c.id
        WHERE a.earnMax <= ${paid}
        AND a.presence = 1 AND c.presence = 1 AND c.status = 1 and p.presence = 1
        AND ( c.redeemStartDate < NOW() AND  c.redeemEndDate >= NOW() )
        AND p.paymentId = ${checkPaymentTypeId} 
        ORDER BY a.earnMax DESC
      LIMIT 1`;

      const [cashbackData] = await db.query(q2);
      if (cashbackData.length > 0) {
        results.push({ id, status: 'cashback available', cashbackData: cashbackData });
        for (const cb of cashbackData) {
          const q3 = `INSERT INTO
          cart_cashback(
            presence, inputDate, updateDate,
            cartId, cashbackId, paymentId, 
            cashbackMax, cartPaymentId)
          SELECT 1, '${today()}', '${today()}', 
            '${cartId}', '${cb.cashbackId}', ${checkPaymentTypeId}, 
            ${cb.cashbackMax} , ${cartPaymentId}
          WHERE NOT EXISTS (
            SELECT 1 FROM cart_cashback
            WHERE cartId = '${cartId}' AND cashbackId = '${cb.cashbackId}' AND presence = 1 AND paymentId = ${checkPaymentTypeId}
          )`;

          const [result3] = await db.query(q3);
          if (result3.affectedRows === 0) {
            results.push({ status: 'cart not found / Payment closed' });
          } else {
            results.push({ status: 'cart cashback payment updated' });
          }
        }
      } else {
        results.push({ id, status: 'no cashback available' });
      }

    }

    res.json({
      message: 'Batch update completed',
      results: results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.printing = async (req, res) => {
  const templatePath = path.join(__dirname, '../../public/template/bill.ejs');

  try {
    const cartId = req.query.id;

    const [formattedRows] = await db.query(`
      SELECT t1.* , (t1.total * t1.price) as 'totalAmount', m.name , 0 as 'checkBox', '' as modifier
      FROM (
        SELECT   c.price, c.menuId, COUNT(c.menuId) AS 'total', c.sendOrder
        FROM cart_item AS c
        LEFT JOIN menu AS m ON m.id = c.menuId
        WHERE c.cartId = '${cartId}'
        AND c.presence = 1 AND c.void  = 0
        GROUP BY c.price, c.menuId, c.sendOrder
        ORDER BY MAX(c.inputDate) ASC
      ) AS t1
      JOIN menu AS m ON m.id = t1.menuId
    `);
    let totalAmount = 0;
    for (const row of formattedRows) {

      const s = `
        SELECT COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount'
        FROM (
          SELECT r.modifierId, m.descl, r.price
          FROM cart_item  AS i 
          right JOIN cart_item_modifier AS r ON r.cartItemId = i.id
          LEFT JOIN modifier AS m ON m.id = r.modifierId 
          WHERE i.menuId = ${row['menuId']} AND i.price = ${row['price']}
          AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
          AND r.presence = 1 AND i.void = 0 and r.applyDiscount = 0
        ) AS t1
        GROUP BY t1.descl
      `;

      const [modifier] = await db.query(s);
      row.modifier = modifier; // tambahkan hasil ke properti maps 

      let totalAmountModifier = 0;
      modifier.forEach(el => {
        totalAmountModifier += parseInt(el['totalAmount']);
      });


      totalAmount += row['totalAmount'] + totalAmountModifier;

    }



    formattedRows.forEach(row => {
      row['modifier'].forEach(el => {
        row['totalAmount'] += parseInt(el['totalAmount']);
      });
    });

    function formatCurrency(num) {
      return num.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    }
    const html = await ejs.renderFile(templatePath, {
      items: formattedRows, formatCurrency
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(html);


  } catch (err) {
    console.error('Render error:', err);
    res.status(500).send('Gagal render HTML');
  }
};

exports.createTxt = async (req, res) => {
  const cartId = req.body.id;
  const htmlBill = req.body.htmlBill;
  try {


    await exportTxtBill(cartId, htmlBill, 'billClosed');
    res.json({ message: 'Create TXT initiated ' + cartId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: err });
  }
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
