require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs');
const db = require('./config/db'); // koneksi pool dari mysql2
const employeeRoutes = require('./routes/general/employee');
const specialHour = require('./routes/general/specialHour');
const holidayList = require('./routes/general/holidayList');
const payment = require('./routes/general/payment');
const discount = require('./routes/general/discount');
const other = require('./routes/general/other');
const member = require('./routes/general/member');
const complaint = require('./routes/general/complaint');
const customer = require('./routes/general/customer');
const template = require('./routes/general/template');
const workStation = require('./routes/station/workStation');
const tableMap = require('./routes/outlet/tableMap');
const global = require('./routes/global/global');
const outlet = require('./routes/outlet/outlet');
const floorMap = require('./routes/outlet/floorMap');
const menu = require('./routes/menu/menu');
const printer = require('./routes/station/printer');
 
 
 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Token');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cek koneksi database saat startup
app.get(process.env.PREFIX+'checkdb', async (req, res) => {
    console.log('PREFIX : ',process.env.PREFIX);
    try {
        const conn = await db.getConnection(); // ambil koneksi dari pool
        await conn.ping(); // ping koneksi ke database
        conn.release(); // jangan lupa lepas koneksi
        res.json({ success: true, message: 'Berhasil konek ke database' });
    } catch (err) {
        console.error('❌ DB error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Gagal konek ke database',
            error: err.message
        });
    }
});
app.use(process.env.PREFIX+'public', express.static('public'));
app.use(process.env.PREFIX+'global', global);


app.use(process.env.PREFIX+'specialHour', specialHour);
app.use(process.env.PREFIX+'holidayList', holidayList);
app.use(process.env.PREFIX+'employee', employeeRoutes);
app.use(process.env.PREFIX+'payment', payment);
app.use(process.env.PREFIX+'discount', discount);
app.use(process.env.PREFIX+'other', other);
app.use(process.env.PREFIX+'member', member);
app.use(process.env.PREFIX+'complaint', complaint);
app.use(process.env.PREFIX+'customer', customer);
app.use(process.env.PREFIX+'template', template);
app.use(process.env.PREFIX+'workStation', workStation);
app.use(process.env.PREFIX+'tableMap', tableMap); 
app.use(process.env.PREFIX+'outlet', outlet);
app.use(process.env.PREFIX+'floorMap', floorMap);
app.use(process.env.PREFIX+'menu', menu);
app.use(process.env.PREFIX+'printer', printer);

app.use('/', (req, res) => {
    const data = {
        error: false,
        serverTime: new Date(),
        prefix : process.env.PREFIX
    }
    res.json(data);

});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
