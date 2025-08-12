const db = require('../../../config/db');
const { today, formatDateOnly } = require('../../../helpers/global');
const { printToPrinter } = require('../../../helpers/printer');


exports.testPrintingIP = async (req, res) => {
  const printerIp = '10.51.122.20'; // ganti dengan IP printer kamu
  const printerPort = 9100;
  const cut = "\x1B\x69"; // ESC i = cut paper
  const date = new Date();
  const message = '\n\n\n Hello Printer  \n' + date + ' \n\n\n\n' + cut;

  // Panggil dan tangani promise dari printToPrinter
  try {
    const result = await printToPrinter(message, printerIp, printerPort);
    res.json({
      success: true,
      message: result
    });
  } catch (err) {
    console.error('Printer error:', err);
    res.status(500).json({
      success: false,
      error: 'Printer connection or print failed',
      detail: err.message
    });
  }
};


exports.testPrinting = async (req, res) => {
  const printerIp = req.body['item']['ipAddress'];  
  const printerPort = req.body['item']['port'];  
  const cut = "\x1B\x69"; // ESC i = cut paper
  const date = new Date();
  const message = req.body['message']  + cut;

  // Panggil dan tangani promise dari printToPrinter
  try {
    const result = await printToPrinter(message, printerIp, printerPort);
    res.json({
      success: true,
      message: result
    });
  } catch (err) {
    console.error('Printer error:', err);
    res.status(500).json({
      success: false,
      error: 'Printer connection or print failed',
      message: err.message
    });
  }
};


exports.getAllData = async (req, res) => {

    const printerGroupId = req.query.printerGroupId == 'undefined' ? '' : req.query.printerGroupId; 

  try {

    const [items] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM printer  
      WHERE presence = 1  ${printerGroupId ? 'and printerGroupId = ' + printerGroupId : ''}
    `);


    const data = {
      error: false,
      items: items,
      get: req.query
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
      `INSERT INTO printer (presence, inputDate,   printerTypeCon, name, ipAddress, port, printerGroupId ) 
      VALUES (
        1, '${inputDate}','${model['printerTypeCon']}','${model['name']}',
        '${model['ip']}','${model['port']}','${model['printerGroupId']}')`
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'printer created',
      printerId: result.insertId
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
        `UPDATE printer SET 
          printerTypeCon = '${emp['printerTypeCon']}',   
          name = '${emp['name']}',   
          ipAddress = '${emp['ipAddress']}',   
          port = '${emp['port']}',    
          printerGroupId = '${emp['printerGroupId']}',
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
        'UPDATE printer SET presence = ?, updateDate = ? WHERE id = ?',
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
