const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');

exports.getAllData = async (req, res) => {
  try {

    const outletTab = [
      {
        name: 'Basic Outlet Setup', href: '', icon:'<i class="bi bi-display"></i>',
        children: [
          { name: 'Outlet Details', href: 'outlet', icon:'<i class="bi bi-credit-card"></i>', },  
        ]
      },  
      {
        name: 'Advance Outlet Setup', href: '', icon:'<i class="bi bi-display"></i>',
        children: [
          { name: 'Payment', href: 'outlet/payment', icon:'<i class="bi bi-credit-card"></i>', }, 
          { name: 'Cash Types', href: 'outlet/cashType', icon:'<i class="bi bi-credit-card"></i>', }, 
          { name: 'Autority', href: 'outlet/funcAuthority', icon:'<i class="bi bi-person-fill-gear"></i>', }, 
          { name: 'Order level', href: 'outlet/orderLevel', icon:'<i class="bi bi-person-fill-gear"></i>', },  
          { name: 'Discount', href: 'outlet/discount', icon:'<i class="bi bi-percent"></i>', },  
          { name: 'Special Hours', href: 'outlet/specialHour', icon:'<i class="bi bi-clock"></i>', },  
  
          { name: 'Table Map', href: 'tableMap', icon:'<i class="bi bi-display"></i>', 
            children: [
          
            ] 
          }, 
          { name: 'Floor Map', href: 'floorMap', icon:'<i class="bi bi-display"></i>',  },  
  
          { name: 'Tips Pool', href: 'outlet/tipsPool', icon:'<i class="bi bi-display"></i>',  },  
          { name: 'Mix & Match Rules', href: 'outlet/mixAndMatch', icon:'<i class="bi bi-display"></i>',  },  
          { name: 'Bonus Rules', href: 'outlet/bonusRules', icon:'<i class="bi bi-display"></i>',  },  
  
  
        ]
      },  
      
    ] 


   


    const menuTab = [
      { name: 'Department', href: 'menu/department', icon:'<i class="bi bi-display"></i>', },  
      { name: 'Category', href: 'menu/category', icon:'<i class="bi bi-display"></i>', },  
      { name: 'Class', href: 'menu/class', icon:'<i class="bi bi-display"></i>', },  
      { name: 'Item', href: 'menu/item', icon:'<i class="bi bi-display"></i>', },   
    ] 
    const data = {
      error: false,
      menuTab: menuTab, 
      outletTab: outletTab, 
      
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
