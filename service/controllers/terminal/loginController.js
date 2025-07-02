const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const ejs = require('ejs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
            `SELECT * FROM employee WHERE presence = 1 AND username = ?`, [empId]
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

        const data = {
            id: employee[0]['id'],
            username: employee[0]['username'],
            name: employee[0]['name'],
            lastLogin: today(),
        }

        const SECRET_KEY = process.env.SECRET_KEY;

        const tokenjwt = jwt.sign(data, SECRET_KEY);
        console.log(tokenjwt);

        // const decoded = jwt.verify(tokenjwt, SECRET_KEY);
        // console.log(decoded);


        const q2 = `
            INSERT INTO employee_token( employeeId, presence, inputDate, updateDate)
            value('${employee[0]['id']}',1,'${today()}', '${today()}') 
        `;

        const [result] = await db.query(q2);
        if (result.affectedRows === 0) {
            results.push({ status: ' not found', });
        } else {
            results.push({ status: 'employee_token insert' });
        }

        res.status(200).json({
            message: 'Login successful',
            dailyCheck: dailyCheck,
            token: tokenjwt,
            printer: {
                con: 'ip',
                address: '10.51.122.20',
                port: 9100,
                name: 'ESC/POS (Epson-style)'
            }
        });



    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
