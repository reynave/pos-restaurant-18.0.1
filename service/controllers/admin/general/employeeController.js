const db = require('../../../config/db');
const { today } = require('../../../helpers/global');

exports.getSelect = async (req, res) => {
  try {
    const [auth_level] = await db.query('SELECT * FROM employee_auth_level');
    const [dept] = await db.query('SELECT * FROM employee_dept');
    const [order_level] = await db.query('SELECT * FROM employee_order_level');

    const data = {
      error: false,
      auth_level: auth_level,
      dept: dept,
      order_level: order_level,
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getAllData = async (req, res) => {
  try {

    const filterAuthLevel = req.query.filterAuthLevel != '' ? " AND e.authlevel = " + req.query.filterAuthLevel : '';
    const filterDept = req.query.filterDept != '' ? " AND e.empdept = " + req.query.filterDept : '';
    const filterOrdLevel = req.query.filterOrdLevel != '' ? " AND e.ordlevel = " + req.query.filterOrdLevel : '';


    const [rows] = await db.query(`SELECT e.*, 0 as 'checkbox' , 
      a.desc1 AS 'authlevelDesc', 
      d.desc1 AS 'empdeptDesc',
      o.desc1 AS 'ordlevelDesc'
    FROM employee AS e 
    LEFT JOIN employee_auth_level AS a ON e.authlevel = a.authlevel
    LEFT JOIN employee_dept AS d ON d.empdept = e.empdept 
    LEFT JOIN employee_order_level AS o ON o.ordlevel = e.ordlevel
    WHERE e.presence =1 ${filterAuthLevel} ${filterDept} ${filterOrdLevel}
    
    `);


    const data = {
      error: false,
      items: rows,
      get: req.query
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


  try {
    const [result] = await db.query(
      `INSERT INTO employee (presence, inputDate, login, passwd, name1,empdept, ordlevel, authlevel,disclevel,birthday  ) 
      VALUES (?, ?, ?,  ?, ?, ?, ?, ?, ?,?)`,
      [
        1,
        inputDate,
        model['login'],
        model['passwd'],
        model['name1'],

        model['empdept'],
        model['ordlevel'],
        model['authlevel'],
        model['disclevel'],

        model['birthday']['year'] + "-" + model['birthday']['month'] + "-" + model['birthday']['day'],

      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'Employee created',
      employeeId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error : true, note: 'Database insert error' });
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
      const { id, first1, last1 } = emp;

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
          first1 = '${emp['first1']}', 
          last1 = '${emp['last1']} ',
          name1 = '${emp['name1']} ',
          tel = '${emp['tel']} ',
          sex = '${emp['sex']} ',
          
          contact = '${emp['contact']} ',
          addr1 = '${emp['addr1']} ',
          addr2 = '${emp['addr2']} ',
          birthday = '${emp['birthday']} ',
          dob = '${emp['dob']} ',
          sex = '${emp['sex']} ',
          socialid = '${emp['socialid']} ',
          email = '${emp['email']} ',
          empdept = '${emp['empdept']} ',
          authlevel = '${emp['authlevel']} ',
          ordlevel = '${emp['ordlevel']} ',
          disclevel = '${emp['disclevel']} ',
          actdate = '${emp['actdate']} ',
          card = '${emp['card']} ',
          emptype = '${emp['emptype']} '
          

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
