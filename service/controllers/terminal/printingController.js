const db = require('../../config/db');
const net = require('net');
const { formatDateTime, formatCurrency, formatLine, centerText, headerUserId } = require('../../helpers/global');
const { cart } = require('../../helpers/bill');
const { sendOrder } = require('../../helpers/sendOrder');

const { printToPrinter, inputPrintQueue, printerEsc, openCashDrawer } = require('../../helpers/printer'); // arahkan ke path file yg kamu punya

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



exports.printQueue = async (req, res) => {
  const message = req.body.message || 'Test print from server';
  const printers = req.body.printers;
  const dailyCheckId = req.body.dailyCheckId || 'test';
  const userId = headerUserId(req);
  try {

    const result = await inputPrintQueue(db, message, printers, dailyCheckId, userId);


    res.json({ message: 'Printed successfully', detail: result });



  } catch (err) {
    console.error('Print error:', err);
    res.status(500).json({ error: 'Failed to print', detail: err.message });
  }
};


exports.print = async (req, res) => {
  const note = req.body.note || 'Test print from server';
  const printer = req.body.printer;

  try {
    const message = req.body.message;
    if (process.env.DUMMY_PRINTER == 'true') {
      res.json({ success: true, message: 'Printed successfully', detail: 'This is a dummy printer response'  });
    } else {
      const result = await printerEsc(message, printer); 
      if (result === true) {
        res.json({ success: true, message: 'Printed successfully', detail: result });
      } else {
        res.status(500).json({ error: 'Failed to print', detail: 'Printer ESC command failed', printer: printer });
      } 
    }


  } catch (err) {
    console.error('Print error:', err);
    res.status(500).json({ error: 'Failed to print', detail: err.message });
  }
};

exports.cashDrawer = async (req, res) => {
  const printer = req.body.printer;
  try {
    const result = await openCashDrawer(printer.address, printer.port);
    res.json(result);
  } catch (err) {
    console.error('Open cash drawer error:', err);
    res.status(500).json({ success: false, message: 'Failed to open cash drawer', error: err.message });
  }
};

exports.viewPrinters = async (req, res) => {
  try {
    const q = `SELECT 0 as checkBox, g.name AS 'group', 
              p.id, p.name, p.printerTypeCon, p.ipAddress, p.port, 
              p2.id AS id2, p2.name AS 'name2', p2.printerTypeCon AS printerTypeCon2, p2.ipAddress AS 'ipAddress2',
              p2.port AS 'port2'
            FROM printer AS p
              JOIN (SELECT m.printerGroupId FROM menu AS m
              GROUP BY m.printerGroupId) AS t1 ON t1.printerGroupId = p.printerGroupId
              LEFT JOIN printer AS p2 ON p2.id = p.printerId2
              JOIN printer_group AS g ON  g.id = p.printerGroupId
            WHERE p.presence = 1 AND g.presence = 1
          `;

    const [printers] = await db.query(q);
    res.json(printers);
  } catch (err) {
    console.error('View printers error:', err);
    res.status(500).send('Failed to load printers');
  }
};

exports.viewPrintersLogs = async (req, res) => {
  const dailyCheckId = req.query.dailyCheckId || 0;
  try {
    const q = `SELECT q.updateDate, q.consoleError, q.status, q.status2, q.message,
q.printerid, q.printerId2, p.name AS 'printer1' , p2.name AS 'printer2'
FROM print_queue AS q
LEFT JOIN printer AS p ON p.id =  q.printerId
LEFT JOIN printer AS p2 ON p2.id =  q.printerId2

WHERE q.cartItemId = 0 AND q.so = 0 and q.dailyCheckId = '${dailyCheckId}' ORDER BY q.id DESC LIMIT 100
          `;

    const [printers] = await db.query(q);
    res.json(printers);
  } catch (err) {
    console.error('View printers error:', err);
    res.status(500).send('Failed to load printers');
  }
};