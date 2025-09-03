const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const { cart } = require('../../helpers/bill');
 
exports.getAllData = async (req, res) => {
  const outletId = req.query.outletId;

  try { 
    const q = `
    SELECT 
        c.id,
        c.outletId,
        c.outletTableMapId,
        c.tableMapStatusId,
        c.presence,
        c.close,
        c.grandTotal,
        -- tambahkan kolom lain dari cart jika perlu
        o.name AS outlet, 
        m.tableName, 
        '' AS paymentType, 
        s.name AS status,
        COUNT(ci.id) AS 'totalItem',  
        c.startDate,
        c.endDate,
        c.cover
      FROM cart AS c
      JOIN outlet AS o ON o.id = c.outletId 
      JOIN outlet_table_map AS m ON m.id = c.outletTableMapId
      LEFT JOIN outlet_table_map_status AS s ON s.id = c.tableMapStatusId
      LEFT JOIN cart_item AS ci ON ci.cartId = c.id
      WHERE c.presence = 1 AND c.close = 1 AND ci.sendOrder != ''  ${outletId ? ' AND c.outletId = ' + outletId : ''} 
      GROUP BY 
        c.id, c.outletId, c.outletTableMapId, c.tableMapStatusId, c.presence, c.close,
        o.name, m.tableName, s.name, 
        c.startDate,  c.grandTotal,
        c.endDate, c.cover
      ORDER BY c.id DESC   
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
      error: false,
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

