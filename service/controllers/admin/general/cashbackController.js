const db = require('../../../config/db');
const { today, formatDateOnly } = require('../../../helpers/global');

exports.index = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM cashback  
      WHERE presence =1
    `);

    const formattedRows = rows.map(row => ({
      ...row,
      earningStartDate: formatDateOnly(row.earningStartDate),
      earningEndDate: formatDateOnly(row.earningEndDate),
      redeemStartDate: formatDateOnly(row.redeemStartDate),
      redeemEndDate: formatDateOnly(row.redeemEndDate),
    }));


    const data = {
      items: formattedRows,
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.detail = async (req, res) => {
  const id = req.query.id;
  try {

    const [rows] = await db.query(`
      SELECT * 
      FROM cashback  
      WHERE id = ${id} AND
      presence =1
    `);

    const formattedRows = rows.map(row => ({
      ...row,
      earningStartDate: formatDateOnly(row.earningStartDate),
      earningEndDate: formatDateOnly(row.earningEndDate),
      redeemStartDate: formatDateOnly(row.redeemStartDate),
      redeemEndDate: formatDateOnly(row.redeemEndDate),
    }));

    const [cashback_amount] = await db.query(`
      SELECT * 
      FROM cashback  
      WHERE id = ${id} AND
      presence =1
    `);

    const [cashback_outlet] = await db.query(`
      SELECT * 
      FROM cashback  
      WHERE id = ${id} AND
      presence =1
    `);
    const [cashback_payment] = await db.query(`
      SELECT * 
      FROM cashback  
      WHERE id = ${id} AND
      presence =1
    `);

    const data = {
      items: formattedRows[0],
      amount: cashback_amount,
      outlet: cashback_outlet,
      payment: cashback_payment,
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
      `INSERT INTO check_cash_type (presence, inputDate, name, value ) 
      VALUES (?, ?, ?, ?)`,
      [
        1,
        inputDate,
        model['desc1'],
        model['value']
      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'check_cash_type created',
      check_cash_typeId: result.insertId
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
        `UPDATE check_cash_type SET 
          name = '${emp['name']}',   
          value = '${emp['value']}',    
          
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
    const tables = ['cashback_outlet', 'cashback_payment', 'cashback_amount'];
    for (const emp of data) {
      const { id, checkbox } = emp;

      if (!id || !checkbox) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }
      const [result] = await db.query(
        `UPDATE cashback SET presence = ?, updateDate = ? WHERE id = ?`,
        [checkbox == 0 ? 1 : 0, today(), id]
      );
      if (result.affectedRows === 0) {
        results.push({ id, status: 'not found' });
      } else {
        results.push({ id, status: 'updated' });

        for (const table of tables) {
          await db.query(
            `UPDATE ${table} SET presence = ?, updateDate = ? WHERE cashbackId = ?`,
            [checkbox == 0 ? 1 : 0, today(), id]
          );
        }
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
