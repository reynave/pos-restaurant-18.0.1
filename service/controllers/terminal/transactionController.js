const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const { cart } = require('../../helpers/bill');
 
exports.getAllData = async (req, res) => {
  const outletId = req.query.outletId;

  try {

    const [formattedRows] = await db.query(`

            SELECT c.*, o.name AS 'outlet' , m.tableName, '' as paymentType, s.name as 'status'
            FROM cart AS c
            JOIN outlet AS o ON o.id = c.outletId 
            JOIN outlet_table_map AS m ON m.id = c.outletTableMapId
            left join outlet_table_map_status as s on s.id = c.tableMapStatusId
            WHERE c.presence = 1 and c.close = 1    ${outletId ? 'and c.outletId = ' + outletId : ''}
            order BY c.id DESC 
            limit 200
 
        `);

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
       ROW_NUMBER() OVER (ORDER BY i.inputDate ASC, i.sendOrder ASC) AS no,
       i.id, 0 as 'cartItemModifierId',  i.sendOrder, m.name, i.price,
        c.desc1 AS 'category', d.desc1 AS 'department', i.inputDate
       
      from cart_item  AS i
      JOIN menu AS m ON m.id = i.menuId
      LEFT JOIN menu_category AS c ON c.id = i.menuCategoryId
      LEFT JOIN menu_department AS d ON d.id = i.menuDepartmentId
      WHERE i.cartId =  '${id}'  and i.presence = 1 and i.void = 0
      order by i.inputDate ASC, i.sendOrder ASC
       `;
    const [cartItem] = await db.query(q2);
    const items = [];
    for (const row of cartItem) {
      items.push(row);

      const q2 = `
        -- modifier
        SELECT  c.cartItemId as 'id',  c.id 'cartItemModifierId' , c.sendOrder,   
        m.descl AS 'name', c.price,
        0 AS 'applyDiscount', 0 AS 'rate', c.inputDate
        FROM cart_item_modifier AS c
        JOIN modifier AS m ON m.id = c.modifierId
        WHERE c.cartItemId = ${row['id']}
        AND c.presence = 1 AND c.void = 0  
        
        UNION
        -- applyDiscount
        SELECT c.cartItemId as 'id',  c.id 'cartItemModifierId' , c.sendOrder,
        d.name , c.price,
        c.applyDiscount , 0 AS 'rate' , c.inputDate
        FROM cart_item_modifier AS c
        JOIN check_disc_type AS d ON d.id = c.applyDiscount
        WHERE c.cartItemId =  ${row['id']}
        AND c.presence = 1 AND c.void = 0  

        UNION
        -- SC
        SELECT c.cartItemId as 'id',  c.id 'cartItemModifierId' , c.sendOrder,
        d.name , c.price,
        0 AS 'applyDiscount', c.scRate  AS 'rate' , c.inputDate
        FROM cart_item_modifier AS c
        JOIN check_sc_type AS d ON d.id = c.menuTaxScId
        WHERE c.cartItemId =  ${row['id']}
        AND c.presence = 1 AND c.void = 0  AND c.scStatus != 0   

        UNION
        -- TAX
        SELECT c.cartItemId as 'id',  c.id 'cartItemModifierId' , c.sendOrder,
        d.name , c.price,
        0 AS 'applyDiscount', c.taxRate AS 'rate' , c.inputDate
        FROM cart_item_modifier AS c
        JOIN check_tax_type AS d ON d.id = c.menuTaxScId
        WHERE c.cartItemId =  ${row['id']}
        AND c.presence = 1 AND c.void = 0  AND c.taxStatus != 0;

       `;
      const [cartItem] = await db.query(q2);

      cartItem.forEach(element => {
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

  const cartId = req.body['id'];
  const results = [];

  try {

    const [result] = await db.query(
      `INSERT INTO cart_copy_bill (
        presence, inputDate,  updateDate,
        cartId    ) 
      VALUES (1, '${today()}',  '${today()}',
        '${cartId}'
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

