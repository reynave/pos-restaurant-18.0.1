const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');


exports.getAllData = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM special_hour  
      WHERE presence =1
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


exports.postCreate = async (req, res) => {
  const model = req.body['model'];
  const inputDate = today();

  try {
    
    const [result] = await db.query(
      `INSERT INTO special_hour (presence, inputDate, desc1, stdate, enddate ) 
      VALUES (?, ?, ?,?,?)`,
      [
        1,
        inputDate,
        model['desc1'],
        formatDateOnly(inputDate),
        formatDateOnly(inputDate),
      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'special_hour created',
      special_hourId: result.insertId
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
      const { periodid } = emp;
      const id = periodid;
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const [result] = await db.query(
        `UPDATE special_hour SET 
          desc1 = '${emp['desc1']}',   
          stdate = '${emp['stdate']}',   
          enddate = '${emp['enddate']}',   
          sttime = '${emp['sttime']}',   
          endtime = '${emp['endtime']}',   
          weekmask = '${emp['weekmask']}',   
          public = '${emp['public']}',   
          type = '${emp['type']}',   
          stremind = '${emp['stremind']}',   
          endremind = '${emp['endremind']}',   
          bkcolor = '${emp['bkcolor']}',   
          autodisc = '${emp['autodisc']}',   
          disctoold = '${emp['disctoold']}',    

          updateDate = '${today()}'

        WHERE periodid = ${id}`,
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
      const { periodid, checkbox } = emp;
      const id = periodid;
      if (!id || !checkbox) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }


      const [result] = await db.query(
        'UPDATE special_hour SET presence = ?, updateDate = ? WHERE periodid = ?',
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
