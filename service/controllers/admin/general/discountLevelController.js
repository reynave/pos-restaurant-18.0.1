const db = require('../../../config/db');
const { today, formatDateOnly } = require('../../../helpers/global');


exports.getAllData = async (req, res) => {
  const discountId = req.query.discountId;
  try {


    const [formattedRows] = await db.query(`
       SELECT id as 'employeeAuthLevelId', name , ${discountId} as 'discountId',  0 as 'checkbox'
        FROM employee_auth_level  
        WHERE presence = 1
    `);

    for (const row of formattedRows) {

      const [data] = await db.query(`
        SELECT id FROM discount_level
        WHERE employeeAuthLevelId = ${row['employeeAuthLevelId']} AND discountId = '${discountId}';
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
  const data = req.body['selectAuthLevel'];
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
      const { employeeAuthLevelId, checkbox, discountId } = emp;
      if (!employeeAuthLevelId) {
        results.push({  status: 'failed', reason: 'employeeAuthLevelId Missing fields' });
        continue;
      }

       const [result] = await db.query(
          `DELETE FROM discount_level
            WHERE discountId = ${emp['discountId']} AND employeeAuthLevelId = ${emp['employeeAuthLevelId']}`
        );

        if (result.affectedRows === 0) {
          results.push({  status: 'not found' });
        } else {
          results.push({   status: 'updated' });
        }



      if (checkbox == 1) { 
        const [result] = await db.query(
          `INSERT INTO 
            discount_level (discountId, employeeAuthLevelId, inputDate ) 
            VALUES ('${emp['discountId']}', '${emp['employeeAuthLevelId']}', '${today()}' )`
        );

        if (result.affectedRows === 0) {
          results.push({   status: 'not found' });
        } else {
          results.push({  status: 'updated' });
        }
      }
    }


      const [total] = await db.query(`
            SELECT count(id) as 'total'   
            FROM discount_level
            WHERE discountId = '${data[0]['discountId']}';
          `);

    res.json({
      message: 'Batch update completed',
      results: results,
      total : total[0]['total']
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
        const [result] = await db.query(
          `INSERT INTO discount_level (
            discountId, employeeAuthLevelId, presence, inputDate
          )
          VALUES (?, ?, ?, ?)`,
          [
            emp['discountId'],
            emp['employeeAuthLevelId'],
            1,
            today()
          ]
        );

        if (result.affectedRows === 0) {
          results.push({ id, status: 'not found' });
        } else {
          results.push({ id, status: 'duplicated' });
        }
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

