const db = require('../../../config/db');
const { today, formatDateOnly } = require('../../../helpers/global');

exports.getAllData = async (req, res) => {

  const modifierListId = req.query.modifierListId == 'undefined' ? '' : req.query.modifierListId;
 
  try {

    const [rows] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM modifier  
      WHERE presence = 1   ${modifierListId ? 'and modifierListId = ' + modifierListId : ''}
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

exports.getMasterData = async (req, res) => {
  try {

    const [modifierList] = await db.query(`
      SELECT id, name
      FROM modifier_list  
      WHERE presence = 1 order by name ASC
    `);

    const [modifierGroup] = await db.query(`
      SELECT id, name
      FROM modifier_group  
      WHERE presence = 1 order by name ASC
    `);

    const data = {
      error: false,
      modifierList: modifierList,
      modifierGroup: modifierGroup,
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
      `INSERT INTO modifier (presence, inputDate, descl, descm, descs , modifierListId) 
      VALUES (?, ?,?,?,?,?)`,
      [
        1,
        inputDate,
        model['name'],
        model['name'],
        model['name'],
        model['modifierListId'], 
      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'modifier created',
      modifierId: result.insertId
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
      const { id, modifierListId, modifierGroupId, descl, descm, descs, printing, price1, price2, price3, price4, price5 } = emp;
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const [result] = await db.query(
        `UPDATE modifier SET 
          modifierListId = '${emp['modifierListId']}',     
          modifierGroupId = '${emp['modifierGroupId']}',     
          descl = '${emp['descl']}',
          descm = '${emp['descm']}',
          descs = '${emp['descs']}',
          printing = '${emp['printing']}',

          price1 = '${emp['price1']}',
          price2 = '${emp['price2']}',
          price3 = '${emp['price3']}',
          price4 = '${emp['price4']}',
          price5 = '${emp['price5']}',

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
        'UPDATE modifier SET presence = ?, updateDate = ? WHERE id = ?',
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
          `INSERT INTO modifier (
            presence, inputDate, modifierListId, modifierGroupId,
            descl, descm, descs, printing,
            price1, price2, price3, price4, price5
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            1,
            today(),
            emp['modifierListId'],
            emp['modifierGroupId'],
            emp['descl'],
            emp['descm'],
            emp['descs'],
            emp['printing'],
            emp['price1'],
            emp['price2'],
            emp['price3'],
            emp['price4'],
            emp['price5']
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
