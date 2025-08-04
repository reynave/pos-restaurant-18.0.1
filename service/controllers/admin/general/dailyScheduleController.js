const db = require('../../../config/db');
const { today, formatDateOnly } = require('../../../helpers/global');

exports.getAllData = async (req, res) => {
  try { 
    const [rows] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM daily_schedule  
      WHERE presence = 1
    `);  
    const data = { 
      items: rows, 
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
      `INSERT INTO daily_schedule (presence, inputDate, name, status, days ) 
      VALUES (?, ?,?, ? , ? )`,
      [
        1,
        inputDate,
        model['name'],
        0,
        1
      ]
    );

    res.status(201).json({
      error: false,  
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
        `UPDATE daily_schedule SET 
          name = '${emp['name']}',   
          days = '${emp['days']}',   
          closeHour = '${emp['closeHour']}',   
         
          mon = '${emp['mon']}',  
          tue = '${emp['tue']}',  
          wed = '${emp['wed']}',  
          thu = '${emp['thu']}',  
          fri = '${emp['fri']}',  
          sat = '${emp['sat']}',  
            sun = '${emp['sun']}',  
          status = '${emp['status']}',   
          
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
        'UPDATE daily_schedule SET presence = ?, updateDate = ? WHERE id = ?',
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
