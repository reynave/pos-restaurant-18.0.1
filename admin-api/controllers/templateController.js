const db = require('../config/db');
const { today, formatDateOnly } = require('../helpers/global');


exports.getAllData = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM template  
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

exports.getDetail = async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: 'Missing template ID in query' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM template WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(rows[0]);
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
      `INSERT INTO template (presence, inputDate, desc1 ) 
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
      message: 'template created',
      templateId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.postUpdate = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const data = req.body; 
  // res.json({
  //   body: req.body, 
  // });

  

  const results = [];

  try {
   
      const id  = data['id']; 
      const originalStr = Buffer.from(data['message'], 'base64').toString('utf-8'); 
     // message = '${data['message']}',    
      let q = 
      `UPDATE template SET 
        message = '${originalStr}',    
        updateDate = '${today()}' 
      WHERE id = '${id}'`;
      const [result] = await db.query(q,
      );

      console.log(q);
      


      if (result.affectedRows === 0) {
        results.push({ id, status: 'not found' });
      } else {
        results.push({ id, status: 'updated' });
      }
  

    res.json({
      message: 'Batch update completed',
      results: results,
      q : q,
      data : data
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
        'UPDATE template SET presence = ?, updateDate = ? WHERE id = ?',
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
