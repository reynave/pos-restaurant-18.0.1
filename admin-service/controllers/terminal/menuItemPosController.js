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
    const cartId = req.query.id;

    const [formattedRows] = await db.query(`
      SELECT t1.* , (t1.total * t1.price) as 'totalAmount', m.name , 0 as 'checkBox', '' as modifier
      FROM (
        SELECT   c.price, c.menuId, COUNT(c.menuId) AS 'total'
        FROM cart_item AS c
        LEFT JOIN menu AS m ON m.id = c.menuId
        WHERE c.cartId = '${cartId}'
        AND c.presence = 1 AND c.void  = 0
        GROUP BY c.price, c.menuId
        ORDER BY MAX(c.inputDate) ASC
      ) AS t1
      JOIN menu AS m ON m.id = t1.menuId
    `);
    let totalAmount = 0;
    for (const row of formattedRows) {
     
      const s = `
        SELECT COUNT(t1.descl) AS 'total', t1.descl
        FROM (
          SELECT r.modifierId, m.descl
          FROM cart_item  AS i 
          right JOIN cart_item_modifier AS r ON r.cartItemId = i.id
          LEFT JOIN modifier AS m ON m.id = r.modifierId 
          WHERE i.menuId = ${row['menuId']} AND i.price = ${row['price']}
          AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
          AND r.presence = 1 AND i.void = 0
        ) AS t1
        GROUP BY t1.descl
      `;

      const [modifier] = await db.query(s);

      row.modifier = modifier; // tambahkan hasil ke properti maps

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
  const cartId = req.body['id'];

  const inputDate = today();

  try {

    const [result] = await db.query(
      `INSERT INTO cart_item (presence, inputDate, updateDate, menuId, price, cartId,
      menuDepartmentId, menuCategoryId)
      VALUES (1, '${inputDate}', '${inputDate}',  ${menu['id']}, ${menu['price']}, '${cartId}',
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
  const cartId = req.body['cartId'];

  const inputDate = today();
  const results = [];

  try {

    const [row] = await db.query(
      `
        SELECT * FROM cart_item
          WHERE cartId = '${cartId}'  AND  presence = 1 AND void = 0
          AND  menuId= ${item['menuId']} AND price = ${item['price']}
        ORDER BY inputDate DESC
        LIMIT 1
        `
    );


    for (let i = 0; i < model.newQty; i++) {

      const [result] = await db.query(
        `INSERT INTO cart_item (presence, inputDate, updateDate, menuId, price, cartId, menuDepartmentId, menuCategoryId)
        VALUES (1, '${row[0]['inputDate']}', '${row[0]['inputDate']}',  ${item['menuId']}, ${item['price']}, '${cartId}',
          ${row[0]['menuDepartmentId']}, ${row[0]['menuCategoryId']}
        )`
      );

      if (result.affectedRows === 0) {
        results.push({ cartId, status: 'not found' });
      } else {
        results.push({ cartId, status: 'insert' });
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

exports.voidItem = async (req, res) => {
  // const { id, name, position, email } = req.body;

  const data = req.body['cart'];
  const cartId = req.body['cartId'];

  const inputDate = today();
  const results = [];

  try {
    for (const emp of data) {
      const { menuId, price, checkBox } = emp;

      if (!menuId) {
        results.push({ menuId, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      if (checkBox == 1) {
        const q = `UPDATE cart_item
            SET
              void = 1,
              presence = 0,
              updateDate = '${today()}'
          WHERE menuId = ${menuId} and price = ${price} and cartId = '${cartId}'`;
        const [result] = await db.query(q);
        if (result.affectedRows === 0) {
          results.push({ menuId, status: 'not found', query: q, });
        } else {
          results.push({ menuId, status: 'updated', query: q, });
        }
      }
    }

    res.json({
      message: 'Batch update completed',
      results: results
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

exports.addToItemModifier = async (req, res) => {
  const data = req.body['cart'];
  const modifiers = req.body['modifiers'];
  const cartId = req.body['cartId'];

  const results = [];

  try {

    for (const emp of data) {
      const { menuId, checkBox, price } = emp;

      if (!menuId) {
        results.push({ menuId, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      if (checkBox == 1) {
        const q2 = `
          SELECT id FROM cart_item 
          WHERE  cartId = '${cartId}' AND presence = 1 AND void = 0
          AND price = ${price} AND menuId = ${menuId} 
        `;
        const [cartItems] = await db.query(q2);
        

        for (const cartItem of cartItems) {
          const q3 = `
            SELECT count(id) as 'total'
              FROM cart_item_modifier
            WHERE
            cartId = '${cartId}' and
            cartItemId = ${cartItem['id']} and
            modifierId = ${modifiers['id']} and
            presence = 1 and void = 0
          `;
          const [isDouble] = await db.query(q3);
          if (isDouble[0]['total'] == 0) {

            const q =
              `INSERT INTO cart_item_modifier (
                presence, inputDate, updateDate, void,
                cartId, cartItemId, modifierId,
                note, price
              )
              VALUES (
                1, '${today()}', '${today()}',  0,
                '${cartId}',  ${cartItem['id']}, ${modifiers['id']},
                '', ${modifiers['price']}
            )`;
            const [result] = await db.query(q);

            if (result.affectedRows === 0) {
              results.push({ status: 'not found', query: q, });
            } else {
              results.push({ status: 'updated', query: q, });
            }



          } else {
            results.push({ status: 'cannot double' });
          }
        }
      }
    }

    res.status(201).json({
      error: false,
      message: 'cart created',
      results: results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.cartDetail = async (req, res) => {
  const cartId = req.query.id;
  const menuId = req.query.menuId;
  const price = req.query.price;

  try {

    const q = `
      SELECT c.id, c.price, c.menuId , m.name, 0 as 'checkBox', '' as 'modifier'
      FROM cart_item AS c
      LEFT JOIN menu AS m ON m.id = c.menuId
      WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void = 0
      AND c.menuId = ${menuId} AND c.price = ${price}
    `;
    const [formattedRows] = await db.query(q);
    let totalAmount = 0;
    for (const row of formattedRows) {
      totalAmount += row['price'];
    }

    // Loop dengan for...of agar bisa pakai await
    for (const row of formattedRows) {
      const [modifier] = await db.query(`
        SELECT c.id, c.modifierId, c.price, m.descl, c.cartItemId, 0 as 'checkBox'
          FROM cart_item_modifier AS c
          LEFT JOIN modifier AS m ON m.id = c.modifierId
        where c.cartItemId = ? and c.presence = 1 and c.void = 0
      `, [row.id]);

      row.modifier = modifier; // tambahkan hasil ke properti maps
    }



    res.json({
      error: false,
      items: formattedRows,
      totalAmount: totalAmount,
      get: req.query,
      q: q,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getModifier = async (req, res) => {
  const i = 1;
  try {

    const [formattedRows] = await db.query(`
      SELECT id, name,min,max, '' as detail
      FROM modifier_list
      WHERE presence = 1
    `);

    // Loop dengan for...of agar bisa pakai await
    for (const row of formattedRows) {
      const [detail] = await db.query(`
        SELECT id, descl, descm,descs, price${i}  as 'price' ,printing
        FROM modifier
        where modifierListId = ?
        order by sorting ASC
      `, [row.id]);

      row.detail = detail; // tambahkan hasil ke properti maps
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

exports.voidItemDetail = async (req, res) => {
  // const { id, name, position, email } = req.body;

  const data = req.body['cart'];
  const cartId = req.body['cartId'];

  const results = [];

  try {
    for (const emp of data) {
      const { id, checkBox } = emp;

      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      if (checkBox == 1) {
        const q = `UPDATE cart_item
            SET
              void = 1,
              presence = 0,
              updateDate = '${today()}'
          WHERE id = ${id}  and cartId = '${cartId}'`;
        const [result] = await db.query(q);
        if (result.affectedRows === 0) {
          results.push({ id, status: 'not found', query: q, });
        } else {
          results.push({ id, status: 'updated', query: q, });
        }
      }
    }

    res.json({
      message: 'Batch update completed',
      results: results
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};
exports.addModifier = async (req, res) => {
  const data = req.body['cart'];
  const menu = req.body['menu'];
  const cartId = req.body['id'];

  const results = [];

  try {

    for (const emp of data) {
      const { id, checkBox } = emp;

      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      if (checkBox == 1) {
        const q2 = `
          SELECT count(id) as 'total'
            FROM cart_item_modifier
          WHERE
          cartId = '${cartId}' and
          cartItemId = ${id} and
          modifierId = ${menu['id']} and
          presence = 1 and void = 0
        `;
        const [isDouble] = await db.query(q2);
        if (isDouble[0]['total'] == 0) {


          const q =
            `INSERT INTO cart_item_modifier (
            presence, inputDate, updateDate, void,
            cartId, cartItemId, modifierId,
            note, price
          )
          VALUES (
            1, '${today()}', '${today()}',  0,
            '${cartId}',  ${id}, ${menu['id']},
            '', ${menu['price']}
         )`;
          const [result] = await db.query(q);

          if (result.affectedRows === 0) {
            results.push({ id, status: 'not found', query: q, });
          } else {
            results.push({ id, status: 'updated', query: q, });
          }
        } else {
          results.push({ id, status: 'cannot double' });
        }
      }
    }

    res.status(201).json({
      error: false,
      message: 'cart created',
      results: results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.removeDetailModifier = async (req, res) => {
  // const { id, name, position, email } = req.body;

  const data = req.body['cart'];
  const cartId = req.body['cartId'];

  const results = [];

  try {
    for (const emp of data) {
      const { id, checkBox, modifier } = emp;

      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }


      for (const emp2 of modifier) {
        const { id, checkBox } = emp2;
        if (checkBox == 1) {
          const q = `UPDATE cart_item_modifier
            SET
              void = 1,
              presence = 0,
              updateDate = '${today()}'
            WHERE id = ${id} `;
          const [result] = await db.query(q);

          if (result.affectedRows === 0) {
            results.push({ id, status: 'modifier not found', query: q, });
          } else {
            results.push({ id, status: 'modifier updated', query: q, });
          }
        }
      }

      if (checkBox == 1) {
        const q = `UPDATE cart_item_modifier
            SET
              void = 1,
              presence = 0,
              updateDate = '${today()}'
          WHERE cartItemId = ${id}  and cartId = '${cartId}'`;
        const [result] = await db.query(q);

        if (result.affectedRows === 0) {
          results.push({ id, status: 'not found', query: q, });
        } else {
          results.push({ id, status: 'updated', query: q, });
        }
      }
    }

    res.json({
      message: 'Batch update completed',
      results: results
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

