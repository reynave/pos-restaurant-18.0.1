const db = require('../../config/db');
const { headerUserId, mapUpdateByName, today, sanitizeText } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');
const { taxScUpdate, scUpdate, taxUpdate } = require('../../helpers/bill');
const { printQueueInternal } = require('../../helpers/printer');

const { logger } = require('./userLogController');

exports.cart = async (req, res) => {
   const i = 1;
   try {
      const cartId = req.query.id;

      const q2 = `
      SELECT c.*, t.tableName, c.startDate, c.overDue,
           TIMESTAMPDIFF(MINUTE,  c.overDue, NOW())  AS overTime, s.name AS 'status', 
           t.outletFloorPlandId, f.desc1 AS 'floorName'
      FROM cart  AS c
          JOIN outlet_table_map AS t ON t.id = c.outletTableMapId
          left join outlet_table_map_status as s on s.id = c.tableMapStatusId
          left join outlet_floor_plan as f on f.id = t.outletFloorPlandId
      WHERE c.id = '${cartId}' AND c.presence = 1
      `;
      const [table] = await db.query(q2);
      const tableRow = await mapUpdateByName(db, table);


      // HEADER
      const q = `
       SELECT  c.id,  c.menuId, c.price, c.qty AS 'total', c.ta, (c.qty * c.price) AS 'totalAmount', m.name, 0 AS 'checkBox', 
        '' AS 'modifier',   m.modifierGroupId, m.discountGroupId, 
        c.sendOrder, c.inputDate, c.inputBy, c.updateDate, c.updateBy, e.name AS 'employeeName',  '' as printerRows
        FROM cart_item AS c
        JOIN menu AS m ON m.id = c.menuId
        left join employee as e on e.id = c.inputBy
        WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void  = 0  
        ORDER BY  c.inputDate ASC 
      `;
      const [formattedRows] = await db.query(q);


      for (const row of formattedRows) {
         const q6 = `
         SELECT p.*, r.name AS printerName, r.ipAddress, r.port , t.name AS statusName
         FROM print_queue as p
         JOIN printer as r on r.id = p.printerId
         left JOIN print_queue_status as t on t.id = p.status
         WHERE  p.so = '${row['sendOrder']}' and p.presence = 1  and p.cartItemId = ${row['id']}
         ORDER BY p.inputDate ASC
         `;
         const [printerRows] = await db.query(q6);
         row.printerRows = printerRows;
      }




      // DETAIL / MODIFIER 
      const s = ` 
    -- CUSTOM NOTES
      SELECT r.id, i.id AS cartItemId, r.menuTaxScId AS modifierId, r.note AS descl, r.price, 
      NULL AS rateOrDiscount, NULL AS remark, 1 as 'modifier', 0 as 'checkBox', r.sendOrder, i.inputDate, i.inputBy, i.updateDate, i.updateBy
      FROM cart_item  AS i
      RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
      WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
      AND r.presence = 1 AND i.void = 0 AND r.modifierId = 0 AND r.note != ''

      UNION

      -- MODIFIER
      SELECT r.id, i.id AS cartItemId, r.modifierId, m.descl, r.price, 
      NULL AS rateOrDiscount, r.remark, 1 as 'modifier', 0 as 'checkBox', r.sendOrder, i.inputDate, i.inputBy, i.updateDate, i.updateBy
      FROM cart_item  AS i 
      RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id
      JOIN modifier AS m ON m.id = r.modifierId 
      WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
      AND r.presence = 1 AND i.void = 0   

      UNION

      -- DISCOUNT
      SELECT r.id,i.id AS cartItemId, r.modifierId, d.name AS descl, r.price,
       r.applyDiscount AS rateOrDiscount, r.remark, 1 as 'modifier', 0 as 'checkBox', r.sendOrder, i.inputDate, i.inputBy, i.updateDate, i.updateBy
      FROM cart_item  AS i
         JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
         JOIN discount AS d ON d.id = r.applyDiscount
      WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
         AND r.presence = 1 AND i.void = 0 

      UNION

      -- SC
      SELECT r.id, i.id AS cartItemId, r.menuTaxScId AS modifierId, t.scNote AS descl, r.price, 
      r.scRate AS rateOrDiscount, r.remark, 0 as 'modifier', 0 as 'checkBox', i.sendOrder, i.inputDate, i.inputBy, i.updateDate, i.updateBy
         FROM cart_item  AS i
         RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
         JOIN menu_tax_sc AS t ON t.id = r.menuTaxScId
      WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
         AND r.presence = 1 AND i.void = 0 AND r.scRate != 0

      UNION 

      -- TAX
      SELECT r.id, i.id AS cartItemId, r.menuTaxScId AS modifierId, t.taxNote AS descl, r.price, 
      r.taxRate AS rateOrDiscount, r.remark, 0 as 'modifier', 0 as 'checkBox', i.sendOrder, i.inputDate, i.inputBy, i.updateDate, i.updateBy
         FROM cart_item  AS i
         RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
         JOIN menu_tax_sc AS t ON t.id = r.menuTaxScId
      WHERE   i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
         AND r.presence = 1 AND i.void = 0 AND r.taxRate != 0
 
      `;
      const [modifier] = await db.query(s);


      // Merge detail into header
      const items = formattedRows.map(header => {
         const itemModifier = modifier
            .filter(detail => detail.cartItemId === header.id)
            .map(detail => ({ ...detail, totalAmount: detail.price * header.total, total: header.total })); // Add qty from header to each modifier
         return { ...header, modifier: itemModifier };
      });


     

      // function to calculate total amount and total items
      let totalAmount = 0;
      let totalItem = 0;

       // buatkan function untuk menghitung total dari total + modifier
      const calculateGrandTotal = (item) => {
         const modifierTotal = item.modifier.reduce((acc, curr) => acc + curr.totalAmount, 0);
         return item.totalAmount + modifierTotal;
      };
      items.forEach(item => {
         item.grandTotalAmount = calculateGrandTotal(item) 
      });

      // function to calculate total amount and total items
      items.forEach(item => {
         totalAmount += item.grandTotalAmount;
         totalItem += item.total;
      });

      // End of calculation
      res.json({
         table: tableRow,
         items: items, 
         totalAmount: totalAmount,
         totalItem: totalItem,
      });

   } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
   }
};

