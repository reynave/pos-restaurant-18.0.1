const db = require('../../config/db'); 
const { today } = require('../../helpers/global'); 

const ejs = require('ejs');
const path = require('path');

 
exports.queue = async (req, res) => {
  
const dailyCheckId = req.query.dailyCheckId;
 const cartId = req.query.cartId;

  try {
    // ${so ? 'AND so = "'+so+'"' : '' }
      const a = `
        SELECT p.id, p.cartId, p.so, p.dailyCheckId, s.name as 'statusName', p.status, p.consoleError, p.inputDate,
        r.name AS 'printer'
        FROM print_queue  as p
        join print_queue_status as s on s.id = p.status 
          JOIN printer AS r ON r.id = p.printerId
        WHERE p.presence = 1 AND  p.dailyCheckId = '${dailyCheckId}' ${cartId != 'undefined' ? 'AND p.cartId = "'+cartId+'"' : ''}
        ORDER BY p.id DESC
      `;
  
     const [formattedRows] = await db.query(a);
 
    res.json({
      items: formattedRows, 
    });  

  } catch (err) {
    console.error('Render error:', err);
    res.status(500).send('Gagal render HTML');
  }
};
 
exports.fnReprint = async (req, res) => {
  
  const item = req.body['item'];
  const results = [];
  try {
    const id =  item['id'];
    console.log(item['id']);
 
    const [result] = await db.query( `
        UPDATE print_queue SET  
          status = 0,
          updateDate = '${today()}'
        WHERE id = ${id}
    `); 

    if (result.affectedRows === 0) {
      results.push({   status: 'not found' });
    } else {
      results.push({   status: 'print_queue updated' });
    }
 
    res.status(201).json({
      error: false,
      item: item, 
      results :results,
    });  

  } catch (err) {
      console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
 