const db = require('../../config/db');
const { today, formatDateOnly, headerUserId } = require('../../helpers/global');
const { cart } = require('../../helpers/bill');

exports.getAllData = async (req, res) => {
  const outletId = req.query.outletId;
  const dailyCheckId = req.query.dailyCheckId;
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  try {
    const q = `
      SELECT 
        c.id, c.startDate, c.endDate, c.outletId, c.cover,  t.tableName,
        c.tableMapStatusId, s.name AS 'status', s.id as 'statusId',  c.grandTotal,   e.name AS 'cashier'
      FROM cart AS c
      LEFT JOIN employee AS e  ON e.id = c.closeBy
      LEFT JOIN outlet_table_map AS t ON  t.id = c.outletTableMapId
      LEFT JOIN outlet_table_map_status AS s ON s.id = c.tableMapStatusId
      WHERE c.presence = 1  AND c.close = 1 AND s.id = 20
      ${startDate != '' ? '--' : ''} AND c.dailyCheckId = '${dailyCheckId}'
      ${startDate != '' ? '' : '--'}    AND (c.startDate >= '${startDate}' AND c.endDate <= '${endDate} 23:59:55');
    `;

    const [formattedRows] = await db.query(q);

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

exports.detail = async (req, res) => {

  try {
    const id = req.query.id;

    const q = `
        select * from cart where id = '${id}'
       `;
    const [cart] = await db.query(q);

    const q2 = `
       SELECT 
        ROW_NUMBER() OVER (ORDER BY i.inputDate ASC, i.sendOrder ASC) AS no, i.void,
        i.id, 0 as 'cartItemModifierId',  i.sendOrder, m.name, i.price,
        c.desc1 AS 'category', d.desc1 AS 'department', i.inputDate 
        FROM cart_item  AS i
          JOIN menu AS m ON m.id = i.menuId
          LEFT JOIN menu_category AS c ON c.id = i.menuCategoryId
          LEFT JOIN menu_department AS d ON d.id = i.menuDepartmentId
        WHERE i.cartId =  '${id}'  and i.presence = 1  and i.sendOrder != ''
        ORDER BY i.inputDate ASC, i.sendOrder ASC
       `;
    const [cartItem] = await db.query(q2);
    const items = [];
    for (const row of cartItem) {
      items.push(row);

      const q2 = `
  --  CUSTOM NOTES   
        SELECT    
          c.cartItemId as 'id',  c.id 'cartItemModifierId' , c.sendOrder,   c.void, 
         c.note AS 'name', c.price,
          0 AS 'applyDiscount', 0 AS 'rate', c.inputDate
        FROM cart_item_modifier AS c 
        WHERE c.cartItemId = ${row['id']}  AND c.presence = 1  AND c.note != ''


        UNION



        -- MODIFIER
        SELECT  
          c.cartItemId as 'id',  c.id 'cartItemModifierId' , c.sendOrder,   c.void, 
          m.descl AS 'name', c.price,
          0 AS 'applyDiscount', 0 AS 'rate', c.inputDate
        FROM cart_item_modifier AS c
          JOIN modifier AS m ON m.id = c.modifierId
        WHERE c.cartItemId = ${row['id']}  AND c.presence = 1  
        
        UNION
        -- applyDiscount
        SELECT 
          c.cartItemId as 'id',  c.id 'cartItemModifierId' , c.sendOrder,c.void, 
          d.name , c.price, c.applyDiscount , 0 AS 'rate' , c.inputDate
        FROM cart_item_modifier AS c
          JOIN discount AS d ON d.id = c.applyDiscount
        WHERE c.cartItemId =  ${row['id']}  AND c.presence = 1  

        UNION
        -- SC
        SELECT 
          c.cartItemId as 'id',  c.id 'cartItemModifierId' , c.sendOrder,c.void, 
          d.scNote AS 'name' , c.price,
          0 AS 'applyDiscount', c.scRate  AS 'rate' , c.inputDate
        FROM cart_item_modifier AS c
          JOIN menu_tax_sc AS d ON d.id = c.menuTaxScId
        WHERE c.cartItemId =  ${row['id']}   AND c.presence = 1   AND c.scStatus != 0   

        UNION
        -- TAX
        SELECT 
          c.cartItemId as 'id',  c.id 'cartItemModifierId' , c.sendOrder, c.void, 
          d.taxNote AS 'name' , c.price,  0 AS 'applyDiscount', c.taxRate AS 'rate' , c.inputDate
        FROM cart_item_modifier AS c
          JOIN menu_tax_sc AS d ON d.id = c.menuTaxScId
          WHERE c.cartItemId =  ${row['id']} AND c.presence = 1   AND c.taxStatus != 0;

       `;
      const [cartItemModifier] = await db.query(q2);


      cartItemModifier.forEach(element => {
        items.push(element);
      });

    }


    res.json({
      error: false,
      items: items,
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
      items: items,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.addCopyBill = async (req, res) => {
  const userId = headerUserId(req);
  const cartId = req.body['id'];
  const results = [];

  try {

    const [result] = await db.query(
      `INSERT INTO cart_copy_bill (
        presence, inputDate,  updateDate,
        cartId, updateBy, inputBy
        ) 
      VALUES (1, '${today()}',  '${today()}',
        '${cartId}', ${userId}, ${userId}
      )`
    );

    if (result.affectedRows === 0) {
      results.push({ cartId, status: 'cart_copy_bill not found' });
    } else {
      results.push({ cartId, status: 'cart_copy_bill insert' });
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


exports.voidPaid = async (req, res) => {
  const userId = headerUserId(req);
  const cartId = req.body['id'];
  const reason = req.body['reason'];
  const results = [];

  try {
    const q1 = `INSERT INTO cart_payment_void_reason (
            cartId,  reason, presence, 
            inputDate, updateDate,  
            inputBy, updateBy
        )
        VALUES (
          '${cartId}', '${reason}', 1,
          '${today()}', '${today()}', 
          ${userId}, ${userId}
        )`;
    const [result1] = await db.query(q1);
    if (result1.affectedRows === 0) {
      results.push({ status: 'not found' });
    }
    else {
      results.push({ status: 'INSERT VOID REASON inserted' });
    }

    const q = `UPDATE cart
        SET
          printBill = 0,
          paymentId = '',
          close = 0,
          tableMapStatusId = 18,
          updateBy = ${userId},
          updateDate = '${today()}'
      WHERE id = '${cartId}' `;
    const [result] = await db.query(q);

    if (result.affectedRows === 0) {
      results.push({ cartId, status: 'void not found' });
    } else {
      results.push({ cartId, status: 'void update' });
    }


    const q3 = `UPDATE cart_payment
        SET
          presence = 0,
          void = 1, 
          updateBy = ${userId},
          updateDate = '${today()}'
      WHERE cartId = '${cartId}' `;
    const [result3] = await db.query(q3);

    if (result3.affectedRows === 0) {
      results.push({ cartId, status: 'void not found' });
    } else {
      results.push({ cartId, status: 'void update' });
    }


     const b = `
      UPDATE daily_cash_balance SET 
        presence = 0, 
        updateDate = '${today()}',
        updateBy = ${userId}
      WHERE cartId = '${cartId}' `;
    const [resultb] = await db.query(b);

    if (resultb.affectedRows === 0) {
      results.push({ cartId, status: 'not found', });
    } else {
      results.push({ cartId, status: 'daily_cash_balance updated', });
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
