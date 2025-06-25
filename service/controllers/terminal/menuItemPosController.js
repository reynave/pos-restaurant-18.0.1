const db = require('../../config/db');
const { today, formatDateOnly, formatDateTime } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');
const { taxScUpdate } = require('../../helpers/bill');

exports.getMenuItem = async (req, res) => {
  const i = 1;
  try {
    const menuLookupId = req.query.menuLookupId;
    const outletId = req.query.outletId;


    const q = `
       
        SELECT 
          m.id, m.name, m.price${i} as 'price' , m.adjustItemsId, m.qty,
          m.menuDepartmentId, m.menuCategoryId, m.menuTaxScId,
          t.desc, t.taxRate, t.taxNote, t.taxStatus,
            CASE 
              WHEN t.taxStatus = 2 THEN m.price${i} - (m.price${i} / (1+ (t.taxRate/100) ))
              WHEN t.taxStatus = 1 THEN m.price${i}*(t.taxRate/100)
              ELSE  0
            END AS 'taxAmount',  
          t.scRate, t.scNote, t.scStatus,
            CASE 
              WHEN t.scStatus = 2 THEN m.price${i} - (m.price${i} / (1+ (t.scRate/100) ))
              WHEN t.scStatus = 1 THEN m.price${i}*(t.scRate/100)
              ELSE  0
            END AS 'scAmount' ,

             (
                SELECT COUNT(ci.id)
                FROM cart_item ci
                WHERE ci.presence = 1 
                  AND ci.void = 0 
                  AND ci.adjustItemsId = m.adjustItemsId
              ) AS usedQty
        FROM menu AS m
        LEFT JOIN menu_tax_sc AS t ON t.id = m.menuTaxScId
        WHERE m.presence = 1 and m.menuLookupId = ${menuLookupId} and m.menuLookupId != 0
      `;
    const [items] = await db.query(q);

    const [discountGroup] = await db.query(`
      SELECT t.*
      FROM outlet_check_disc AS d
       JOIN check_disc_type AS t ON t.id = d.checkDiscTypeId
      WHERE d.presence = 1 and d.outletId = ${outletId}
    `);

    res.json({
      error: false,
      items: items,
      discountGroup: discountGroup,
      get: req.query
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.getMenuItem_Ver1 = async (req, res) => {
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
      const q = `
       
        SELECT 
          m.id, m.name, m.price${i} as 'price' , m.adjustItemsId, m.qty,
          m.menuDepartmentId, m.menuCategoryId, m.menuTaxScId,
          t.desc, t.taxRate, t.taxNote, t.taxStatus,
            CASE 
              WHEN t.taxStatus = 2 THEN m.price${i} - (m.price${i} / (1+ (t.taxRate/100) ))
              WHEN t.taxStatus = 1 THEN m.price${i}*(t.taxRate/100)
              ELSE  0
            END AS 'taxAmount',  
          t.scRate, t.scNote, t.scStatus,
            CASE 
              WHEN t.scStatus = 2 THEN m.price${i} - (m.price${i} / (1+ (t.scRate/100) ))
              WHEN t.scStatus = 1 THEN m.price${i}*(t.scRate/100)
              ELSE  0
            END AS 'scAmount' ,

             (
    SELECT COUNT(ci.id)
    FROM cart_item ci
    WHERE ci.presence = 1 
      AND ci.void = 0 
      AND ci.adjustItemsId = m.adjustItemsId
  ) AS usedQty
        FROM menu AS m
        LEFT JOIN menu_tax_sc AS t ON t.id = m.menuTaxScId
        WHERE m.presence = 1 and m.menuDepartmentId = ${row.id}
      `;
      const [menu] = await db.query(q);

      row.menu = menu; // tambahkan hasil ke properti maps
    }

    const [discountGroup] = await db.query(`
      SELECT t.*
      FROM outlet_check_disc AS d
       JOIN check_disc_type AS t ON t.id = d.checkDiscTypeId
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
    const q = `
      SELECT t1.* , (t1.total * t1.price) as 'totalAmount', m.name , 0 as 'checkBox', '' as modifier
      FROM (
        SELECT  c.price,   c.menuId, COUNT(c.menuId) AS 'total' 
        FROM cart_item AS c
        JOIN menu AS m ON m.id = c.menuId
        WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void  = 0 AND c.sendOrder = ''
        GROUP BY  c.menuId, c.price
        ORDER BY MAX(c.inputDate) ASC
      ) AS t1
      JOIN menu AS m ON m.id = t1.menuId 
    `;

    const [formattedRows] = await db.query(q);

    let totalAmount = 0;
    let n = 0;
    for (const row of formattedRows) {
      const s = `
        SELECT COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price
        FROM (
          SELECT r.modifierId, m.descl, r.price
          FROM cart_item  AS i 
          right JOIN cart_item_modifier AS r ON r.cartItemId = i.id
          JOIN modifier AS m ON m.id = r.modifierId 
          WHERE i.menuId = ${row['menuId']}  
          AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
          AND i.sendOrder = '' AND r.sendOrder = ''
          AND r.presence = 1 AND i.void = 0   
        ) AS t1
        GROUP BY t1.descl, t1.price


        UNION 

         SELECT COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price
        FROM ( SELECT r.modifierId,   r.price, r.applyDiscount, d.name AS 'descl'
          FROM cart_item  AS i
            JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
           JOIN check_disc_type AS d ON d.id = r.applyDiscount
          WHERE i.menuId = ${row['menuId']} 
          AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1  
           AND i.sendOrder = '' AND r.sendOrder = ''
          AND r.presence = 1 AND i.void = 0 
      ) AS t1
        GROUP BY t1.descl, t1.price    
;
      `;

      const [modifier] = await db.query(s);
      row.modifier = modifier;
      let totalAmountModifier = 0;
      modifier.forEach(el => {
        totalAmountModifier += parseInt(el['totalAmount']);
        formattedRows[n]['totalAmount'] += parseInt(el['totalAmount']);
      });


      n++;
    }


    let temp = 0;


    for (let i = 0; i < formattedRows.length; i++) {
      totalAmount += formattedRows[i]['totalAmount'];
    }


    const [sendOrder] = await db.query(`
      SELECT 
        ROW_NUMBER() OVER (ORDER BY sendOrder ASC) AS no,
        sendOrder AS id,
        COUNT(sendOrder) AS totalMenu
      FROM cart_item
      WHERE cartId = '${cartId}' AND  presence =1 AND void = 0 AND sendOrder != ''
      GROUP BY sendOrder
      ORDER BY sendOrder DESC;
    `);
    totalItem = 0;
    formattedRows.forEach(element => {
      totalItem += element['total'];
    });

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

exports.cartOrdered = async (req, res) => {
  const i = 1;
  try {
    const cartId = req.query.id;
    let totalItem = 0;
    const q = `
      SELECT t1.* , (t1.total * t1.price) as 'totalAmount', m.name , 0 as 'checkBox', '' as modifier
      FROM (
        SELECT   c.price, c.menuId, COUNT(c.menuId) AS 'total' 
        FROM cart_item AS c
        JOIN menu AS m ON m.id = c.menuId
        WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void  = 0 AND c.sendOrder != ''
        GROUP BY  c.menuId, c.price
        ORDER BY MAX(c.inputDate) ASC
      ) AS t1
      JOIN menu AS m ON m.id = t1.menuId 
    `;
    const [formattedRows] = await db.query(q);

    let totalAmount = 0;
    let n = 0;
    for (const row of formattedRows) {

      const s = `
       SELECT COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price
        FROM (
          SELECT r.modifierId, m.descl, r.price
          FROM cart_item  AS i 
          right JOIN cart_item_modifier AS r ON r.cartItemId = i.id
          JOIN modifier AS m ON m.id = r.modifierId 
          WHERE i.menuId = ${row['menuId']}  
          AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
          AND i.sendOrder != ''  
          AND r.presence = 1 AND i.void = 0   
        ) AS t1
        GROUP BY t1.descl, t1.price


        UNION 

         SELECT COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price
        FROM ( SELECT r.modifierId,   r.price, r.applyDiscount, d.name AS 'descl'
          FROM cart_item  AS i
            JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
           JOIN check_disc_type AS d ON d.id = r.applyDiscount
          WHERE i.menuId = ${row['menuId']} 
          AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1  
           AND i.sendOrder != ''  
          AND r.presence = 1 AND i.void = 0 
      ) AS t1
        GROUP BY t1.descl, t1.price    
;
      `;

      const [modifier] = await db.query(s);
      row.modifier = modifier; // tambahkan hasil ke properti maps 

      let totalAmountModifier = 0;
      modifier.forEach(el => {
        totalAmountModifier += parseInt(el['totalAmount']);
        formattedRows[n]['totalAmount'] += parseInt(el['totalAmount']);
      });


      n++;
    }





    let temp = 0;


    for (let i = 0; i < formattedRows.length; i++) {
      totalAmount += formattedRows[i]['totalAmount'];
    }

    totalItem = 0;
    formattedRows.forEach(element => {
      totalItem += element['total'];
    });
    res.json({
      error: false,
      temp: temp,
      items: formattedRows,
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

  let inputDate = today();
  const results = [];
  try {

    //let price = parseInt(menu['price']) + parseInt(menu['taxAmount']) + parseInt(menu['scAmount']);
    let c =
      `SELECT * FROM cart_item
      WHERE cartId = '${cartId}' and   menuId = ${menu['id']} and 
      sendOrder = '' and presence = 1 and void = 0 order by inputDate ASC limit 1`;

    const [cek] = await db.query(c);
    if (cek.length) {
      inputDate = formatDateTime(cek[0]['inputDate']);
    }

    let q =
      `INSERT INTO cart_item (presence, inputDate, updateDate, menuId, price, cartId,
      menuDepartmentId, menuCategoryId, adjustItemsId
      )
      VALUES (1, '${inputDate}', '${inputDate}',  ${menu['id']}, ${menu['price']}, '${cartId}',
        ${menu['menuDepartmentId']}, ${menu['menuCategoryId']}, '${!menu['adjustItemsId'] ? '' : menu['adjustItemsId']}'
      )`;

    const [result] = await db.query(q);
    const cartItemId = result.insertId;

    if (result.affectedRows === 0) {
      results.push({ cartId, status: 'not found' });
    } else {

      results.push({ cartId, status: 'cart_item insert' });
    }
    let scAmount = menu['price'] * (menu['scRate'] / 100);
  
    let taxAmount = (parseInt(menu['price']) + scAmount) * (menu['taxRate'] / 100);
 

 
    if (menu['scStatus'] == 1) {
      let q2 =
        `INSERT INTO cart_item_modifier (
        presence, inputDate, updateDate,  
        cartId, cartItemId, menuTaxScId, 
        scRate, scStatus , price, priceIncluded
      )
      VALUES (
        1, '${inputDate}', '${inputDate}', 
        '${cartId}',  ${cartItemId}, ${menu['menuTaxScId']}, 
        ${menu['scRate']},  ${menu['scStatus']} , ${scAmount}, 0
      )`;
      const [result2] = await db.query(q2);

      if (result2.affectedRows === 0) {
        results.push({ cartId, status: 'not found' });
      } else {
        results.push({ cartId, status: 'SC cart_item_modifier insert' });
      }
    }
    else if (menu['scStatus'] == 2) {
      let q2 =
        `INSERT INTO cart_item_modifier (
        presence, inputDate, updateDate,  
        cartId, cartItemId, menuTaxScId, 
        scRate, scStatus , 
        price, priceIncluded
      )
      VALUES (
        1, '${inputDate}', '${inputDate}', 
        '${cartId}',  ${cartItemId}, ${menu['menuTaxScId']}, 
        ${menu['scRate']},  ${menu['scStatus']} , 0, ${menu['scAmount']}
      )`;
      const [result2] = await db.query(q2);

      if (result2.affectedRows === 0) {
        results.push({ cartId, status: 'not found' });
      } else {
        results.push({ cartId, status: 'SC cart_item_modifier insert' });
      }
    }



    if (menu['taxStatus'] == 1) {
      let q3 =
        `INSERT INTO cart_item_modifier (
        presence, inputDate, updateDate,  
        cartId, cartItemId, menuTaxScId,
        taxRate, taxStatus,
          price, priceIncluded
      )
      VALUES (
        1, '${inputDate}', '${inputDate}', 
        '${cartId}',  ${cartItemId}, ${menu['menuTaxScId']},
        ${menu['taxRate']},  ${menu['taxStatus']},
          ${taxAmount}, 0
      )`;
    //  console.log(q3);
      const [result3] = await db.query(q3);

      if (result3.affectedRows === 0) {
        results.push({ cartId, status: 'not found' });
      } else {
        results.push({ cartId, status: 'TAX cart_item_modifier insert' });
      }
    }
    else if (menu['taxStatus'] == 2) {
      let q3 =
        `INSERT INTO cart_item_modifier (
        presence, inputDate, updateDate,  
        cartId, cartItemId, menuTaxScId,
        taxRate, taxStatus,  price, priceIncluded
      )
      VALUES (
        1, '${inputDate}', '${inputDate}', 
        '${cartId}',  ${cartItemId}, ${menu['menuTaxScId']},
        ${menu['taxRate']},  ${menu['taxStatus']}, 0, ${menu['taxAmount']}
      )`;

      const [result3] = await db.query(q3);

      if (result3.affectedRows === 0) {
        results.push({ cartId, status: 'not found' });
      } else {
        results.push({ cartId, status: 'TAX cart_item_modifier insert' });
      }
    }

    res.status(201).json({
      error: false,
      cek: cek,
      db: results,
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

  let inputDate = today();
  const results = [];

  try {

    const [row] = await db.query(
      `
        SELECT * FROM cart_item
          WHERE cartId = '${cartId}'  AND  presence = 1 AND void = 0
          AND  menuId= ${item['menuId']} AND price = ${item['price']}
          and sendOrder = ''
        ORDER BY inputDate ASC
        LIMIT 1
        `
    );
    inputDate = formatDateTime(row[0]['inputDate']);

    for (let i = 0; i < model.newQty; i++) {


      // INSERT CART_ITEM
      const [result] = await db.query(
        `INSERT INTO cart_item (
          presence, inputDate, updateDate, menuId, price, cartId,  
          menuDepartmentId, menuCategoryId 
        )
        VALUES (
          1, '${inputDate}', '${inputDate}',  ${item['menuId']},
          ${row[0]['price']}, '${cartId}',
          ${row[0]['menuDepartmentId']}, ${row[0]['menuCategoryId']} 
        )`
      );
      const cartItemId = result.insertId;
      if (result.affectedRows === 0) {
        results.push({ cartId, status: 'not found' });
      } else {
        results.push({ cartId, status: 'cart_item insert' });
      }


      // INSERT cart_item_modifier
      const [taxRow] = await db.query(
        `select * from cart_item_modifier 
        where presence = 1 and void = 0  and cartItemId = ${row[0]['id']}  
        and sendOrder = ''
        `
      );
      for (const rec of taxRow) {
        const j = `INSERT INTO cart_item_modifier (  
            presence, inputDate, updateDate,  
            cartId, cartItemId, menuTaxScId, 
            modifierId, price, priceIncluded, 
            taxRate, taxStatus, 
            scRate, scStatus, 
            applyDiscount, sendOrder
          )
          VALUES (
            1, '${today()}', '${today()}',
            '${rec['cartId']}', ${cartItemId}, ${rec['menuTaxScId']}, 
             ${rec['modifierId']}, ${rec['price']},  ${rec['priceIncluded']}, 
              ${rec['taxRate']}, ${rec['taxStatus']},
              ${rec['scRate']}, ${rec['scStatus']} ,
              ${rec['applyDiscount']}, '${rec['sendOrder']}'
          )`;

        const [result2] = await db.query(j);


        if (result2.affectedRows === 0) {
          results.push({ cartId, status: 'not found' });
        } else {
          results.push({ cartId, status: 'TAX cart_item_modifier insert' });
        }
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
          WHERE menuId = ${menuId}  and cartId = '${cartId}' and sendOrder = '' `;
        const [result] = await db.query(q);
        if (result.affectedRows === 0) {
          results.push({ menuId, status: 'not found' });
        } else {
          results.push({ menuId, status: 'cart_item updated' });
        }
      }
    }

    const q2 = `
          SELECT id, cartId, presence , void FROM cart_item
          WHERE cartId = '${cartId}' `;
    const [result2] = await db.query(q2);


    if (result2.length > 0) {
      for (const row of result2) {
        const q = `UPDATE cart_item_modifier
            SET
              void = 1,
              presence = 0,
              updateDate = '${today()}'
          WHERE   cartItemId = '${row['id']}'`;
        const [result] = await db.query(q);

        if (result2.affectedRows === 0) {
          results.push({ status: 'not found' });
        } else {
          results.push({ status: 'cart_item_modifier updated' });
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
          AND price = ${price} AND menuId = ${menuId}  and sendOrder = ''
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


            const q2 =
              `SELECT SUM(price) AS 'total' 
              FROM cart_item_modifier
              WHERE cartItemId = ${cartItem['id']}
              AND presence =1 AND void = 0 and menuTaxScId = 0
            `;
            const [totalAmountModifier] = await db.query(q2);


            const m1 = `
              SELECT price + ${parseInt(totalAmountModifier[0]['total'])} as 'price' 
              FROM cart_item 
              WHERE id = ${cartItem['id']} AND presence =1 AND void = 0  
            `;
            const [itemPrice] = await db.query(m1);

            const taxScUpdateRest = await taxScUpdate(cartItem['id']);



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
  const cart = req.body['cart'];
  const cartOrdered = req.body['cartOrdered'];

  const discountGroup = req.body['discountGroup'];
  const cartId = req.body['cartId'];

  const results = [];

  try {

    for (const emp of cart) {
      const { menuId, checkBox, price } = emp;

      if (!menuId) {
        results.push({ menuId, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      if (checkBox == 1) {
        const q2 = `
          SELECT id FROM cart_item 
          WHERE  cartId = '${cartId}' AND presence = 1 AND void = 0
          AND price = ${price} AND menuId = ${menuId} and sendOrder = ''
        `;
        const [cartItems] = await db.query(q2);


        for (const cartItem of cartItems) {



          const t1 = `
          SELECT SUM(t1.totalAmount)  AS 'totalAmount' 
          FROM (
            SELECT  SUM(price) AS 'totalAmount'
            FROM cart_item_modifier
            WHERE
              cartId = '${cartId}' and
              cartItemId = ${cartItem['id']} AND 
              presence = 1 and void = 0
               AND menuTaxScId = 0
            UNION

            SELECT SUM(price)AS 'totalAmount' 
            FROM cart_item WHERE 
              cartId = '${cartId}' and
              id = ${cartItem['id']} AND 
              presence = 1 and void = 0
          ) AS t1
          `;
          const [queryT1] = await db.query(t1);
          const totalAmount = parseInt(queryT1[0]['totalAmount']);


          if (parseInt(discountGroup['discAmount']) > 0) {
            discAmount = parseInt(discountGroup['discAmount']) * -1;
            if (totalAmount + discAmount <= 0) {
              discAmount = totalAmount * -1;
            }
          } else {
            discAmount = (totalAmount * (parseFloat(discountGroup['discRate']) / 100)) * -1;

          }


          const q =
            `INSERT INTO cart_item_modifier (
                presence, inputDate, updateDate, void,
                cartId, cartItemId, modifierId,
                applyDiscount, price
              )
              VALUES (
                1, '${today()}', '${today()}',  0,
                '${cartId}',  ${cartItem['id']}, 0,
                ${discountGroup['id']}, ${discAmount}
            )`;

          const [result] = await db.query(q);

          if (result.affectedRows === 0) {
            results.push({ status: 'not found', query: q, });
          } else {
            results.push({ status: 'updated', query: q, });
          }

          // const  taxScUpdateRest  = await taxScUpdate(cartItem['id'], totalAmount);


          const taxScUpdateRest = await taxScUpdate(cartItem['id']);

          // } else {
          //   results.push({ status: 'cannot double' });
          // }
        }
      }
    }
    for (const emp of cartOrdered) {
      const { menuId, checkBox, price } = emp;

      if (!menuId) {
        results.push({ menuId, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      if (checkBox == 1) {
        const q2 = `
          SELECT id FROM cart_item 
          WHERE  cartId = '${cartId}' AND presence = 1 AND void = 0
          AND price = ${price} AND menuId = ${menuId} and sendOrder != ''
        `;
        const [cartItems] = await db.query(q2);


        for (const cartItem of cartItems) {



          const t1 = `
          SELECT SUM(t1.totalAmount)  AS 'totalAmount' 
          FROM (
            SELECT  SUM(price) AS 'totalAmount'
            FROM cart_item_modifier
            WHERE
              cartId = '${cartId}' and
              cartItemId = ${cartItem['id']} AND 
              presence = 1 and void = 0
               AND menuTaxScId = 0
            UNION

            SELECT SUM(price)AS 'totalAmount' 
            FROM cart_item WHERE 
              cartId = '${cartId}' and
              id = ${cartItem['id']} AND 
              presence = 1 and void = 0
          ) AS t1
          `;
          const [queryT1] = await db.query(t1);
          const totalAmount = parseInt(queryT1[0]['totalAmount']);


          if (parseInt(discountGroup['discAmount']) > 0) {
            discAmount = parseInt(discountGroup['discAmount']) * -1;
            if (totalAmount + discAmount <= 0) {
              discAmount = totalAmount * -1;
            }
          } else {
            discAmount = (totalAmount * (parseFloat(discountGroup['discRate']) / 100)) * -1;

          }


          const q =
            `INSERT INTO cart_item_modifier (
                presence, inputDate, updateDate, void,
                cartId, cartItemId, modifierId,
                applyDiscount, price
              )
              VALUES (
                1, '${today()}', '${today()}',  0,
                '${cartId}',  ${cartItem['id']}, 0,
                ${discountGroup['id']}, ${discAmount}
            )`;

          const [result] = await db.query(q);

          if (result.affectedRows === 0) {
            results.push({ status: 'not found', query: q, });
          } else {
            results.push({ status: 'updated', query: q, });
          }

          // const  taxScUpdateRest  = await taxScUpdate(cartItem['id'], totalAmount);


          const taxScUpdateRest = await taxScUpdate(cartItem['id']);

          // } else {
          //   results.push({ status: 'cannot double' });
          // }
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
  let sendOrder = !req.query.sendOrder ? '' : req.query.sendOrder;

  if (sendOrder == 'undefined') {
    sendOrder = '';
  }

  try {

    const q = `
      SELECT c.id, c.price, c.menuId , m.name, 0 as 'checkBox', '' as 'modifier', c.sendOrder
      FROM cart_item AS c
      LEFT JOIN menu AS m ON m.id = c.menuId
      WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void = 0
      AND c.menuId = ${menuId} AND c.price = ${price} and c.sendOrder = '${sendOrder}'
    `;
    console.log(q)
    const [formattedRows] = await db.query(q);
    let totalAmount = 0;
    let grandAmount = 0;


    // Loop dengan for...of agar bisa pakai await
    for (const row of formattedRows) {
      const q = `

        -- GENERAL
        SELECT c.id, c.modifierId, c.price, m.descl, c.cartItemId, c.applyDiscount,  c.menuTaxScId,
         c.priceIncluded, 
        0 as 'checkBox'
          FROM cart_item_modifier AS c
           JOIN modifier AS m ON m.id = c.modifierId
          where c.cartItemId = ${row.id}
          and c.presence = 1 and c.void = 0 and c.modifierId != 0
        and c.applyDiscount = 0
 
        UNION 
        -- APPLYDISCOUNT
        SELECT c.id, c.modifierId, c.price, m.name AS 'descl' , c.cartItemId, c.applyDiscount, c.menuTaxScId,
         c.priceIncluded, 
        0 as 'checkBox'
        FROM cart_item_modifier AS c
         JOIN check_disc_type AS m ON m.id = c.applyDiscount
        where c.cartItemId =  ${row.id}
        and c.presence = 1 and c.void = 0  and c.modifierId = 0 


        UNION 
        -- SC 
        SELECT c.id, c.modifierId, c.price,  t.scNote AS 'descl' ,  c.cartItemId, c.applyDiscount, c.menuTaxScId,
         c.priceIncluded, 
        0 as 'checkBox'
        FROM cart_item_modifier AS c
        JOIN menu_tax_sc AS t ON t.id = c.menuTaxScId
        where c.cartItemId =   ${row.id}
        and c.presence = 1 and c.void = 0  and c.scStatus != 0


        UNION 
        -- TAX 
        SELECT c.id, c.modifierId, c.price,  t.taxNote AS 'descl' ,  c.cartItemId, c.applyDiscount, c.menuTaxScId,
        c.priceIncluded, 
        0 as 'checkBox'
        FROM cart_item_modifier AS c
        JOIN menu_tax_sc AS t ON t.id = c.menuTaxScId
        where c.cartItemId =   ${row.id}
        and c.presence = 1 and c.void = 0  and c.taxStatus != 0


      `;
      const [modifier] = await db.query(q);

      row.modifier = modifier; // tambahkan hasil ke properti maps

    }



    const orderItems = [];
    let no = 1;
    for (let i = 0; i < formattedRows.length; i++) {

      orderItems.push({
        no: no++,
        id: formattedRows[i]['id'],
        menuId: formattedRows[i]['menuId'],
        parentId: 0,
        name: formattedRows[i]['name'] + (formattedRows[i]['modifier'].length > 0 ? '*' : ''),
        price: parseInt(formattedRows[i]['price']),
        priceIncluded: 0,
        checkBox: 0,
        sendOrder: formattedRows[i]['sendOrder'],
        modifierId: 'parent',
        applyDiscount: 0,
        menuTaxScId: 0,
      })
      formattedRows[i]['modifier'].forEach(el => {
        orderItems.push({
          no: 0,
          id: el['id'] == null ? 0 : el['id'],
          menuId: 0,
          parentId: el['cartItemId'],
          name: el['descl'],
          price: parseInt(el['price']),
          priceIncluded: parseInt(el['priceIncluded']),

          checkBox: 0,
          sendOrder: formattedRows[i]['sendOrder'],
          modifierId: el['modifierId'],
          applyDiscount: el['applyDiscount'],
          menuTaxScId: el['menuTaxScId'],
        })
        grandAmount += parseInt(el['price']);

        if (el['menuTaxScId'] == 0) {
          totalAmount += parseInt(el['price']);
        }
      });

      grandAmount += parseInt(formattedRows[i]['price']);
      totalAmount += parseInt(formattedRows[i]['price']);

    }

    res.json({
      error: false,
      items: formattedRows,
      totalAmount: totalAmount,
      grandAmount: grandAmount,
      get: req.query,
      orderItems: orderItems,

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

            const taxScUpdateRest = await taxScUpdate(id);
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
      const { id, checkBox, parentId } = emp;

      if (checkBox == 1) {
        if (parentId == 0) {
          const q = `UPDATE cart_item_modifier
            SET
              void = 1,
              presence = 0,
              updateDate = '${today()}'
          WHERE menuTaxScId = 0 and  cartItemId = '${id}'`;
          const [result] = await db.query(q);
          if (result.affectedRows === 0) {
            results.push({ id, status: 'not found' });
          } else {
            results.push({ id, status: 'updated' });
            const taxScUpdateRest = await taxScUpdate(id);
          }

        }
        else {
          const q = `UPDATE cart_item_modifier
            SET
              void = 1,
              presence = 0,
              updateDate = '${today()}'
          WHERE menuTaxScId = 0  and  id = '${id}'`;
          const [result] = await db.query(q);
          if (result.affectedRows === 0) {
            results.push({ id, status: 'not found' });
          } else {
            results.push({ id, status: 'updated' });
            const taxScUpdateRest = await taxScUpdate(parentId);
          }
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

    const q1 = `
    UPDATE cart SET
      tableMapStatusId = 12, 
      updateDate = '${today()}'
    WHERE id = ${cartId}  `;
    const [result23] = await db.query(q1);

    if (result23.affectedRows === 0) {
      results.push({ cartId, status: 'not found', });
    } else {
      results.push({ cartId, status: 'cart_item updated', });
    }


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
      void = 1,
      endDate =  '${today()}',
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
 
exports.menuLookUp = async (req, res) => {
  // const { id, name, position, email } = req.body;
  let parentId = req.query.parentId;

  if (parentId == 'undefined' || !parentId) parentId = 0;

  try {

    const q = `
      SELECT m.id, m.parentId, m.name, m.departmentId, p.name as 'parent'
      FROM menu_lookup  as m
      left join  menu_lookup as p on p.id = m.parentId
      WHERE m.presence = 1 and m.parentId = ${parentId}
      ORDER BY m.sorting ASC
    `;

    const [rows] = await db.query(q);



    const q2 = `
      SELECT id, parentId,  name 
      FROM menu_lookup 
      WHERE presence = 1 and id = ${parentId} 
    `;
    console.log(q2);
    const [lookUpHeader] = await db.query(q2);



    res.status(201).json({
      error: false,
      parent : lookUpHeader,
    //  lookUpHeader: parentId == 0 ? 'Menu' : lookUpHeader[0]['name'],
    //  parentId: parentId == 0 ? 0 : parseInt(lookUpHeader[0]['parentId']),
      results: rows,
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

