const db = require('../../config/db');
const net = require('net');
const { today, formatDateTime, formatCurrency, formatLine, centerText } = require('../../helpers/global');
const { cart } = require('../../helpers/bill');

const ejs = require('ejs');
const path = require('path');
const { group } = require('console');

exports.getData = async (req, res) => {

  try {
    const cartId = req.query.id;
    const q = `
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
    `;
    const [formattedRows] = await db.query(q);
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
 


  try {



    const cartId = req.query.id;
    const subgroup = !req.query.subgroup ? 1 : req.query.subgroup;

    const data = await cart(cartId, subgroup);


    const [transaction] = await db.query(`
     SELECT 
         c.id   , c.id as 'bill', c.void,  c.dailyCheckId, c.cover, c.outletId,
        o.name AS 'outlet', c.startDate, c.endDate , 
        c.close,   t.tableName, t.tableNameExt, 'UAT PERSON' as 'servedBy' 
      FROM cart AS c
      JOIN outlet AS o ON o.id = c.outletId
      JOIN outlet_table_map AS t ON t.id = c.outletTableMapId
      WHERE c.presence = 1 AND  c.id = '${cartId}'
    `);

    const formattedRows = transaction.map(row => ({
      ...row,
      bill : row.id + ( subgroup > 1 ? ( '.'+subgroup): ''),

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
        subgroup :subgroup,
        function: [
          { 'formatCurrency(value, symbol=null)': `return string` },
          { 'formatLine(leftText, rightText, lineLength = 50)': `return string` },
          { 'centerText(str, lineLength = 50)': `return string` },
        ]
      });
    } else {


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
    }

  } catch (err) {
    console.error('Render error:', err);
    res.status(500).send('Gagal render HTML');
  }
};


exports.getCartCopyBill = async (req, res) => {

  try {
    const cartId = req.query.id;

    const [formattedRows] = await db.query(`
      SELECT  * FROM cart_copy_bill 
      where cartId = '${cartId}'  order by inputDate Desc
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

exports.copyBill = async (req, res) => {
  const cartId = req.body['id'];
  const results = [];
  try {

    const [result] = await db.query(
      `INSERT INTO cart_copy_bill (
              cartId, presence, inputDate, inputBy) 
            VALUES ( '${cartId}', 1, '${today()}', '0' )`
    );
    if (result.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'updated' });
    }

    res.json({
      error: false,
      get: req.query
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}


exports.ipPrint = async (req, res) => {
  const printerIp = '10.51.122.20'; // ganti dengan IP printer kamu
  const printerPort = 9100;

  const cut = "\x1B\x69"; // ESC i = cut paper (Epson-style)

  const message = req.body['message'] + '\n' + cut; // bisa juga pakai ESC/POS command

  const client = new net.Socket();
  try {
    client.connect(printerPort, printerIp, () => {
      let note = 'Connected to printer';
      console.log(note);
      client.write(message); // kirim pesan ke printer
      client.end(); // tutup koneksi setelah selesai
      res.json({
        note: note,
        error: false,
      });
    });

    client.on('error', (err) => {
      let note = 'Printer error:' + err;
      console.error('Printer error:', err);
      res.json({
        note: note,
        error: true,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error' });
  }
}

exports.splitBill = async (req, res) => {

  try {
    const cartId = req.query.id;
    const q = `
     SELECT i.id, i.subgroup, i.price, i.sendOrder, i.inputDate, 
      m.name AS 'menu'
      FROM cart_item AS i
      JOIN menu AS m ON m.id = i.menuId
      WHERE i.cartId = '${cartId}' AND i.presence = 1 AND i.void = 0 
      ORDER BY i.inputDate ASC;
    `;
    const [items] = await db.query(q);
    let subgroup = [1, 2, 3, 4]


    res.json({
      subgroup: subgroup,
      error: false,
      items: items,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.updateGroup = async (req, res) => {
  const id = req.body['id'];
  const group = req.body['group'];

  const results = [];
  try {
    const q = `
            UPDATE cart_item
               SET    
                  subgroup = '${group}', 
                  updateDate = '${today()}'
            WHERE id = ${id}
         `;

    const [result] = await db.query(q);

    if (result.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'updated' });
    }

    res.json({
      error: false,
      get: req.query
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}
