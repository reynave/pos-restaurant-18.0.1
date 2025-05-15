const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');

exports.getMenuItem = async (req, res) => {
  const i = 1;
  try {

    const [formattedRows] = await db.query(`
      SELECT id, desc1, '' as menu
      FROM menu_department  
      WHERE presence = 1
    `);

    // Loop dengan for...of agar bisa pakai await
    for (const row of formattedRows) {
      const [menu] = await db.query(`
        SELECT id, name, price${i}  as 'price' , menuDepartmentId, menuCategoryId
        FROM menu
        where menuDepartmentId = ?
      `, [row.id]);

      row.menu = menu; // tambahkan hasil ke properti maps
    }


    res.json({
      error: false,
      items: formattedRows,
      get: req.query
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.cart = async (req, res) => {
  const i = 1;
  try {
    const cardId = req.query.id;

    const [formattedRows] = await db.query(`  
      SELECT t1.* , (t1.total * t1.price) as 'totalAmount', m.name FROM (
        SELECT   c.price, c.menuId, COUNT(c.menuId) AS 'total'
        FROM cart_item AS c
        LEFT JOIN menu AS m ON m.id = c.menuId
        WHERE c.cardId = '${cardId}'
        AND c.presence = 1 AND c.void  = 0
        GROUP BY c.price, c.menuId
        ORDER BY MAX(c.inputDate) ASC
      ) AS t1 
      JOIN menu AS m ON m.id = t1.menuId
    `);
    let totalAmount = 0;
    for (const row of formattedRows) {

      totalAmount += row['totalAmount'];
    }


    res.json({
      error: false,
      items: formattedRows,
      totalAmount: totalAmount,
      get: req.query
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
 
exports.addToCart = async (req, res) => {
  const menu = req.body['menu'];
  const cardId = req.body['id'];

  const inputDate = today();

  try {

    const [result] = await db.query(
      `INSERT INTO cart_item (presence, inputDate, updateDate, menuId, price, cardId, 
      menuDepartmentId, menuCategoryId) 
      VALUES (1, '${inputDate}', '${inputDate}',  ${menu['id']}, ${menu['price']}, '${cardId}', 
         ${menu['menuDepartmentId']}, ${menu['menuCategoryId']}
      )`
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'cart created',
      outlet_bonus_ruleId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.updateQty = async (req, res) => {
  // const { id, name, position, email } = req.body;

  const model = req.body['model'];
  const item = req.body['item'];
  const cardId = req.body['cardId'];
  
  const inputDate = today(); 
  const results = [];

  try {

    const [row] = await db.query(
        `
        SELECT * FROM cart_item 
          WHERE cardId = '${cardId}'  AND  presence = 1 AND void = 0 
          AND  menuId= ${item['menuId']} AND price = ${item['price']}  
        ORDER BY inputDate DESC
        LIMIT 1 
        `
      );


    for (let i = 0; i < model.newQty; i++) {

      const [result] = await db.query(
        `INSERT INTO cart_item (presence, inputDate, updateDate, menuId, price, cardId, menuDepartmentId, menuCategoryId) 
        VALUES (1, '${row[0]['inputDate']}', '${row[0]['inputDate']}',  ${item['menuId']}, ${item['price']}, '${cardId}',
          ${row[0]['menuDepartmentId']}, ${row[0]['menuCategoryId']} 
        )`
      );

      if (result.affectedRows === 0) {
        results.push({ cardId, status: 'not found' });
      } else {
        results.push({ cardId, status: 'insert' });
      }
    }
    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'cart created', 
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};



exports.cartDetail = async (req, res) => {
  const cardId = req.query.id;
  const menuId = req.query.menuId;
  const price = req.query.price;
  
  try {
    

    const [formattedRows] = await db.query(`  
     SELECT * FROM cart_item
      WHERE cardId = '${cardId}' AND presence = 1 AND void = 0
      AND menuId = ${menuId} AND price = ${price}
    `);
    let totalAmount = 0;
    for (const row of formattedRows) {

      totalAmount += row['price'];
    }


    res.json({
      error: false,
      items: formattedRows,
      totalAmount: totalAmount,
      get: req.query
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
