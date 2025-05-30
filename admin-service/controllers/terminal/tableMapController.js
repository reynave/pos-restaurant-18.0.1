const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');

exports.getAllData = async (req, res) => {
  const outletId = req.query.outletId;
  try {

    const [formattedRows] = await db.query(`
      SELECT id, outletId, desc1, null as 'maps'
      FROM outlet_floor_plan  
      WHERE presence = 1  ${!outletId ? '' : 'AND outletId = ' + outletId}
    `);

    // Loop dengan for...of agar bisa pakai await
    for (const row of formattedRows) {
      const [maps] = await db.query(`
       SELECT o.id, o.outletFloorPlandId, o.tableName, o.posY, o.posX, o.width, 
        o.height, o.capacity, r.id  AS 'cardId', r.cover, r.tableMapStatusId , r.close, s.name AS 'status'
        FROM outlet_table_map AS o
        LEFT JOIN (

          WITH ranked AS (
            SELECT *, 
            ROW_NUMBER() OVER (PARTITION BY outletTableMapId ORDER BY inputDate DESC) AS rn
            FROM cart
            WHERE close  = 0 AND presence = 1
          )
          SELECT *
          FROM ranked
          WHERE rn = 1
        ) AS r ON r.outletTableMapId = o.id
        LEFT JOIN outlet_table_map_status AS s ON s.id = r.tableMapStatusId
        WHERE o.presence = 1 AND o.outletFloorPlandId = ?
      `, [row.id]);



      // const [maps] = await db.query(`
      //   SELECT o.id, o.outletFloorPlandId,   o.tableName, o.posY, o.posX, o.width, 
      //   o.height, o.capacity, s.name as 'status', o.cover
      //   FROM outlet_table_map as o
      //   left join outlet_table_map_status as s on s.id = o.tableMapStatusId
      //   WHERE o.presence = 1 AND o.outletFloorPlandId = ?
      // `, [row.id]);

      // row.maps = maps; // tambahkan hasil ke properti maps



      row.maps = maps; // tambahkan hasil ke properti maps
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



exports.newOrder = async (req, res) => {
  const model = req.body['model'];
  const outletId = req.body['outletId'];
  const inputDate = today();
  const results = [];
  try {
    const q = `
    SELECT  count(c.close) AS 'total' 
      FROM outlet_table_map AS o
      LEFT JOIN cart AS c ON c.outletTableMapId = o.id
    WHERE  o.presence = 1 AND o.id = ${model['outletTableMapId']} AND c.presence = 1 AND c.void = 0
    `;
    const [rows] = await db.query(q);
    const total = rows[0]?.total || 0; // gunakan optional chaining biar aman
    const { insertId } = await autoNumber('cart');
    if (total == 0) {

      const [newOrder] = await db.query(
        `INSERT INTO cart (
        presence, inputDate, tableMapStatusId, outletTableMapId, 
        cover,  id, outletId,
        startDate, endDate ) 
      VALUES (1, '${inputDate}', 10, ${model['outletTableMapId']}, 
        ${model['cover']},  '${insertId}',  ${outletId}, 
        '${inputDate}', '${inputDate}'  )`
      );
      if (newOrder.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'updated' });
      }
      res.status(201).json({
        error: false,
        cardId: insertId,
        message: 'cart created',
      });

    } else {
      res.status(201).json({
        error: true,
        cardId: null,
        message: 'tables used',
      });
    }


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};




exports.postDelete = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const data = req.body;

  // res.json({
  //   body: req.body, 
  // });

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'Request body should be a non-empty array' });
  }

  const results = [];

  try {
    for (const emp of data) {
      const { id, checkbox } = emp;

      if (!id || !checkbox) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }


      const [result] = await db.query(
        'UPDATE outlet_bonus_rule SET presence = ?, updateDate = ? WHERE id = ?',
        [checkbox == 0 ? 1 : 0, today(), id]
      );



      if (result.affectedRows === 0) {
        results.push({ id, status: 'not found' });
      } else {
        results.push({ id, status: 'updated' });
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
