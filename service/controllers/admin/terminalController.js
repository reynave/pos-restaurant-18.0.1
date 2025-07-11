const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');

exports.getAllData = async (req, res) => {
  const idCategory = req.query.idCategory;

  try {

    const [rows] = await db.query(`
      SELECT *, '0' as 'checkBox'
      FROM terminal  
      WHERE presence =1  
    `);

    const formattedRows = rows.map(row => ({
      ...row,
      exp: formatDateOnly(row.exp),
    }));


    const [printer] = await db.query(`
      SELECT *
      FROM printer  
      WHERE presence = 1 order by id DESC  
    `);

    const data = {
      error: false,
      items: formattedRows,
      printer: printer
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.postUpdate = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const data = req.body.items;
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
      const { id, priceNo, printerId } = emp;
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const [result] = await db.query(
        `UPDATE terminal SET  
          priceNo = '${priceNo}',
          printerId = '${printerId}',
          
          updateDate = '${today()}' 
        WHERE id = ${id}`,
      );


      if (result.affectedRows === 0) {
        results.push({ id, status: 'not found' });
      } else {
        results.push({ id, status: 'terminal updated' });
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
  const data = req.body['items'];
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
      const { id, checkBox } = emp;

      if (!id || !checkBox) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      if (checkBox == '1') {
        const q = `UPDATE terminal SET presence = 0, updateDate = '${today()}' WHERE id = ${id}`;

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
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};


exports.loadKey = async (req, res) => {

  try {
    // Tentukan path ke folder public/keylisence
    const folderPath = path.join(__dirname, '../../public/keyLicence/');

    // Baca daftar file
    const files = await fs.readdir(folderPath);

    // Filter txt saja (opsional)
    const txtFiles = files.filter(file => file.endsWith('.txt'));

    // Untuk menampung hasil decode
    const results = [];

    for (const file of txtFiles) {
      const filePath = path.join(folderPath, file);

      try {
        const content = await fs.readFile(filePath, 'utf-8');

        // JWT.decode tidak memverifikasi signature
        const decoded = jwt.decode(content);

        results.push({
          file,
          token: content,
          decoded
        });
      } catch (err) {
        console.error(`Error reading/decoding ${file}:`, err.message);
        results.push({
          file,
          error: 'Failed to read or decode'
        });
      }
    }

    // Step 2: Simpan ke database (update/insert)
    const dbResults = [];

    for (const row of results) {
      if (!row.decoded) {
        dbResults.push({ file: row.file, status: 'skip (not decoded)' });
        continue;
      }

      const terminalId = row.decoded.terminalId;
      const expired = row.decoded.expired;

      if (!terminalId) {
        dbResults.push({ file: row.file, status: 'missing terminalId in decoded' });
        continue;
      }

      // Check exist
      const [existing] = await db.query(
        `SELECT id FROM terminal WHERE terminalId = ?`,
        [terminalId]
      );

      if (existing.length > 0) {
        // Update
        await db.query(
          `UPDATE terminal SET  
              exp = ?,  
              updateDate = ?, 
              presence = 1
           WHERE terminalId = ?`,
          [expired, today(), terminalId]
        );

        dbResults.push({ file: row.file, terminalId, status: 'updated' });
      } else {
        // Insert
        await db.query(
          `INSERT INTO terminal (terminalId, presence, inputDate, exp) 
           VALUES (?, 1, ?, ?)`,
          [terminalId, today(), expired]
        );

        dbResults.push({ file: row.file, terminalId, status: 'inserted' });
      }
    }


    return res.json({
      error: false,
      results
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
};

