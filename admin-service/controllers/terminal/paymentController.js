const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');
const { cart } = require('../../helpers/bill');

const ejs = require('ejs');
const path = require('path');

exports.cart = async (req, res) => {
  let totalItem = 0;
  try {
    const cartId = req.query.id;  
    const data = await cart(cartId);
 
    res.json({
      error: false, 
      data: data, 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
exports.cartVer1 = async (req, res) => {
  let totalItem = 0;
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
      totalItem += 1;
      const s = `
        SELECT COUNT(t1.descl) AS 'total', t1.descl, t1.price, SUM(t1.price) AS 'totalAmount'
        FROM (
          SELECT r.modifierId, m.descl, r.price
          FROM cart_item  AS i 
          right JOIN cart_item_modifier AS r ON r.cartItemId = i.id
          LEFT JOIN modifier AS m ON m.id = r.modifierId 
          WHERE i.menuId = ${row['menuId']} AND i.price = ${row['price']}
          AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
          AND r.presence = 1 AND i.void = 0 and r.applyDiscount = 0
        ) AS t1
        GROUP BY t1.descl, t1.price
      `;

      const [modifier] = await db.query(s);
      row.modifier = modifier; // tambahkan hasil ke properti maps 

      let totalAmountModifier = 0;
      modifier.forEach(el => {
        totalAmountModifier += parseInt(el['totalAmount']);
      });
      totalAmount += row['totalAmount'] + totalAmountModifier;

    }

    // formattedRows.forEach(row => {
    //   row['modifier'].forEach(el => {
    //     row['totalAmount'] += parseInt(el['totalAmount']);
    //   });
    // });

    const orderItems = [];
    for (let i = 0; i < formattedRows.length; i++) {
      orderItems.push({
        menuId: formattedRows[i]['menuId'],
        parentMenuId: 0,
        name: formattedRows[i]['name'] + (formattedRows[i]['modifier'].length > 0 ? '*' : ''),
        price: formattedRows[i]['price'],
        total: formattedRows[i]['total'],
        totalAmount: parseInt(formattedRows[i]['totalAmount']),
      })
      formattedRows[i]['modifier'].forEach(el => {
        orderItems.push({
          menuId: 0,
          parentMenuId: formattedRows[i]['menuId'],
          name: el['descl'],
          price: el['price'],
          total: el['total'],
          totalAmount: parseInt(el['totalAmount']),
        })
      });
    }
    let grandTotal = totalAmount;

    const s2 = `
      SELECT c.id, c.bill as 'amount', t.name 
      FROM cart_payment  AS c
      JOIN check_sc_type AS t ON t.id = c.checkScTypeId  
      WHERE c.cartId = '${cartId}' and c.presence = 1 

      UNION 

      SELECT  c.id, c.bill as 'amount',  a.name
      FROM cart_payment  AS c 
      JOIN check_tax_type AS a ON a.id = c.checkTaxTypeId 
      WHERE c.cartId = '${cartId}' and c.presence = 1 
      `;
    const [bill] = await db.query(s2);

    bill.forEach(el => {
      grandTotal += el['amount'];
    });


     const s3 = `
      SELECT c.id, c.paid as 'amount', t.name 
      FROM cart_payment  AS c
      JOIN check_payment_type AS t ON t.id = c.checkPaymentTypeId
      WHERE c.cartId = '${cartId}' and c.presence = 1 and  submit = 1
      `;
    const [paided] = await db.query(s3);

   

      const s5 = `
        SELECT SUM(t1.bill - t1.paid) AS 'amount'  FROM (

          SELECT id, price  AS 'bill', 0 AS 'paid' 
          FROM cart_item_modifier
          WHERE cartId = '${cartId}' AND presence =1 AND void = 0
          UNION

          SELECT id, price  AS 'bill', 0 AS 'paid' FROM cart_item
          WHERE cartId = '${cartId}'  AND presence =1 AND void = 0
          UNION 

          SELECT c.id, c.bill  , c.paid
          FROM cart_payment  AS c 
          WHERE c.cartId = '${cartId}' AND presence =1  and submit = 1

          UNION 

          SELECT  c.id, c.bill  , c.paid
          FROM cart_payment  AS c  
          WHERE c.cartId = '${cartId}' AND presence =1  and submit = 1
      ) AS t1
      `;
    const [closePaymentQuery] = await db.query(s5);

    if( parseInt(closePaymentQuery[0]['amount'] ) <= 0  ){
      const q = `UPDATE cart
            SET
              close =  1, 
              totalAmount = '${totalAmount}',
              grandTotal = '${grandTotal}',
              totalItem = '${totalItem}',
              endDate = '${today()}',
              updateDate = '${today()}'
              
          WHERE id = ${cartId} and presence = 1  `;
      const [result] = await db.query(q);

    }
    


    res.json({
      error: false,
      preview: "https://[YOUR_HOST]:[PORT]/terminal/bill/?id=" + cartId,
      id: cartId,
     // items: formattedRows,
      orderItems: orderItems,
      totalAmount: totalAmount,
      grandTotal: grandTotal, 
      totalItem: totalItem,
      bill: bill,
      paided: paided,
      closePayment : parseInt(closePaymentQuery[0]['amount'] ) <= 0  ? true : false,
      closePaymentAmount : parseInt(closePaymentQuery[0]['amount'] ),
      get: req.query
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
  const totalAmount = req.body['totalAmount'];
  let amount = 0;
  const results = [];
  try {
    if (payment['autoMatchAmount'] == 1) {
      amount = totalAmount;
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
  const cartId = req.body['cartId'];
  const paid = req.body['paid'];

  const results = [];
  try {
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

    res.status(201).json({
      error: false,
      message: 'cart_payment updated',

    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
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

