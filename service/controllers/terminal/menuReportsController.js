const e = require('express');
const crypto = require('crypto');
const db = require('../../config/db'); 
 
const buildReportTree = rows => {
  const nodes = new Map();
  const parents = new Map();
  const roots = [];

  rows.forEach(row => {
    const node = {
      id: String(row.id),
      title: row.label || row.name || '',
      show: false,
      startDate: row.startDate,
      endDate: row.endDate,
      employeeId: row.employeeId,
      outletId: row.outletId,
      mapId: row.mapId,
      sorting : row.sorting,
      router : row.name
    };

     

    if (row.mapId) {
      node.router = row.mapId;
    }

    nodes.set(node.id, node);
    parents.set(node.id, row.parentId !== null && row.parentId !== undefined ? String(row.parentId) : null);
  });

  parents.forEach((parentId, nodeId) => {
    const node = nodes.get(nodeId);

    if (parentId && nodes.has(parentId)) {
      const parent = nodes.get(parentId);
      if (!parent.items) {
        parent.items = [];
      }
      parent.items.push(node);
    } else {
      roots.push(node);
    }
  });

  

  return roots;
};

exports.selectReports = async (req, res) => {
  try {
    const q = `
    SELECT 
      id, parentId, name as 'router', label as 'title', startDate, endDate , 
      employeeId , outletId , mapId, sorting, false as 'show'
    FROM reports 
    WHERE presence = 1 and parentId = 0
    ORDER BY sorting ASC `;
    const [tableReports] = await db.query(q);

   
    for (const row of tableReports) {

       const q = `
        SELECT 
          id, parentId, name as 'router', label as 'title', startDate, endDate , 
          employeeId , outletId , mapId, sorting, false as 'show'
        FROM reports 
        WHERE presence = 1 and parentId = ${row.id}
        ORDER BY sorting ASC `;
        const [items] = await db.query(q);
       
          row.items = items;
    } 

      const data = tableReports;

    res.json({ data });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
};

exports.getUsers = async (req, res) => {
  try {
    const q = `SELECT id, username, name FROM employee WHERE presence = 1 `;
    const [users] = await db.query(q);

    res.json({ users: users });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
};

exports.getOutlets = async (req, res) => {
  try {
    const q = `SELECT id,name FROM outlet WHERE presence = 1`;
    const [outlets] = await db.query(q);
    res.json({ outlets: outlets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


//buatkan create token donk controller
exports.createReportToken = async (req, res) => {
  const createdName = req.body.createdName || 'System';
  const inputBy  = req.body.inputBy || 0;
  try { 
    let expTime = 0;
    // bisa buatkan expTime pakai epoch atau timestamp + beberapa menit misal 24 jam 
    const minute = 60 * 24;

    const timestamp = Math.floor(Date.now() / 1000); // waktu sekarang dalam detik
    expTime = timestamp + (minute * 60);  

 


    const token = crypto.randomBytes(16).toString('hex');
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const inputDateValue =  now; 

    const q = `INSERT INTO reports_token (token, expTime, createdName, presence, inputDate, inputBy) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [token, expTime, createdName, 1, inputDateValue, inputBy];
    const [result] = await db.query(q, values);

    res.json({ expTime: expTime, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
