const db = require('../../config/db');
const { today, convertCustomDateTime, formatDateTime, parseTimeString, addTime } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');
const { taxScUpdate } = require('../../helpers/bill');

exports.getMenuItem = async (req, res) => {
  let i = 1;
  try {
    const header = JSON.parse(req.headers['x-terminal']);

    const menuLookupId = req.query.menuLookupId;
    const outletId = req.query.outletId;

    if (outletId) {
      const [outlet] = await db.query(`SELECT id, priceNo FROM outlet WHERE id = ${outletId}`);
      i = outlet[0]['priceNo'];
    }

    const [terminal] = await db.query(`SELECT priceNo FROM terminal WHERE terminalId = ${header['terminalId']}`);
    if (terminal[0]['priceNo'] != 0) {
      i = terminal[0]['priceNo'];
    }


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
                  AND ci.adjustItemsId = m.adjustItemsId
              ) AS usedQty
        FROM menu AS m
        LEFT JOIN menu_tax_sc AS t ON t.id = m.menuTaxScId
        WHERE m.presence = 1 and m.menuLookupId = ${menuLookupId} and m.menuLookupId != 0 and 
          m.startDate < NOW() AND m.endDate > NOW()
    `;



    const [items] = await db.query(q);

    items.forEach(el => {
      if (el['adjustItemsId'] == '') {
        el['qty'] = 99999999
      }
    });

    const [discountGroup] = await db.query(`
       SELECT t.* , g.name AS 'discountGroup'
      FROM outlet_check_disc AS d
       JOIN check_disc_type AS t ON t.id = d.checkDiscTypeId 
       LEFT JOIN discount_group AS g ON g.id = t.discountGroupId
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

exports.cart = async (req, res) => {
  const i = 1;
  try {
    const cartId = req.query.id;
    let totalItem = 0;
    const q = `
      SELECT t1.* , (t1.total * t1.price) as 'totalAmount', m.name , 0 as 'checkBox', '' as modifier, 
      0 as totalModifier, m.modifierGroupId, m.discountGroupId
      FROM (
        SELECT  c.price,   c.menuId, COUNT(c.menuId) AS 'total' , sum(c.ta) as 'ta'
        FROM cart_item AS c
        JOIN menu AS m ON m.id = c.menuId
        WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void  = 0 AND c.sendOrder = ''
        GROUP BY  c.menuId, c.price, c.ta
        ORDER BY MAX(c.inputDate) ASC
      ) AS t1
      JOIN menu AS m ON m.id = t1.menuId 
    `;

    const [formattedRowsOri] = await db.query(q);

    const formattedRows = [];
    let i = 0;
    for (const row of formattedRowsOri) {
      let getIndexById = formattedRows.findIndex((obj) => obj.menuId === row.menuId);

      if (getIndexById > -1) {
        formattedRows[getIndexById]['totalAmount'] += parseInt(row.totalAmount);
        formattedRows[getIndexById]['ta'] = parseInt(row.ta) + parseInt(formattedRows[getIndexById]['ta']);
        formattedRows[getIndexById]['total'] += parseInt(row.total);
      } else {
        formattedRows.push(row);
      }

    }

    let totalAmount = 0;
    let n = 0;
    for (const row of formattedRows) {
      // MODIFIER 
      const s = `


        -- MODIFIER
       SELECT COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price, 1 as 'modifier'
        FROM (
          SELECT r.modifierId, m.descl, r.price
            FROM cart_item  AS i 
            RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id
            JOIN modifier AS m ON m.id = r.modifierId 
          WHERE i.menuId = ${row['menuId']}  
            AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
            AND i.sendOrder = ''  
            AND r.presence = 1 AND i.void = 0   
        ) AS t1
        GROUP BY t1.descl, t1.price
        UNION

 

        -- check_disc_type
        SELECT 
          COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price, 1 as 'modifier'
          FROM ( 
            SELECT r.modifierId,   r.price, r.applyDiscount, d.name AS 'descl'
              FROM cart_item  AS i
              JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
              JOIN check_disc_type AS d ON d.id = r.applyDiscount
            WHERE i.menuId = ${row['menuId']} 
                AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1  
                AND i.sendOrder = '' AND r.sendOrder = ''
                AND r.presence = 1 AND i.void = 0 
          ) AS t1
        GROUP BY t1.descl, t1.price    


        UNION

      --  SC
         SELECT
          COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price, 0 as 'modifier'
          FROM (
            SELECT r.menuTaxScId AS 'modifierId', t.scNote AS descl, r.price, r.scRate
              FROM cart_item  AS i
              RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
              JOIN menu_tax_sc AS t ON t.id = r.menuTaxScId
            WHERE i.menuId = ${row['menuId']} 
                AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
                AND i.sendOrder = '' AND r.sendOrder = ''
                AND r.presence = 1 AND i.void = 0 AND r.scRate != 0
          ) AS t1
          GROUP BY t1.descl, t1.price

        UNION 


      --  TAX
         SELECT
          COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price, 0 as 'modifier'
          FROM (
            SELECT r.menuTaxScId AS 'modifierId', t.taxNote AS descl, r.price, r.taxRate
              FROM cart_item  AS i
              RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
              JOIN menu_tax_sc AS t ON t.id = r.menuTaxScId
            WHERE i.menuId = ${row['menuId']}
                AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
                AND i.sendOrder = '' AND r.sendOrder = ''
                AND r.presence = 1 AND i.void = 0 AND r.taxRate != 0
          ) AS t1
          GROUP BY t1.descl, t1.price

         UNION 
        --  CUSTOM NOTES
          SELECT COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price, 1 as 'modifier'
          FROM (
            SELECT r.menuTaxScId AS 'modifierId', r.note AS descl, r.price
            FROM cart_item  AS i
            RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
          WHERE i.menuId = ${row['menuId']}
              AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
              AND i.sendOrder = '' AND r.sendOrder = ''
              AND r.presence = 1 AND i.void = 0 AND r.modifierId = 0 AND r.note != ''
          ) AS t1
          GROUP BY t1.descl, t1.price 
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
      let temp = 0;
      for (let n = 0; n < formattedRows[i]['modifier'].length; n++) {
        temp += formattedRows[i]['modifier'][n]['modifier'];
      }
      formattedRows[i]['totalModifier'] = temp;
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


    const q2 = `
      SELECT * FROM cart WHERE id = '${cartId}' and presence = 1;
    `;

    const [table] = await db.query(q2);

    res.json({
      error: false,
      table: table,
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
      SELECT t1.* , (t1.total * t1.price) as 'totalAmount', m.name , 0 as 'checkBox', 
      '' as modifier, 0 as 'totalModifier', m.discountGroupId
      FROM (
        SELECT   c.price, c.menuId, COUNT(c.menuId) AS 'total' , sum(c.ta) as 'ta'
        FROM cart_item AS c
        JOIN menu AS m ON m.id = c.menuId
        WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void  = 0 AND c.sendOrder != ''
        GROUP BY  c.menuId, c.price, c.ta
        ORDER BY MAX(c.inputDate) ASC
      ) AS t1
      JOIN menu AS m ON m.id = t1.menuId 
    `;
    const [formattedRowsOri] = await db.query(q);

    const formattedRows = [];
    let i = 0;
    for (const row of formattedRowsOri) {
      let getIndexById = formattedRows.findIndex((obj) => obj.menuId === row.menuId);

      if (getIndexById > -1) {
        formattedRows[getIndexById]['totalAmount'] += parseInt(row.totalAmount);
        formattedRows[getIndexById]['ta'] = parseInt(row.ta) + parseInt(formattedRows[getIndexById]['ta']);
        formattedRows[getIndexById]['total'] += parseInt(row.total);
      } else {
        formattedRows.push(row);
      }

    }



    let totalAmount = 0;
    let n = 0;
    for (const row of formattedRows) {

      const s = `

-- MODIFIER
       SELECT COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price, 1 as 'modifier'
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
-- DISCOUNT TYPE
         SELECT COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price,  1 as 'modifier'
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

        UNION 
       --  SC
         SELECT
          COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price, 0 as 'modifier'
          FROM (
            SELECT r.menuTaxScId AS 'modifierId', t.scNote AS descl, r.price, r.scRate
              FROM cart_item  AS i
              RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
              JOIN menu_tax_sc AS t ON t.id = r.menuTaxScId
            WHERE i.menuId = ${row['menuId']} 
                AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
                AND i.sendOrder != '' AND r.sendOrder != ''
                AND r.presence = 1 AND i.void = 0 AND r.scRate != 0
          ) AS t1
          GROUP BY t1.descl, t1.price

        UNION 


      --  TAX
         SELECT
          COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price, 0 as 'modifier'
          FROM (
            SELECT r.menuTaxScId AS 'modifierId', t.taxNote AS descl, r.price, r.taxRate
              FROM cart_item  AS i
              RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
              JOIN menu_tax_sc AS t ON t.id = r.menuTaxScId
            WHERE i.menuId = ${row['menuId']}
                AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
                AND i.sendOrder != '' AND r.sendOrder != ''
                AND r.presence = 1 AND i.void = 0 AND r.taxRate != 0
          ) AS t1
          GROUP BY t1.descl, t1.price

 UNION 
        --  CUSTOM NOTES
          SELECT COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price, 1 as 'modifier'
          FROM (
            SELECT r.menuTaxScId AS 'modifierId', r.note AS descl, r.price
            FROM cart_item  AS i
            RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
          WHERE i.menuId = ${row['menuId']}
              AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
              AND i.sendOrder != '' AND r.sendOrder != ''
              AND r.presence = 1 AND i.void = 0 AND r.modifierId = 0 AND r.note != ''
          ) AS t1
          GROUP BY t1.descl, t1.price 
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
      let temp = 0;
      for (let n = 0; n < formattedRows[i]['modifier'].length; n++) {
        temp += formattedRows[i]['modifier'][n]['modifier'];
      }

      formattedRows[i]['totalModifier'] = temp;
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
    const newQty = model.newQty;
    const currentQty = item['total'];

    const [row] = await db.query(
      `
        SELECT * FROM cart_item
          WHERE cartId = '${cartId}'  AND  presence = 1 AND void = 0
          AND  menuId= ${item['menuId']}  
          and sendOrder = ''
        ORDER BY inputDate ASC
        LIMIT 1
        `
    );
    inputDate = formatDateTime(row[0]['inputDate']);

    const q1 = `
      SELECT 
        m.id, m.name,  
        m.qty -  (
            SELECT COUNT(ci.id)
            FROM cart_item ci
            WHERE ci.presence = 1 
              AND ci.void = 0 
              AND ci.adjustItemsId = m.adjustItemsId
          ) AS qty
      FROM menu AS m 
      WHERE m.presence = 1 AND id = ${item['menuId']}
    `;
    const [row3] = await db.query(q1);
    qtyMenu = parseInt(row3[0]['qty']);

    let warning = '';
    if (newQty > currentQty) {

      for (let i = 0; i < (newQty - currentQty); i++) {

        if (qtyMenu >= 1) {
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
        } else {
          warning = 'Qty items are empty!';
          i = newQty + 1;
        }
        qtyMenu = qtyMenu - 1;
      }
    } else {
      const limit = (currentQty - newQty);
      for (let i = 0; i < limit; i++) {

        const q = ` 
        UPDATE cart_item  SET 
          adjustItemsId = 'DELETE',
          presence = 0,
          void = 1
        WHERE cartId = '${cartId}'  AND  presence = 1 
          AND  menuId= ${item['menuId']}    AND sendOrder = ''
        ORDER BY inputDate  DESC
        LIMIT 1
        `;

        const [result] = await db.query(q);

        if (result.affectedRows === 0) {
          results.push({ status: 'not found' });
        } else {
          results.push({ status: 'cart_item insert' });
        }
      }

      const q2 = ` 
        SELECT * FROM cart_item  
        WHERE presence = 0 AND cartId = '${cartId}'
        `;
      const [formattedRows] = await db.query(q2);
      for (const row of formattedRows) {
        const q = ` 
        UPDATE cart_item_modifier  SET  
          presence = 0,
          void = 1
        WHERE cartItemId = '${row['id']}' 
        `;
        const [result] = await db.query(q);

        if (result.affectedRows === 0) {
          results.push({ status: 'not found' });
        } else {
          results.push({ status: 'cart_item insert' });
        }

      }



    }
    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'cart created',
      warning: warning,
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

exports.updateCover = async (req, res) => {
  // const { id, name, position, email } = req.body;

  const model = req.body['model'];
  const cartId = req.body['cartId'];

  let inputDate = today();
  const results = [];

  try {

    const q = `UPDATE cart
            SET
              cover = ${model['newQty']}, 
              updateDate = '${today()}'
          WHERE  id = '${cartId}'   `;

    const [result] = await db.query(q);
    if (result.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'UPDATE updated' });
    }

    res.status(201).json({
      error: false,
      results: results
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
          SELECT id, cartId, presence , void 
          FROM cart_item
          WHERE cartId = '${cartId}' and presence = 0 and void = 1`;
    const [result2] = await db.query(q2);


    if (result2.length > 0) {
      for (const row of result2) {
        const q = `UPDATE cart_item_modifier
            SET
              void = 1,
              presence = 0,
              updateDate = '${today()}'
          WHERE  cartItemId = '${row['id']}'`;
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
      const { menuId, checkBox, price, modifierGroupId, name } = emp;

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


            if (modifiers['modifierGroupId'] == modifierGroupId) {

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
              results.push({ status: `${name} didnt match with failed Modifier Group Id` });
            }


          } else {
            results.push({ status: 'Cannot double' });
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
      const { menuId, checkBox, price, discountGroupId, name } = emp;

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

          if (discountGroup['discountGroupId'] == discountGroupId) {
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


            const q = `INSERT INTO cart_item_modifier (
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
          } else {
            results.push({ status: `ERROR ${discountGroup['discountGroup']} was not match menu ${name}` });
          }
        }
      }
    }

    for (const emp of cartOrdered) {
      const { menuId, checkBox, price, discountGroupId, name } = emp;

      if (!menuId) {
        results.push({ menuId, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      if (checkBox == 1) {
        if (discountGroup['discountGroupId'] == discountGroupId) {

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
        } else {
          results.push({ status: `ERROR ${discountGroup['discountGroup']} was not match menu ${name}` });
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
      SELECT c.id, c.price, c.menuId , m.name, 0 as 'checkBox', '' as 'modifier', c.sendOrder, c.ta
      FROM cart_item AS c
      LEFT JOIN menu AS m ON m.id = c.menuId
      WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void = 0
      AND c.menuId = ${menuId} 
    `;

    const [formattedRows] = await db.query(q);
    let totalAmount = 0;
    let grandAmount = 0;


    // Loop dengan for...of agar bisa pakai await
    for (const row of formattedRows) {
      const q = `

        -- GENERAL
        SELECT 
            c.id, c.modifierId, c.price, m.descl, c.cartItemId, c.applyDiscount,  c.menuTaxScId,
            c.priceIncluded,  0 as 'checkBox'
          FROM cart_item_modifier AS c
           JOIN modifier AS m ON m.id = c.modifierId
          where c.cartItemId = ${row.id}
          and c.presence = 1 and c.void = 0 and c.modifierId != 0
        and c.applyDiscount = 0

        UNION
        -- MEMO
        SELECT c.id, c.modifierId, c.price, c.note AS 'descl', c.cartItemId, c.applyDiscount,  c.menuTaxScId,
            c.priceIncluded,   0 as 'checkBox'
        FROM cart_item_modifier AS c 
        WHERE c.cartItemId = ${row.id}
          and c.presence = 1 and c.void = 0  and c.modifierId = 0 AND    c.note  != ''
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
        ta: formattedRows[i]['ta']
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
  let i = 1;

  const outletId = req.query.outletId;
  const header = JSON.parse(req.headers['x-terminal']);

  try {

    if (outletId) {
      const [outlet] = await db.query(`SELECT id, priceNo FROM outlet WHERE id = ${outletId}`);
      i = outlet[0]['priceNo'];
    }

    const [terminal] = await db.query(`SELECT priceNo FROM terminal WHERE terminalId = ${header['terminalId']}`);
    if (terminal[0]['priceNo'] != 0) {
      i = terminal[0]['priceNo'];
    }

    const [formattedRows] = await db.query(`
      SELECT id, name,min,max, '' as detail
      FROM modifier_list
      WHERE presence = 1
    `);

    // Loop dengan for...of agar bisa pakai await
    for (const row of formattedRows) {
      const [detail] = await db.query(`
        SELECT id, descl, descm,descs, price${i}  as 'price' ,printing, modifierGroupId
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
          WHERE id = ${id}  AND  sendOrder = ''  AND  cartId = '${cartId}'`;
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
          WHERE menuTaxScId = 0 AND sendOrder ='' AND  cartItemId = '${id}'`;
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
          WHERE menuTaxScId = 0  AND sendOrder ='' AND   id = '${id}'`;
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

exports.printQueue = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const results = [];
  const sendOrder = req.query.sendOrder;
  try {
    const q1 = `SELECT c.cartId, c.sendOrder,  c.menuId , c.id AS 'cartItemId',    m.descs,   m.printerId,  
        b.tableName, '' as modifier, 1 as qty, a.dailyCheckId
      FROM cart_item AS c
      JOIN cart AS a ON c.cartId = a.id
      LEFT JOIN menu AS m ON m.id = c.menuId 
      LEFT JOIN outlet_table_map AS b ON b.id = a.outletTableMapId
      WHERE c.sendOrder = '${sendOrder}' `;
    const [result] = await db.query(q1);

    let i = 0;
    for (const emp of result) {
       const { cartId, cartItemId, } = emp;

        const q2 = `SELECT  m.descs 
      FROM cart_item_modifier AS c
      LEFT JOIN modifier AS m ON m.id = c.modifierId
      WHERE c.cartId = '${cartId}' AND c.cartItemId = ${cartItemId} AND c.modifierId != 0
        `;
   
      const [cart_item_modifier] = await db.query(q2);

      let n = 0;
      cart_item_modifier.forEach(element => {
          result[i]['modifier'] +=  ((n>0)? ', ':'')+element['descs'];
          n++
      }); 
      i++;  
    }

      const items = []; 
    for (const row of result) {
      let getIndexById = items.findIndex((obj) => (obj.menuId === row.menuId) && (obj.modifier == row.modifier)); 
 
      if (getIndexById > -1) { 
         items[getIndexById]['qty'] += 1;
      } else {
        items.push(row);
      }

    }

   
    for (const row of items) {

      const q11 =  `INSERT INTO print_queue (
            dailyCheckId, cartId,  so,
            message,  printerId, status, 
            inputDate, updateDate 
          ) 
          VALUES (
            '${result[0]['dailyCheckId']}', '${row['cartId']}', '${row['sendOrder']}',
            '${JSON.stringify(row)}',  '${row['printerId']}',  0,
            '${today()}', '${today()}'
          )`;

      console.log(row,q11)

      const [rest] = await db.query(q11); 
      if (rest.affectedRows === 0) {
        results.push({   status: 'not found' });
      } else {
        results.push({  status: 'print_queue updated' });
      }
      
    }





    res.status(201).json({
      error: false,
      items : items, 
      rest :results
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
      sendOrder : insertId,
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

    const b = `
    SELECT count(id) as 'total' FROM cart_item   
    WHERE cartId = '${cartId}' AND sendOrder != '' `;
    const [cart] = await db.query(b);

    if (cart[0]['total'] > 0) {

      const a = `
      UPDATE cart SET
        void = 1,
        close = 1,
        tableMapStatusId = 41,
        endDate =  '${today()}', 
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
      void  = 1, 
      updateDate = '${today()}'
      WHERE cartId = '${cartId}' `;
      const [result] = await db.query(q);

      if (result.affectedRows === 0) {
        results.push({ cartId, status: 'not found', });
      } else {
        results.push({ cartId, status: 'cart_item updated', });
      }

      const a2 = `
    UPDATE cart_item SET
      adjustItemsId = 'DELETE'
      WHERE cartId = '${cartId}' and sendOrder = '' `;
      const [result2] = await db.query(a2);

      if (result2.affectedRows === 0) {
        results.push({ cartId, status: 'not found', });
      } else {
        results.push({ cartId, status: 'cart_item adjustItemsId = "DELETE"  updated', });
      }
    } else {
      const a = `
        UPDATE cart SET
          presence = 0,
          void = 1,
          tableMapStatusId = 41,
          endDate =  '${today()}', 
          updateDate = '${today()}'
        WHERE id = '${cartId}' `;
      const [resulta] = await db.query(a);

      if (resulta.affectedRows === 0) {
        results.push({ cartId, status: 'not found', });
      } else {
        results.push({ cartId, status: 'cart updated', });
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

    const [lookUpHeader] = await db.query(q2);



    res.status(201).json({
      error: false,
      parent: lookUpHeader,
      //  lookUpHeader: parentId == 0 ? 'Menu' : lookUpHeader[0]['name'],
      //  parentId: parentId == 0 ? 0 : parseInt(lookUpHeader[0]['parentId']),
      results: rows,
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

exports.transferItems = async (req, res) => {

  try {
    const cartId = req.query.id;
    const q = `
      SELECT i.id,   i.price, i.sendOrder, i.inputDate, c.id AS 'cartId' , c.outletTableMapId, c.outletId, t.tableName,
m.name AS 'menu', 0 AS 'checkBox'
FROM cart_item AS i
JOIN cart AS c ON c.id = i.cartId
JOIN menu AS m ON m.id = i.menuId
JOIN outlet_table_map AS t ON t.id = c.outletTableMapId
WHERE i.cartId = '${cartId}' AND i.presence = 1 AND i.void = 0 
ORDER BY i.inputDate ASC;
    `;
    const [items] = await db.query(q);


    const q1 = `
      SELECT  * 
      FROM cart 
      WHERE id = '${cartId}' AND  presence = 1 AND void = 0
    `;
    const [table] = await db.query(q1);

    res.json({
      table: table[0],
      error: false,
      items: items,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.transferItemsGroup = async (req, res) => {
  const i = 1;
  try {
    const cartId = req.query.id;
    let totalItem = 0;
    const q = `
      SELECT t1.* ,  m.name  ,t1.total as 'totalReset'
      FROM (
        SELECT  c.price,   c.menuId, COUNT(c.menuId) AS 'total' , sum(c.ta) as 'ta'
        FROM cart_item AS c
        JOIN menu AS m ON m.id = c.menuId
        WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void  = 0 
        GROUP BY  c.menuId, c.price, c.ta
        ORDER BY MAX(c.inputDate) ASC
      ) AS t1
      JOIN menu AS m ON m.id = t1.menuId 
    `;
    const [formattedRowsOri] = await db.query(q);

    const formattedRows = [];
    let i = 0;
    for (const row of formattedRowsOri) {
      let getIndexById = formattedRows.findIndex((obj) => obj.menuId === row.menuId);

      if (getIndexById > -1) {
        formattedRows[getIndexById]['totalAmount'] += parseInt(row.totalAmount);
        formattedRows[getIndexById]['ta'] = parseInt(row.ta) + parseInt(formattedRows[getIndexById]['ta']);
        formattedRows[getIndexById]['total'] += parseInt(row.total);
      } else {
        formattedRows.push(row);
      }

    }




    const q2 = `
      SELECT * FROM cart WHERE id = '${cartId}' and presence = 1;
    `;

    const [table] = await db.query(q2);

    res.json({
      error: false,
      table: table[0],
      items: formattedRows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};



exports.transferTable = async (req, res) => {
  const table = req.body['table'];
  const cart = req.body['cart'];
  const itemsTransfer = req.body['itemsTransfer'];
  const dailyCheckId = req.body['dailyCheckId'];
  const outletId = req.body['outletId'];

  const inputDate = today();
  const results = [];

  try {
    let cartId = table['cardId'];

    if (cartId == '') {
      const originalDate = inputDate;
      const timeToAdd = '01:01:00';

      const { hours, minutes, seconds } = parseTimeString(timeToAdd);
      const updatedDate = addTime(originalDate, hours, minutes, seconds);

      // Format hasil
      // Format hasil
      let overDue = updatedDate.toLocaleString(process.env.TO_LOCALE_STRING).replace('T', ' ').substring(0, 19);
      overDue = convertCustomDateTime(overDue.toString())


      const { insertId } = await autoNumber('cart');
      cartId = insertId;




      const [newOrder] = await db.query(
        `INSERT INTO cart (
          presence, inputDate,   outletTableMapId, 
          cover,  id, outletId, dailyCheckId, tableMapStatusId,
          startDate, endDate, overDue
          ) 
        VALUES (
          1, '${inputDate}',  ${table['outletTableMapId']}, 
          1,  '${insertId}',  ${outletId}, '${dailyCheckId}',   ${cart['tableMapStatusId']}, 
          '${inputDate}', '${inputDate}', '${overDue}'  )`
      );
      if (newOrder.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'updated' });
      }
    }

    // Detail Item
    for (const emp of itemsTransfer) {
      const { menuId, price, total } = emp;
      console.log(emp);
      if (!menuId) {
        results.push({ menuId, status: 'failed', reason: 'menuId Missing fields' });
        continue;
      }
      const l1 =
        `SELECT * FROM cart_item 
        WHERE cartId = '${cart['id']}' AND menuId = ${menuId} AND price = ${price} 
        ORDER BY id desc 
        LIMIT ${total}`;
      console.log(l1);
      const [cartDb] = await db.query(l1);

      for (const emp2 of cartDb) {
        console.log(emp2)
        const { id } = emp2;
        const q0 = `
          UPDATE cart_item SET 
            cartId = '${cartId}', 
            subgroup = 1, 
            updateDate = '${today()}'
          WHERE id = ${id}`;
        console.log(q0);
        const [result] = await db.query(q0);
        if (result.affectedRows === 0) {
          results.push({ id, status: 'not found' });
        } else {
          results.push({ id, status: 'updated' });
        }

        const q1 = `
        UPDATE cart_item_modifier SET 
          cartId = '${cartId}',  
          updateDate = '${today()}'
        WHERE cartItemId = ${id}`;
        const [result2] = await db.query(q1);
        if (result2.affectedRows === 0) {
          results.push({ id, status: 'not found' });
        } else {
          results.push({ id, status: 'updated' });
        }


        const [cart_transfer_items] = await db.query(
          `INSERT INTO cart_transfer_items (
                presence, inputDate,  outletTableMapId, outletTableMapIdNew,
                cartItemId, cartId, cartIdNew, dailyCheckId
               ) 
        VALUES (1, '${inputDate}',  ${cart['outletTableMapId']},  ${table['outletTableMapId']}, 
             ${id}, '${cart['id']}' ,'${cartId}',  '${dailyCheckId}'  )`
        );
        if (cart_transfer_items.affectedRows === 0) {
          results.push({ status: 'not found' });
        } else {
          results.push({ status: 'cart_transfer_items INSERT' });
        }

      }




    }



    res.json({
      error: false,
      cartId: cartId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.transferLog = async (req, res) => {

  try {
    const cartId = req.query.cartId;
    const q = `
      SELECT  t.*, m.name 'menu', o.tableName FROM cart_transfer_items AS t 
      JOIN cart_item AS c ON c.id = t.cartItemId
      JOIN menu AS m ON m.id = c.menuId
      JOIN outlet_table_map AS o ON o.id = t.outletTableMapId
      WHERE t.cartIdNew = '${cartId}';
    `;
    const [transferIn] = await db.query(q);

    const q2 = `
     SELECT  t.*, m.name 'menu', o.tableName FROM cart_transfer_items AS t 
      JOIN cart_item AS c ON c.id = t.cartItemId
      JOIN menu AS m ON m.id = c.menuId
      JOIN outlet_table_map AS o ON o.id = t.outletTableMapIdNew
      WHERE t.cartId = '${cartId}';
    `;
    const [transferOut] = await db.query(q2);

    const transferInData = [];
    for (let i = 0; i < transferIn.length; i++) {
      const targetId = transferIn[i]['menu'];
      console.log(targetId)
      const index = transferInData.findIndex((item) => item.menu === targetId);
      if (index == -1) {
        const temp = {
          menu: transferIn[i]['menu'],
          total: 1,
          tableName: transferIn[i]['tableName'],
          inputDate: transferIn[i]['inputDate'],
        }
        transferInData.push(temp);
      } else {
        transferInData[index]['total']++;
      }
    }


    const transferOutData = [];
    for (let i = 0; i < transferOut.length; i++) {
      const targetId = transferOut[i]['menu'];
      console.log(targetId)
      const index = transferOutData.findIndex((item) => item.menu === targetId);
      if (index == -1) {
        const temp = {
          menu: transferOut[i]['menu'],
          total: 1,
          tableName: transferOut[i]['tableName'],
          inputDate: transferOut[i]['inputDate'],
        }
        transferOutData.push(temp);
      } else {
        transferOutData[index]['total']++;
      }
    }


    res.json({
      error: false,
      transferIn: transferInData,
      transferOut: transferOutData,

    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.takeOut = async (req, res) => {
  const cart = req.body['cart'];
  const cartOrdered = req.body['cartOrdered'];

  const cartId = req.body['cartId'];

  const inputDate = today();
  const results = [];
  try {

    for (const emp of cart) {
      const { menuId, ta } = emp;

      if (!menuId) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const q = `UPDATE cart_item
            SET
              ta = ${parseInt(ta) > 0 ? 0 : 1}, 
              updateDate = '${today()}'
          WHERE menuId = ${menuId}  and cartId = '${cartId}' and sendOrder = '' `;
      const [result] = await db.query(q);
      if (result.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'cart_item updated' });
      }

    }
    const q2 = `SELECT id, ta FROM  cart_item 
      WHERE  cartId = '${cartId}' and sendOrder = '' AND presence = 1 AND void = 0 `;
    const [result] = await db.query(q2);
    for (const data of result) {

      const q = `UPDATE cart_item_modifier
            SET
              void = ${parseInt(data['ta'])}, 
              updateDate = '${today()}'
          WHERE cartItemId = ${data['id']}  and scStatus  = 1  `;



      const [result] = await db.query(q);
      if (result.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'cart_item_modifier updated' });
      }

    }

    // CARD SEND ORDER
    for (const emp of cartOrdered) {
      const { menuId, ta } = emp;

      if (!menuId) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const q = `UPDATE cart_item
            SET
              ta = ${parseInt(ta) > 0 ? 0 : 1}, 
              updateDate = '${today()}'
          WHERE menuId = ${menuId}  and cartId = '${cartId}' and sendOrder != '' `;
      const [result] = await db.query(q);
      if (result.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'cart_item updated' });
      }

    }
    const q3 = `SELECT id, ta FROM  cart_item 
      WHERE  cartId = '${cartId}' and sendOrder != '' AND presence = 1 AND void = 0 `;
    const [result3] = await db.query(q3);
    for (const data of result3) {

      const q = `UPDATE cart_item_modifier
            SET
              void = ${parseInt(data['ta'])}, 
              updateDate = '${today()}'
          WHERE cartItemId = ${data['id']}  and scStatus  = 1  `;



      const [result3] = await db.query(q);
      if (result.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'cart_item_modifier updated' });
      }

    }




    res.json({
      error: false,

    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.takeOutDetail = async (req, res) => {
  const data = req.body['cart'];
  const cartId = req.body['cartId'];

  const inputDate = today();
  const results = [];
  try {

    for (const emp of data) {
      const { id, ta } = emp;

      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const q = `UPDATE cart_item
            SET
              ta = ${parseInt(ta) > 0 ? 0 : 1}, 
              updateDate = '${today()}'
          WHERE id = ${id}  `;
      const [result] = await db.query(q);
      if (result.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'cart_item updated' });
      }

    }


    // JIKA TA maka SC harus di hapus
    const q2 = `SELECT id, ta FROM  cart_item 
      WHERE  cartId = '${cartId}'  AND presence = 1 AND void = 0 `;
    const [result] = await db.query(q2);
    for (const data of result) {

      const q = `UPDATE cart_item_modifier
            SET
              void = ${parseInt(data['ta'])}, 
              updateDate = '${today()}'
          WHERE cartItemId = ${data['id']}  and scStatus  = 1  `;



      const [result] = await db.query(q);
      if (result.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'cart_item_modifier updated' });
      }

    }


    res.json({
      error: false,

    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.mergerCheck = async (req, res) => {
  const newTable = req.body['newTable'];
  const cartId = req.body['cartId'];
  const table = req.body['table'];
  const dailyCheckId = req.body['dailyCheckId'];
  const inputDate = today();
  const results = [];
  try {


    const q1 = `UPDATE cart SET 
          void = 1,   
          close = 1,
          tableMapStatusId = 40,
          endDate = '${today()}',
          updateDate = '${today()}'
        WHERE id = '${cartId}'`;
    const [result1] = await db.query(q1);

    if (result1.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'header void cart  ' + cartId });
    }

    const q0 = `UPDATE cart SET   
          cover = ${table['cover'] + newTable['cover']}, 
          updateDate = '${today()}'
        WHERE id ='${newTable['cardId']}'`;
    const [result0] = await db.query(q0);

    if (result0.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'header other update cart updated ' + newTable['cardId'] });
    }

    const q2 = `UPDATE cart_item SET 
          cartId = '${newTable['cardId']}',
          updateDate = '${today()}'
        WHERE cartId = ${cartId}`;
    const [result2] = await db.query(q2);
    if (result2.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'cart updated' });
    }

    const q3 = `UPDATE cart_item_modifier SET 
          cartId = '${newTable['cardId']}',
          updateDate = '${today()}'
        WHERE cartId = ${cartId}`;
    const [result3] = await db.query(q3);
    if (result3.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'cart updated' });
    }

    const inputBy = 1;
    // LOG
    let q =
      `INSERT INTO cart_merge_log (
        presence, inputDate, inputBy,
        cartId, cartIdNew, 
        outletTableMapId, outletTableMapIdNew, 
        cover1, cover2,  coverNew, 
        dailyCheckId
      )
      VALUES (
        1, '${inputDate}', ${inputBy}, 
        '${cartId}',  '${newTable['cardId']}',
        '${table['outletTableMapId']}', '${newTable['outletTableMapId']}', 
        ${table['cover']}, ${newTable['cover']}, ${table['cover'] + newTable['cover']},
        '${dailyCheckId}'
      )`;
    const [resultlog] = await db.query(q);

    if (resultlog.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'cart updated' });
    }

    res.json({
      error: false,
      results: results
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getChildrenRecursive = async (parentId, db) => {
  const [children] = await db.query(`SELECT *  FROM cart_merge_log WHERE cartId = '${parentId}'`);

  // Rekursif: untuk setiap anak, cari anak-anaknya
  for (const child of children) {
    child.children = await getChildrenRecursive(child.cartIdNew, db);
  }

  return children;
};

const getAncestorRecursive = async (childId, db) => {
  // Ambil data dirinya
  const q = `SELECT m.*, t1.tableName AS 'oldTable', t2.tableName AS 'newTable'
    FROM cart_merge_log AS m
    LEFT JOIN outlet_table_map AS t1 ON t1.id = m.outletTableMapId
    LEFT JOIN outlet_table_map AS t2 ON t2.id = m.outletTableMapIdNew
  WHERE m.cartIdNew = '${childId}' `;
  const [rows] = await db.query(q);

  if (rows.length === 0) return null;

  const current = rows[0];

  // Jika tidak ada parent (sudah paling atas), stop
  if (!current.cartId) return current;

  // Ambil parent-nya
  current.parent = await getAncestorRecursive(current.cartId, db);

  return current;
};

exports.mergeLog = async (req, res) => {
  const cartId = req.query.cartId;
  try {

    if (isNaN(cartId)) {
      return res.status(400).json({ error: 'Invalid cartId ID' });
    }
    const items = await getAncestorRecursive(cartId, db);

    res.json({
      items,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
};

exports.addCustomNotes = async (req, res) => {
  const cartId = req.body['cartId'];
  const model = req.body['model'];
  const items = req.body['items'];

  const inputDate = today();
  const results = [];
  try {

    for (const emp of items) {
      const { menuId, price } = emp;

      const q = `
        SELECT * FROM cart_item 
        WHERE cartId = '${cartId}' AND menuId = ${menuId} AND price = ${price} AND presence = 1 AND void = 0 `;

      const [result] = await db.query(q);

      for (const row of result) {

        const q3 =
          `INSERT INTO cart_item_modifier (
            presence, inputDate, updateDate,  
            cartId , note, cartItemId
          )
          VALUES (
            1, '${inputDate}', '${inputDate}',  
            '${cartId}', '${model['note']}', ${row['id']}
          )`;
        const [result3] = await db.query(q3);
        if (result3.affectedRows === 0) {
          results.push({ status: 'cart_item_modifier not found', });
        } else {
          results.push({ status: 'cart_item_modifier insert', });
        }
      }
    }

    res.status(201).json({
      error: false,
      results: results,
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

exports.addCustomNotesDetail = async (req, res) => {
  const cartId = req.body['cartId'];
  const model = req.body['model'];
  const items = req.body['items'];

  const inputDate = today();
  const results = [];
  try {
    console.log(items)
    for (const row of items) {
      const q3 =
        `INSERT INTO cart_item_modifier (
            presence, inputDate, updateDate,  
            cartId , note, cartItemId
          )
          VALUES (
            1, '${inputDate}', '${inputDate}',  
            '${cartId}', '${model['note']}', ${row['id']}
          )`;
      const [result3] = await db.query(q3);
      if (result3.affectedRows === 0) {
        results.push({ status: 'cart_item_modifier not found', });
      } else {
        results.push({ status: 'cart_item_modifier insert', });
      }

    }

    res.status(201).json({
      error: false,
      results: results,
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};