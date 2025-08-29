require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express(); 
const PORT = process.env.PORT || 3000;

// Serve Angular build (ubah 'pos-app' sesuai nama folder dist)
app.use(express.static(path.join(__dirname, 'dist')));


// Contoh API endpoint (kalau kamu gabungin API di sini juga)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
