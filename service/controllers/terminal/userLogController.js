const path = require('path'); 
const fs = require('fs');

exports.userLogIndex = (req, res) => {

    const log = req.body;

    // Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
    function getTodayDate() {
        const now = new Date();
        return now.toISOString().split('T')[0]; // Contoh: '2025-06-17'
    }

    // Data yang ingin dicatat
    const logData = `[${new Date().toISOString()}] ${log.userId} - ${log.action} @ ${log.url}\n`;


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