exports.updateQty = async (req, res) => {
   // const { id, name, position, email } = req.body;
   const userId = headerUserId(req);
   const model = req.body['model'];
   const item = req.body['item'];
   const cartId = req.body['cartId'];

   let inputDate = today();
   const results = [];
   let updateStock = false;
   try {
      // const currentQty = item['total'];
      const newQty = model['newQty'];

      const q1 = `
        SELECT 
            m.id, m.name, m.adjustItemsId,
            m.qty - (
            COALESCE(
                (
                SELECT SUM(ci.qty)
                FROM cart_item ci
                WHERE ci.presence = 1
                    AND ci.adjustItemsId = m.adjustItemsId AND ci.menuId = m.id
                ), 0
            ) +
            COALESCE(
                (
                SELECT SUM(cim.menuSetQty)
                FROM cart_item_modifier cim
                WHERE cim.presence = 1
                    AND cim.menuSetadjustItemsId = m.adjustItemsId AND cim.menuSetmenuId = m.id
                ), 0
            )
            ) AS qty
        FROM menu AS m
        WHERE m.presence = 1 AND m.id = ${item['menuId']}
        `;

      const [row3] = await db.query(q1);

      const stockQty = parseInt(row3[0]['qty']);
      let warning = '';
      if (row3[0]['adjustItemsId'] == '') {
         updateStock = true
      } else {
         if (newQty > stockQty) {
            warning = `Stock not enough. Available stock is ${stockQty}`;
            updateStock = false;
         } else {
            updateStock = true;
         }

      }

      if (updateStock == true) {
         const q = ` 
            UPDATE cart_item  SET 
               qty =  ${newQty}, 
               updateDate = '${today()}',
               updateBy = ${userId}  
            WHERE cartId = '${cartId}'  AND  id = ${item['id']}   
            `;
         const [result] = await db.query(q);

         if (result.affectedRows === 0) {
            results.push({ status: 'not found' });
         } else {
            results.push({ status: 'UPDATE', query: q });
         }
      }

      res.status(201).json({
         error: false,
         inputDate: inputDate,
         results: results,
         warning: warning,
      });


   } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database update error', details: err.message });
   }
};

