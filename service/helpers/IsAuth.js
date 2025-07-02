const jwt = require('jsonwebtoken');


exports.validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const SECRET_KEY = process.env.SECRET_KEY;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('✅ Token valid:', decoded);

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
};