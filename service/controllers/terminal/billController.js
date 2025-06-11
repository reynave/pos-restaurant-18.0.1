const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const { cart } = require('../../helpers/bill');

const ejs = require('ejs');
const path = require('path');

exports.getData = async (req, res) => {

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



    res.json({
      error: false,
      preview: "https://[YOUR_HOST]:[PORT]/terminal/bill/?id=" + cartId,
      id: cartId,
      items: formattedRows,
      totalAmount: totalAmount,
      get: req.query
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

  

exports.printing = async (req, res) => {
  const templatePath = path.join(__dirname, '../../public/template/bill.ejs');

  try {
    const cartId = req.query.id;
    const data = await cart(cartId);

    function formatCurrency(num) {
      return num.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    }

    const html = await ejs.renderFile(templatePath, {
      data: data,
      formatCurrency
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(html);


  } catch (err) {
    console.error('Render error:', err);
    res.status(500).send('Gagal render HTML');
  }
};

exports.api = async (req, res) => {
  
  try {
    const cartId = req.query.id;
    const data = await cart(cartId);

    function formatCurrency(num) {
      return num.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    }

   
    res.json({ 
      data: data,
      function: [
        { 'formatCurrency(value:number)' : `return num.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });`},

      ]
    });

  } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};