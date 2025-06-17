const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');

exports.getAllData = async (req, res) => {
  try {
    // Query menu_lookup data
    const q = `
      SELECT id, parentId, name , sorting
      FROM menu_lookup  
      WHERE presence = 1
      ORDER BY sorting ASC
    `;
    const [rows] = await db.query(q);

    // Utility: membangun tree dari array flat
    function buildTree(items, parentId = 0) {
      return items
        .filter(item => item.parentId === parentId)
        .map(item => ({
          ...item,
          children: buildTree(items, item.id)
        }));
    }

    // Buat tree
    const tree = buildTree(rows);

    // Kirim respon JSON
    res.status(200).json({
      error: false,
      results: tree, 
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      error: true,
      message: 'Database error',
      details: err.message,
    });
  }
};

exports.items = async (req, res) => {

  const menuLookupId = req.query.menuLookupId;
  try {
    // Query menu_lookup data
    const q = `
      SELECT  id, name,   menuLookupId, menuTaxScId, qty, adjustItemsId, 0 as 'checkBox'
      FROM menu  
      WHERE presence = 1 and menuLookupId = ${menuLookupId}
      ORDER BY id ASC
    `;
    const [rows] = await db.query(q);

    
    // Kirim respon JSON
    res.status(200).json({
      error: false,
      items: rows, 
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      error: true,
      message: 'Database error',
      details: err.message,
    });
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
          specialPrice1 = ${emp['specialPrice1']},  

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
