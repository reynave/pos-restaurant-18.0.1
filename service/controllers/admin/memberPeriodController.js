const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');


exports.getAllData = async (req, res) => {
  try { 
    const [rows] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM member_period  
      WHERE presence =1
    `); 
    const formattedRows = rows.map(row => ({
      ...row,
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
      `INSERT INTO member_period (presence, inputDate,  desc1 ) 
      VALUES (?, ?, ?)`,
      [
        1,
        inputDate, 
        model['desc1'],
      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'member_period created',
      member_periodId: result.insertId
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
        `UPDATE member_period SET 
          desc1 = '${emp['desc1'].replace(/\s{2,}/g, '')}',    
          outlet = '${emp['outlet']}',     
          periodid = '${emp['periodid']}',      
      
          sttime = '${emp['sttime']}',      
          endtime = '${emp['endtime']}',      
          consumcnt = '${emp['consumcnt']}',      
          weekmask = '${emp['weekmask']}', 
 
          updateDate = '${today()}'

        WHERE id = '${id}'`,
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
      const { id, checkbox, member_period } = emp; 
      if (!id || !checkbox) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const newDate = new Date();

      const [result] = await db.query(
        'UPDATE member_period SET presence = ?, updateDate = ? WHERE id = ?',
        [ checkbox == 0 ? 1 : 0, today(), id]
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
