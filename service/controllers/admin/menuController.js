const db = require('../../config/db');
const packageJson = require('./../../package.json');
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
      { name: 'Department', href: 'menu/department', icon: '<i class="bi bi-journal-medical"></i>', children: [] },
      { name: 'Category', href: 'menu/category', icon: '<i class="bi bi-journal-bookmark"></i>', children: [] },
      //   { name: 'Class', href: 'menu/class', icon: '<i class="bi bi-journal-text"></i>', },
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
    menuTab[4]['children'] = modifier_list;

    const [modifier_group] = await db.query(
      ` SELECT id, name  ,  'modifier/'  as 'href' ,  
     CONCAT('{"modifierListId":"',id,'"}')  as 'params'
        FROM  modifier_group WHERE presence = 1`,
    );
    menuTab[5]['children'] = modifier_group;

    const reportTab = [
      {
        name: 'Daily Close', href: 'report/dailyClose', icon: '<i class="bi bi-calendar-date"></i>',
      },
      {
        name: 'Transaction', href: 'report/transaction', icon: '<i class="bi bi-list-ol"></i>', children: []
      },

      {
        name: 'User Login', href: 'report/userLogin', icon: '<i class="bi bi-person-exclamation"></i>',
      },
      // {
      //   name: 'Adjustment Items', href: 'report/adjustmentItems', icon: '<i class="bi bi-box-seam"></i>',
      // }, 
    ];

    const generalTab = [
      {
        name: 'Employees', href: 'employee', icon: '<i class="bi bi-person-vcard"></i> ',
        children: [
          { name: 'Auth Level', href: 'employee/authLevel', icon: '<i class="bi bi-key"></i>', children: [] },
        ]
      },

      {
        name: 'Daily Schedule', href: 'dailySchedule', icon: '<i class="bi bi-calendar-week"></i>',
      },

      {
        name: 'Discount', href: 'discount', icon: '<i class="bi bi-percent"></i>',
        children: [
          { name: 'Discount Group', href: 'discount/discGroup', icon: '<i class="bi bi-journals"></i>', children: [] },
          //   { name: 'Discount Level', href: 'discount/discLevel', icon: '<i class="bi bi-diagram-2-fill"></i>' },
        ]
      },

      {
        name: 'Payment', href: '', icon: '<i class="bi bi-cash-coin"></i>',
        children: [
          { name: 'Payment Group', href: 'payment/paymentGroup', icon: '<i class="bi bi-collection"></i>', children: [] }, //check_payment_group
          { name: 'Payment Type', href: 'payment/paymentType', icon: '<i class="bi bi-credit-card"></i>' }, //check_payment_type
          { name: 'Currency', href: 'payment/foreignCurrency', icon: '<i class="bi bi-currency-exchange"></i>' },
          { name: 'Cash Type', href: 'payment/cashType', icon: '<i class="bi bi-cash-stack"></i>' },
          { name: 'Tax & Service Charge', href: 'payment/taxType', icon: '<i class="bi bi-bank"></i>' },
        ]
      },

      {
        name: 'workStation', href: '', icon: '<i class="bi bi-pc-display"></i>',
        children: [
          { name: 'Terminal', href: 'workStation/terminal', icon: '<i class="bi bi-pc-display-horizontal"></i>' },
          { name: 'Printer', href: 'workStation/printer', icon: '<i class="bi bi-printer"></i>' },
          {
            name: 'Printer Group', href: 'workStation/printerGroup', icon: '<i class="bi bi-collection"></i>',
            children: []
          },

        ]
      },
      {
        name: 'Cashback', href: 'cashback', icon: '<i class="bi bi-gift"></i>',
      },
      {
        name: 'User Interface', href: 'ux', icon: '<i class="bi bi-window"></i>',
      },

    ];
    const [printerGroup] = await db.query(
      ` SELECT id, name  ,  'workStation/printer/'  as 'href' ,  
     CONCAT('{"printerGroupId":"',id,'"}')  as 'params'
        FROM  printer_group WHERE presence = 1`,
    );;


    generalTab[4]['children'][2]['children'] = printerGroup;




    const [discount_group] = await db.query(
      ` SELECT id, name  ,  'discount/'  as 'href' ,  
     CONCAT('{"discountGroupId":"',id,'"}')  as 'params'
        FROM  discount_group WHERE presence = 1`,
    );;

    generalTab[2]['children'][0]['children'] = discount_group;

    const [authLevel] = await db.query(
      ` SELECT id, name  ,  'employee/'  as 'href' ,  
        CONCAT('{"authlevelId":"',id,'"}')  as 'params'
        FROM  employee_auth_level WHERE presence = 1`,
    );;

    generalTab[0]['children'][0]['children'] = authLevel;

    const [paymentGroup] = await db.query(
      ` SELECT id, name  ,  'payment/paymentType/'  as 'href' ,  
        CONCAT('{"paymentGroupId":"',id,'"}')  as 'params'
        FROM  check_payment_group WHERE presence = 1`,
    );;

    generalTab[3]['children'][0]['children'] = paymentGroup;


    const [outlet] = await db.query(
      ` SELECT id, name  ,  'report/transaction/'  as 'href' ,  
        CONCAT('{"outletId":"',id,'"}')  as 'params'
        FROM  outlet WHERE presence = 1`,
    );;

    reportTab[1]['children'] = outlet;


    const data = {
      error: false,
      generalTab: generalTab,
      menuTab: menuTab,

      outletTab: outletTab,
      reportTab: reportTab,
      patch: packageJson.version
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.uxFunction = async (req, res) => {
  try {

    

    const [items] = await db.query(
      `Select id, name, pos2sorting as 'sorting', pos2Status as 'status', pos2Class as 'class' from ux order by pos2Sorting ASC`,
    );
      
    const data = { 
      items: items, 
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
exports.uxFunctionSaveOrder = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const data = req.body['order'];
  console.log(data);
  // res.json({
  //   body: req.body, 
  // });

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'Request body should be a non-empty array' });
  }

  const results = [];

  try {
    let i = 0;
    for (const emp of data) {
      const id  = emp; 
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }
      i++;
      const [result] = await db.query(
        `UPDATE ux SET 
          pos2Sorting = '${i}'
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
exports.uxFunctionStatus = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const data = req.body['items'];
  console.log(data);
  // res.json({
  //   body: req.body, 
  // });

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'Request body should be a non-empty array' });
  }

  const results = [];

  try {
    let i = 0;
    for (const emp of data) {
      const { id, status, class: className } = emp; 
      console.log(id, status);
      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }
      i++;
      const [result] = await db.query(
        `UPDATE ux SET 
          pos2Status = '${status}',
          pos2Class  = '${className}'
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
