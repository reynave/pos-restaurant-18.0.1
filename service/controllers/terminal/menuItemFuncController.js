const db = require('../../config/db');
//const { headerUserId } = require('../../helpers/global');
//const { headerUserId } = require('../../helpers/global');
const { sendOrder } = require('../../helpers/sendOrder');
const {  formatDateTime } = require('../../helpers/global');

const { logger } = require('./userLogController');
const fs = require('fs');
const path = require('path');

const Handlebars = require("handlebars");
require("../../helpers/handlebarsFunction")(Handlebars);



exports.tableChecker = async (req, res) => {
    const cartId = req.query.id;

    try {
        const q1 = `
           SELECT t1.*, so.sendOrderDate as 'date' FROM (
            SELECT sendOrder, COUNT(sendOrder) AS qty FROM cart_item 
            WHERE cartId = '${cartId}' AND presence = 1 AND void = 0
            GROUP BY sendOrder
            ) AS t1
            JOIN send_order AS so ON so.id = t1.sendOrder

            ;
        `;
        const [data] = await db.query(q1);


        //  let i = 0;
        // for (const row of data) {
        //     const itemData = await sendOrder(row.sendOrder);
        //     data[i]['items'] = itemData['cart'];
        //     i++;
        // }


        res.json({
            data
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}


exports.tableCheckerDetail = async (req, res) => {
    const so = req.query.so; 
    const api = req.query.api == 'true' ? true : false;
    const templatePath = path.join(__dirname, '../../public/template/tableChecker.hbs');
    try {
        const data = await sendOrder(so);
        const [cartId] = await db.query(`
            SELECT cartId FROM send_order WHERE id = '${so}'
        `);

        const qq = `
            SELECT 
                c.id , c.id as 'bill', c.void,  c.dailyCheckId, c.cover, c.outletId,
                o.name AS 'outlet', c.startDate, c.endDate , 
                c.close,   t.tableName, t.tableNameExt, 'UAT PERSON' as 'servedBy' 
            FROM cart AS c
            JOIN outlet AS o ON o.id = c.outletId
            JOIN outlet_table_map AS t ON t.id = c.outletTableMapId
            WHERE c.presence = 1 AND  c.id = '${cartId[0].cartId}'
        `
        console.log(qq);
        const [transactionq] = await db.query(qq);

        const transaction = transactionq.map(row => ({
            ...row,
            startDate: formatDateTime(row.startDate),
            endDate: row.close == 0 ? '' : formatDateTime(row.endDate),
        }));

        if (api == true) {
            res.json({
                transaction: transaction,
                cart: data['cart'],
            });
            return;
        }

        const templateSource = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateSource);
        const result = template({
            cart: data['cart'],
            transaction: transaction[0]
        });
        res.setHeader('Content-Type', 'application/json');
        res.send(result);



    } catch (err) {
        console.error('Render error:', err);
        res.status(500).send('Gagal render HTML');
    }
}
