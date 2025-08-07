const db = require('../../../config/db');
const { today, formatDateTime } = require('../../../helpers/global');

exports.getAllData = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT d.*, s.name as 'dailySchedule'
      FROM daily_check  AS d
      JOIN daily_schedule AS s ON s.id = d.dailyScheduleId
      WHERE d.presence = 1
    `);

    const formattedRows = rows.map(row => ({
      ...row,
      startDate: formatDateTime(row.startDate),
      closeDate: formatDateTime(row.closeDate),
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

    const [outlet] = await db.query(`
      SELECT id, name1
      FROM outlet  
      WHERE presence = 1 order by name1 ASC
    `);
  
    const data = {
      error: false,
      outlet: outlet,
      get: req.query
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
 