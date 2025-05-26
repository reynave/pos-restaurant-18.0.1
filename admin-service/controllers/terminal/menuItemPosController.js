const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');

exports.getMenuItem = async (req, res) => {
  const i = 1;
  try {
    const outletId = req.query.outletId;

    const [formattedRows] = await db.query(`
      SELECT id, desc1, '' as menu
      FROM menu_department
      WHERE presence = 1
    `);

    // Loop dengan for...of agar bisa pakai await
    for (const row of formattedRows) {
      const [menu] = await db.query(`
       
        SELECT m.id, m.name, m.price1 as 'originPrice' , 
        m.menuDepartmentId, m.menuCategoryId, m.menuTaxScId,
        t.desc, 
        t.taxRate, t.taxNote, t.taxStatus,
        CASE 
          WHEN t.taxStatus = 2 THEN 0
          WHEN t.taxStatus = 1 THEN m.price1*(t.taxRate/100)
          ELSE  0
        END AS 'taxAmount',  
        t.scRate, t.scNote, t.scStatus,
        CASE 
          WHEN t.scStatus = 2 THEN 0
          WHEN t.scStatus = 1 THEN m.price1*(t.scRate/100)
          ELSE  0
        END AS 'scAmount'

        FROM menu AS m
        LEFT JOIN menu_tax_sc AS t ON t.id = m.menuTaxScId
        WHERE m.presence = 1 and m.menuDepartmentId = ?
      `, [row.id]);

      row.menu = menu; // tambahkan hasil ke properti maps
    }

    const [discountGroup] = await db.query(`
      SELECT t.*
      FROM outlet_check_disc AS d
      LEFT JOIN check_disc_type AS t ON t.id = d.checkDiscTypeId
      WHERE d.presence = 1 and d.outletId = ${outletId}
    `);



    res.json({
      error: false,
      items: formattedRows,
      discountGroup: discountGroup,
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
    let totalItem = 0;
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
      ORDER BY t1.sendOrder DESC
    `);
    let totalAmount = 0;
    for (const row of formattedRows) {
      totalItem += 1;
      const s = `
        SELECT COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount'
        FROM (
          SELECT r.modifierId, m.descl, r.price
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

      let totalAmountModifier = 0;
      modifier.forEach(el => {
        totalAmountModifier += parseInt(el['totalAmount']);
      });



    }



    // formattedRows.forEach(row => { 
    //   row['modifier'].forEach(el => { 
    //     row['totalAmount'] += parseInt(el['totalAmount']);
    //   });
    // });
    let temp = 0;
    for (let i = 0; i < formattedRows.length; i++) {
      temp = 0;
      for (let n = 0; n < formattedRows[i]['modifier'].length; n++) {
        temp = parseInt(formattedRows[i]['modifier'][n]['totalAmount']);
      }
      formattedRows[i]['totalAmount'] = formattedRows[i]['totalAmount'] + temp;
      if (formattedRows[i]['totalAmount'] < 0) formattedRows[i]['totalAmount'] = 0;
    }

    for (let i = 0; i < formattedRows.length; i++) {
      totalAmount += formattedRows[i]['totalAmount'];
    }


    const [sendOrder] = await db.query(`
      SELECT 
        ROW_NUMBER() OVER (ORDER BY sendOrder ASC) AS no,
        sendOrder AS id,
        COUNT(sendOrder) AS totalMenu
      FROM cart_item
      WHERE cartId = '${cartId}'
      GROUP BY sendOrder
      ORDER BY sendOrder DESC;
    `);

    res.json({
      error: false,
      temp: temp,
      items: formattedRows,
      sendOrder: sendOrder,
      totalAmount: totalAmount,
      totalItem: totalItem,
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

    let price = parseInt(menu['originPrice']) + parseInt(menu['taxAmount']) + parseInt(menu['scAmount']);

    let q =
      `INSERT INTO cart_item (presence, inputDate, updateDate, menuId, originPrice, cartId,
      menuDepartmentId, menuCategoryId, 
      taxRate, taxAmount, taxStatus,
      scRate ,scAmount, scStatus,
      menuTaxScId,
      price
      )
      VALUES (1, '${inputDate}', '${inputDate}',  ${menu['id']}, ${menu['originPrice']}, '${cartId}',
        ${menu['menuDepartmentId']}, ${menu['menuCategoryId']},
        ${menu['taxRate']}, ${parseInt(menu['taxAmount'])},  ${menu['taxStatus']},  
        ${menu['scRate']}, ${parseInt(menu['scAmount'])}, ${menu['scStatus']},  
        ${menu['menuTaxScId']},
        ${price}
      )`;

    const [result] = await db.query(q);

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
      // insert cart_item
  
      const [result] = await db.query(
        `INSERT INTO cart_item (
          presence, inputDate, updateDate, menuId, originPrice, cartId,  
          menuDepartmentId, menuCategoryId,

          taxRate, taxAmount, taxStatus,
          scRate ,scAmount, scStatus,
          menuTaxScId,
          price
        )
        VALUES (
          1, '${row[0]['inputDate']}', '${row[0]['inputDate']}',  ${item['menuId']},
          ${row[0]['originPrice']}, '${cartId}',
          ${row[0]['menuDepartmentId']}, ${row[0]['menuCategoryId']},

          ${row[0]['taxRate']}, ${row[0]['taxAmount']}, ${row[0]['taxStatus']},
          ${row[0]['scRate']}, ${row[0]['scAmount']}, ${row[0]['scStatus']},
          ${row[0]['menuTaxScId']},
          ${row[0]['price']}

        )`
      );

      if (result.affectedRows === 0) {
        results.push({ cartId, status: 'not found' });
      } else {
        results.push({ cartId, status: 'cart_item insert' });
      }

      // duplcate cart_item_modifier
      // if request



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

exports.addDiscountGroup = async (req, res) => {
  const data = req.body['cart'];
  const discountGroup = req.body['discountGroup'];
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
              applyDiscount = 1 and 
            cartId = '${cartId}' and
            cartItemId = ${cartItem['id']} and
            modifierId = ${discountGroup['id']} and
            presence = 1 and void = 0
          `;
          const [isDouble] = await db.query(q3);
          if (isDouble[0]['total'] == 0) {

            let discAmount = discountGroup['discAmount'];

            if (discountGroup['discRate'] > 0) {
              discAmount = price * (discountGroup['discRate'] / 100);
            }

            const q =
              `INSERT INTO cart_item_modifier (
                presence, inputDate, updateDate, void,
                cartId, cartItemId, modifierId,
                applyDiscount, price
              )
              VALUES (
                1, '${today()}', '${today()}',  0,
                '${cartId}',  ${cartItem['id']}, ${discountGroup['id']},
                1, ${discAmount} * -1
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
  const sendOrder = req.query.sendOrder;

  try {

    const q = `
      SELECT c.id, c.price, c.menuId , m.name, 0 as 'checkBox', '' as 'modifier', c.sendOrder
      FROM cart_item AS c
      LEFT JOIN menu AS m ON m.id = c.menuId
      WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void = 0
      AND c.menuId = ${menuId} AND c.price = ${price} and c.sendOrder = '${sendOrder}'
    `;
    const [formattedRows] = await db.query(q);
    let totalAmount = 0;
    for (const row of formattedRows) {
      totalAmount += row['price'];


    }

    // Loop dengan for...of agar bisa pakai await
    for (const row of formattedRows) {
      const q = `
        SELECT c.id, c.modifierId, c.price, m.descl, c.cartItemId, 0 as 'checkBox'
          FROM cart_item_modifier AS c
          LEFT JOIN modifier AS m ON m.id = c.modifierId
        where c.cartItemId = ${row.id}
        and c.presence = 1 and c.void = 0 and c.applyDiscount = 0
 
        union
        
        SELECT c.id, c.modifierId, c.price, m.name AS 'descl' , c.cartItemId, 
        0 as 'checkBox'
        FROM cart_item_modifier AS c
        LEFT JOIN check_disc_type AS m ON m.id = c.modifierId
        where c.cartItemId =  ${row.id}
        and c.presence = 1 and c.void = 0 and c.applyDiscount =1 
      `;

      const [modifier] = await db.query(q);

      row.modifier = modifier; // tambahkan hasil ke properti maps

      let totalAmountModifier = 0;
      modifier.forEach(el => {
        totalAmountModifier += parseInt(el['price']);
      });


      totalAmount += totalAmountModifier;
      if (totalAmount < 0) totalAmount = 0;
    }


    formattedRows.forEach(row => {
      row['modifier'].forEach(el => {
        row['price'] += parseInt(el['price']);
        //if(row['price'] < 0) row['price'] = 0;
      });

    });



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

exports.sendOrder = async (req, res) => {
  // const { id, name, position, email } = req.body;

  const cartId = req.body['cartId'];

  const inputDate = today();
  const results = [];
  const { insertId } = await autoNumber('sendOrder');
  const sendOrder = insertId;
  try {
    const q = `
    UPDATE cart_item SET
      sendOrder = '${sendOrder}', 
      updateDate = '${today()}'
    WHERE cartId = ${cartId}  and presence = 1 and void = 0 and sendOrder = '' `;
    const [result] = await db.query(q);

    if (result.affectedRows === 0) {
      results.push({ cartId, status: 'not found', });
    } else {
      results.push({ cartId, status: 'cart_item updated', });
    }

    const q2 = `
    UPDATE cart_item_modifier SET
      sendOrder =  '${sendOrder}', 
      updateDate = '${today()}'
    WHERE cartId = ${cartId}  and presence = 1 and void = 0 and sendOrder = ''`;
    const [result2] = await db.query(q2);

    if (result2.affectedRows === 0) {
      results.push({ cartId, status: 'not found', });
    } else {
      results.push({ cartId, status: 'cart_item_modifier updated', });
    }

    if (result2.affectedRows !== 0 || result.affectedRows !== 0) {
      const q3 =
        `INSERT INTO send_order (
        presence, inputDate, updateDate,  
        cartId, sendOrderDate, id
      )
      VALUES (
        1, '${today()}', '${today()}',  
        '${cartId}',  '${today()}', '${sendOrder}'
      )`;
      const [result3] = await db.query(q3);
      if (result3.affectedRows === 0) {
        results.push({ sendOrder, status: 'not found', });
      } else {
        results.push({ sendOrder, status: 'insert', });
      }
    }



    res.status(201).json({
      error: false,
      results: results,
      message: 'cart_item close Order',
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

exports.exitWithoutOrder = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const results = [];
  const cartId = req.body['cartId'];
  try {

    const a = `
    UPDATE cart SET
      presence  = '0', 
      updateDate = '${today()}'
    WHERE id = '${cartId}' `;
    const [resulta] = await db.query(a);

    if (resulta.affectedRows === 0) {
      results.push({ cartId, status: 'not found', });
    } else {
      results.push({ cartId, status: 'cart updated', });
    }


    const q = `
    UPDATE cart_item SET
      presence  = '0', 
      updateDate = '${today()}'
    WHERE cartId = '${cartId}' `;
    const [result] = await db.query(q);

    if (result.affectedRows === 0) {
      results.push({ cartId, status: 'not found', });
    } else {
      results.push({ cartId, status: 'cart_item updated', });
    }

    const q2 = `
    UPDATE cart_item_modifier SET
       presence  = '0', 
      updateDate = '${today()}'
    WHERE cartId = '${cartId}' `;
    const [result2] = await db.query(q2);

    if (result2.affectedRows === 0) {
      results.push({ cartId, status: 'not found', });
    } else {
      results.push({ cartId, status: 'cart_item_modifier updated', });
    }

    const q4 = `
    UPDATE cart_payment SET
       presence  = '0', 
      updateDate = '${today()}'
    WHERE cartId = '${cartId}' `;
    const [result4] = await db.query(q4);

    if (result4.affectedRows === 0) {
      results.push({ cartId, status: 'not found', });
    } else {
      results.push({ cartId, status: 'cart_item_modifier updated', });
    }

    res.status(201).json({
      error: false,
      results: results,
      message: 'cart_item close Order',
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};