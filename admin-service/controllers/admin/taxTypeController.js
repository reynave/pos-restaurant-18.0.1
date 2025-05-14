const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');

exports.getAllData = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM check_tax_type  
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
      `INSERT INTO check_tax_type (presence, inputDate, desc1 ) 
      VALUES (?, ?, ?)`,
      [
        1,
        inputDate,
        model['desc1']
      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'check_tax_type created',
      check_tax_typeId: result.insertId
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
      const { taxid } = emp;
      const id = taxid;
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const [result] = await db.query(
        `UPDATE check_tax_type SET 
          desc1 = '${emp['desc1']}',   
          taxrate = '${emp['taxrate']}', 

          tier1 = '${emp['tier1']}',    
          tier2 = '${emp['tier2']}',    
          tier3 = '${emp['tier3']}',    
          tier4 = '${emp['tier4']}',    
          
          taxrate1 = '${emp['taxrate1']}',    
          taxrate2 = '${emp['taxrate2']}',    
          taxrate3 = '${emp['taxrate3']}',    
          taxrate4 = '${emp['taxrate4']}',    


          ontax1 = '${emp['ontax1']}', 
          ontax2 = '${emp['ontax2']}', 
          ontax3 = '${emp['ontax3']}', 
          ontax4 = '${emp['ontax4']}',  

          onsc1 = '${emp['onsc1']}',    
          onsc2 = '${emp['onsc2']}',    
          onsc3 = '${emp['onsc3']}',    
             
          
          updateDate = '${today()}'

        WHERE taxid = ${id}`,
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
      const { taxid, checkbox } = emp;

      const id = taxid;
      if (!id || !checkbox) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }


      const [result] = await db.query(
        'UPDATE check_tax_type SET presence = ?, updateDate = ? WHERE taxid = ?',
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
