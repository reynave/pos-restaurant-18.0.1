const db = require('../../../config/db');
const { today, formatDateTime } = require('../../../helpers/global');

exports.getAllData = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT t.* , e.name, e.username, l.name AS 'authlevel'
      FROM employee_token AS t
      JOIN employee AS e ON e.id = t.employeeId
      JOIN employee_auth_level AS l ON l.id = e.authlevelId
    `);

    const formattedRows = rows.map(row => ({
      ...row,
      inputDate: formatDateTime(row.inputDate),
      updateDate: formatDateTime(row.updateDate),
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
 