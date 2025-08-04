const db = require('../../../config/db');
const fs = require('fs');
const path = require('path');
const { today, formatDateOnly } = require('../../../helpers/global');


exports.getAllData = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM template_table_map  
      WHERE presence =1  
    `);

    const data = {
      error: false,
      items: rows,
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
    const q =
      `INSERT INTO template_table_map (
          presence, inputDate, 
          name, capacity,  
          width, height,  icon
        ) 
        VALUES ( 
          1, '${inputDate}',
          '${model['name']}', '${model['capacity']}', 
          '${model['width']}', '${model['height']}', '${model['image']}' 
        )`;

    console.log(q);
    const [result] = await db.query(q);

    res.status(201).json({
      result: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.postDelete = async (req, res) => {
  const data = req.body;
  const results = [];

  try {
    for (const emp of data) {
      const { id, checkbox } = emp;
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }
      if (checkbox == 1) {
        const q = `UPDATE template_table_map SET presence = 0, updateDate = '${today()}' WHERE id = ${id}`;
        const [result] = await db.query(q);
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
    res.status(500).json({ error: 'Database update error', details: err.message, body: req.body });
  }
};

exports.postUpdate = async (req, res) => {
  const data = req.body;
  const results = [];

  try {
    for (const emp of data) {
      const { id, name,  capacity , icon ,width , height } = emp;
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const q = `UPDATE template_table_map 
        SET 
          name = '${name}',  
          capacity = '${capacity}',  
          icon = '${icon}',  
          width = '${width}',  
          height = '${height}',   
          updateDate = '${today()}' 
      WHERE id = ${id}`;
 
      const [result] = await db.query(q);
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
    res.status(500).json({ error: 'Database update error', details: err.message, body: req.body });
  }
};

exports.updateImg = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const filename = req.body['filename'];
  const item = req.body['item'];


  const results = [];

  try {
 
    const [result] = await db.query(
      'UPDATE template_table_map SET icon = ?, updateDate = ? WHERE id = ?',
      [ filename , today(), item.id]
    );

    if (result.affectedRows === 0) {
      results.push({   status: 'not found' });
    } else {
      results.push({   status: 'updated' });
    } 

    res.json({ 
      results: req.body
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};