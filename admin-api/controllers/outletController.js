const db = require('../config/db');
const { today, formatDateOnly } = require('../helpers/global');

exports.getAllData = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT *, 0 as 'checkbox'
      FROM outlet  
      WHERE presence =1
    `);
 
    const formattedRows = rows.map(row => ({
      ...row,
      stdate: formatDateOnly(row.stdate),
      enddate: formatDateOnly(row.enddate), 
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


exports.postCreate = async (req, res) => {
  const model = req.body['model'];
  const inputDate = today();

  try {
    
    const [result] = await db.query(
      `INSERT INTO outlet (presence, inputDate,updateDate, name1 ) 
      VALUES (?, ?, ?, ?)`,
      [
        1,
        inputDate,
        inputDate,
        model['desc1']
      ]
    );

    res.status(201).json({
      error: false,
      inputDate: inputDate,
      message: 'outlet created',
      outletId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};

exports.postUpdate = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const emp = req.body;
  console.log(emp);
  // res.json({
  //   body: req.body, 
  // }); 
  const results = [];

  try {
      const id = emp['id'];
      const [result] = await db.query(
        `UPDATE outlet SET  
          name1 = '${emp['name1']}',    
          name2  = '${emp['name2']}',    
          name3  = '${emp['name3']}',    
          descs1  = '${emp['descs1']}',    
          descs2  = '${emp['descs2']}',    
          descs3  = '${emp['descs3']}',    
          tel  = '${emp['tel']}',    
          fax  = '${emp['fax']}',    
          comname1  = '${emp['comname1']}',    
          comname2  = '${emp['comname2']}',    
          comname3  = '${emp['comname3']}',    
          addr1  = '${emp['addr1']}',    
          addr2  = '${emp['addr2']}',    
          addr3  = '${emp['addr3']}',    
          street1  = '${emp['street1']}',    
          street2  = '${emp['street2']}',    
          street3  = '${emp['street3']}',    
          cityname1  = '${emp['cityname1']}',    
          cityname2  = '${emp['cityname2']}',    
          cityname3  = '${emp['cityname3']}',    
          country1  = '${emp['country1']}',    
          country2  = '${emp['country2']}',    
          country3  = '${emp['country3']}',    
          greeta1  = '${emp['greeta1']}',    
          greeta2  = '${emp['greeta2']}',    
          greeta3  = '${emp['greeta3']}',    
          greetb1  = '${emp['greetb1']}',    
          greetb2  = '${emp['greetb2']}',    
          greetb3  = '${emp['greetb3']}',    
          greetc1  = '${emp['greetc1']}',    
          greetc2  = '${emp['greetc2']}',    
          greetc3  = '${emp['greetc3']}',    
          greetd1  = '${emp['greetd1']}',    
          greetd2  = '${emp['greetd2']}',    
          greetd3  = '${emp['greetd3']}',    
          greete1  = '${emp['greete1']}',    
          greete2  = '${emp['greete2']}',    
          greete3  = '${emp['greete3']}',    
          dpoleu1  = '${emp['dpoleu1']}',    
          dpoleu2  = '${emp['desdpoleu2c1']}',    
          dpoleu3  = '${emp['dpoleu3']}',    
          dpolel1  = '${emp['dpolel1']}',    
          dpolel2  = '${emp['dpolel2']}',    
          dpolel3  = '${emp['dpolel3']}',    
          panelid  = '${emp['panelid']}',    
          price  = '${emp['price']}',    
          sendpend  = '${emp['sendpend']}',    
          itmrnd  = '${emp['itmrnd']}',    
          taxrnd  = '${emp['taxrnd']}',    
          scrnd  = '${emp['scrnd']}',    
          discrnd  = '${emp['discrnd']}',    
          ckrnd  = '${emp['ckrnd']}',    
          itmdec  = '${emp['itmdec']}',    
          taxdec  = '${emp['taxdec']}',    
          scdec  = '${emp['scdec']}',    
          discdec  = '${emp['discdec']}',    
          ckdec  = '${emp['ckdec']}',    
          begchk  = '${emp['begchk']}',    
          endchk  = '${emp['endchk']}',    
          nextchk  = '${emp['nextchk']}',    
          bizbegchk  = '${emp['bizbegchk']}',    
          drwprefix  = '${emp['drwprefix']}',    
          drwamt  = '${emp['drwamt']}',    
          drwmethod  = '${emp['drwmethod']}',    
          drwrun  = '${emp['drwrun']}',    
          drwmem  = '${emp['drwmem']}',    
          
          updateDate = '${today()}'

        WHERE id = ${id}`,
      );


      if (result.affectedRows === 0) {
        results.push({ id, status: 'not found' });
      } else {
        results.push({ id, status: 'updated' });
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
      const { date, checkbox } = emp;
      const id = date;
      if (!id || !checkbox) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }


      const [result] = await db.query(
        'UPDATE outlet SET presence = ?, updateDate = ? WHERE date = ?',
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
