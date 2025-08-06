const db = require('../../../config/db');
const { today, formatDateOnly } = require('../../../helpers/global');

exports.getAllData = async (req, res) => {
   const paymentGroupId = req.query.paymentGroupId == 'undefined' ? '' : req.query.paymentGroupId;
  try {

    const [rows] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM check_payment_type  
      WHERE presence =1   ${paymentGroupId ? 'and paymentGroupId = ' + paymentGroupId : ''}
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
      `INSERT INTO check_payment_type (presence, inputDate, desc1, payid ) 
      VALUES (?, ?, ?, ?)`,
      [
        1,
        inputDate,
        model['desc1'],
        model['payid']
      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'check_payment_type created',
      check_payment_typeId: result.insertId
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
        `UPDATE check_payment_type SET 
          desc1 = '${emp['desc1']}',   
          fcyid =  '${emp['fcyid']}', 
          havetips =  '${emp['havetips']}',
          tipsaltr =  '${emp['tipsaltr']}',
          payclass =  '${emp['payclass']}',
          paymeth =  '${emp['paymeth']}',
          maxlimit =  '${emp['maxlimit']}',
          nonsales =  '${emp['nonsales']}',
          opendrw =  '${emp['opendrw']}',
          prefix =  '${emp['prefix']}',
          paysign =  '${emp['paysign']}',
          prtvoid =  '${emp['prtvoid']}',
            reftype =  '${emp['reftype']}',
          haveccac =  '${emp['haveccac']}',
          isguitype =  '${emp['isguitype']}',
          extpath =  '${emp['extpath']}',
          discid =  '${emp['discid']}',
          paygrpid =  '${emp['paygrpid']}',

          disctype =  '${emp['disctype']}',
          drwmulti =  '${emp['drwmulti']}',
  
          
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
        'UPDATE check_payment_type SET presence = ?, updateDate = ? WHERE id = ?',
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
