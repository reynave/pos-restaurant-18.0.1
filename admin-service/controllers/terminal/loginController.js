const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const ejs = require('ejs');
const path = require('path');

exports.getAllData = async (req, res) => {

    try {
        const cartId = req.query.id;

        const [formattedRows] = await db.query(`
            SELECT id, name FROM outlet
            WHERE presence = 1;
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
