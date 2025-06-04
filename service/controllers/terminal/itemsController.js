const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');

exports.getItems = async (req, res) => {

   try {
      const [formattedRows] = await db.query(`
      SELECT *, 0 as 'checkBox'
      FROM menu
      WHERE presence = 1
    `);

      res.json({
         error: false,
         items: formattedRows,
      });

   } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
   }
};

exports.resetAdjust = async (req, res) => {
   const results = [];
   const items = req.body['items'];
   const newQty = req.body['newQty'];

   try {
      for (const id of items) {
         // const { id, cartId, paid, tips } = emp;

         if (!id) {
            results.push({ id, status: 'failed', reason: 'Missing fields' });
            continue;
         }

         const { insertId } = await autoNumber('adjustItems');


         const q = `
            UPDATE menu
               SET   
                  adjustItemsId = '${insertId}',
                  qty = ${newQty},    
                  updateDate = '${today()}'
            WHERE id = ${id}
         `;

         const [result] = await db.query(q);
         if (result.affectedRows === 0) {
            results.push({ id, status: 'menu not found', query: q, });
         } else {
            results.push({ id, status: 'menu updated', query: q, });
         }


         const q2 = `
            INSERT INTO adjust_items(id, presence, inputDate, updateDate)
            value('${insertId}',1,'${today()}', '${today()}') 
         `;

         const [result2] = await db.query(q2);
         if (result2.affectedRows === 0) {
            results.push({ id, status: 'menu not found', query: q, });
         } else {
            results.push({ id, status: 'adjust_items insert', query: q, });
         }
      }

      res.json({
         message: 'Batch update completed',
         results: results
      });

   } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
   }
};

exports.addQty = async (req, res) => {
   const results = [];
   const items = req.body['items'];
   const addQty = req.body['addQty'];

   try {
      for (const id of items) {
         // const { id, cartId, paid, tips } = emp;

         if (!id) {
            results.push({ id, status: 'failed', reason: 'Missing fields' });
            continue;
         }

         const s = `
            SELECT adjustItemsId, qty from menu 
            WHERE id = ${id}
         `; 
         const [qty] = await db.query(s);
         if (qty[0]['adjustItemsId'] == '' || qty[0]['adjustItemsId'] == null) {
            const { insertId } = await autoNumber('adjustItems');
            const q = `
            UPDATE menu
               SET    
                  adjustItemsId = '${insertId}',
                  qty = ${addQty + parseInt(qty[0]['qty'])},    
                  updateDate = '${today()}'
            WHERE id = ${id}
         `;
            const [result] = await db.query(q);
            if (result.affectedRows === 0) {
               results.push({ id, status: 'menu not found', query: q, });
            } else {
               results.push({ id, status: 'menu updated', query: q, });
            }
            const q2 = `
               INSERT INTO adjust_items(id, presence, inputDate, updateDate)
               value('${insertId}',1,'${today()}', '${today()}') 
            `;

            const [result2] = await db.query(q2);
            if (result2.affectedRows === 0) {
               results.push({ id, status: 'adjust_items not found', query: q, });
            } else {
               results.push({ id, status: 'adjust_items insert', query: q, });
            }
         } else {
            const q = `
               UPDATE menu
                  SET     
                     qty = ${addQty + parseInt(qty[0]['qty'])},    
                     updateDate = '${today()}'
               WHERE id = ${id}
            `;
            const [result] = await db.query(q);
            if (result.affectedRows === 0) {
               results.push({ id, status: 'menu not found', query: q, });
            } else {
               results.push({ id, status: 'menu updated', query: q, });
            }

            const q3 = `
               UPDATE adjust_items
                  SET
                     updateDate = '${today()}'
               WHERE id = '${qty[0]['adjustItemsId']}'
            `;
            const [result3] = await db.query(q3);
            if (result.affectedRows === 0) {
               results.push({ id, status: 'adjust_items  not found', query: q, });
            } else {
               results.push({ id, status: 'adjust_items updated', query: q, });
            }
         } 
      }

      res.json({
         message: 'Batch update completed',
         results: results
      });

   } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
   }
};
