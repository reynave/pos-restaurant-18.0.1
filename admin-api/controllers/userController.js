const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM employee');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
