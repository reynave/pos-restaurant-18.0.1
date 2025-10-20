const db = require('../../config/db');
const net = require('net');
const { formatDateTime, formatCurrency, formatLine, centerText } = require('../../helpers/global');
const { cart } = require('../../helpers/bill');
const { sendOrder } = require('../../helpers/sendOrder');

const { printToPrinter, printerEsc } = require('../../helpers/printer'); // arahkan ke path file yg kamu punya

const fs = require('fs');
const path = require('path');

const Handlebars = require("handlebars");
require("../../helpers/handlebarsFunction")(Handlebars);



exports.tableChecker = async (req, res) => {
  const templatePath = path.join(__dirname, '../../public/template/tableChecker.hbs');
  const api = req.query.api == 'true' ? true : false;

  try {
    const cartId = req.query.id;
    const so = req.query.so;
    
    const data = await sendOrder(so);

    const [transactionq] = await db.query(`
      SELECT 
          c.id , c.id as 'bill', c.void,  c.dailyCheckId, c.cover, c.outletId,
         o.name AS 'outlet', c.startDate, c.endDate , 
         c.close,   t.tableName, t.tableNameExt, 'UAT PERSON' as 'servedBy' 
       FROM cart AS c
       JOIN outlet AS o ON o.id = c.outletId
       JOIN outlet_table_map AS t ON t.id = c.outletTableMapId
       WHERE c.presence = 1 AND  c.id = '${cartId}'
     `);

    const transaction = transactionq.map(row => ({
      ...row,
      startDate: formatDateTime(row.startDate),
      endDate: row.close == 0 ? '' : formatDateTime(row.endDate),
    }));

    if (api == true) {
      res.json({
        cart: data['cart'],
        transaction: transaction[0],
      });
      return;
    }

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);
    const result = template({
      cart: data['cart'],
      transaction: transaction[0]
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(result);



  } catch (err) {
    console.error('Render error:', err);
    res.status(500).send('Gagal render HTML');
  }
};

exports.kitchen = async (req, res) => {
  const templatePath = path.join(__dirname, '../../public/template/kitchen.ejs');
  const api = req.query.api == 'true' ? true : false;


  try {

    const cartId = req.query.id;
    const data = await cart(cartId);

    const [transactionq] = await db.query(`
      SELECT 
          c.id , c.id as 'bill', c.void,  c.dailyCheckId, c.cover, c.outletId,
         o.name AS 'outlet', c.startDate, c.endDate , 
         c.close,   t.tableName, t.tableNameExt, 'UAT PERSON' as 'servedBy' 
       FROM cart AS c
       JOIN outlet AS o ON o.id = c.outletId
       JOIN outlet_table_map AS t ON t.id = c.outletTableMapId
       WHERE c.presence = 1 AND  c.id = '${cartId}'
     `);

    const transaction = transactionq.map(row => ({
      ...row,
      startDate: formatDateTime(row.startDate),
      endDate: row.close == 0 ? '' : formatDateTime(row.endDate),
    }));

    if (api == true) {
      res.json({
        cart: data['cart'],
        transaction: transaction[0],
        function: [
          { 'formatCurrency(value, symbol=null)': `return string` },
          { 'formatLine(leftText, rightText, lineLength = 50)': `return string` },
          { 'centerText(str, lineLength = 50)': `return string` },
        ]
      });
    }
    const html = await ejs.renderFile(templatePath, {
      cart: data['cart'],
      transaction: transaction[0],
      formatCurrency,
      formatLine,
      centerText
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(html);


  } catch (err) {
    console.error('Render error:', err);
    res.status(500).send('Gagal render HTML');
  }
};

exports.test = async (req, res) => {
  const note = req.body.note || 'Test print from server';
  const printer = req.body.printer;
 
  try {
    const message = `
*** TEST PRINT ***
NOTE: ${note}
======================
Thank you.
`;

    // Panggil fungsi printToPrinter
    const result = await printToPrinter(message, printer.address, printer.port);

 
    res.json({ success: true, message: 'Printed successfully', detail: result });

  } catch (err) {
    console.error('Print error:', err);
    res.status(500).json({ error: 'Failed to print', detail: err.message });
  }
};


exports.print = async (req, res) => {
  const note = req.body.note || 'Test print from server';
  const printer = req.body.printer;
 
  try {
    const message =  req.body.message;  

    const result = await printerEsc(message, printer);

 
    res.json({ success: true, message: 'Printed successfully', detail: result });

  } catch (err) {
    console.error('Print error:', err);
    res.status(500).json({ error: 'Failed to print', detail: err.message });
  }
};

