const db = require('../config/db');
const { today, formatDateOnly } = require('../helpers/global');


exports.getAllData = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM member  
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
      `INSERT INTO member (presence, inputDate, member, name ) 
      VALUES (?, ?, ?, ?)`,
      [
        1,
        inputDate,
        model['value'],
        model['desc1'],
      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'member created',
      memberId: result.insertId
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
        `UPDATE member SET 
            member = '${emp['member'].replace(/\s{2,}/g, '')}',   
            name = '${emp['name'].replace(/\s{2,}/g, ' ')}',   
            pharea1 = '${emp['pharea1']}',    
            phone1 = '${emp['phone1']}',    
            phone2 = '${emp['phone2']}',    
            phone3 = '${emp['phone3']}',    
            addr1 = '${emp['addr1']}',    
            city = '${emp['city']}',    
          fax = '${emp['fax']}',    
          state = '${emp['state']}',    
          zip = '${emp['zip']}',    
          deliaddr1 = '${emp['deliaddr1']}',    
         deliaddr2 = '${emp['deliaddr2']}',    
         dob = '${emp['dob']}',    
          sex = '${emp['sex']}',    
         socialid = '${emp['socialid']}',    
         email = '${emp['email']}',    
          joindate = '${emp['joindate']}',    
          mclass = '${emp['mclass']}',    
          mtype = '${emp['mtype']}',    
          status = '${emp['status']}',    
         memo1 = '${emp['memo1']}',    
         autodisc = '${emp['autodisc']}',    
         active = '${emp['active']}',    
        empid = '${emp['empid']}',    
         costno = '${emp['costno']}',    
           nodeduct = '${emp['nodeduct']}',    
      
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
      const { id, checkbox, member } = emp;
    
      if (!id || !checkbox) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const newDate = new Date();

      const [result] = await db.query(
        'UPDATE member SET member = ?, presence = ?, updateDate = ? WHERE id = ?',
        ['delete-'+newDate+'-'+member,checkbox == 0 ? 1 : 0, today(), id]
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
