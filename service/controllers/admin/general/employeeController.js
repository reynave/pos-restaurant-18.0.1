const db = require('../../../config/db');
const { today, formatDateOnly } = require('../../../helpers/global');
const bcrypt = require('bcryptjs');
exports.getSelect = async (req, res) => {
  try {
    const [auth_level] = await db.query('SELECT * FROM employee_auth_level');
    // const [dept] = await db.query('SELECT * FROM employee_dept');
    //  const [order_level] = await db.query('SELECT * FROM employee_order_level');

    const data = {
      error: false,
      auth_level: auth_level,

    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getAllData = async (req, res) => {
  try {

    const authlevelId = req.query.authlevelId == 'undefined' ? '' : req.query.authlevelId;
 // const filterDept = req.query.filterDept != '' ? " AND e.empdept = " + req.query.filterDept : '';
    // const filterOrdLevel = req.query.filterOrdLevel != '' ? " AND e.ordlevel = " + req.query.filterOrdLevel : '';

    const q = `SELECT *, 0 as checkbox
    FROM employee
    WHERE presence =1    ${authlevelId ? 'and authlevelId = ' + authlevelId : ''}
    `;
    const [rows] = await db.query(q);

    const items = rows.map(row => ({
      ...row,
      birthday: formatDateOnly(row.birthday),
    }));

    const data = {
      items: items
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
    return res.status(400).json({ error: 'Missing employee ID in query' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM employee WHERE id = ?', [id]);

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


  const results = [];
  try {

  const saltRounds = 4;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(model['passwd'], salt);

    const [result] = await db.query(
      `INSERT INTO employee (
        presence, inputDate, username, 
        hash, name,  authlevelId  ) 
      VALUES (
        1, '${inputDate}', '${model['username'].replace(/\s+/g, '')}', 
        '${hash}', '${model['name']}', '${model['authlevelId']}'
      )`,
    );
    if (result.affectedRows === 0) {
      results.push({ status: 'ERROR' });
    } else {
      results.push({ status: 'INSERT INTO employee' });
    }

    res.status(201).json({
      message: 'Employee created',
      results: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Duplicate Username* and Database insert error' });
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

      // const [result] = await db.query(
      //   'UPDATE employee SET first1 = ?, last1 = ?  WHERE id = ?',
      //   [emp['first1'], emp['last1'], id]
      // );

      const [result] = await db.query(
        `UPDATE employee SET 
          authlevelId = '${emp['authlevelId']}', 
          name = '${emp['name']} ', 
          tel = '${emp['tel']} ',
          sex = '${emp['sex']} ',
          
          address = '${emp['address']} ',
          birthday = '${emp['birthday']} ', 
          sex = '${emp['sex']} ', 
          email = '${emp['email']} ',     
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
        'UPDATE employee SET presence = ? WHERE id = ?',
        [checkbox == 0 ? 1 : 0, id]
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


exports.changePassword = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const data = req.body['model'];

  const results = [];

  try {
    const { id, passwd } = data;
    console.log(data);

      const saltRounds = 4;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(passwd, salt);



    const [result] = await db.query(
      `UPDATE employee SET  
          hash = '${hash}',     
          updateDate = '${today()}' 
        WHERE id = ${id}`,
    );

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
