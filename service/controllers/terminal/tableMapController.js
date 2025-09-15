const db = require('../../config/db');
const { headerUserId, today, convertCustomDateTime, parseTimeString, addTime } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');

exports.getAllData = async (req, res) => {
  const outletId = req.query.outletId;
  try {

    const [formattedRows] = await db.query(`
      SELECT id, outletId, desc1, '' as 'maps', 0 as 'checking', image
      FROM outlet_floor_plan  
      WHERE presence = 1  ${!outletId ? '' : 'AND outletId = ' + outletId}
    `);

    for (const row of formattedRows) {
      const [maps] = await db.query(`
       SELECT o.id, o.id as 'outletTableMapId', o.outletFloorPlandId, o.tableName, o.posY, o.posX, o.width, 
        o.height, o.capacity, o.icon, 0 as active, t.name as 'outlet', t.overdue
        FROM outlet_table_map AS o 
        LEFT JOIN outlet as t on t.id = o.outletId
        WHERE o.presence = 1 AND o.outletFloorPlandId = ?
      `, [row.id]);
      row.maps = maps;
    }

    const [cart] = await db.query(`
      SELECT 
        c.*, s.name AS 'tableMapStatus',  
        TIMESTAMPDIFF(MINUTE,  overDue, NOW()) AS overdueMinute,
        s.bgn, s.color, c.lockBy
      FROM cart AS c
      LEFT JOIN outlet_table_map_status AS s ON c.tableMapStatusId = s.id 
      WHERE c.close  = 0 AND c.presence = 1 AND c.outletId = ${outletId}
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

    const [overdueClass] = await db.query(`
      SELECT *
      FROM outlet_table_map_status  
      WHERE  id = 30
    `);
    const [avaiableClass] = await db.query(`
      SELECT *
      FROM outlet_table_map_status  
      WHERE  id = 1
    `);

    const [statusMap] = await db.query(`
      SELECT *
      FROM outlet_table_map_status  
      WHERE  showOnUser = 1 order by id desc
    `);

    formattedRows.forEach(rec => {
      rec.maps.forEach(x => {

        const index = cart.findIndex(y => y.outletTableMapId === x.outletTableMapId);

        if (index !== -1) {

          x['close'] = cart[index]['close'];
          x['cardId'] = cart[index]['id'];
          x['totalItem'] = cart[index]['totalItem'];
          x['cover'] = cart[index]['cover'];
          x['lockBy'] = cart[index]['lockBy'] ? cart[index]['lockBy'] : '';


          if (cart[index]['overdueMinute'] > 0) {

            x['bgn'] = overdueClass[0]['bgn'];
            x['tableMapStatusId'] = overdueClass[0]['id'];
            x['tableMapStatus'] = overdueClass[0]['name'];
          } else {
            x['bgn'] = cart[index]['bgn'];
            x['tableMapStatusId'] = cart[index]['tableMapStatusId'];
            x['tableMapStatus'] = cart[index]['tableMapStatus'];
          }

          x['grandTotal'] = cart[index]['grandTotal'];
          x['overdueMinute'] = cart[index]['overdueMinute'];

        } else {
          x['close'] = null
          x['cardId'] = ''
          x['totalItem'] = 0;
          x['cover'] = null;
          x['bgn'] = avaiableClass[0]['bgn'];
          x['tableMapStatusId'] = avaiableClass[0]['id'];
          x['tableMapStatus'] = avaiableClass[0]['name'];
          x['grandTotal'] = 0;
          x['overdueMinute'] = 0;
        }


      });
    });


    res.json({
      //  error: false,
      items: formattedRows,
      cart: cart,
      statusMap: statusMap,
      //get: req.query
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.tableDetail = async (req, res) => {
  const cartId = req.query.cartId;
  try {
    const q = `
    SELECT SUM(total) AS 'total', sum(qty) AS 'qty'  FROM (
      SELECT sum(price) AS 'total', count(id) AS 'qty' 
      FROM cart_item WHERE cartId = '${cartId}' AND presence =1 AND void = 0
      UNION
      SELECT sum(price) AS 'total', 0 AS 'qty' 
      FROM cart_item_modifier WHERE cartId = '${cartId}' AND presence =1 AND void = 0
    ) AS a
    `;
    const [cart] = await db.query(q);

    const q2 = `
      SELECT c.*, e.name as 'employee', s.*,
       TIMESTAMPDIFF(MINUTE,  c.overDue, NOW()) AS overdueMinute
      FROM cart as c 
        LEFT JOIN employee as e on e.id = c.inputBy
        LEFT JOIN outlet_table_map_status AS s ON s.id = c.tableMapStatusId 
      WHERE c.id = '${cartId}' AND  c.presence = 1 
    `;
    const [detail] = await db.query(q2);


    if (detail.length) {
      if (detail[0]['overdueMinute'] > 0) {
        const [overdueClass] = await db.query(`
          SELECT *
          FROM outlet_table_map_status  
          WHERE  id = 30
        `);

        detail[0]['outletTableMapId'] = overdueClass[0]['id'];
        detail[0]['tableMapStatus'] = overdueClass[0]['name'];
        detail[0]['bgn'] = overdueClass[0]['bgn'];
        detail[0]['color'] = overdueClass[0]['color'];

      }
    }


    res.status(201).json({
      error: false,
      cart: cart[0],
      detail: detail.length ? detail[0] : {}
    });



  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.newOrder = async (req, res) => {
  const model = req.body['model'];
  const dailyCheckId = req.body['dailyCheckId'];
  const terminalId = req.body['terminalId'];

  const outletId = req.body['outletId'];
  const inputDate = today();
  const results = [];
  const userId = headerUserId(req);
  try {
    const q = `
    SELECT  count(c.close) AS 'total' 
      FROM outlet_table_map AS o
      LEFT JOIN cart AS c ON c.outletTableMapId = o.id
    WHERE  o.presence = 1 AND o.id = ${model['outletTableMapId']} AND c.presence = 1 AND c.void = 0
    AND c.tableMapStatusId != 20 AND c.dailyCheckId = '${dailyCheckId}';
    `;
    console.log(q);
    const [rows] = await db.query(q);
    const total = rows[0]?.total || 0; // gunakan optional chaining biar aman
    const { insertId } = await autoNumber('order');

    const originalDate = inputDate;


    const [outlet] = await db.query(`SELECT overDue FROM outlet   WHERE  id = ${outletId}`);
    const timeToAdd = outlet[0]['overDue'];

    const { hours, minutes, seconds } = parseTimeString(timeToAdd);
    const updatedDate = addTime(originalDate, hours, minutes, seconds);

    // Format hasil
    let overDue = updatedDate.toLocaleString(process.env.TO_LOCALE_STRING).replace('T', ' ').substring(0, 19);
    overDue = convertCustomDateTime(overDue.toString())
    console.log(overDue); // Output: 2025-07-22 17:03:38

    if (total == 0) {
      const a = `INSERT INTO cart (
          presence, inputDate, tableMapStatusId, outletTableMapId, 
          cover,  id, outletId, dailyCheckId,
          lockBy,
          startDate, endDate, overDue, 
          updateBy, inputBy
        ) 
        VALUES (
        1, '${inputDate}', 10, ${model['outletTableMapId']}, 
          ${model['cover']},  '${insertId}',  ${outletId}, '${dailyCheckId}', 
          '${terminalId}',
          '${inputDate}', '${inputDate}' , '${overDue}', 
          ${userId}, ${userId})`;
      console.log(a)
      const [newOrder] = await db.query(a);
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
  const userId = headerUserId(req);
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
        'UPDATE outlet_bonus_rule SET presence = ?, updateDate = ?, updateBy = ? WHERE id = ?',
        [checkbox == 0 ? 1 : 0, today(), userId, id]
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
