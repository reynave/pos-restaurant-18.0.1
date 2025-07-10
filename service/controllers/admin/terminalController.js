const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');


exports.getAllData = async (req, res) => {
  const idCategory = req.query.idCategory;

  try {

    const [rows] = await db.query(`
      SELECT *
      FROM terminal  
      WHERE presence =1  
    `);

    const formattedRows = rows.map(row => ({
      ...row,
      exp: formatDateOnly(row.exp),
    }));


    const data = {
      error: false,
      items: formattedRows,
      get: req.query,
      idCategory: idCategory,
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
      const { id, priceNo } = emp;
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const [result] = await db.query(
        `UPDATE terminal SET  
          priceNo = '${priceNo}',
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
