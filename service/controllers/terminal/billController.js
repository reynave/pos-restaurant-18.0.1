const db = require('../../config/db');
const { formatDateOnly, formatDateTime } = require('../../helpers/global');
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
  const api = req.query.api == 'true' ? true : false;

  function formatCurrency(num, symbol = '') {
      num = parseInt(num);
      num = num.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, });
      return symbol + num.replace(/Rp/g, '');
    }

    function formatLine(leftText, rightText, lineLength = 50) {
      const totalLength = leftText.length + rightText.length;

      if (totalLength >= lineLength) {
        // Jika terlalu panjang, potong teks kiri
        const trimmedLeft = leftText.slice(0, lineLength - rightText.length - 1);
        return trimmedLeft + ' ' + rightText;
      }

      const spaces = lineLength - totalLength;
      return leftText + ' '.repeat(spaces) + rightText;
    }

    function centerText(str, width = 50) {
      if (str.length >= width) return str; // jika string lebih panjang, tidak diubah

      const totalSpaces = width - str.length;
      const paddingLeft = Math.floor(totalSpaces / 2);
      const paddingRight = totalSpaces - paddingLeft;

      return ' '.repeat(paddingLeft) + str + ' '.repeat(paddingRight);
    }


  try {

    

    const cartId = req.query.id;
    const data = await cart(cartId);


    const [transaction] = await db.query(`
     SELECT 
         c.id , c.id as 'bill', c.void,  c.dailyCheckId, c.cover, c.outletId,
        o.name AS 'outlet', c.startDate, c.endDate , 
        c.close,   t.tableName, t.tableNameExt, 'UAT PERSON' as 'servedBy' 
      FROM cart AS c
      JOIN outlet AS o ON o.id = c.outletId
      JOIN outlet_table_map AS t ON t.id = c.outletTableMapId
      WHERE c.presence = 1 AND  c.id = '${cartId}'
    `);

    const formattedRows = transaction.map(row => ({
      ...row,
      startDate: formatDateTime(row.startDate),
      endDate: row.close == 0 ? '' : formatDateTime(row.endDate),
    }));

    const [outlet] = await db.query(`
     SELECT  * 
      FROM outlet  
      WHERE id = '${formattedRows[0]['outletId']}'
    `);

    if (api == true) {
      res.json({
        data: data,
        transaction: formattedRows[0],
        company: outlet[0],
        function: [
          { 'formatCurrency(value, symbol=null)': `return string` },
          { 'formatLine(leftText, rightText, lineLength = 50)': `return string` },
           { 'centerText(str, lineLength = 50)': `return string` },
        ]
      });
    }
    const html = await ejs.renderFile(templatePath, {
      data: data,
      transaction: formattedRows[0],
      company: outlet[0],
      formatCurrency,
      formatLine,
      centerText
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(html);


  } catch (err) {
    console.error('Render error:', err);
    res.status(500).send('Gagal render HTML');
  }
};

