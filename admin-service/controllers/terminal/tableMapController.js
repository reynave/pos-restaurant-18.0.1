const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');

exports.getAllData = async (req, res) => {
  try {

    const [formattedRows] = await db.query(`
      SELECT id, outletId, desc1, null as 'maps'
      FROM outlet_floor_plan  
      WHERE presence = 1
    `);

    // Loop dengan for...of agar bisa pakai await
    for (const row of formattedRows) {
      const [maps] = await db.query(`
        SELECT id, outletFloorPlandId,   tableName, posY, posX, width, height, capacity
        FROM outlet_table_map
        WHERE presence = 1 AND outletFloorPlandId = ?
      `, [row.id]);

      row.maps = maps; // tambahkan hasil ke properti maps
    }
 

    res.json({
      error: false,
      items: formattedRows,
      get: req.query
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getMasterData = async (req, res) => {
  try {

    const [outlet] = await db.query(`
      SELECT id, name1
      FROM outlet  
      WHERE presence = 1 order by name1 ASC
    `);

    const data = {
      error: false,
      outlet: outlet,
      get: req.query
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.newOrder = async (req, res) => {
  const model = req.body['model'];
  const inputDate = today();

  try {

    const [result] = await db.query(
      `INSERT INTO pos_table_order (presence, inputDate, statusId, outletTableMapId, cover ) 
      VALUES (?, ?, ?, ?, ? )`,
      [
        1,
        inputDate, 
        1,
        model['mapId'],
        model['cover'], 
      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'pos_table_order created',
      outlet_bonus_ruleId: result.insertId
    });

// SELECT o.id, o.outletFloorPlandId,   o.tableName, 
// o.posY, o.posX, o.width, o.height, o.capacity, t.statusId, t.inputDate

// FROM outlet_table_map AS o 

// LEFT JOIN (
	
// 	WITH ranked AS (
// 	  SELECT *, ROW_NUMBER() OVER (PARTITION BY outletTableMapId ORDER BY inputDate DESC) AS rn
// 	  FROM pos_table_order
// 	)
// 	SELECT id, outletTableMapId, statusId, inputDate
// 	FROM ranked
// 	WHERE rn = 1
// ) AS t ON t.outletTableMapId = o.id
// WHERE o.outletId = 1002


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.postCreate = async (req, res) => {
  const model = req.body['model'];
  const inputDate = today();

  try {

    const [result] = await db.query(
      `INSERT INTO outlet_bonus_rule (presence, inputDate, outletId ) 
      VALUES (?, ?,?)`,
      [
        1,
        inputDate,
        model['outletId']
      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'outlet_bonus_rule created',
      outlet_bonus_ruleId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.postUpdate = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const data = req.body;
  console.log(data);
  // res.json({
  //   body: req.body, 
  // });

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'Request body should be a non-empty array' });
  }

  const results = [];

  try {
    for (const emp of data) {
      const { id } = emp;
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const [result] = await db.query(
        `UPDATE outlet_bonus_rule SET 
          outletId = '${emp['outletId']}',   
          ruleid = '${emp['ruleid']}',    
          desc1 = '${emp['desc1']}',   
           weekmask = '${emp['weekmask']}',   
           stdate = '${emp['stdate']}',   
          enddate = '${emp['enddate']}',   
          sttime = '${emp['sttime']}',   
          endtime = '${emp['endtime']}',   
          level = '${emp['level']}',   
          plu = '${emp['plu']}',   
          type = '${emp['type']}',   
           mode = '${emp['mode']}',   
          rate = '${emp['rate']}',   
          amount = '${emp['amount']}',   
          checkamt = '${emp['checkamt']}',   
          active = '${emp['active']}',   
          discid = '${emp['discid']}',    
          
          updateDate = '${today()}'

        WHERE id = ${id}`,
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

exports.postDelete = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const data = req.body;
  console.log(data);
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
