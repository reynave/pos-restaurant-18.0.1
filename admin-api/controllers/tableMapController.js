const db = require('../config/db');
const { today, formatDateOnly } = require('../helpers/global');

exports.getAllData = async (req, res) => {
  try {
    const outletFloorPlandId = req.query.outletFloorPlandId
    const [rows] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM outlet_table_map  
      WHERE presence =1  and outletFloorPlandId = ${outletFloorPlandId}
    `);

    const formattedRows = rows.map(row => ({
      ...row,
      stdate: formatDateOnly(row.stdate),
      enddate: formatDateOnly(row.enddate),
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


exports.getMaster = async (req, res) => {
  try {

    const [floorPlan] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM outlet_floor_plan  
      WHERE presence =1 order by sorting asc
    `);
    const [templateTableMap] = await db.query(`
      SELECT * 
      FROM template_table_map  
      WHERE presence =1 order by capacity Asc
    `);


    const data = {
      error: false,
      floorPlan: floorPlan,
      templateTableMap: templateTableMap,
      get: req.query
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.postCreate = async (req, res) => {
  const model = req.body['model'];
  const inputDate = today();

  try {

    const [rows] = await db.query(`
      SELECT * 
      FROM template_table_map  
      WHERE presence =1 and id = ${model['outletFloorPlandId']}
    `);

    const templateTableMap = rows[0];

    for (let i = 0; i < model['totalTable']; i++) {
      const [result] = await db.query(
        `INSERT INTO outlet_table_map (
          presence, inputDate, 
          outletFloorPlandId, tableName, 
          posY, posX , 
          width, height, capacity
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? )`,
        [
          1, inputDate,
          model['outletFloorPlandId'], model['tableName'] + " " + (i + 1),
          10, (i + 1) * 5,
          templateTableMap['width'], templateTableMap['height'], templateTableMap['capacity']
        ]
      );
    }
    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'outlet_table_map created',
      templateTableMap: templateTableMap
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.postUpdatePosXY = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const data = req.body['tables'];
  const dataNames = req.body['tablesName'];

  console.log(data);
  // res.json({
  //   body: req.body, 
  // });


  const results = [];

  try {
    for (const emp of data) {
      const { id } = emp;
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const [result] = await db.query(
        `UPDATE outlet_table_map SET 
         
          posY = '${Math.round(emp['y'])}',   
          posX = '${Math.round(emp['x'])}',    
          
          updateDate = '${today()}'

        WHERE id = ${id}`,
      );


      if (result.affectedRows === 0) {
        results.push({ id, status: 'not found' });
      } else {
        results.push({ id, status: 'updated' });
      }
    }

    for (const emp of dataNames) {
      const { id } = emp;
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }
      const [result] = await db.query(
        `UPDATE outlet_table_map SET 
          tableName = '${emp['tableName']}', 
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
  const id = data.id;
  console.log(data);
  // res.json({
  //   body: req.body, 
  // });


  const results = [];

  try {

    const [result] = await db.query(
      'UPDATE outlet_table_map SET presence = ?, updateDate = ? WHERE id = ?',
      [0, today(), id]
    );


    if (result.affectedRows === 0) {
      results.push({ id, status: 'not found' });
    } else {
      results.push({ id, status: 'updated' });
    }


    res.json({
      message: 'Batch update completed',
      results: results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message, body: req.body });
  }
};
