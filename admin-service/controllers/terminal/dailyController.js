const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const ejs = require('ejs');
const path = require('path');

exports.getAllData = async (req, res) => {

    try { 
        const [formattedRows] = await db.query(`
            SELECT * FROM daily_check
            WHERE presence = 1 and closed = 0;
        `); 
        res.json({
            error: false,
            outletSelect: formattedRows,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
