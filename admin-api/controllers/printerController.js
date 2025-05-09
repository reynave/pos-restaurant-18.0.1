const db = require('../config/db');
const { today, formatDateOnly } = require('../helpers/global');
const { printToPrinter } = require('../helpers/printer');
  
exports.testPrintingIp = async (req, res) => {
  const printerIp = '10.51.122.20'; // ganti dengan IP printer kamu
  const printerPort = 9100;
  const cut = "\x1B\x69"; // ESC i = cut paper
  const date = new Date();
  const message = '\n\n\n Hello Printer  \n'+date+' \n\n\n\n' + cut;

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

/*
exports.testPrintingFromDB = async (req, res) => {
  const cut = "\x1B\x69"; // ESC i = cut
  const message = "Hello Printer\n" + cut;

  try {
    // Ambil IP dan Port dari global_setting
    const [settings] = await db.query(`
      SELECT name, value FROM global_setting 
      WHERE name IN ('printer_ip', 'printer_port')
    `);

    const config = {};
    settings.forEach(s => config[s.name] = s.value);

    const printerIp = config['printer_ip'];
    const printerPort = parseInt(config['printer_port'], 10);

    if (!printerIp || !printerPort) {
      return res.status(400).json({ error: 'Printer config not found in DB' });
    }

    const result = await printToPrinter(message, printerIp, printerPort);
    res.json({ success: true, message: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
*/

exports.testPrintingCom = (req, res) => {

  res.json({
    success: true,
    message: 'wait Printer com'
  });

};






exports.getAllData = async (req, res) => {
  try {

    const [items] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM printer  
      WHERE presence = 1
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

exports.getMasterData = async (req, res) => {
  try {

    const [outlet] = await db.query(`
      SELECT id, name1
      FROM outlet  
      WHERE presence = 1 order by name1 ASC
    `);

    const data = {
      error: false,
      outlet: outlet,
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
      `INSERT INTO printer (presence, inputDate, outletId, printerTypeCon, name, ipAddress, port ) 
      VALUES (?, ?, ?,?, ?, ?,? )`,
      [
        1,
        inputDate,
        model['outletId'],
        '1',
        model['desc1'],
        model['ip'],
        model['port'],
      ]
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
          outletId = '${emp['outletId']}',   
          name = '${emp['name']}',   
          ipAddress = '${emp['ipAddress']}',   
          port = '${emp['port']}',    
          
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
