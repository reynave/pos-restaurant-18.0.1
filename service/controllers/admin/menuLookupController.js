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

exports.removeLookup = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const data = req.body.list;
  console.log(data);
  // res.json({
  //   body: req.body, 
  // });

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'Request body should be a non-empty array' });
  }

  const results = [];

  try {
    for (const id of data) {
      console.log(id);

      const [result] = await db.query(
        'UPDATE menu SET menuLookupId = 0, updateDate = ? WHERE id = ?',
        [today(), id]
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

exports.allItem = async (req, res) => {

  try {

    const [formattedRows] = await db.query(`
          SELECT id, desc1, '' as menu
          FROM menu_department
          WHERE presence = 1
        `);

    for (const row of formattedRows) {
      const q = `
      SELECT m.id, m.name, m.menuLookupId, l.name AS 'menuLookup', 0 as 'checkBox'
      FROM  menu  as m
      LEFT JOIN menu_lookup AS l ON l.id =  m.menuLookupId
      WHERE m.presence = 1  AND m.menuDepartmentId = ${row.id}
      ORDER BY m.name ASC
    `;
      const [menu] = await db.query(q);


      row.menu = menu; // tambahkan hasil ke properti maps
    }

    // Kirim respon JSON
    res.status(200).json({
      error: false,
      items: formattedRows,
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

exports.onSubmitLookupMenu = async (req, res) => {
  const data = req.body.items;
  const menuLookupId = req.body.menuLookupId;

  console.log(data);

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'Request body should be a non-empty array' });
  }

  const results = [];

  try {
    for (const id of data) {
      console.log(id);

      const [result] = await db.query(
        'UPDATE menu SET menuLookupId = ?, updateDate = ? WHERE id = ?',
        [menuLookupId, today(), id]
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
  const model = req.body.item;
  const inputDate = today();

  try {
    const q = `
      INSERT INTO menu_lookup (parentId, presence, inputDate, name ) 
      VALUES ( ${ model['id']}, 1, '${inputDate}','child of ${ model['name']}')` ;
    console.log(q)
    const [result] = await db.query(q);

    res.status(201).json({
      error: false, 
      message: 'menu_lookup created',
      menuId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.updateLookUp = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const data = req.body.item;
  
  console.log(data);
 
  const results = [];

  try {

    const [result] = await db.query(
      `UPDATE menu_lookup SET 
          name = '${data['name']}',    
          updateDate = '${today()}'

        WHERE id = ${data['id']}`,
    );


    if (result.affectedRows === 0) {
      results.push({   status: 'not found' });
    } else {
      results.push({  status: 'updated' });
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

exports.deleteTree = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const data = req.body.item;
  
  console.log(data);
 
  const results = [];

  try {

    const [result] = await db.query(
      `UPDATE menu_lookup SET 
          presence = 0,    
          updateDate = '${today()}' 
        WHERE id = ${data['id']}`,
    );


    if (result.affectedRows === 0) {
      results.push({   status: 'menu_lookup not found' });
    } else {
      results.push({  status: 'menu_lookup updated' });
    }
 
    const [result2] = await db.query(
      `UPDATE menu SET 
          menuLookupId = 0,    
          updateDate = '${today()}' 
        WHERE menuLookupId = ${data['id']}`,
    );


    if (result2.affectedRows === 0) {
      results.push({   status: 'menu not found' });
    } else {
      results.push({  status: 'menu updated' });
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