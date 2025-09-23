const db = require('../../config/db');
const { headerUserId, today, convertCustomDateTime, parseTimeString, addTime } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');


exports.queue = async (req, res) => {
    const outletId = req.query.outletId;
    try {


        const [items] = await db.query(`
            SELECT  id, counterNo, startDate, overDue , outletId
            FROM  cart
            WHERE presence = 1 AND close = 0 AND outletId = ${outletId}
            ORDER BY id ASC
        `);

        res.status(201).json({
            items: items,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, note: 'Database insert error' });
    }
};

exports.deleteOrder = async (req, res) => {
    const id = req.body['id'];
    try {

         await db.query(`
            UPDATE cart
               SET    
                  presence = 0,
                  updateDate = '${today()}',
                updateBy = ${headerUserId(req)}
            WHERE id = ${id}
        `);

         await db.query(`
            UPDATE cart_item
               SET    
                  presence = 0,
                  updateDate = '${today()}',
                updateBy = ${headerUserId(req)}
            WHERE cartId = ${id}
        `);

        await db.query(`
            UPDATE cart_item_modifier
               SET    
                  presence = 0,
                  updateDate = '${today()}',
                updateBy = ${headerUserId(req)}
            WHERE cartId = ${id}
        `);
        await db.query(`
            DELETE FROM cart_item_group 
            WHERE cartId = ${id}
        `);
         await db.query(`
            DELETE FROM cart_merge_log 
            WHERE cartId = ${id}
        `);
          await db.query(`
            DELETE FROM cart_transfer_items 
            WHERE cartId = ${id}
        `); 
          await db.query(`
            UPDATE cart_payment
               SET    
                  presence = 0,
                  updateDate = '${today()}',
                updateBy = ${headerUserId(req)}
            WHERE cartId = ${id}
        `);


        res.status(201).json({
            items: [],
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, note: 'Database insert error' });
    }
};

exports.newOrder = async (req, res) => {
    const model = req.body['model'];
    const dailyCheckId = req.body['dailyCheckId'];
    const terminalId = req.body['terminalId'];

    const outletId = req.body['outletId'];
    const inputDate = today();
    const results = [];
    const userId = headerUserId(req);
    try {
        // Generate nomor otomatis
        const { insertId: cartId } = await autoNumber('cart');
        const { insertId: counterId } = await autoNumber('counter');

        const [outlet] = await db.query(`SELECT overDue FROM outlet   WHERE  id = ${outletId}`);
        const timeToAdd = outlet[0]['overDue'];

        const { hours, minutes, seconds } = parseTimeString(timeToAdd);
        const updatedDate = addTime(inputDate, hours, minutes, seconds);

        // Format hasil
        let overDue = updatedDate.toLocaleString(process.env.TO_LOCALE_STRING).replace('T', ' ').substring(0, 19);
        overDue = convertCustomDateTime(overDue.toString())
        console.log(overDue); // Output: 2025-07-22 17:03:38


        const a = `INSERT INTO cart (
          presence, inputDate, tableMapStatusId, outletTableMapId, 
          cover,  id, outletId, dailyCheckId,
          lockBy,
          startDate, endDate, overDue, 
          updateBy, inputBy, counterNo
        ) 
        VALUES (
            1, '${inputDate}', 13, 0, 
            1,  '${cartId}',  ${outletId}, '${dailyCheckId}', 
            '${terminalId}',
            '${inputDate}', '${inputDate}' , '${overDue}', 
            ${userId}, ${userId}, '${counterId}'
            )`;
        const [newOrder] = await db.query(a);
        if (newOrder.affectedRows === 0) {
            results.push({ status: 'not found' });
        } else {
            results.push({ status: 'updated' });
        }
        res.status(201).json({
            cardId: cartId,
            counterNo: counterId,
            message: 'cart created',
        });




    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, note: 'Database insert error' });
    }
};