exports.voidItem = async (req, res) => {
   // const { id, name, position, email } = req.body;
   const userId = headerUserId(req);
   const cart = req.body['cart'];
   const cartId = req.body['cartId'];

   const inputDate = today();
   const results = [];

   try {
      for (const emp of cart) {
         const { id, checkBox, modifier } = emp;
         if (checkBox == 1) {
            const q = `UPDATE cart_item
            SET
              void = 1,
              presence = 0,
              updateDate = '${today()}',
              updateBy = ${userId}
          WHERE id = ${id}  and cartId = '${cartId}' and sendOrder = '' `;
            const [result] = await db.query(q);
            if (result.affectedRows === 0) {
               results.push({ id, status: 'not found' });
            } else {
               results.push({ id, status: 'cart_item updated' });
            }
         }

         // loop untuk modifier
         console.log(modifier);
         for (const mod of modifier) {
            if (mod['checkBox'] == 1) {
               const q = `UPDATE cart_item_modifier
                     SET
                        void = 1,
                        presence = 0,
                        updateDate = '${today()}',
                        updateBy = ${userId}
                     WHERE id = ${mod['id']} and sendOrder = '' `;
               const [result] = await db.query(q);
               if (result.affectedRows === 0) {
                  results.push({ id: mod['id'], status: 'not found' });
               } else {
                  results.push({ id: mod['id'], status: 'cart_item_modifier updated', query: q });
               }
            }

         }

          await scUpdate(id);

          await taxUpdate(id);

      }

      const q2 = `
      SELECT id, cartId, presence , void 
      FROM cart_item
      WHERE cartId = '${cartId}' and presence = 0 and void = 1
   `;
      const [result2] = await db.query(q2);
      if (result2.length > 0) {
         for (const row of result2) {
            const q = `UPDATE cart_item_modifier
            SET
              void = 1,
              presence = 0,
              updateDate = '${today()}',
              updateBy = ${userId}
          WHERE  cartItemId = '${row['id']}'`;
            const [result] = await db.query(q);

            if (result.affectedRows === 0) {
               results.push({ status: 'not found' });
            } else {
               results.push({ status: 'cart_item_modifier updated' });
            }
         }
      }






      res.json({
         message: 'Batch update completed',
         results: results
      });


   } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database update error', details: err.message });
   }
};

exports.addToItemModifier = async (req, res) => {
   const cart = req.body['cart'];
   const userId = headerUserId(req);
   const modifiers = req.body['modifiers'];
   const cartId = req.body['cartId'];

   const results = [];

   try {

      for (const emp of cart) {
         const { id, checkBox, modifierGroupId, sendOrder } = emp;

         if (!id) {
            results.push({ id, status: 'failed', reason: 'Missing fields' });
            continue;
         }

         if (checkBox == 1) {
            for (const modifier of modifiers) {
               if (modifier['checkBox'] == 1) {
                  let allowAdd = false;

                  if (modifier['modifierGroupId'] == modifierGroupId) {
                     allowAdd = true;
                  }
                  if (modifierGroupId == 0) {
                     allowAdd = true;
                  }


                  if (allowAdd == true && sendOrder == '') {

                     const q =
                        `INSERT INTO cart_item_modifier (
                           presence, inputDate, updateDate, void,
                           cartId, cartItemId, modifierId,
                           note, price,
                           inputBy, updateBy
                        )
                        VALUES (
                           1, '${today()}', '${today()}',  0,
                           '${cartId}',  ${id}, ${modifier['id']},
                           '', ${modifier['price']},
                           ${userId}, ${userId}
                        )`;
                     const [result] = await db.query(q);
                     if (result.affectedRows === 0) {
                        results.push({ status: 'not found', query: q, });
                     } else {
                        results.push({ status: 'updated', query: q, });
                     }
                     // const [itemPrice] = await db.query(m1);
                     //   const taxScUpdateRest = await taxScUpdate(cartItem['id']);
                  }
               }
            }


         }
      }

      res.status(201).json({
         error: false,
         message: 'cart created',
         results: results
      });
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, note: 'Database insert error' });
   }
};

