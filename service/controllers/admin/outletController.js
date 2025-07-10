const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');

exports.getAllData = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM outlet  
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
exports.getSelect = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT  id, name1
      FROM outlet  
      WHERE presence =1 order by name1 ASC
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
      `INSERT INTO outlet (presence, inputDate,updateDate, name1 ) 
      VALUES (?, ?, ?, ?)`,
      [
        1,
        inputDate,
        inputDate,
        model['desc1']
      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'outlet created',
      outletId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.postUpdate = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const emp = req.body;
  console.log(emp);
  // res.json({
  //   body: req.body, 
  // }); 
  const results = [];

  try {
      const id = emp['id'];
      const q = 
        `UPDATE outlet SET  
          name = '${emp['name']}',    
          priceNo = '${emp['priceNo']}',     
          descs  = '${emp['descs']}',      
          tel  = '${emp['tel']}',    
          fax  = '${emp['fax']}',     
          address  = '${emp['address']}',     
          street  = '${emp['street']}',    
          city  = '${emp['city']}',    
          country  = '${emp['country']}',     
          greeting1  = '${emp['greeting1']}',    
          greeting2  = '${emp['greeting2']}',     
          greeting3  = '${emp['greeting3']}',     
          greeting4  = '${emp['greeting4']}',     
          greeting5  = '${emp['greeting5']}',
          updateDate = '${today()}'

        WHERE id = ${id}`;
      const [result] = await db.query(q );


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
      const { date, checkbox } = emp;
      const id = date;
      if (!id || !checkbox) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }


      const [result] = await db.query(
        'UPDATE outlet SET presence = ?, updateDate = ? WHERE date = ?',
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
