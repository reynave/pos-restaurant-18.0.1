const db = require('../config/db');
const { today, formatDateOnly } = require('../helpers/global');

exports.getAllData = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM outlet_bonus_rule  
      WHERE presence = 1
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
