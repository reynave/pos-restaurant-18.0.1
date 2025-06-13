const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');
const { cart } = require('../../helpers/bill');

const ejs = require('ejs');
const path = require('path');

exports.cart = async (req, res) => {
  let totalItem = 0;
  const results = [];
  let closePayment = 0;
  try {
    const cartId = req.query.id;
    const dailyCheckId = req.query.dailyCheckId;

    const data = await cart(cartId);
    const [cartData] = await db.query(`
       SELECT  * from cart 
       where presence = 1 and id = '${cartId}'
    `);
    if (data['unpaid'] == 0) {
      console.log("FINISH");
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
    res.json({
      error: false,
      data: data,
      results: results,
      closePayment: data['unpaid']  == 0 ? 1:0,
      cart : cartData[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.paymentType = async (req, res) => {

  try {
    const [formattedRows] = await db.query(`
       SELECT  * from check_payment_type 
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

exports.paid = async (req, res) => {
  const cartId = req.query.id;
  try {
    const [formattedRows] = await db.query(` 
       SELECT p.* , c.name
        FROM cart_payment AS p
         JOIN check_payment_type AS c ON c.id = p.checkPaymentTypeId
        WHERE p.presence = 1 and   p.cartId =  '${cartId}'
      ORDER BY  p.inputDate ASC
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

exports.addPayment = async (req, res) => {
  const cartId = req.body['cartId'];
  const payment = req.body['payment'];
  const unpaid = req.body['unpaid'];
  let amount = 0;
  const results = [];
  try {
    if (payment['autoMatchAmount'] == 1) {
      amount = unpaid;
    }
    const [result] = await db.query(
      `INSERT INTO cart_payment (
          presence, inputDate,  updateDate,
          cartId,  checkPaymentTypeId, paid, tips  ) 
        VALUES (1, '${today()}',  '${today()}',
          '${cartId}',  ${payment['id']}, ${amount}, 0
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

  const results = [];
  try {
    await connection.beginTransaction();
    const q = `UPDATE cart_payment
      SET
        presence = 0, 
        updateDate = '${today()}'
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

  const results = [];
  try {
    await connection.beginTransaction();
    const q = `UPDATE cart_payment
      SET
        tips = ${item['tips']}, 
        paid = ${item['paid']}, 
        updateDate = '${today()}'
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

  try {
    const { insertId } = await autoNumber('sendOrder');
    const sendOrder = insertId;
    const q = `UPDATE cart_item
            SET
              sendOrder = '${sendOrder}', 
              updateDate = '${today()}'
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
          updateDate = '${today()}'
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
              updateDate = '${today()}'
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
                  updateDate = '${today()}'
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

