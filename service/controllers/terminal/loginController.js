const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const ejs = require('ejs');
const fs = require('fs');
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
        const [employee] = await db.query(`
            SELECT e.id, e.authlevelId, e.username, e.name  , e.hash,
            a.name AS  'authlevel', a.void, a.dailyAccess, a.discountLevelId, e.status
            FROM employee AS e
            JOIN employee_auth_level AS a ON a.id = e.authlevelId
            WHERE e.presence = 1 AND e.status =  1 and  e.username = '${empId}' `
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
            authlevelId: employee[0]['name'],
            authlevel: employee[0]['authlevel'],
            void: employee[0]['void'],
            dailyAccess: employee[0]['dailyAccess'],
            discountLevelId: employee[0]['discountLevelId'],
            status: employee[0]['status'],
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


exports.terminal = async (req, res) => {
    const results = [];
    const terminalId = req.body.terminalId;

    try {
        // Lokasi file relatif ke project root 

        const filePath = path.join(__dirname, '../../public/keyLicence/' + terminalId + '.txt');

        // Baca file secara async
        fs.readFile(filePath, 'utf8', async (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return res.status(500).json({
                    error: true,
                    message: 'Cannot read ID',
                });
            }



            const q3 = `
            DELETE FROM terminal WHERE 
                terminalId =  '${terminalId}'
            `;

            const [result3] = await db.query(q3);
            if (result3.affectedRows === 0) {
                results.push({ status: ' not found', });
            } else {
                results.push({ status: 'old id terminal DELETE' });
            }

            const q2 = `
            INSERT INTO terminal( 
                terminalId, 
                presence, inputDate, updateDate)
            value(
                '${terminalId}', 
                1,'${today()}', '${today()}') 
            `;

            const [result] = await db.query(q2);
            if (result.affectedRows === 0) {
                results.push({ status: ' not found', });
            } else {
                results.push({ status: 'terminal insert' });
            }


            res.status(200).json({
                error: false,
                message: 'Read Id success',
                address  : result.insertId ,
                terminalId: terminalId,
                fileContent: data, // <-- ini isi file
            });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};