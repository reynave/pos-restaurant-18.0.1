const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const { cart } = require('../../helpers/bill');

const ejs = require('ejs');
const path = require('path');

exports.getAllData = async (req, res) => {
  const outletId = req.query.outletId;

  try {

    const [formattedRows] = await db.query(`

            SELECT c.*, o.name AS 'outlet' , m.tableName, '' as paymentType
            FROM cart AS c
            JOIN outlet AS o ON o.id = c.outletId 
            JOIN outlet_table_map AS m ON m.id = c.outletTableMapId
            WHERE c.presence = 1 and c.close = 1    ${outletId ? 'and c.outletId = ' + outletId : ''}
            order BY c.id DESC 
 
        `);

    for (const row of formattedRows) {

      const s = `
                SELECT c.id, c.checkPaymentTypeId, p.name
                FROM cart_payment  AS c
                JOIN check_payment_type AS p ON p.id = c.checkPaymentTypeId
                WHERE c.presence = 1 and  c.cartId = '${row['id']}'
            `;

      const [paymentType] = await db.query(s);
      row.paymentType = paymentType;

    }


    res.json({
      error: false,
      items: formattedRows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.cart = async (req, res) => {

  try {
    const cartId = req.query.id;

    const { orderItems } = await cart(cartId);


    res.json({
      error: false,
      items: orderItems,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getCopyBill = async (req, res) => {

  try {
    const cartId = req.query.id;
    const [formattedRows] = await db.query(` 
      SELECT count(id) as 'total'
      FROM cart_copy_bill 
      WHERE presence = 1 and cartId = '${cartId}'   
    `);

    const [items] = await db.query(` 
      SELECT *
      FROM cart_copy_bill 
      WHERE presence = 1 and cartId = '${cartId}'   
    `);


    res.json({
      error: false,
      copy: formattedRows,
      items : items,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.addCopyBill = async (req, res) => {

  const cartId = req.body['id'];
  const results = [];

  try {

    const [result] = await db.query(
      `INSERT INTO cart_copy_bill (
        presence, inputDate,  updateDate,
        cartId    ) 
      VALUES (1, '${today()}',  '${today()}',
        '${cartId}'
      )`
    );

    if (result.affectedRows === 0) {
      results.push({ cartId, status: 'cart_copy_bill not found' });
    } else {
      results.push({ cartId, status: 'cart_copy_bill insert'});
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

