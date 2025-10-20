const db = require('../../config/db');
const { today, formatDateTime, formatCurrency, formatLine, centerText } = require('../../helpers/global');
const fs = require('fs');
const path = require('path');

const Handlebars = require("handlebars");
require("../../helpers/handlebarsFunction")(Handlebars);



exports.queue = async (req, res) => {

  const dailyCheckId = req.query.dailyCheckId;
  const cartId = req.query.cartId;

  try {
    // ${so ? 'AND so = "'+so+'"' : '' }
    const a = `
        SELECT 
          p.id, p.cartId, p.so, p.dailyCheckId, s.name as 'statusName', p.status, p.consoleError, p.inputDate,
          r.name AS 'printer', m.name AS 'menu', p.message, p.rushPrinting, c.qty
        FROM print_queue  as p
          JOIN print_queue_status as s on s.id = p.status 
          JOIN printer AS r ON r.id = p.printerId
          LEFT JOIN menu AS m ON m.id = p.menuId
          LEFT JOIN cart_item AS c ON c.id = p.cartItemId
        WHERE p.presence = 1 AND  p.dailyCheckId = '${dailyCheckId}' ${cartId != 'undefined' ? 'AND p.cartId = "' + cartId + '"' : ''}
        ORDER BY c.id ASC
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

exports.template = async (req, res) => {
  const n = 33;
  // Untuk render file .hbs (Handlebars), harus pakai handlebars, bukan ejs
  const templatePath = path.join(__dirname, '../../public/template/kitchen.hbs');

  const itemDetail = req.body.itemDetail;
  

  // didalam itemDetail ada modifier, saya mau setiap kelipatan 50 karakter \n
  itemDetail['modifier'] = itemDetail['modifier'].replace(new RegExp(`(.{${n}})`, 'g'), '$1\n');
  itemDetail['descs'] = itemDetail['descs'].replace(new RegExp(`(.{${n}})`, 'g'), '$1\n');
  
 
  const rushPrinting = req.body.rushPrinting; 

  if (!itemDetail) {
    return res.status(400).json({ error: 'itemDetail is required in request body' });
  }


  try {
    
    itemDetail['rushPrinting'] = rushPrinting;  
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);
    const result = template(itemDetail);
    res.setHeader('Content-Type', 'text/html');
    res.send(result);


  } catch (err) {
    console.error('Render error:', err);
    res.status(500).send('Gagal render HTML');
  }
};


exports.fnReprint = async (req, res) => {

  const item = req.body['item'];
  const results = [];
  try {
    const id = item['id']; 

    const [result] = await db.query(`
        UPDATE print_queue SET  
          status = 0,
          updateDate = '${today()}'
        WHERE id = ${id}
    `);

    if (result.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'print_queue updated' });
    }

    res.status(201).json({
      error: false,
      item: item,
      results: results,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.fnRushPrint = async (req, res) => {

  const item = req.body['item'];
  const results = [];
  try {
    const id = item['id']; 

    const [result] = await db.query(`
        UPDATE print_queue SET  
          status = 0,
          rushPrinting = 1,
          updateDate = '${today()}'
        WHERE id = ${id}
    `);

    if (result.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'print_queue updated' });
    }

    res.status(201).json({
      error: false,
      item: item,
      results: results,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
