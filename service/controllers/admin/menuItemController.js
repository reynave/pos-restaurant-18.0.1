const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');

exports.getAllData = async (req, res) => {

  const menuDepartmentId = req.query.departmentId == 'undefined' ? '': req.query.departmentId;
  console.log(menuDepartmentId)
 
  try {

    const [rows] = await db.query(`
      SELECT id,name, price1, price2, price3,price4,price5,
      menuDepartmentId, menuCategoryId, menuClassId ,inputDate ,updateDate
      , 0 as 'checkbox'
      FROM menu  
      WHERE presence = 1    ${menuDepartmentId? 'and menuDepartmentId = '+menuDepartmentId:'' }
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

exports.getMasterData = async (req, res) => {
  try {

    const [category] = await db.query(`
      SELECT id, desc1
      FROM menu_category  
      WHERE presence = 1 order by desc1 ASC
    `);

    const [itemClass] = await db.query(`
      SELECT id, desc1
      FROM menu_class  
      WHERE presence = 1 order by desc1 ASC
    `);

    const [dept] = await db.query(`
      SELECT id, desc1
      FROM menu_department  
      WHERE presence = 1 order by desc1 ASC
    `);

    const data = {
      error: false,
      category: category,
      class: itemClass,
      dept: dept,
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
      `INSERT INTO menu (presence, inputDate, name ) 
      VALUES (?, ?,?)`,
      [
        1,
        inputDate,
        model['desc1']
      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'menu created',
      menuId: result.insertId
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
        `UPDATE menu SET 
          name = '${emp['name']}',     
          price1 = ${emp['price1']},   
          price2 = ${emp['price2']},  
           price3 = ${emp['price3']},  
           price4 = ${emp['price4']},  
           price5 = ${emp['price5']},  
          

          menuDepartmentId = ${emp['menuDepartmentId']},  
          menuCategoryId = ${emp['menuCategoryId']},  
          menuClassId = ${emp['menuClassId']},  
            
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
        'UPDATE menu SET presence = ?, updateDate = ? WHERE id = ?',
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
