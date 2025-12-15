const db = require('../../../config/db');

exports.index = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT id, name, lang1, lang2, lang3 
      FROM language
      Order by name ASC
    `);
 
    const data = { 
      items: rows, 
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
  
exports.postUpdate = async (req, res) => {
  const data = Array.isArray(req.body)
    ? req.body
    : req.body
    ? [req.body]
    : [];

  if (data.length === 0) {
    return res.status(400).json({ error: 'Request body should be a non-empty array' });
  }

  const results = [];

  try {
    for (const row of data) {
      if (!row || typeof row !== 'object') {
        results.push({ id: null, status: 'failed', reason: 'Invalid payload' });
        continue;
      }

      const id = row.id;
      if (!id) {
        results.push({ id: null, status: 'failed', reason: 'Missing id' });
        continue;
      }

      const params = [
        row.name ?? '',
        row.lang1 ?? '',
        row.lang2 ?? '',
        row.lang3 ?? '',
        id,
      ];

      const [result] = await db.query(
        'UPDATE language SET name = ?, lang1 = ?, lang2 = ?, lang3 = ? WHERE id = ?',
        params
      );

      if (result.affectedRows === 0) {
        results.push({ id, status: 'not found' });
      } else {
        results.push({ id, status: 'updated' });
      }
    }

    res.json({
      message: 'Batch update completed',
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};