const db = require('../../../config/db');
const { today, formatDateOnly } = require('../../../helpers/global');

exports.getAllData = async (req, res) => {

  const menuDepartmentId = req.query.departmentId == 'undefined' ? '' : req.query.departmentId;

  try {

    const [rows] = await db.query(`
     SELECT m.id, m.plu, m.name, m.price1, m.price2, m.price3, m.price4, m.price5,
      m.menuDepartmentId, m.menuCategoryId, m.menuClassId , m.menuSet, m.menuSetMinQty, l.name AS 'lookup', 
      l.id AS 'lookupId', m.printerGroupId,
      m.menuTaxScId, m.discountGroupId, m.modifierGroupId,  m.startDate, m.endDate, m.printerId,
      m.qty - ( 
          (
          SELECT COUNT(ci.id)
            FROM cart_item ci
            WHERE ci.presence = 1  
              AND ci.adjustItemsId = m.adjustItemsId AND ci.menuId = m.id
          )  +
          (
          SELECT COUNT(cim.id)
            FROM cart_item_modifier cim
            WHERE cim.presence = 1  
              AND cim.menuSetadjustItemsId = m.adjustItemsId AND cim.menuSetmenuId = m.id
          )
      )
      AS 'currentQty', 0 as 'checkbox',  m.inputDate , m.updateDate
      FROM menu AS m
      LEFT JOIN menu_lookup AS l ON l.id = m.menuLookupId 
      WHERE m.presence = 1    ${menuDepartmentId ? 'and menuDepartmentId = ' + menuDepartmentId : ''}
    `);

    const formattedRows = rows.map(row => ({
      ...row,
      startDate: formatDateOnly(row.startDate),
      endDate: formatDateOnly(row.endDate),
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

    const [category] = await db.query(`
      SELECT id, desc1
      FROM menu_category  
      WHERE presence = 1 order by desc1 ASC
    `);

    const [printerGroup] = await db.query(`
      SELECT id, name
      FROM printer_group  
      WHERE presence = 1 order by name ASC
    `);

    const [itemClass] = await db.query(`
      SELECT id, desc1
      FROM menu_class  
      WHERE presence = 1 order by desc1 ASC
    `);

    const [dept] = await db.query(`
      SELECT id, desc1
      FROM menu_department  
      WHERE presence = 1 order by desc1 ASC
    `);

    const [menuTaxSc] = await db.query(`
      SELECT  *
      FROM menu_tax_sc  
      WHERE presence = 1 
    `);
    const [discountGroup] = await db.query(`
      SELECT id, name
      FROM discount_group  
      WHERE presence = 1 order by name ASC
    `);
    const [modifierGroup] = await db.query(`
      SELECT id, name
      FROM modifier_group  
      WHERE presence = 1 order by name ASC
    `);
    const data = {
      error: false,
      category: category,
      class: itemClass,
      dept: dept,
      menuTaxSc: menuTaxSc,
      discountGroup: discountGroup,
      modifierGroup: modifierGroup,
      printerGroup: printerGroup,
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.itemsList = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT  id, name 
      FROM menu 
      WHERE presence = 1 AND menuSet = ''
      ORDER BY name ASC  
    `);
    const data = {
      error: false,
      items: rows,
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
exports.menuSetDetail = async (req, res) => {
  const menuId = req.query.menuId;


  try {

    const [rows] = await db.query(`
      SELECT *
      FROM menu_set 
      WHERE presence = 1 AND  menuId = ${menuId} 
    `);
    const data = {
      error: false,
      items: rows,
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
exports.addMenuSet = async (req, res) => {
  const menuId = req.body['menuId'];

  const inputDate = today();

  try {
    const q = `INSERT INTO menu_set (
        presence, inputDate, menuId,  minQty, maxQty 
      ) 
      VALUES (
        1, '${inputDate}' , ${menuId}, 1,1 
      )`;
    const [result] = await db.query(q);


    const a = `select * from menu_set
     where id = ${result.insertId} `;

    const [resulta] = await db.query(a);


    res.status(201).json({
      error: false,
      item: resulta[0],
      menuId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};
exports.updateMenuDetail = async (req, res) => {
  const id = req.body['id'];
  const menuSet = req.body['menuSet'];
  const item = req.body['item'];
  const date = req.body['date'];
  const results = [];
  const inputDate = today();

  try {

    const q = `UPDATE menu SET 
          menuCategoryId = ${item['menuCategoryId']},  
          menuClassId = ${item['menuClassId']},  
          menuDepartmentId = ${item['menuDepartmentId']},  
          menuSet = '${item['menuSet']}',  
          menuSetMinQty = ${item['menuSetMinQty']},  
          menuTaxScId = ${item['menuTaxScId']},  
          modifierGroupId = ${item['modifierGroupId']},  
          name = '${item['name']}',  
          price1 = ${item['price1']},  
          price2 = ${item['price2']},  
          price3 = ${item['price3']},  
          price4 = ${item['price4']},  
          price5 = ${item['price5']},   
            printerGroupId = ${item['printerGroupId']},   
          
          startDate = '${date['startDate']}',   
          endDate = '${date['endDate']}',   
          updateDate = '${today()}' 
        WHERE id = ${id}`;
    console.log(q)
    const [result] = await db.query(q);

    if (result.affectedRows === 0) {
      results.push({ id, status: 'not found' });
    } else {
      results.push({ id, status: 'updated' });
    }


    for (const emp of menuSet) {
      const { id, detailMenuId, minQty, maxQty } = emp;
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }
      const q = `UPDATE menu_set SET 
          detailMenuId = '${detailMenuId}',     
          minQty = ${minQty},   
          maxQty = ${maxQty},    
          updateDate = '${today()}' 
        WHERE id = ${id}`;
      console.log(q)
      const [result] = await db.query(q);

      if (result.affectedRows === 0) {
        results.push({ id, status: 'not found' });
      } else {
        results.push({ id, status: 'updated' });
      }
    }



    res.status(201).json({
      error: false,
      results: results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};
exports.removeMenuSet = async (req, res) => {
  const id = req.body['id'];

  const inputDate = today();

  try {
    const q = `
      UPDATE menu_set SET 
          presence  = 0,      
          updateDate = '${today()}' 
        WHERE id = ${id}`;
    console.log(q)
    const [result] = await db.query(q);

    res.status(201).json({
      error: false,
      result: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.postCreate = async (req, res) => {
  const model = req.body['model'];
  const inputDate = today();

  try {

    const [result] = await db.query(
      `INSERT INTO menu (presence, inputDate, name, plu ) 
      VALUES (?, ?,? , ?)`,
      [
        1,
        inputDate,
        model['desc1'],
        model['plu']
      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'menu created',
      menuId: result.insertId
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
        `UPDATE menu SET 
          name = '${emp['name']}',     
          price1 = ${emp['price1']},   
          price2 = ${emp['price2']},  
           price3 = ${emp['price3']},  
           price4 = ${emp['price4']},  
           price5 = ${emp['price5']},  
          plu = '${emp['plu']}',
   printerId = ${emp['printerId']},  
            printerGroupId = ${emp['printerGroupId']},   
          menuDepartmentId = ${emp['menuDepartmentId']},  
          menuCategoryId = ${emp['menuCategoryId']},  
          menuClassId = ${emp['menuClassId']},  
            
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
        'UPDATE menu SET presence = ?, updateDate = ? WHERE id = ?',
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
  // const { id, name, position, email } = req.body;
  const data = req.body;

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'Request body should be a non-empty array' });
  }

  const results = [];

  try {
    for (const emp of data) {
      const { id } = emp;


      const [rows] = await db.query(`
          SELECT * FROM menu WHERE id = ${id}   
        `);

      const q = `INSERT INTO menu (
            presence, inputDate, plu, menuSet, menuSetMinQty, name, descm, descs, menuLookupId, 
            startDate, endDate, discountGroupId, adjustItemsId, menuTaxScId, qty, sku, barcode, 
            keyword, price1, price2, price3, price4, price5, specialPrice1, specialPrice2, 
            specialPrice3, specialPrice4, specialPrice5, cost, printerId, printerGroupId, 
            itemGroupId, orderLevelGroupId, menuDepartmentId, menuCategoryId, menuClassId, 
            modifierGroupId, taxStatus, scStatus, openPrice, image, inputBy, updateBy
          ) VALUES (
            1, '${today()}', '${rows[0]['plu']}', '${rows[0]['menuSet']}', ${rows[0]['menuSetMinQty']}, 
            '${rows[0]['name']}', '${rows[0]['descm']}', '${rows[0]['descs']}', ${rows[0]['menuLookupId']}, 
            '${rows[0]['startDate']}', '${rows[0]['endDate']}', ${rows[0]['discountGroupId']}, 
            '${rows[0]['adjustItemsId']}', ${rows[0]['menuTaxScId']}, ${rows[0]['qty']}, '${rows[0]['sku']}', 
            '${rows[0]['barcode']}', '${rows[0]['keyword']}', ${rows[0]['price1']}, ${rows[0]['price2']}, 
            ${rows[0]['price3']}, ${rows[0]['price4']}, ${rows[0]['price5']}, ${rows[0]['specialPrice1']}, 
            ${rows[0]['specialPrice2']}, ${rows[0]['specialPrice3']}, ${rows[0]['specialPrice4']}, 
            ${rows[0]['specialPrice5']}, ${rows[0]['cost']}, ${rows[0]['printerId']}, ${rows[0]['printerGroupId']}, 
            '${rows[0]['itemGroupId']}', ${rows[0]['orderLevelGroupId']}, ${rows[0]['menuDepartmentId']}, 
            ${rows[0]['menuCategoryId']}, ${rows[0]['menuClassId']}, ${rows[0]['modifierGroupId']}, 
            '${rows[0]['taxStatus']}', '${rows[0]['scStatus']}', ${rows[0]['openPrice']}, '${rows[0]['image']}', 
           ' ${today()}', '${today()}'
          )`;

      const [result] = await db.query(q);

      if (result.affectedRows === 0) {
        results.push({ id, status: 'not found' });
      } else {
        results.push({ id, status: 'insert done' });


        //buatkan juga menu_set kalo dia menu set
        if (rows[0]['menuSet'] != '') {

          const [menuSet] = await db.query(`
              SELECT * FROM menu_set WHERE menuId = ${id}   and presence = 1
            `);


          for (const menuSetItem of menuSet) {
            const q2 = `INSERT INTO menu_set (
                presence, inputDate, menuId, detailMenuId, minQty, maxQty, inputBy, updateBy
              ) VALUES (
                1, '${today()}', ${result.insertId}, ${menuSetItem['detailMenuId']}, ${menuSetItem['minQty']}, ${menuSetItem['maxQty']}, 1, 1
              )`;
            const [result2] = await db.query(q2);
            if (result2.affectedRows === 0) {
              results.push({ menuSetId: menuSetItem['id'], status: 'menu_set insert failed' });
            } else {
              results.push({ menuSetId: menuSetItem['id'], status: 'menu_set insert done' });
            }
          }



        }







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