exports.addCustomNotes = async (req, res) => {
   const cartId = req.body['cartId'];
   const model = req.body['model'];
   const items = req.body['items'];
   const userId = headerUserId(req);
   const inputDate = today();
   const results = [];
   try {

      for (const emp of items) {
         const { id, checkBox, sendOrder } = emp;
         // Sanitize note to prevent SQL injection and remove special characters
         let note = sanitizeText(model['note']);
         const q3 =
            `INSERT INTO cart_item_modifier (
               presence, inputDate, updateDate,  
               cartId , note, cartItemId,
               updateBy, inputBy
            )
            VALUES (
               1, '${inputDate}', '${inputDate}',  
               '${cartId}', '${note}', ${id}, ${userId}, ${userId}
            )`;
         const [result3] = await db.query(q3);
         if (result3.affectedRows === 0) {
            results.push({ status: 'cart_item_modifier not found', });
         } else {
            results.push({ status: 'cart_item_modifier insert', });
         }
      }

      res.status(201).json({
         error: false,
         results: results,
      });


   } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database update error', details: err.message });
   }
};

exports.addDiscountGroup = async (req, res) => {
   const userId = headerUserId(req);
   const cart = req.body['cart'];
   const remark = req.body['remark'];

   const discountGroup = req.body['discountGroup'];
   const cartId = req.body['cartId'];

   const results = [];

   try {

      for (const emp of cart) {
         const { id, checkBox, discountGroupId, name } = emp;

         if (checkBox == 1) {

            let allowAdd = false;

            if (discountGroup['discountGroupId'] == discountGroupId) {
               allowAdd = true;
            }
            if (discountGroup['allDiscountGroup'] == 1) {
               allowAdd = true;
            }

            if (allowAdd == true) {

               const t1 = `
                  SELECT SUM(t1.totalAmount)  AS 'totalAmount' 
                  FROM (
                     SELECT  SUM(price) AS 'totalAmount'
                     FROM cart_item_modifier
                     WHERE 
                     cartItemId = ${id} AND 
                     presence = 1 and void = 0
                        AND menuTaxScId = 0
                     UNION

                     SELECT SUM(price)AS 'totalAmount' 
                     FROM cart_item WHERE  
                     id = ${id} AND 
                     presence = 1 and void = 0
                  ) AS t1
                  `;
               const [queryT1] = await db.query(t1);
               const totalAmount = parseInt(queryT1[0]['totalAmount']);

               if (parseInt(discountGroup['discAmount']) > 0) {
                  let discAmount = 0;
                  const q = `
                  INSERT INTO cart_item_modifier (
                    presence, inputDate, updateDate, void,
                    cartId, cartItemId, modifierId,
                    applyDiscount, price, remark,
                    inputBy, updateBy
                  )
                  VALUES (
                    1, '${today()}', '${today()}',  0,
                    '${cartId}',  ${id}, 0,
                    ${discountGroup['id']}, ${discAmount}, '${remark}',
                    ${userId}, ${userId}
                )`;
                  const [result] = await db.query(q);
                  if (result.affectedRows === 0) {
                     results.push({ status: 'not found', query: q, });
                  } else {
                     results.push({ status: 'discAmount updated', query: q, });
                  }
               } else {
                  let discAmount = (totalAmount * (parseFloat(discountGroup['discRate']) / 100)) * -1;
                  const q = `
                  INSERT INTO cart_item_modifier (
                    presence, inputDate, updateDate, void,
                    cartId, cartItemId, modifierId,
                    applyDiscount, price, remark
                  )
                  VALUES (
                    1, '${today()}', '${today()}',  0,
                    '${cartId}',  ${id}, 0,
                    ${discountGroup['id']}, ${discAmount}, '${remark}'
                )`;
                  const [result] = await db.query(q);
                  if (result.affectedRows === 0) {
                     results.push({ status: 'not found', query: q, });
                  } else {
                     results.push({ status: 'discRate updated', query: q, });
                  }
               }

               if (discountGroup['postDiscountSC'] == 1) {
                  const taxScUpdateRest = await scUpdate(id);
               }

               if (discountGroup['postDiscountTax'] == 1) {
                  const taxScUpdateRest = await taxUpdate(id);
               }

            } else {
               results.push({ status: `ERROR ${discountGroup['discountGroup']} was not match menu ${name}` });
            }
         }
      }

      res.status(201).json({
         error: false,
         message: 'cart created',
         results: results
      });
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, note: 'Database insert error' });
   }
};
