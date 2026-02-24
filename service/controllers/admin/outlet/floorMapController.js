const db = require('../../../config/db');
const fs = require('fs');
const path = require('path');
const { today, formatDateOnly } = require('../../../helpers/global');

exports.getAllData = async (req, res) => {
  const id = req.query.id == 'undefined' ? '' : req.query.id;


  try {

    const [rows] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM outlet_floor_plan  
      WHERE presence =1  ${id ? 'and outletId = ' + id : ''}
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

exports.postCreate = async (req, res) => {
  const model = req.body['model'];
  const inputDate = today();

  try { 
    const [result] = await db.query(
      `INSERT INTO outlet_floor_plan (presence, inputDate, desc1, outletId,  image ) 
      VALUES (?, ?, ?, ?, ? )`,
      [
        1,
        inputDate,
        model['desc1'],
        model['value'],
        model['image'], 
      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'outlet_floor_plan created',
      outlet_floor_planId: result.insertId
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
      console.log(emp);
      const [result] = await db.query(
        `UPDATE outlet_floor_plan SET 
          desc1 = '${emp['desc1']}',   
           outletId = '${emp['outletId']}',    
          
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
        'UPDATE outlet_floor_plan SET presence = ?, updateDate = ? WHERE id = ?',
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

exports.getIcon = (req, res) => {
  const imagesFolder = path.join(__dirname, '../../../public/floorMap/floor');
  try {
    fs.readdir(imagesFolder, (err, files) => {
      if (err) {
        console.error('Gagal membaca folder:', err);
        return;
      }

      // Filter hanya file gambar (optional)
      const imageFiles = files.filter(file =>
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
      );

      // Buat array JSON
      const imageData = imageFiles.map(file => ({
        filename: file,
      }));



      const data = {
        items: imageData,
      }

      res.json(data);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.updateImg = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const filename = req.body['filename'];
  const item = req.body['item'];


  const results = [];

  try {


    const [result] = await db.query(
      'UPDATE outlet_floor_plan SET image = ?, updateDate = ? WHERE id = ?',
      [ filename , today(), item.id]
    );

    if (result.affectedRows === 0) {
      results.push({   status: 'not found' });
    } else {
      results.push({   status: 'updated' });
    } 

    res.json({
      message: 'Batch update completed',
      results: req.body
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
          `INSERT INTO outlet_floor_plan (
            presence, inputDate, outletId, desc1, image, sorting
          )
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            1,
            today(),
            emp['outletId'],
            emp['desc1'],
            emp['image'],
            emp['sorting']
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