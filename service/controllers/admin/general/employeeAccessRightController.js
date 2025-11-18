const db = require('../../../config/db');
const { today } = require('../../../helpers/global');


exports.getAllData = async (req, res) => {
  const id = req.query.id || 0;
  try {

    const [rows] = await db.query(`
     SELECT m.*, t1.moduleId , t1.authLevelId FROM module AS m 
      left JOIN (
        SELECT a.* FROM employee_access_right AS a
        LEFT JOIN module AS m ON m.id = a.moduleId
        WHERE a.authLevelId = ${id}
      ) AS t1 ON t1.moduleId = m.id 
      ORDER BY m.category ASC, m.name ASC 
    `);

    // tolong buatkan function untuk buat dari "namaSaya" jadi "Nama Saya"
    function camelCaseToTitleCase(str) {
      const result = str.replace(/([A-Z])/g, ' $1');
      return result.charAt(0).toUpperCase() + result.slice(1);
    }
    rows.forEach(row => {
      row.name = camelCaseToTitleCase(row.name);
    });

    const data = {
      items: rows,
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
      `INSERT INTO employee_auth_level (presence, inputDate, desc1  ) 
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
      message: 'employee_auth_level created',
      employee_auth_levelId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.postUpdate = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const data = req.body['items'];
  const authLevelId = req.body['authLevelId'];
   
  const today = new Date().toISOString().split('T')[0];

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'Request body should be a non-empty array' });
  }

  const results = [];

  try {
    const [result] = await db.query(
      `DELETE FROM employee_access_right WHERE authLevelId = ${authLevelId}`
    );

    for (const emp of data) {
      const { authLevelId, id } = emp;

      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }
      if (authLevelId !== null) {
        const [result] = await db.query(
          `INSERT INTO employee_access_right (
          inputDate, authLevelId, moduleId , status  ) 
        VALUES (
          '${today}', ${authLevelId}, ${id}, 1
        )`,
        );
        if (result.affectedRows === 0) {
          results.push({ status: 'ERROR' });
        } else {
          results.push({ status: 'INSERT INTO employee_access_right' });
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
      const { authlevel, checkbox } = emp;
      const id = authlevel;
      if (!id || !checkbox) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }


      const [result] = await db.query(
        'UPDATE employee_auth_level SET presence = ?, updateDate = ? WHERE authlevel = ?',
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
