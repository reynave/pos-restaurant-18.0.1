const db = require('../../config/db');
const { headerUserId, today, formatDateOnly, formatDateTime } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');
const { cart, cartGrouping } = require('../../helpers/bill');

const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const Handlebars = require("handlebars");
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

     cartData = cartData.map(row => ({
      ...row,
      bill: row.id,  
      startDate: formatDateTime(row.startDate),
      endDate: row.close == 0 ? '' : formatDateTime(row.endDate), 
    }));
    
    const summary = {
      itemTotal: 0,
      discount: 0,
      sc: 0,
      tax: 0,
      total: 0
    }

    data.forEach(element => {
      summary.itemTotal += element.data.itemTotal || 0;
      summary.discount += element.data.discount || 0;
      summary.sc += element.data.sc || 0;
      summary.tax += element.data.tax || 0;
      summary.total += element.data.total || 0;

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
    cartPayment.forEach(element => {
      paid += element['paid'];
      tips += element['tips'];
    });

    const [outlet] = await db.query(`
        SELECT  * 
        FROM outlet  
        WHERE id = '${cartData[0]['outletId']}'
      `);
      let result = '';
      const templateSource = fs.readFileSync("public/template/bill.hbs", "utf8");
      for (let i = 0; i < 3; i++) {
      
        const template = Handlebars.compile(templateSource);
        const jsonData = {
          data: data,
          transaction: cartData[0],
          company: outlet[0],
          // subgroup: subgroup,
          // copyBill : copyBill.length > 0 ? copyBill[0] : 0,
          copyIndex: i + 1 // jika ingin tahu urutan ke berapa
        };
        result += template(jsonData);
      }
      
     
    res.json({
      data: data,
      //closePayment: data['unpaid'],
      cart: cartData[0],
      cartPayment :cartPayment,
      paid : paid,
      summary : summary,
      groups:subgroups,
      htmlBill : result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

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
    const grandTotal = req.query.grandTotal;
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


    const qq = `
      SELECT 
        COALESCE(SUM(paid), 0) AS 'paid', 
        ${grandTotal} AS grandTotal,
        (${grandTotal} - COALESCE(SUM(paid), 0)) AS 'unpaid'
      FROM cart_payment 
      WHERE presence = 1 and  submit = 1 and cartId =  '${cartId}' `;

    const [cartPayment] = await db.query(qq);


    let closePayment = 0;


    if (cartPayment[0]['paid'] >= cartPayment[0]['grandTotal']) closePayment = 1;

    if (closePayment == 1) {
      console.log("FINISH");
      const data = await cart(cartId);
      const q = `UPDATE cart
            SET
              endDate = '${today()}',
              updateDate = '${today()}',
              close = 1,
              tableMapStatusId = 20,
              totalAmount  = ${data['subTotal']},
              grandTotal = ${data['grandTotal']},
              changePayment =  ${data['change']},
              totalTips = ${data['tips']},
              totalItem  = ${data['totalItem']}
          WHERE id = '${cartId}' and close = 0`;
      const [result] = await db.query(q);

      if (result.affectedRows === 0) {
        results.push({ status: 'cart not found / Payment closed' });
      } else {
        closePayment = 1;
        results.push({ status: 'cart close payment updated' });
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
        let change = parseInt(openDrawer[0]['totalPaid']) - parseInt(data['grandTotal']);
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

    const text = 'text test saja';
    const [selectOutlet] = await db.query(`
        SELECT  outletTableMapId 
        FROM cart  
        WHERE id = '${cartId}'
      `);

     const [selectSubgroup] = await db.query(`
      SELECT g.subgroup
      FROM cart_item_group AS g
      WHERE cartId = '${cartId}'
      GROUP BY g.subgroup;
      `);

  let subgroupArr = [1, ...selectSubgroup.map(item => item.subgroup)];
    await exportTxtBill(cartId, selectOutlet, results, subgroupArr);


    res.json({
      error: false,
      subgroupArr : subgroupArr,
      outletTableMapId: selectOutlet[0]['outletTableMapId'],
      closePayment: closePayment,
      cartPayment: cartPayment[0],
      items: formattedRows,
      results: results,
    });

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
    console.log(q)

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
      const { id, cartId, paid, tips } = emp;

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
      if (result.affectedRows === 0) {
        results.push({ id, status: 'cart_payment not found', query: q, });
      } else {
        results.push({ id, status: 'cart_payment updated', query: q, });
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
 
async function exportTxtBill(cartId, selectOutlet, results, subgroupArr) {
  try {
   
    for (const subgroup of subgroupArr) {
      const data = await cart(cartId, subgroup);

      let q = '';
      if (selectOutlet[0]['outletTableMapId'] != 0) {
      // TABLE
      q = `
        SELECT 
        c.id   , c.id as 'bill', c.void,  c.dailyCheckId, c.cover, c.outletId, c.billNo,
        o.name AS 'outlet', c.startDate, c.endDate , 
        c.close,   t.tableName, t.tableNameExt, 'UAT PERSON' as 'servedBy' , e.name as 'employeeName'
        FROM cart AS c
        JOIN outlet AS o ON o.id = c.outletId
        JOIN outlet_table_map AS t ON t.id = c.outletTableMapId
        left JOIN employee AS e ON e.id = c.closeBy
        WHERE c.presence = 1 AND  c.id = '${cartId}'
      `;
      }
      else {
      // CASHIER
      q = ` 
        SELECT 
        c.id   , c.id as 'bill', c.void,  c.dailyCheckId, c.cover, c.outletId, c.billNo,
        o.name AS 'outlet', c.startDate, c.endDate , 
        c.close,  'UAT PERSON' as 'servedBy' , e.name as 'employeeName'
        FROM cart AS c
        JOIN outlet AS o ON o.id = c.outletId
        left JOIN employee AS e ON e.id = c.closeBy
        WHERE c.presence = 1 AND  c.id = '${cartId}'
      `;
      }

      const [transaction] = await db.query(q);
      const formattedRows = transaction.map(row => ({
      ...row,
      bill: row.id + (subgroup > 1 ? ('.' + subgroup) : ''),
      startDate: formatDateTime(row.startDate),
      endDate: row.close == 0 ? '' : formatDateTime(row.endDate),
      }));

      const [outlet] = await db.query(`
      SELECT  * 
      FROM outlet  
      WHERE id = '${formattedRows[0]['outletId']}'
      `);
      // Baca template Handlebars
      const templateSource = fs.readFileSync(path.join(__dirname, '../../public/template/bill.hbs'), "utf8");
      const template = Handlebars.compile(templateSource);

      // Siapkan data untuk template
      const jsonData = {
      data: data,
      transaction: formattedRows[0],
      company: outlet ? outlet[0] : {},
      subgroup: subgroup,
      };
      const result = template(jsonData);

      // Buat folder export jika belum ada
      const dateFolder = formatDateOnly(new Date());
      const exportDir = path.join(__dirname, '../../public/output/bill', dateFolder);
      if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
      }

      // Tulis hasil render ke file txt
      fs.writeFileSync(
      path.join(exportDir, `${cartId}${subgroup > 1 ? '.' + subgroup : ''}.txt`), result
      );
      results.push({ status: 'TXT exported', file: `${dateFolder}/${cartId}${subgroup > 1 ? '.' + subgroup : ''}.txt` });
    }
  } catch (txtErr) {
    console.error('TXT export error:', txtErr);
    results.push({ status: 'TXT export failed', error: txtErr.message });
  }
}
