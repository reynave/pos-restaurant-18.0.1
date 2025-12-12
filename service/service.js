require('dotenv').config();
const express = require('express');
const app = express(); 
const http = require('http').Server(app); 
const io = require('socket.io')(http, {
    cors: {
        origin: "*", // Ganti kalau pakai frontend berbeda
    },
});
 

const db = require('./config/db'); // koneksi pool dari mysql2 
 

const loginPos = require('./routes/terminal/loginPos');
const terminalMap = require('./routes/terminal/tableMap');
const menuItemPos = require('./routes/terminal/menuItemPos');
const bill = require('./routes/terminal/bill');
const paymentPos = require('./routes/terminal/payment');
const daily = require('./routes/terminal/daily');
const transactionPos = require('./routes/terminal/transaction');
const items = require('./routes/terminal/items');
const printingPos = require('./routes/terminal/printing');
const userLog = require('./routes/terminal/userLog');
const printQueue = require('./routes/terminal/printQueue');
const cashier = require('./routes/terminal/cashier');

const IsAuth = require('./helpers/IsAuth');
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Terminal, X-Requested-With, Content-Type, Accept, Authorization, Token');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cek koneksi database saat startup
app.get(process.env.PREFIX + 'checkdb', async (req, res) => {
    console.log('PREFIX : ', process.env.PREFIX);
    try {

       
         const q = `SELECT now() as 'dbDateTime'`;
        const [formattedRows] = await db.query(q);


        const conn = await db.getConnection(); // ambil koneksi dari pool
        await conn.ping(); // ping koneksi ke database
        conn.release(); // jangan lupa lepas koneksi
        // Mendapatkan tanggal sekarang +7 jam (WIB)
        const now = new Date();
        now.setHours(now.getHours() + 7);

        res.json({ 
            success: true, 
            message: 'Successfully connected to the database',
            date: now,
            db: formattedRows,  
        });
    } catch (err) {
        console.error('❌ DB error:', err.message);
        res.status(500).json({ 
            message: 'ERROR! Failed to connect to the database',
            error: err.message,
            date : new Date(),
        });
    }
});

app.use(process.env.PREFIX + 'public', express.static('public'));
// ADMIN SERVICE HERE  
app.use(process.env.PREFIX + 'global', require('./routes/global/global')); //MENU
app.use(process.env.PREFIX + 'login', require('./routes/admin/loginAdmin')); //ADMIN
app.use(process.env.PREFIX + 'global', require('./routes/global/global')); //MENU

app.use(process.env.PREFIX + 'employee', require('./routes/general/employee'));
app.use(process.env.PREFIX + 'payment', require('./routes/general/payment'));
app.use(process.env.PREFIX + 'discount', require('./routes/general/discount'));
app.use(process.env.PREFIX + 'other', require('./routes/general/other'));   
app.use(process.env.PREFIX + 'workStation', require('./routes/general/workStation'));

app.use(process.env.PREFIX + 'tableMap',  require('./routes/outlet/tableMap'));
app.use(process.env.PREFIX + 'outlet', require('./routes/outlet/outlet'));
app.use(process.env.PREFIX + 'floorMap', require('./routes/outlet/floorMap'));
app.use(process.env.PREFIX + 'menu', require('./routes/menu/menu')); 
app.use(process.env.PREFIX + 'tableMapTemplate', require('./routes/outlet/tableMapTemplate')); 
app.use(process.env.PREFIX + 'dailySchedule', require('./routes/general/dailySchedule')); 
app.use(process.env.PREFIX + 'dailyClose', require('./routes/report/dailyClose')); 
app.use(process.env.PREFIX + 'userLogin', require('./routes/report/userLogin')); 
app.use(process.env.PREFIX + 'transaction', require('./routes/report/transaction')); 

app.use(process.env.PREFIX + 'cashback', require('./routes/general/cashback')); 


// TERMINAL SERVICE HERE
app.use(process.env.PREFIX + process.env.TERMINAL + 'login', loginPos);
app.use(process.env.PREFIX + process.env.TERMINAL + 'transaction', IsAuth.validateToken,transactionPos);
app.use(process.env.PREFIX + process.env.TERMINAL + 'tableMap', IsAuth.validateToken,terminalMap);
app.use(process.env.PREFIX + process.env.TERMINAL + 'menuItemPos', IsAuth.validateToken,menuItemPos);
app.use(process.env.PREFIX + process.env.TERMINAL + 'bill',  bill);
app.use(process.env.PREFIX + process.env.TERMINAL + 'payment', IsAuth.validateToken,paymentPos);
app.use(process.env.PREFIX + process.env.TERMINAL + 'daily', IsAuth.validateToken, daily);
app.use(process.env.PREFIX + process.env.TERMINAL + 'items', IsAuth.validateToken,items);
app.use(process.env.PREFIX + process.env.TERMINAL + 'printing', printingPos);
app.use(process.env.PREFIX + process.env.TERMINAL + 'log', userLog);
app.use(process.env.PREFIX + process.env.TERMINAL + 'printQueue', IsAuth.validateToken, printQueue);
app.use(process.env.PREFIX + process.env.TERMINAL + 'cashier', IsAuth.validateToken, cashier);
app.use(process.env.PREFIX + process.env.TERMINAL + 'ux', IsAuth.validateToken, require('./routes/terminal/ux'));
app.use(process.env.PREFIX + process.env.TERMINAL + 'language',  require('./routes/terminal/language'));

  
app.use('/', (req, res) => {
    const data = {
        error: false,
        serverTime: new Date(),
        prefix: process.env.PREFIX
    }
    res.json(data);
});
const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
io.on('connection', (socket) => {
   // console.log('Client connected');

    socket.on('message-from-client', (data) => {
       // console.log('Received from client:', data);

        // Kirim ke SEMUA client yang terhubung
        // io.emit('message-from-server', 'Broadcast: ' + data);  

        // Kirim ke  client yang terhubung kecuali diri sendiri
        socket.broadcast.emit('message-from-server', data);

    });

    socket.on('broadcast-reload', (data) => { 
        socket.broadcast.emit('reload', data); 
    });

    socket.on('printing-reload', (data) => { 
        socket.broadcast.emit('printing', data); 
    });

});


http.listen(PORT, () => {
    console.log('listening on *:' + PORT);
});