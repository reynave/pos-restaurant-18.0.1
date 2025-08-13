const db = require('../../../config/db');
const { today, formatDateOnly } = require('../../../helpers/global');

exports.getAllData = async (req, res) => {

  const menuDepartmentId = req.query.departmentId == 'undefined' ? '' : req.query.departmentId; 

  try {

    const [rows] = await db.query(`
     SELECT m.id, m.name, m.price1, m.price2, m.price3, m.price4, m.price5,
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
      printerGroup : printerGroup,
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
      `INSERT INTO menu (presence, inputDate, name ) 
      VALUES (?, ?,?)`,
      [
        1,
        inputDate,
        model['desc1']
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
