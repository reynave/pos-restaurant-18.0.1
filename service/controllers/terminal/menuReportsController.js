const e = require('express');
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
    const q = `SELECT id, parentId, name, label, startDate, endDate , employeeId ,outletId , mapId, sorting
    FROM reports WHERE presence = 1 order by sorting ASC `;
    const [tableReports] = await db.query(q);

    const data = buildReportTree(tableReports);

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