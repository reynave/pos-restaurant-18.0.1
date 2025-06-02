const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const ejs = require('ejs');
const path = require('path');
const bcrypt = require('bcryptjs');

exports.getAllData = async (req, res) => {

    try {
        const cartId = req.query.id;

        const [formattedRows] = await db.query(`
            SELECT id, name FROM outlet
            WHERE presence = 1;
        `);

        const [employee] = await db.query(`
            SELECT * FROM employee
            WHERE presence = 1;
        `);

        res.json({
            error: false,
            outletSelect: formattedRows,
            employeeSelect: employee,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.signin = async (req, res) => {
    const results = [];
    const { username, password, outletId } = req.body;
    const saltRounds = 4;

    try {
        let empId = username;
        const [employee] = await db.query(
            `SELECT * FROM employee WHERE presence = 1 AND id = ?`, [empId]
        );

        if (!employee.length) {
            return res.status(401).json({ message: 'Invalid username' });
        }

        const user = employee[0];
        const passwordMatch = await bcrypt.compare(password, user.hash.trim());

        //  const hash2 = await bcrypt.hash(password, saltRounds); 
        // const passwordMatch2 = await bcrypt.compare(password, hash2); 
        // console.log('hash2', passwordMatch2, hash2);

        const dailyCheck = [];
        if (passwordMatch === true) {
            const [result] = await db.query(`
                SELECT * FROM daily_check
                WHERE presence = 1 and closed = 0 ;
            `);
            dailyCheck.push(result[0]);
        }


        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.status(200).json({
            message: 'Login successful',
            dailyCheck: dailyCheck,
            token: 'UAT123',
        });



    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
