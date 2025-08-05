const db = require('../../../config/db');
const { today } = require('../../../helpers/global');


exports.getAllData = async (req, res) => {
  const discountId = req.query.discountId;
  try {


    const [formattedRows] = await db.query(`
       SELECT id as 'outletId', name , ${discountId} as 'discountId',  0 as 'checkbox'
        FROM outlet  
        WHERE presence = 1
    `);

    for (const row of formattedRows) {

      const [data] = await db.query(`
        SELECT id FROM outlet_discount
        WHERE outletId = ${row['outletId']} AND discountId = '${discountId}';
      `);

      row['checkbox'] = data.length < 1 ? 0 : 1;

    }
    const data = {
      error: false,
      items: formattedRows,
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.postUpdate = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const data = req.body['selectOutlet']; 
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
      const { outletId, checkbox, discountId } = emp;
      if (!outletId) {
        results.push({  status: 'failed', reason: 'outletId Missing fields' });
        continue;
      }

       const [result] = await db.query(
          `DELETE FROM outlet_discount
            WHERE discountId = ${discountId} AND outletId = ${outletId}`
        );

        if (result.affectedRows === 0) {
          results.push({  status: 'not found' });
        } else {
          results.push({   status: 'updated' });
        }



      if (checkbox == 1) { 
        const [result] = await db.query(
          `INSERT INTO 
            outlet_discount (discountId, outletId, inputDate ) 
            VALUES ('${discountId}', '${outletId}', '${today()}' )`
        );

        if (result.affectedRows === 0) {
          results.push({   status: 'not found' });
        } else {
          results.push({  status: 'updated' });
        }
      }
    }

    const [total] = await db.query(`
        SELECT count(ci.id) as 'total' 
        FROM outlet_discount AS ci
        JOIN outlet AS o ON o.id = ci.outletId
        WHERE ci.discountId = '${data[0]['discountId']}';
      `);


    res.json({
      message: 'Batch update completed',
      results: results,
      total :total[0]['total'],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

