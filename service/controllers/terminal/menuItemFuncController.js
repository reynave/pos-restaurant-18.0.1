const db = require('../../config/db');
//const { headerUserId } = require('../../helpers/global');
//const { headerUserId } = require('../../helpers/global');
const { sendOrder } = require('../../helpers/sendOrder');
const { formatDateTime, headerUserId, today } = require('../../helpers/global');

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

exports.voidTransaction = async (req, res) => {
    // const { id, name, position, email } = req.body;
    const results = [];
    const userId = headerUserId(req);
    const cartId = req.body['id'];
    const reason = req.body['reason'];

    try {
        const q1 = `INSERT INTO cart_void_reason (
            cartId,  reason, presence, 
            inputDate, updateDate,  
            inputBy, updateBy
        )
        VALUES (
          '${cartId}', '${reason}', 1,
          '${today()}', '${today()}', 
          ${userId}, ${userId}
        )`;
        const [result1] = await db.query(q1);
        if (result1.affectedRows === 0) {
            results.push({ status: 'not found' });
        }
        else {
            results.push({ status: 'INSERT VOID REASON inserted' });
        }


        const a = `
      UPDATE cart SET
        void = 1,
        close = 1,
        tableMapStatusId = 41,
        endDate =  '${today()}', 
        updateDate = '${today()}',
        updateBy = ${userId}
      WHERE id = '${cartId}' `;
        const [resulta] = await db.query(a);

        if (resulta.affectedRows === 0) {
            results.push({ cartId, status: 'not found', });
        } else {
            results.push({ cartId, status: 'cart updated', });
        }

        const tablesVoid = [
            'cart_item',
            'cart_item_modifier',
            'cart_item_discount',
            'cart_item_sc',
            'cart_item_tax',
        ];
        for (const table of tablesVoid) {
            const q = `
      UPDATE ${table} SET
        presence = 0,
        void  = 1, 
        updateDate = '${today()}',
        updateBy = ${userId}
      WHERE cartId = '${cartId}'  `;
            const [result] = await db.query(q);
            if (result.affectedRows === 0) {
                results.push({ cartId, status: 'not found', });
            } else {
                results.push({ cartId, status: 'cart_item updated', });
            }
        }



        res.status(201).json({
            error: false,
            results: results,
            message: 'cart_item close Order',
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database update error', details: err.message });
    }
};
 