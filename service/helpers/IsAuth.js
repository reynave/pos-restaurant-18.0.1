const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;


  if (process.env.PRODUCTION == true) {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    const SECRET_KEY = process.env.SECRET_KEY;

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      // console.log('✅ Token valid');

      // Simpan decoded ke req untuk digunakan di controller berikutnya
      req.user = decoded;

      // Jika mode production aktif, boleh tambahkan pengecekan khusus di sini
      if (process.env.PRODUCTION === 'true') {
        // contoh tambahan: cek expired atau userId tertentu
      }

      next(); // lanjut ke controller berikutnya
    } catch (err) {
      console.error('❌ Token tidak valid:', err.message);
      return res.status(401).json({ error: 'Invalid token', message: err.message });
    }
  }else{
    next(); // lanjut ke controller berikutnya
  }

};

exports.checkReportToken = async (req, res, next) => {
  //if (process.env.PRODUCTION !== 'true') {
  //  return next();
 // }

  try {
    const token = req.query.t;
    const timestamp = Math.floor(Date.now() / 1000); // waktu sekarang dalam detik
    if (!token) {
      return res.status(401).json({ error: 'Missing report token' });
    }

    const q = `
      SELECT 
        id, token, expTime, createdName, presence 
      FROM reports_token
      WHERE token = '${token}' and expTime > ${timestamp}
    `;
     console.log(q)
    const [rows] = await db.query(q);

    if (!rows.length || rows[0].presence !== 1) {
      return res.status(401).json({ error: 'Invalid report token' });
    }

    const tokenRow = rows[0];
    if (tokenRow.expTime) {
      const expiresAt = new Date(tokenRow.expTime);
      if (!Number.isNaN(expiresAt.getTime()) && expiresAt < new Date()) {
        return res.status(401).json({ error: 'Report token expired' });
      }
    }

    req.reportToken = tokenRow;
    next();
  } catch (err) {
    console.error('❌ Report token check failed:', err.message);
    res.status(500).json({ error: 'Database error', message: err.message });
  }
};