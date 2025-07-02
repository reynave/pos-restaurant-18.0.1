const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');

exports.getItems = async (req, res) => {

   try {
      const [formattedRows] = await db.query(`
       SELECT 
          m.id, m.name,   m.adjustItemsId,  0 as 'checkBox',
          m.menuDepartmentId, m.menuCategoryId,  
            m.qty -  (
                SELECT COUNT(ci.id)
                FROM cart_item ci
                WHERE ci.presence = 1 
                  AND ci.void = 0 
                  AND ci.adjustItemsId = m.adjustItemsId
              ) AS qty
        FROM menu AS m 
        WHERE m.presence = 1 
    `);


      formattedRows.forEach(el => {
         if( el['adjustItemsId'] == '' ){
            el['qty'] = 'unlimited';
         }
      });

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

         const q = `
            UPDATE menu
               SET   
                  adjustItemsId = '',
                  qty = 0,    
                  updateDate = '${today()}'
            WHERE id = ${id}
         `;

         const [result] = await db.query(q);
         if (result.affectedRows === 0) {
            results.push({ id, status: 'menu not found', query: q, });
         } else {
            results.push({ id, status: 'menu updated', query: q, });
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


         const { insertId } = await autoNumber('adjustItems');
         const q = `
            UPDATE menu
               SET    
                  adjustItemsId = '${insertId}',
                  qty = ${addQty},    
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
