const path = require('path');
const fs = require('fs');
const { formatDateTime } = require('../../helpers/global');
const winston = require('winston');

const getTodayDate = () => new Date().toISOString().split('T')[0];
const logDir = path.join(__dirname, './../../public', 'userLog', getTodayDate());

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, message }) => `[${timestamp}] ${message}`)
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, 'user-actions.log') })
    ]
});

exports.userLogIndex = (req, res) => {

    const log = req.body;

    const logMsg = `${log.userId} - ${log.action} @ ${log.url}`;
    logger.info(logMsg); // ✅ ini akan error kalau logger undefined

    res.json({ status: 'ok', message: 'Log saved' });
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