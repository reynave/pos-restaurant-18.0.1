const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');

exports.getAllData = async (req, res) => {
  try {

    const outletTab = [
      { name: 'Outlet Setup', href: 'outlet', icon: '<i class="bi bi-pc-display-horizontal"></i>' },
      { name: 'Floor Map', href: 'floorMap', icon: '<i class="bi bi-building"></i>', },
      { name: 'Table Map', href: 'tableMap', icon: '<i class="bi bi-map"></i>', },
      { name: 'Template Map', href: 'tableMap/template', icon: '<i class="bi bi-bookmark-star"></i>', },
      
    ]
    const [floorMap] = await db.query(
      ` SELECT id, name, 'floorMap' as 'href' , CONCAT('{"outletId":"',id,'"}')  as 'params'
      FROM outlet
      WHERE presence = 1
      order by name asc`,
    );
    outletTab[1]['children'] = floorMap;


    const [tableMap] = await db.query(
      ` SELECT id, name, 'tableMap' as 'href' , CONCAT('{"outletId":"',id,'"}')  as 'params'
      FROM outlet
      WHERE presence = 1
      order by name asc`,
    );
    outletTab[2]['children'] = tableMap;


    const menuTab = [
      { name: 'Department', href: 'menu/department', icon: '<i class="bi bi-journal-medical"></i>',children: []  },
      { name: 'Category', href: 'menu/category', icon: '<i class="bi bi-journal-bookmark"></i>',children: []  },
      { name: 'Class', href: 'menu/class', icon: '<i class="bi bi-journal-text"></i>', },
      { name: 'Item', href: 'menu/item', icon: '<i class="bi bi-fork-knife"></i>', children: [] },
      { name: 'Item Look Up', href: 'menu/lookUp', icon: '<i class="bi bi-diagram-2-fill"></i>', },

      { name: 'Modifier List', href: 'modifier/list', icon: '<i class="bi bi-diagram-2"></i>', children: [] },
      { name: 'Modifier Group', href: 'modifier/group', icon: '<i class="bi bi-collection"></i>', children: [] },
      { name: 'Modifier', href: 'modifier/', icon: '<i class="bi bi-journal-text"></i>', }, 
    ]

    const [department] = await db.query(
      ` SELECT id, desc1 as 'name' ,  'menu/item/'  as 'href' ,  
     CONCAT('{"departmentId":"',id,'"}')  as 'params'
        FROM  menu_department WHERE presence = 1`,
    );
    menuTab[0]['children'] = department;


    const [category] = await db.query(
      ` SELECT id, desc1 as 'name' ,  'menu/item/'  as 'href' ,  
     CONCAT('{"departmentId":"',id,'"}')  as 'params'
        FROM  menu_category WHERE presence = 1`,
    );
    menuTab[1]['children'] = category;
 

    const [modifier_list] = await db.query(
      ` SELECT id, name  ,  'modifier/'  as 'href' ,  
     CONCAT('{"modifierListId":"',id,'"}')  as 'params'
        FROM  modifier_list WHERE presence = 1`,
    ); 
    menuTab[5]['children'] = modifier_list;

     const [modifier_group] = await db.query(
      ` SELECT id, name  ,  'modifier/'  as 'href' ,  
     CONCAT('{"modifierListId":"',id,'"}')  as 'params'
        FROM  modifier_group WHERE presence = 1`,
    ); 
    menuTab[6]['children'] = modifier_group;

    const stationTab = [
      {
        name: 'Terminal', href: 'workStation/terminal', icon: '<i class="bi bi-display"></i>',

      },


      {
        name: 'Printer', href: 'workStation/printer', icon: '<i class="bi bi-printer"></i>',
      },
    ];


    const data = {
      error: false,
      menuTab: menuTab,
      outletTab: outletTab,
      stationTab: stationTab,

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
      `INSERT INTO check_cash_type (presence, inputDate, desc1, value ) 
      VALUES (?, ?, ?, ?)`,
      [
        1,
        inputDate,
        model['desc1'],
        model['value']
      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'check_cash_type created',
      check_cash_typeId: result.insertId
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
      const { cashid } = emp;
      const id = cashid;
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const [result] = await db.query(
        `UPDATE check_cash_type SET 
          desc1 = '${emp['desc1']}',   
          value = '${emp['value']}',    
          
          updateDate = '${today()}'

        WHERE cashid = ${id}`,
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
      const { cashid, checkbox } = emp;

      const id = cashid;
      if (!id || !checkbox) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }


      const [result] = await db.query(
        'UPDATE check_cash_type SET presence = ?, updateDate = ? WHERE cashid = ?',
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
