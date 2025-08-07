const db = require('../../../config/db');
const { today, formatDateTime } = require('../../../helpers/global');
const { cartHistory } = require('../../../helpers/bill');

exports.getAllData = async (req, res) => {

  const outletId = req.query.outletId == 'undefined' ? '' : req.query.outletId;
  try {

    const [rows] = await db.query(`
      SELECT c.*, o.name AS 'outlet', m.tableName
      FROM cart AS c
      LEFT JOIN outlet AS o ON o.id = c.outletId
      LEFT JOIN outlet_table_map AS m ON m.id = c.outletTableMapId
      LEFT JOIN outlet_table_map_status AS s ON s.id = c.tableMapStatusId
      WHERE c.close = 1 
        ${outletId ? 'and c.outletId = ' + outletId : ''}
         ORDER BY c.id DESC limit 500
    `);

    const formattedRows = rows.map(row => ({
      ...row,
      startDate: formatDateTime(row.startDate),
      endDate: formatDateTime(row.endDate),
    }));


    const data = {
      error: false,
      items: formattedRows,
      get: req.query
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.detail = async (req, res) => {
  const id = req.query.id;
  try {

    const [rows] = await db.query(`
      SELECT c.*, o.name AS 'outlet', m.tableName
      FROM cart AS c
      LEFT JOIN outlet AS o ON o.id = c.outletId
      LEFT JOIN outlet_table_map AS m ON m.id = c.outletTableMapId
      LEFT JOIN outlet_table_map_status AS s ON s.id = c.tableMapStatusId
      WHERE c.close = 1  and c.id = '${id}' 
    `);

    const formattedRows = rows.map(row => ({
      ...row,
      startDate: formatDateTime(row.startDate),
      endDate: formatDateTime(row.endDate),
    }));

    const q2 = `
       SELECT 
         i.id, ROW_NUMBER() OVER (ORDER BY i.inputDate ASC, i.sendOrder ASC) AS no, i.void, m.id as 'menuId',
         0 as 'cartItemModifierId',  i.sendOrder, m.name, i.price,
        c.desc1 AS 'category', d.desc1 AS 'department', i.inputDate , '' as 'modifier'
        FROM cart_item  AS i
          JOIN menu AS m ON m.id = i.menuId
          LEFT JOIN menu_category AS c ON c.id = i.menuCategoryId
          LEFT JOIN menu_department AS d ON d.id = i.menuDepartmentId
        WHERE i.cartId =  '${id}'  and i.presence = 1  and i.sendOrder != ''
        ORDER BY i.inputDate ASC, i.sendOrder ASC
       `;
    const [cartItem] = await db.query(q2);
    const items = [];
    let i = 0;
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

      cartItem[i]['modifier'] = cartItemModifier;;
      i++;
    }



    const j = ` SELECT   c.menuTaxScId,
        d.scNote AS 'name' , sum(c.price) AS 'total'
        FROM cart_item_modifier AS c
        JOIN menu_tax_sc AS d ON d.id = c.menuTaxScId
        WHERE c.cartId =  '${id}'  AND c.presence = 1   AND c.scStatus != 0 
        AND c.void =0
        GROUP BY c.menuTaxScId,  d.scNote `;
    const [sc] = await db.query(j);

    const j2 = ` SELECT   c.menuTaxScId,
        d.taxNote AS 'name' , sum(c.price) AS 'total'
        FROM cart_item_modifier AS c
        JOIN menu_tax_sc AS d ON d.id = c.menuTaxScId
        WHERE c.cartId =  '${id}'  AND c.presence = 1   AND c.taxStatus != 0 
        AND c.void =0
        GROUP BY c.menuTaxScId,  d.scNote `;
    const [tax] = await db.query(j2);


    const j3 = `  SELECT    
 c.applyDiscount  , d.name ,  SUM(c.price) AS 'total'
FROM cart_item_modifier AS c
 JOIN discount AS d ON d.id = c.applyDiscount
WHERE c.cartId = '${id}'  AND c.presence = 1  AND c.void = 0
GROUP BY c.applyDiscount  ,  d.name `;
    const [discount] = await db.query(j3);


    const j4 = `SELECT 'modifier' as 'name', SUM(t1.price) AS 'total' FROM 
      ( 
        --  CUSTOM NOTES   
        SELECT     
          c.price 
        FROM cart_item_modifier AS c 
        WHERE c.cartId = '${id}'  AND c.presence = 1  AND c.void = 0 AND c.note != ''
        UNION 
        -- MODIFIER
        SELECT   
            c.price 
        FROM cart_item_modifier AS c
          JOIN modifier AS m ON m.id = c.modifierId
        WHERE c.cartId = '${id}'  AND c.presence = 1  AND c.void = 0
        AND c.applyDiscount = 0 AND c.menuTaxScId = 0
        ) AS t1  `;
    const [modifier] = await db.query(j4);

    res.json({
      error: false,
      cartItem: cartItem,
      header: formattedRows[0],
      sc: sc,
      tax: tax,
      discount: discount,
      modifier: modifier,
      //  items: items,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
