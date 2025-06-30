const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');

exports.getAllData = async (req, res) => {
  const outletId = req.query.outletId;
  try {

    const [formattedRows] = await db.query(`
      SELECT id, outletId, desc1, null as 'maps', 0 as 'checking', image
      FROM outlet_floor_plan  
      WHERE presence = 1  ${!outletId ? '' : 'AND outletId = ' + outletId}
    `);

    // Loop dengan for...of agar bisa pakai await
    for (const row of formattedRows) {
      const [maps] = await db.query(`
       SELECT o.id, o.id as 'outletTableMapId', o.outletFloorPlandId, o.tableName, o.posY, o.posX, o.width, 
        o.height, o.capacity, o.icon
        FROM outlet_table_map AS o 
        WHERE o.presence = 1 AND o.outletFloorPlandId = ?
      `, [row.id]);
      row.maps = maps;
    }


    const [cart] = await db.query(`
      SELECT c.*, s.name AS 'tableMapStatus'
      FROM cart AS c
      LEFT JOIN outlet_table_map_status AS s ON c.tableMapStatusId = s.id
      WHERE c.close  = 0 AND c.presence = 1 AND c.outletId = 15
    `);


    for (let i = 0; i < formattedRows.length; i++) {
      let checking = 0;
      for (let n = 0; n < formattedRows[i]['maps'].length; n++) {
        if (formattedRows[i]['maps'][n]['cardId'] != null) {
          checking += 1;
        }
      }
      formattedRows[i]['checking'] = checking;
    }


    formattedRows.forEach(rec => {
      rec.maps.forEach(x => {

        const index = cart.findIndex(y => y.outletTableMapId === x.outletTableMapId);

        if (index !== -1) { 

          x['close'] = cart[index]['close'];
          x['cardId'] = cart[index]['id'];
          x['totalItem'] = cart[index]['totalItem'];
          x['cover'] = cart[index]['cover']; 
          x['tableMapStatusId'] = cart[index]['tableMapStatusId'];
          x['tableMapStatus'] = cart[index]['tableMapStatus']; 
          x['grandTotal'] = cart[index]['grandTotal'];

        }else{
          x['close'] = null
          x['cardId'] = ''
          x['totalItem'] = 0;
          x['cover'] = null; 
          x['tableMapStatusId'] = null;
          x['tableMapStatus'] = null; 
          x['grandTotal'] = 0;
        }


      });
    });


    res.json({
      //  error: false,
      items: formattedRows,
      cart: cart,
      //get: req.query
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

 
exports.newOrder = async (req, res) => {
  const model = req.body['model'];
  const dailyCheckId = req.body['dailyCheckId'];

  const outletId = req.body['outletId'];
  const inputDate = today();
  const results = [];
  try {
    const q = `
    SELECT  count(c.close) AS 'total' 
      FROM outlet_table_map AS o
      LEFT JOIN cart AS c ON c.outletTableMapId = o.id
    WHERE  o.presence = 1 AND o.id = ${model['outletTableMapId']} AND c.presence = 1 AND c.void = 0
    AND c.tableMapStatusId != 20
    `;
   
    const [rows] = await db.query(q);
    const total = rows[0]?.total || 0; // gunakan optional chaining biar aman
    const { insertId } = await autoNumber('cart');
    if (total == 0) {

      const [newOrder] = await db.query(
        `INSERT INTO cart (
          presence, inputDate, tableMapStatusId, outletTableMapId, 
          cover,  id, outletId, dailyCheckId,
          startDate, endDate ) 
        VALUES (1, '${inputDate}', 10, ${model['outletTableMapId']}, 
          ${model['cover']},  '${insertId}',  ${outletId}, '${dailyCheckId}',
          '${inputDate}', '${inputDate}'  )`
      );
      if (newOrder.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'updated' });
      }
      res.status(201).json({
        error: false,
        cardId: insertId,
        message: 'cart created',
      });

    } else {
      res.status(201).json({
        error: true,
        cardId: null,
        message: 'tables used',
      });
    }


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.postDelete = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const data = req.body;

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
        'UPDATE outlet_bonus_rule SET presence = ?, updateDate = ? WHERE id = ?',
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
