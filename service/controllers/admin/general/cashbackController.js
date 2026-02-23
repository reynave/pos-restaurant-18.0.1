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

     
    const [selectOutlet] = await db.query(`
      SELECT * 
      FROM outlet   
      WHERE  presence =1
      order by name asc
    `);

    
    const [cashback_payment] = await db.query(`
      SELECT p.id, cpt.name as 'name'
      FROM cashback_payment  as p
      join check_payment_type as cpt on cpt.id = p.paymentId
      WHERE p.cashbackId = ${id} AND
       p.presence =1
    `);

    const data = {
      items: formattedRows[0], 
      selectOutlet: selectOutlet,
      payment: cashback_payment,
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.amount = async (req, res) => {
  const id = req.query.id;
  try {

    const [cashback_amount] = await db.query(`
      SELECT * , 0 as checkbox
      FROM cashback_amount  
      WHERE cashbackId = ${id} AND
      presence =1
    `);

    const data = {
      items: cashback_amount,
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
exports.addAmount = async (req, res) => {
  const inputDate = today();
  try {

    const [result] = await db.query(
      `INSERT INTO cashback_amount (presence, inputDate, cashbackId ) 
      VALUES (1, '${inputDate}', ${req.body.id})`,
    );

    res.status(201).json({
      message: 'cashback_amount created',
      cashback_amountId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.selectPaymentMethod = async (req, res) => {
  const id = req.query.id;
  try {

    const [selectPaymentMethod] = await db.query(`
      SELECT id, name , '' as 'linkToPayment'
      FROM check_payment_group   
      WHERE presence =1
      order by name asc
    `);

    for(const payment of selectPaymentMethod) {
     const q= `SELECT c.id, c.name, t1.paymentId ,
      CASE
          WHEN t1.paymentId IS NULL THEN 0
          ELSE 1
      END AS checkbox
      FROM check_payment_type AS c
      LEFT JOIN (
        SELECT p.paymentId
            FROM cashback_payment  as p
            join check_payment_type as cpt on cpt.id = p.paymentId
            WHERE p.cashbackId = ${id} AND
            p.presence =1
      ) t1 ON t1.paymentId = c.id 
      WHERE c.presence =1 AND c.paymentGroupId = ${payment.id}
      order by c.name asc
      `;

     const [selectPaymentMethod] = await db.query(q);
      payment.linkToPayment = selectPaymentMethod;
    }

    const data = {
      items: selectPaymentMethod,
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.updateDetail = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const model = req.body.model;
  const id = req.body.id;
  const date = req.body.date;

  const results = [];

  try {
    const q =  `UPDATE cashback SET 
        name = '${model['name']}',    
        description = '${model['description']}', 
        earningStartDate = '${date['earningStartDate']}', 
        earningEndDate = '${date['earningEndDate']}', 
        redeemStartDate = '${date['redeemStartDate']}', 
        redeemEndDate = '${date['redeemEndDate']}',  
        updateDate = '${today()}',
        outletId =  ${model['outletId']}, 
        
        status = '${model['status']}',
        x1 = '${model['x1']}',
        x2 = '${model['x2']}'
      WHERE id = ${id}`;
    const [result] = await db.query(q);
   
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
exports.updateAmount = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const id = req.body.id;
  const amounts = req.body.amounts;



  if (!Array.isArray(amounts) || amounts.length === 0) {
    return res.status(400).json({ error: 'Request body should be a non-empty array' });
  }

  const results = [];

  try {
    for (const emp of amounts) {
      const { id } = emp;
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const [result] = await db.query(
        `UPDATE cashback_amount SET   
          earnMax = ${emp['earnMax']},         
          cashbackMax = ${emp['cashbackMax']},     
             redeemMinAmount = ${emp['redeemMinAmount']},
          status = ${emp['status']},     
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
exports.deleteAmount = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const id = req.body.id;
  const amounts = req.body.amounts;
 
  if (!Array.isArray(amounts) || amounts.length === 0) {
    return res.status(400).json({ error: 'Request body should be a non-empty array' });
  }

  const results = [];

  try {
    for (const emp of amounts) {
      const { id } = emp;
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }
      if (emp['checkbox'] == '1') {
        const [result] = await db.query(
          `UPDATE cashback_amount SET 
            presence = 0,    
            updateDate = '${today()}'   
          WHERE id = ${id}`,
        );  
        if (result.affectedRows === 0) {
          results.push({ id, status: 'not found' });
        } else {
          results.push({ id, status: 'updated' });
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

exports.updatePaymentLink = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const id = req.body.id;
  const paymentMethods = req.body.paymentMethods;
  const inputDate = today();
  if (!Array.isArray(paymentMethods) || paymentMethods.length === 0) {
    return res.status(400).json({ error: 'Request body should be a non-empty array' });
  }

  const results = [];

  try {
    const [result] = await db.query(
        `DELETE FROM cashback_payment WHERE cashbackId = ${id} `
    );


    for (const emp of paymentMethods) {
      const { paymentId, cashbackId } = emp; 
     
      const [result] = await db.query(
        `INSERT INTO cashback_payment (paymentId, cashbackId, inputDate ) 
        VALUES (${paymentId}, ${cashbackId}, '${inputDate}')`,
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

exports.postCreate = async (req, res) => {
  const model = req.body['model'];
  const inputDate = today();

  try {

    const [result] = await db.query(
      `INSERT INTO cashback (presence, inputDate, name, description, status ) 
      VALUES (1, '${inputDate}', '${model['name']}', '${model['description']}', '${model['status']}')`, 
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'cashback created',
      id: result.insertId
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
        `UPDATE cashback SET 
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

exports.duplicate = async (req, res) => {
  const data = req.body;

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

      if (checkbox == 1) {
        // Duplicate header: cashback
        const [header] = await db.query(
          `INSERT INTO cashback (
            presence, inputDate, name, description,
            earningStartDate, earningEndDate,
            redeemStartDate, redeemEndDate,
            x1, x2, outletId, status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            1,
            today(),
            emp['name'],
            emp['description'],
            emp['earningStartDate'],
            emp['earningEndDate'],
            emp['redeemStartDate'],
            emp['redeemEndDate'],
            emp['x1'],
            emp['x2'],
            emp['outletId'],
            emp['status']
          ]
        );

        if (header.affectedRows === 0) {
          results.push({ id, status: 'not found' });
          continue;
        }

        const newCashbackId = header.insertId;

        // Duplicate detail: cashback_amount
        const [amounts] = await db.query(
          `SELECT * FROM cashback_amount WHERE cashbackId = ? AND presence = 1`,
          [id]
        );
        for (const amt of amounts) {
          await db.query(
            `INSERT INTO cashback_amount (
              cashbackId, earnMin, earnMax, cashbackMin, cashbackMax,
              redeemMinAmount, status, presence, inputDate
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              newCashbackId,
              amt['earnMin'],
              amt['earnMax'],
              amt['cashbackMin'],
              amt['cashbackMax'],
              amt['redeemMinAmount'],
              amt['status'],
              1,
              today()
            ]
          );
        }

        // Duplicate detail: cashback_payment
        const [payments] = await db.query(
          `SELECT * FROM cashback_payment WHERE cashbackId = ? AND presence = 1`,
          [id]
        );
        for (const pay of payments) {
          await db.query(
            `INSERT INTO cashback_payment (
              cashbackId, paymentId, status, presence, inputDate
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
              newCashbackId,
              pay['paymentId'],
              pay['status'],
              1,
              today()
            ]
          );
        }

        // Duplicate detail: cashback_outlet
        const [outlets] = await db.query(
          `SELECT * FROM cashback_outlet WHERE cashbackId = ? AND presence = 1`,
          [id]
        );
        for (const out of outlets) {
          await db.query(
            `INSERT INTO cashback_outlet (
              cashbackId, outletId, status, presence, inputDate
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
              newCashbackId,
              out['outletId'],
              out['status'],
              1,
              today()
            ]
          );
        }

        results.push({ id, status: 'duplicated', newId: newCashbackId });
      }
    }

    res.json({
      message: 'Batch duplicate completed',
      results: results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database duplicate error', details: err.message });
  }
};
