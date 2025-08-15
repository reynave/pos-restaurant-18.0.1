const db = require('../../../config/db');
const { today } = require('../../../helpers/global');


exports.getAllData = async (req, res) => {
  const discountGroupId = req.query.discountGroupId == 'undefined' ? '' : req.query.discountGroupId;

  try {

    const [items] = await db.query(`
      SELECT d.*, 0 as 'checkbox',
      
(
  SELECT COUNT(ci.id)
    FROM discount_level ci
    WHERE ci.discountId = d.id
) AS 'totalDiscountLevel',

(
  SELECT COUNT(ci.id)
    FROM outlet_discount ci
    JOIN outlet AS o ON o.id = ci.outletId
    WHERE ci.discountId = d.id
) AS 'totalOutlet'

      FROM discount AS d
      WHERE d.presence =1    ${discountGroupId ? ' and allDiscountGroup = 1  or d.discountGroupId = ' + discountGroupId : ''}
    `);


    const data = {
      error: false,
      items: items,
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
      `INSERT INTO discount (
          presence, inputDate, name, 
          allDiscountGroup,
          status, discountGroupId
        ) 
      VALUES (
        1, '${inputDate}', '${model['name']}', 
        ${model['discountGroupId'] == 'a' ? 1 : 0}, 
        1,  '${model['discountGroupId'] != 'a' ? model['discountGroupId'] : ''}'
      )`

    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'discount created',
      discountId: result.insertId
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

      const [result] = await db.query(
        `UPDATE discount SET 
          allLevel = '${emp['allLevel']}',
          allOutlet = '${emp['allOutlet']}',
          allDiscountGroup = '${emp['allDiscountGroup']}',  
          discountGroupId = '${emp['discountGroupId']}',   
          maxDiscount = '${emp['maxDiscount']}',
          name = '${emp['name']}',   
          discRate = '${emp['discRate']}',   
          status = '${emp['status']}',   

          postDiscountSC = '${emp['postDiscountSC']}',   
          postDiscountTax = '${emp['postDiscountTax']}',   
          remark = '${emp['remark']}',   
        
        
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
        'UPDATE discount SET presence = ?, updateDate = ? WHERE id = ?',
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
