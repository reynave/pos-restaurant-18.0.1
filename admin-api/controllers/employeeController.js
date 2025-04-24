const db = require('../config/db');

exports.getAllData = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM employee');

    const data  = {
      error : false,
      items : rows,
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
