const db = require('../../../config/db');
const { today, formatDateTime } = require('../../../helpers/global');
const { cartHistory } = require('../../../helpers/bill');

exports.getAllData = async (req, res) => {

  const outletId = req.query.outletId == 'undefined' ? '' : req.query.outletId;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  try {
    const whereDate = startDate && endDate ? `and (c.startDate >= '${startDate} 00:00:00' AND c.endDate <= '${endDate} 23:59:59')` : '';
    
    const q = `
      SELECT c.*, o.name AS 'outlet', m.tableName
      FROM cart AS c
      LEFT JOIN outlet AS o ON o.id = c.outletId
      LEFT JOIN outlet_table_map AS m ON m.id = c.outletTableMapId
      LEFT JOIN outlet_table_map_status AS s ON s.id = c.tableMapStatusId
      WHERE c.close = 1 
        ${outletId ? 'and c.outletId = ' + outletId : ''}
        ${whereDate}
         ORDER BY c.id DESC limit 500
    `;
    console.log(q)
    const [rows] = await db.query(q);

    const formattedRows = rows.map(row => ({
      ...row,
      startDate: formatDateTime(row.startDate),
      endDate: formatDateTime(row.endDate),
    }));


    const data = {
      error: false,
      items: formattedRows,
      get: req.query,
     
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.detailGroup = async (req, res) => {
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
       SELECT ROW_NUMBER() OVER (ORDER BY m.name ASC) AS no, t1.* , m.name  ,
       c.desc1 AS 'category', d.desc1 AS 'department',  0 as 'checkbox',
       "" as 'modifier'
        FROM (
          SELECT   i.menuId, SUM( i.price) AS 'total', COUNT(i.price) AS 'qty', i.ta, i.void
          FROM cart_item i
          WHERE i.cartId =  '${id}'  and i.presence = 1  and i.sendOrder != ''
          GROUP BY i.menuId, i.ta, i.void
        ) AS t1  
      LEFT  JOIN menu AS m ON m.id = t1.menuId  
      LEFT JOIN menu_category AS c ON c.id = m.menuCategoryId
      LEFT JOIN menu_department AS d ON d.id = m.menuDepartmentId
      ORDER BY m.name ASC
       `;
    const [cartItem] = await db.query(q2);
 
    const j5 = `SELECT c.*, p.name FROM cart_payment AS c
      LEFT JOIN check_payment_type AS p ON p.id = c.checkPaymentTypeId
      WHERE c.cartId = '${id}' and c.presence = 1 `;

    const [payment] = await db.query(j5);

    const c = `SELECT *  FROM cart 
    WHERE id = '${id}' and presence = 1  and void  =0`;

    const [cart] = await db.query(c);


    res.json({
      error: false,
      cart : cart,
      cartItem: cartItem,
      header: formattedRows[0],
      payment: payment,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
exports.detail = async (req, res) => {
  const id = req.query.id;
  try {

    const [rows] = await db.query(`
      SELECT c.*, o.name AS 'outlet', m.tableName, e.name AS 'closeByName', p.name AS 'periodName'
      FROM cart AS c
      LEFT JOIN outlet AS o ON o.id = c.outletId
      LEFT JOIN outlet_table_map AS m ON m.id = c.outletTableMapId
      LEFT JOIN outlet_table_map_status AS s ON s.id = c.tableMapStatusId
      left join employee AS e ON e.id = c.closeBy
      left join period AS p ON p.id = c.periodId
      WHERE c.close = 1  and c.id = '${id}' 
    `);

    const formattedRows = rows.map(row => ({
      ...row,
      startDate: formatDateTime(row.startDate),
      endDate: formatDateTime(row.endDate),
    }));

    const q2 = `
       SELECT * FROM view_cart WHERE id = '${id}';
       `;
    const [cartItem] = await db.query(q2);
     
  
      const q3 = `
       SELECT c.* , p.name FROM cart_payment as c
       LEFT JOIN check_payment_type AS p ON p.id = c.checkPaymentTypeId
       WHERE c.cartId = '${id}' and c.presence = 1  and c.void = 0 and c.paid != 0 and c.submit = 1;
       `;
    const [payment] = await db.query(q3);

    res.json({ 
      cartItem: cartItem,
      header: formattedRows[0], 
      payment: payment
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
