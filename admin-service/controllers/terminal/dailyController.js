const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');

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

exports.getData = async (req, res) => {

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

exports.dailyStart = async (req, res) => {
    const outletId = req.body['outletId'];

    const inputDate = today();
    const results = [];
    try {
        const [dailyCheck] = await db.query(
            `SELECT * FROM daily_check
            WHERE presence = 1 and closed = 0;`
        );
       if (!dailyCheck.length) {
            const { insertId } = await autoNumber('dailyCheck');

            const [result] = await db.query(
                `INSERT INTO daily_check (
              presence, inputDate, updateDate, startDate, id, outletId) 
            VALUES (1, '${inputDate}', '${inputDate}','${inputDate}', '${insertId}', ${outletId} )`
            );
            if (result.affectedRows === 0) {
                results.push({ status: 'not found' });
            } else {
                results.push({ status: 'updated' });
            }
            res.json({
                insertId: insertId,
                error: false,
                results: results,
            });
        }else{
              res.json({
                insertId : dailyCheck[0]['id'],
                error: false, 
            });
        }


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
