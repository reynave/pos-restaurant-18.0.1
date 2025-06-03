const db = require('../../config/db');
const convertToCsv = require('../../helpers/convertToCsv');

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
              presence, inputDate, updateDate, startDate, id) 
            VALUES (1, '${inputDate}', '${inputDate}','${inputDate}', '${insertId}' )`
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
        } else {
            res.json({
                insertId: dailyCheck[0]['id'],
                error: false,
            });
        }


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.dailyClose = async (req, res) => {
    const id = req.body['id'];
    const results = [];
    try {
        const q = `UPDATE daily_check
                    SET
                        closed = 1, 
                        updateDate = '${today()}',
                        closeDate = '${today()}', 
                        closeBalance = 1,
                        totalTables = 0,
                        presence = 1
                    WHERE id = '${id}' `;
        const [result] = await db.query(q);

        if (result.affectedRows === 0) {
            results.push({ status: 'not found' });
        } else {
            results.push({ status: 'daily_check updated close = 1' });
        }



        const [dailyCheck] = await db.query(
            `SELECT id, closed, startDate, closeDate, startBalance, closeBalance, totalTables,
            totalCover, totalBill, totalItem, discount, sc, tax, subTotal, grandTotal
                FROM daily_check
            WHERE id = '${id}'
        `
        );
        const pad = n => String(n).padStart(2, '0');
        const startDate = `${dailyCheck[0]['startDate'].getFullYear()}${pad(dailyCheck[0]['startDate'].getMonth() + 1)}${pad(dailyCheck[0]['startDate'].getDate())}`;

        const formatted = dailyCheck.map(row => {
            const startDate = new Date(row.startDate);
            const closeDate = new Date(row.closeDate);

            const pad = n => String(n).padStart(2, '0');
            const startDateFormated = `${startDate.getFullYear()}-${pad(startDate.getMonth() + 1)}-${pad(startDate.getDate())} ${pad(startDate.getHours())}:${pad(startDate.getMinutes())}:${pad(startDate.getSeconds())}`;
            const closeDateFormated = `${closeDate.getFullYear()}-${pad(closeDate.getMonth() + 1)}-${pad(closeDate.getDate())} ${pad(closeDate.getHours())}:${pad(closeDate.getMinutes())}:${pad(closeDate.getSeconds())}`;

            return {
                ...row,
                startDate: startDateFormated,
                closeDate: closeDateFormated,
            };
        });

        const daily_check = await convertToCsv(formatted, startDate + '-daily.csv');

        if (!daily_check['success']) {
            return res.status(500).json({ error: 'Export CSV was failed', message });
        }
        res.json({
            daily_check,
            results: results,
            error: false,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
