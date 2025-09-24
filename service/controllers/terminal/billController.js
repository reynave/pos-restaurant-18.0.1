const db = require('../../config/db');
const net = require('net');
const { headerUserId, today, formatDateTime, formatCurrency, formatLine, centerText } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');
const { cart } = require('../../helpers/bill');
const { printQueueInternal } = require('../../helpers/printer');
const Handlebars = require("handlebars");

require("../../helpers/handlebarsFunction")(Handlebars);

const fs = require("fs");
const ejs = require('ejs');
const path = require('path');

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

exports.printing2 = async (req, res) => {
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
      bill: row.id + (subgroup > 1 ? ('.' + subgroup) : ''),

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
        subgroup: subgroup,
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



exports.printing = async (req, res) => {

  const api = req.query.api == 'true' ? true : false;
  const userId = headerUserId(req);
  //try {

    const templateSource = fs.readFileSync("public/template/bill.hbs", "utf8");
    const template = Handlebars.compile(templateSource);
  
    const cartId = req.query.id;
    const subgroup = !req.query.subgroup ? 1 : req.query.subgroup; 
    const data = await cart(cartId, subgroup);
    let q = '';
    const [selectOutlet] = await db.query(`
            SELECT  outletTableMapId 
            FROM cart  
            WHERE id = '${cartId}'
          `); 

    if (selectOutlet[0]['outletTableMapId'] != 0) { 
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
    }else{
        
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

    console.log(q);
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

    if (api == true) {
      res.json({
        data: data,
        transaction: formattedRows[0],
        company: outlet[0],
        subgroup: subgroup,

      });
    } else {
      const jsonData = {
        data: data,
        transaction: formattedRows[0],
        company: outlet[0],
        subgroup: subgroup,

      };
      const result = template(jsonData);
      res.setHeader('Content-Type', 'application/json');
      res.send(result);
    }

  // } catch (err) {
  //   console.error('Render error:', err);
  //   res.status(500).send('Failed to render HTML');
  // }
};



exports.testHbs = async (req, res) => {

  try {
    const templateSource = fs.readFileSync("public/template/bill.hbs", "utf8");

    const template = Handlebars.compile(templateSource);

    const data = {
      items: [
        { nama: "Nasi Goreng", qty: 1, harga: 25000, total: 25000 },
        { nama: "Es Teh Manis", qty: 2, harga: 5000, total: 10000 },
        { nama: "Ayam Bakar", qty: 1, harga: 30000, total: 30000 }
      ],
      grandTotal: 65000
    };

    const result = template(data);
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
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
      results.push({ status: 'Insert success' });
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

exports.billUpdate = async (req, res) => {
  const cartId = req.body['id'];
  const results = [];
  const userId = headerUserId(req);
  try {

    const [item] = await db.query(`
        SELECT  count(id)  as 'total' FROM bill 
        where cartId = '${cartId}'  order by inputDate Desc
      `);

    const q3 =
      `INSERT INTO bill (
          presence, inputDate, updateDate, 
          cartId, no,
          inputBy, updateBy
      )
      VALUES (
        1, '${today()}', '${today()}',
        '${cartId}', ${item[0]['total']}, 
        ${userId}, ${userId}
      )`;
    const [result23] = await db.query(q3);
    if (result23.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'BILL INSERT' });
    }


    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();


    const q2 = `UPDATE cart
      SET
        paymentId = '${hours * 100 + minutes}',
        billNo =  ${item[0]['total']}, 
        tableMapStatusId = 13, 
        updateDate = '${today()}',
        updateBy = ${userId}
      WHERE  id = '${cartId}'`;

    console.log(q2);
    const [result2] = await db.query(q2);

    if (result2.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'cart updated' });
    }

    //  const [so] = await db.query(`
    //     SELECT  count(id)  as 'total' FROM cart_item 
    //     where cartId = '${cartId}'  and sendOrder = '' and presence = 1 and void = 0
    //     order by inputDate Desc
    //   `);


    const a1 = `
        SELECT  sendOrder FROM cart
        where id = '${cartId}'   and  presence = 1 and void = 0
        order by inputDate Desc
      `;
    console.log(a1);
    const [cartTable] = await db.query(a1);


    res.json({
      billNo: item[0]['total'],
      // emptySendOrderTotal : so[0]['total'], 
      tableSendOrder: cartTable[0]['sendOrder'],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}



exports.ipPrint = async (req, res) => {
  const printerIp = req.body['ipAddress']; // ganti dengan IP printer kamu
  const printerPort = req.body['port']; // ganti dengan port printer kamu, biasanya 9100

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
  const subgroup = req.query.subgroup || 1; 
  try {
    const cartId = req.query.id;
    const q = `
     SELECT i.id, i.subgroup, i.price, i.sendOrder, i.inputDate, 
      m.name AS 'menu', i.qty as 'total', i.qty as 'totalReset'
      FROM cart_item AS i
      JOIN menu AS m ON m.id = i.menuId
      WHERE i.cartId = '${cartId}' AND i.presence = 1 AND i.void = 0 
      ORDER BY i.inputDate ASC;
    `;
    const [items] = await db.query(q);
    console.log(q)


    const q5 = `
      SELECT  g.cartItemId AS 'id' ,  g.qty as 'total'
      FROM cart_item_group AS g 
      WHERE g.cartId = '${cartId}';
    `; 
    const [usedItem] = await db.query(q5);

    // bisa buatkan code untuk qty dari items - qty dari itemsTransfer
    const itemsMap = new Map();
    items.forEach(item => {
      itemsMap.set(item.id, item);
    });

    usedItem.forEach(item => {
      const originalItem = itemsMap.get(item.id);
      if (originalItem) {
        originalItem.total -= item.total;
      }
    });


    const q2 = `
     SELECT  g.cartItemId AS 'id' , c.price, g.qty AS 'total', g.qty AS 'totalOriginal', 1 as 'isTransfer',
      c.menuId, m.name AS 'menu'
      FROM cart_item_group AS g
      JOIN cart_item AS c ON c.id = g.cartItemId
      JOIN menu AS m ON m.id = c.menuId
      WHERE g.cartId = '${cartId}' AND g.subgroup = '${subgroup}'  
      AND g.presence = 1
      ORDER BY g.inputDate ASC;
    `;
   // console.log(q2)
    const [itemsTransfer] = await db.query(q2);


    res.json({
      subgroup: subgroup,
      error: false,
      items: items,
      itemsTransfer: itemsTransfer,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.updateGroup = async (req, res) => {
  const cartId = req.body['id']; 
  const subgroup = req.body['subgroup'];
  const qty = req.body['qty'];
  const itemTransfer = req.body['itemTransfer'];
  const userId = headerUserId(req);
  const results = [];
  try {

    const [cartItemGroup] = await db.query(`
      SELECT * FROM cart_item_group
      WHERE cartId = '${cartId}' AND subgroup = ${subgroup} and cartItemId = '${itemTransfer['id']}'
    `);

    if (cartItemGroup.length > 0) {
      const q = `update cart_item_group set
          qty = ${qty},
          updateDate = '${today()}',
          updateBy = '${userId}'
        WHERE cartId = '${cartId}' AND subgroup = ${subgroup} and cartItemId = '${itemTransfer['id']}'
      `;
      const [result] = await db.query(q); 
      if (result.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'updated' });
      }
    } else {
      const q =
        `INSERT INTO cart_item_group (
          cartId, cartItemId,   subgroup, qty,
          presence, inputDate, inputBy) 
        VALUES ( 
          '${cartId}', '${itemTransfer['id']}', ${subgroup}, ${qty},
          1, '${today()}', '${userId}' 
        )`;
      const [result] = await db.query(q);
      if (result.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'updated' });
      }
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

exports.resetGroup = async (req, res) => {
  const id = req.body['id'];
  const item = req.body['item']; 
  const subgroup = req.body['subgroup'];

  const results = [];
  try {
    const q = `
      DELETE FROM cart_item_group 
      WHERE cartItemId = '${item['id']}' 
        AND subgroup = ${subgroup}  
        AND cartId = '${id}'
       
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



exports.createPayment = async (req, res) => {
  let cartId = req.body['id'];
  const terminalId = req.body['terminalId'];
  const userId = headerUserId(req);

  try {
    const { insertId: sendOrder } = await autoNumber('sendOrder');
    const [tableSendOrder] = await db.query(`
      SELECT  sendOrder FROM cart
      where id = '${cartId}'   and  presence = 1 and void = 0
      order by inputDate Desc
    `);

    if (tableSendOrder[0]['sendOrder'] == 0) {
      const { insertId } = await autoNumber('cart');

      const q2 = `
      UPDATE cart SET
        id =  '${insertId}', 
        sendOrder = 1, 
        updateDate = '${today()}',
        updateBy = ${userId},
        lockBy = '${terminalId}'
      WHERE id = ${cartId} and sendOrder = 0`;
      await db.query(q2);

      const q3 = `
      UPDATE cart_item SET
        cartId =  '${insertId}'
      WHERE cartId = ${cartId}`;
      await db.query(q3);

      const q4 = `
      UPDATE cart_item_modifier SET
        cartId =  '${insertId}'
      WHERE cartId = ${cartId}`;
      await db.query(q4);

      cartId = insertId;
    }



    const q = `
    UPDATE cart_item SET
      sendOrder = '${sendOrder}', 
      updateDate = '${today()}',
      updateBy = ${userId}
    WHERE cartId = ${cartId}  and presence = 1 and void = 0 and sendOrder = '' `;
    await db.query(q);

    const q2 = `
    UPDATE cart_item_modifier SET
      sendOrder =  '${sendOrder}', 
      updateDate = '${today()}',
      updateBy = ${userId}
    WHERE cartId = ${cartId}  and presence = 1 and void = 0 and sendOrder = ''`;
    const [result2] = await db.query(q2);

    if (result2.affectedRows !== 0) {
      const q3 =
        `INSERT INTO send_order (
        presence, inputDate, updateDate,  
        cartId, sendOrderDate, id,
        inputBy, updateBy
      )
      VALUES (
        1, '${today()}', '${today()}',
        '${cartId}',  '${today()}', '${sendOrder}',
        ${userId}, ${userId}
      )`;
      await db.query(q3);
    }

    await printQueueInternal(db, sendOrder, userId);



    res.json({
      error: false,
      id: cartId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}


