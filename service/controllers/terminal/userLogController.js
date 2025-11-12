const db = require('../../config/db');
const { today, formatDateOnly, headerUserId, formatDateTime } = require('../../helpers/global');

const path = require('path');
const fs = require('fs');
const winston = require('winston');
const csv = require('csv-parser'); // npm install csv-parser
const getTodayDate = () => new Date().toISOString().split('T')[0];
const logFilePath = path.join(__dirname, './../../public/userLog', getTodayDate() + '.csv');

// Buat file jika belum ada (optional, bisa dihapus juga)
if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, 'time,outletId,workStationId,userId,bill,action,url,method,server\n'); // atau kasih header CSV
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(({ timestamp, message }) => `${timestamp},${message}`)
    ),
    transports: [
        //     new winston.transports.File({ filename: path.join(logDir,  getTodayDate()+'.csv') })
        new winston.transports.File({ filename: logFilePath })
    ]
});

exports.inputLog = async (req, res) => {
    const log = req.body;
 

    try {


        const timestamp = Math.floor(new Date().getTime()/1000.0);

        const q3 = `INSERT INTO 
            logs(
               timestamp, actionDate, bill, action, actionBy, actionId, 
               dailyCheckId, actionRelated, terminalId, outletId, url)
            VALUES (
            '${timestamp}', '${log.actionDate}', '${log.bill}', '${log.action}', '${log.actionBy}', '${log.actionId}', 
            '${log.dailyCheckId}', '${log.actionRelated}', '${log.terminalId}', '${log.outletId}', '${log.url}'
            )`;

        const [result3] = await db.query(q3);

        if (result3.affectedRows === 0) {
            results.push({ status: 'cart not found / Payment closed' });
        } else {
            results.push({ status: 'cart changePayment payment updated' });
        }

        res.json({ status: 'ok', message: 'Log saved' });
    } catch (err) {
        console.error('Error saving log:', err);
        res.status(500).json({ status: 'error', message: 'Failed to save log' });
    }

};

exports.userLogIndex = (req, res) => {

    const log = req.body;

    const logMsg = `${log.outletId},${log.terminalId},${log.userId},${log.cartId},${log.action},${log.url}`;
    logger.info(logMsg); // ✅ ini akan error kalau logger undefined

    res.json({ status: 'ok', message: 'Log saved' });
};

exports.getLog = async (req, res) => {
    const startDate = req.query.startDate || '1970-01-01'; // Default to earliest date if not provided
    const endDate = req.query.endDate || new Date().toISOString().split('T')[0]; // Default to today if not provided

    const q = `SELECT *, DATE_FORMAT(actionDate, '%Y-%m-%d %H:%i:%s') as actionDate FROM logs 
    WHERE DATE(actionDate) BETWEEN ? AND ? 
    ORDER BY timestamp 
    ASC limit 1000`;

    try {
        const [results] = await db.query(q, [startDate, endDate]);
        res.json({ log: results });
    } catch (err) {
        console.error('Error fetching logs:', err);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
};

exports.getLog_DEL = (req, res) => {
    const date = req.query.date;

    const filePath = path.join(__dirname, './../../public/userLog', date + '.csv');

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Log file not found' });
    }

    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv()) // konversi CSV ke object
        .on('data', (data) => results.push(data))
        .on('end', () => {
            res.json({ log: results }); // kirim ke Angular
        })
        .on('error', (err) => {
            res.status(500).json({ error: 'CSV parsing failed', details: err.message });
        });
};

exports.downloadLog = (req, res) => {
    const date = req.query.date;
    const filePath = path.join(__dirname, './../../public/userLog', date + '.csv');

    res.download(filePath, 'userLog-' + date + '.csv', (err) => {
        if (err) {
            console.error('Download error:', err);
            res.status(500).json({ error: 'File not found or cannot be downloaded' });
        }
    });
};


exports.userLogIndex_NATIVE = (req, res) => {

    const log = req.body;

    // Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
    function getTodayDate() {
        const now = new Date();
        return now.toISOString().split('T')[0]; // Contoh: '2025-06-17'
    }

    // Data yang ingin dicatat
    const logData = `[${formatDateTime(new Date().toISOString())}] ${log.userId} - ${log.action} @ ${log.url}\n`;


    // Path folder berdasarkan tanggal
    const todayFolder = path.join(__dirname, './../../public', 'userLog', getTodayDate());

    // Pastikan foldernya ada, kalau belum maka dibuat
    fs.mkdir(todayFolder, { recursive: true }, (err) => {
        if (err) return console.error('Error creating log folder:', err);

        // Path file log-nya
        const logFilePath = path.join(todayFolder, 'user-actions.log');

        // Tulis atau tambahkan log ke file
        fs.appendFile(logFilePath, logData, (err) => {
            if (err) {
                console.error('Failed to write log:', err);
            } else {
                console.log('Log added successfully');
            }
        });
    });
};