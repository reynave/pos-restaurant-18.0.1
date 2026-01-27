const db = require('../config/db'); // sesuaikan path kalau perlu 
const { today, ceilToTwoDecimal } = require('./global');

async function cart(cartId = '') {
   let subTotal = 0;
   let grandTotal = 0;
   let isGrouping = 0;
   let itemTotal = 0;
   let subgroup = 1;
   let sc = 0;
   let tax = 0;
   let discount = 0;

   const [groups] = await db.query(`
      SELECT   subgroup
      FROM cart_item_group
      Where cartId = '${cartId}'
      GROUP BY subgroup 
      order by subgroup asc
      `);
   if (groups.length > 0) {
      isGrouping = 1;
      //   subgroup = groups[0]['subgroup'];
   }

   const q = `
       SELECT  c.id,  c.menuId, c.price, c.qty AS 'total', c.ta, 0 AS 'totalAmount', 
         m.name, 0 AS 'checkBox', 
        '' AS 'modifier',   m.modifierGroupId, m.discountGroupId, 
        c.debit, c.credit,
        c.sendOrder, c.inputDate, c.inputBy, c.updateDate, c.updateBy, e.name AS 'employeeName',  '' as printerRows
        FROM cart_item AS c
        JOIN menu AS m ON m.id = c.menuId
        left join employee as e on e.id = c.inputBy
        WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void  = 0 
        ORDER BY  c.inputDate ASC 
      `;
   const [formattedRows] = await db.query(q);

   let header = formattedRows;

   const summaryFunction = await summary(cartId);

   itemTotal = 0;
   subTotal = 0;
   summaryFunction.forEach(element => {
      itemTotal += parseFloat(element.itemTotal)|| 0;
      //subTotal += parseFloat(element.subTotal) || 0;
   });


   // DETAIL / MODIFIER 
   const s = ` 
         -- MODIFIER and CUSTOM NOTE
         SELECT 'cart_item_modifier' as 'table', 0 as 'allowVoid', 0 as 'applyDiscount', r.id, i.id AS cartItemId, r.modifierId, CONCAT(m.descl,r.remark) AS 'descl',  
         0 AS rateOrDiscount,   1 as 'modifier', 0 as 'checkBox', r.sendOrder, r.debit, r.credit ,  i.qty,
         (r.debit - r.credit) * i.qty AS totalAmount
         FROM cart_item  AS i 
         RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id
         JOIN modifier AS m ON m.id = r.modifierId 
         WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
         AND r.presence = 1 AND i.void = 0   


         UNION 
         -- DISCOUNT
         SELECT 'cart_item_discount' as 'table', 1 as 'allowVoid', 1 as 'applyDiscount',  r.id, r.cartItemId, NULL AS  'modifierId', r.note AS  'descl', 
         r.rate AS rateOrDiscount,   1 as 'modifier', 0 as 'checkBox', r.sendOrder, r.debit, r.credit , i.qty,
         (r.debit - r.credit) * i.qty AS totalAmount
         FROM cart_item AS i
         JOIN cart_item_discount AS r ON r.cartItemId = i.id
         WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
         AND r.presence = 1 AND i.void = 0   


         UNION 
         -- SC
         SELECT 'cart_item_sc' as 'table', 0 as 'allowVoid', 0 as 'applyDiscount',  r.id, r.cartItemId, NULL AS  'modifierId', r.note AS  'descl', 
         r.rate AS rateOrDiscount,   0 as 'modifier', 0 as 'checkBox', r.sendOrder, r.debit, r.credit , i.qty,
         (r.debit - r.credit) * i.qty AS totalAmount
         FROM cart_item AS i
         JOIN cart_item_sc AS r ON r.cartItemId = i.id
         WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
         AND r.presence = 1 AND i.void = 0   
 
         UNION 
         -- TAX
         SELECT 'cart_item_tax' as 'table', 0 as 'allowVoid', 0 as 'applyDiscount',  r.id, r.cartItemId, NULL AS  'modifierId', r.note AS  'descl', 
         r.rate  AS rateOrDiscount,  0 as 'modifier', 0 as 'checkBox', r.sendOrder, r.debit, r.credit , i.qty,
         (r.debit - r.credit) * i.qty AS totalAmount
         FROM cart_item AS i
         JOIN cart_item_tax AS r ON r.cartItemId = i.id
         WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
         AND r.presence = 1 AND i.void = 0
 
      `;
   const [modifier] = await db.query(s);

   modifier.forEach(element => {
      // tolong buat float hanya 2 digit di belakang koma
      element.totalAmount = parseFloat(element.totalAmount).toFixed(2);
      element.totalAmount = parseFloat(element.totalAmount) || 0;

   });

   // Merge detail into header
   const items = header.map(row => {
      const itemModifier = modifier
         .filter(detail => detail.cartItemId === row.id)
         .map(detail => ({ ...detail, totalAmount: (detail.debit - detail.credit) * row.total, total: row.total })); // Add qty from header to each modifier
      return { ...row, modifier: itemModifier };
   });


   const [billVersion] = await db.query(`   
      SELECT no  FROM  bill WHERE cartId = '${cartId}' ORDER BY no DESC LIMIT 1
   `);

   const [scRow] = await db.query(`   
      SELECT sum( (r.debit - r.credit) * i.qty) AS 'totalAmount'
      FROM  cart_item_sc AS r
      JOIN cart_item AS i ON i.id = r.cartItemId
      WHERE r.cartId = '${cartId}' 
      AND r.presence = 1 AND r.void = 0 AND i.presence = 1 AND i.void = 0;
   `);
   if (scRow.length > 0) {
      sc = parseFloat(scRow[0]['totalAmount']);
   }


   const tq = `
      SELECT sum( (r.debit - r.credit) * i.qty) AS 'totalAmount'
      FROM  cart_item_tax AS r
      JOIN cart_item AS i ON i.id = r.cartItemId
      WHERE r.cartId = '${cartId}'
      AND r.presence = 1 AND r.void = 0 AND i.presence = 1 AND i.void = 0
   `;
   const [taxRow] = await db.query(tq);

   if (taxRow.length > 0) {
      tax = parseFloat(taxRow[0]['totalAmount']);
   }

   const [discountRow] = await db.query(`
      SELECT sum( (r.debit - r.credit) * i.qty) AS 'totalAmount'
      FROM  cart_item_discount AS r
      JOIN cart_item AS i ON i.id = r.cartItemId
      WHERE r.cartId = '${cartId}'
      AND r.presence = 1 AND r.void = 0 AND i.presence = 1 AND i.void = 0
   `);
   if (discountRow.length > 0) {
      discount = parseFloat(discountRow[0]['totalAmount']) || 0;
   }




   subTotal = itemTotal + discount;
   grandTotal = subTotal + sc + tax;






   return {

      cart: items,
      billVersion: billVersion[0] ? billVersion[0]['no'].toString().padStart(2, '0') : '00',
      summary: {
         itemTotal: ceilToTwoDecimal(itemTotal),
         discount: ceilToTwoDecimal(discount),
         subTotal: ceilToTwoDecimal(subTotal),

         sc: ceilToTwoDecimal(sc),
         tax: ceilToTwoDecimal(tax),
         grandTotal: ceilToTwoDecimal(grandTotal), 
      },
      itemSummary: summaryFunction,
      groups: groups
   }
}


// UNTUK BILL ex : http://localhost:3000/terminal/payment/bill?id=251030000577
async function cartGrouping(cartId = '', subgroup = 0) {


   let itemTotal = 0;
   let discount = 0;
   let subTotal = 0;

   let sc = 0;
   let tax = 0;

   const q = `
       SELECT  
            c.id,  c.menuId, c.price, c.qty AS 'total', c.ta, 0 AS 'totalAmount', 
            m.name, 0 AS 'checkBox', 
            '' AS 'modifier',   m.modifierGroupId, m.discountGroupId, 
            c.sendOrder, c.inputDate, c.inputBy, c.updateDate, c.updateBy, 
            e.name AS 'employeeName',  '' as printerRows
        FROM cart_item AS c
        JOIN menu AS m ON m.id = c.menuId
        left join employee as e on e.id = c.inputBy
        WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void  = 0 
        ORDER BY  c.inputDate ASC 
      `;
   const [formattedRows] = await db.query(q);

   // let  itemCart = formattedRows;
   let itemCart = [];

   if (subgroup == 1) {
      const q5 = `
        SELECT  g.cartItemId AS 'id' ,  sum(g.qty) as 'total'
         FROM cart_item_group AS g 
         WHERE g.cartId = '${cartId}'
         GROUP BY g.cartItemId 
      `;
      const [usedItem] = await db.query(q5);

      // Kurangi qty item yang sudah dipakai di group
      formattedRows.forEach(item => {
         const used = usedItem.find(used => used.id === item.id);
         if (used) {
            item.total -= used.total;
            if (item.total < 0) item.total = 0;
         }
      });

      itemCart = formattedRows;
   }
   else {
      const q5 = `
        SELECT  g.cartItemId AS 'id' ,  sum(g.qty) as 'total'
         FROM cart_item_group AS g 
         WHERE g.cartId = '${cartId}' and g.subgroup = ${subgroup}
         GROUP BY g.cartItemId 
      `;
      const [usedItem] = await db.query(q5);

      // Kurangi qty item yang sudah dipakai di group
      formattedRows.forEach(item => {
         const used = usedItem.find(used => used.id === item.id);
         if (used) {
            item.total = parseInt(used.total);
            itemCart.push(item);
         }
      });

   }

   // bisa buatkan foreach untuk array Items, jika total = 0 maka hapus dari array
   itemCart = itemCart.filter(item => item.total > 0);



   let whereCartId = '';

   // qty * price
   itemCart.forEach(row => {
      row['totalAmount'] = row['price'] * row['total'];
      whereCartId += ' i.id = ' + row['id'] + ' or ';
   });

   whereCartId = whereCartId.slice(0, -4); // Remove trailing ' or '

   // DETAIL / MODIFIER 
   const s = ` 
        -- CUSTOM NOTES
          SELECT  'MODIFIER' as 'type',  r.id, i.id AS cartItemId, r.menuTaxScId AS modifierId, r.note AS descl, r.debit as price, r.debit, r.credit,
            0 AS 'discAmount', 0 AS 'maxDiscount', 
          NULL AS rateOrDiscount, NULL AS remark, 1 as 'modifier', 0 as 'checkBox', r.sendOrder
          FROM cart_item  AS i
          RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
          WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
          AND r.presence = 1 AND i.void = 0 AND r.modifierId = 0 AND r.note != '' and ( ${whereCartId} )
    
          UNION
    
          -- MODIFIER
          SELECT  'MODIFIER' as 'type',  r.id, i.id AS cartItemId, r.modifierId, m.descl, r.debit as price,  r.debit, r.credit,
          0 AS 'discAmount', 0 AS 'maxDiscount',
          NULL AS rateOrDiscount, r.remark, 1 as 'modifier', 0 as 'checkBox', r.sendOrder
          FROM cart_item  AS i 
          RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id
          JOIN modifier AS m ON m.id = r.modifierId 
          WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
          AND r.presence = 1 AND i.void = 0   and ( ${whereCartId} )
    
      UNION 
          -- DISCOUNT
           SELECT 'APPLY_DISCOUNT' as 'type',  r.id,i.id AS cartItemId, r.discountId AS  modifierId, d.name AS descl,  r.credit AS price,  r.debit, r.credit,
          d.discAmount * -1 AS 'discAmount', d.maxDiscount * -1 AS 'maxDiscount',
           r.rate AS rateOrDiscount, null as remark, 1 as 'modifier', 0 as 'checkBox',
           r.sendOrder
          FROM cart_item  AS i
             JOIN cart_item_discount AS r ON r.cartItemId = i.id
             JOIN discount AS d ON d.id = r.discountId
          WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
             AND r.presence = 1 AND i.void = 0   and ( ${whereCartId} )

      UNION
      -- SC
     SELECT 'SC' as 'type', r.id, i.id AS cartItemId, r.menuTaxScId AS modifierId, t.scNote AS descl, r.debit AS  price,  r.debit, r.credit,
        0 AS 'discAmount', 0 AS 'maxDiscount',
      r.rate AS rateOrDiscount,  NULL AS remark, 0 as 'modifier', 0 as 'checkBox', i.sendOrder
         FROM cart_item  AS i
         RIGHT JOIN cart_item_sc AS r ON r.cartItemId = i.id
         JOIN menu_tax_sc AS t ON t.id = r.menuTaxScId
      WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
         AND r.presence = 1 AND i.void = 0 AND r.rate != 0

      UNION 

      -- TAX
          SELECT 'TAX' as 'type', r.id, i.id AS cartItemId, r.menuTaxScId AS modifierId, t.taxNote AS descl, r.debit AS price,  r.debit, r.credit,
        0 AS 'discAmount', 0 AS 'maxDiscount',
      r.rate AS rateOrDiscount, null as remark, 0 as 'modifier', 0 as 'checkBox', i.sendOrder
         FROM cart_item  AS i
         RIGHT JOIN cart_item_tax AS r ON r.cartItemId = i.id
         JOIN menu_tax_sc AS t ON t.id = r.menuTaxScId
      WHERE   i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
         AND r.presence = 1 AND i.void = 0 AND r.rate != 0
          `;


   const [modifier] = await db.query(s);


   // Merge detail into header
   const items = itemCart.map(header => {
      const itemModifier = modifier
         .filter(detail => detail.cartItemId === header.id)
         .map(detail => ({ ...detail, totalAmount: detail.price * header.total, total: header.total })); // Add qty from header to each modifier
      return { ...header, modifier: itemModifier };
   });


   const subgroupDiscount = [];
   const scGroup = [];
   const taxGroup = [];
   for (const row of items) {
      const dgg = `
      SELECT   d.discountId, d.note,   ${row.total}  as 'qty',   ${row.total} * d.credit AS 'totalAmount'
      FROM cart_item_discount AS d
      JOIN cart_item AS i ON i.id = d.cartItemId 
      WHERE i.cartId = '${cartId}' AND i.presence = 1 AND i.void = 0
      AND d.presence = 1 AND d.void = 0
      AND d.cartItemId = ${row.id}`;
      const [subgroupDiscountRow] = await db.query(dgg);
      subgroupDiscount.push(...subgroupDiscountRow);


      const scq = `
      SELECT   d.menuTaxScId, d.note,  ${row.total}   as 'qty',   ${row.total} * d.debit AS 'totalAmount'
      FROM cart_item_sc AS d
      JOIN cart_item AS i ON i.id = d.cartItemId
      WHERE i.cartId = '${cartId}' AND i.presence = 1 AND i.void = 0
      AND d.presence = 1 AND d.void = 0
      AND d.cartItemId = ${row.id}
      `;
      const [subgroupScRow] = await db.query(scq);
      scGroup.push(...subgroupScRow);


      const taxq = `
      SELECT  d.menuTaxScId, d.note,  ${row.total}   as 'qty',   ${row.total} * d.debit AS 'totalAmount'
      FROM cart_item_tax AS d
      JOIN cart_item AS i ON i.id = d.cartItemId
      WHERE i.cartId = '${cartId}' AND i.presence = 1 AND i.void = 0
      AND d.presence = 1 AND d.void = 0
      AND d.cartItemId = ${row.id}
      `;
      const [subgroupTaxRow] = await db.query(taxq);
      taxGroup.push(...subgroupTaxRow);
   }

   // AGGREGATE subgroupDiscount by discountId + note
   const groupedSubgroupDiscount = (() => {
      const map = new Map();
      for (const it of subgroupDiscount) {
         const key = `${it.discountId}||${it.note}`;
         const qty = Number(it.qty) || 0;
         const totalAmount = Number(it.totalAmount) || 0;
         if (map.has(key)) {
            const cur = map.get(key);
            cur.qty += qty;
            cur.totalAmount += totalAmount;
         } else {
            map.set(key, { discountId: it.discountId, note: it.note, qty, totalAmount });
         }
      }
      return Array.from(map.values());
   })();

   groupedSubgroupDiscount.forEach(element => {
      // tolong buat float hanya 2 digit di belakang koma
      element.totalAmount = parseFloat(element.totalAmount).toFixed(2);

      element.totalAmount = parseInt(Math.ceil(parseFloat(element.totalAmount)) || 0);
   });



   // AGGREGATE subgroupSc by menuTaxScId + note
   const groupedSubgroupSc = (() => {
      const map = new Map();
      for (const it of scGroup) {
         const key = `${it.menuTaxScId}||${it.note}`;
         const qty = parseInt(it.qty, 10) || 0;
         const totalAmount = parseFloat(it.totalAmount) || 0;
         if (map.has(key)) {
            const cur = map.get(key);
            cur.qty = (parseInt(cur.qty, 10) || 0) + qty;
            cur.totalAmount = (parseFloat(cur.totalAmount) || 0) + totalAmount;
         } else {
            map.set(key, { menuTaxScId: it.menuTaxScId, note: it.note, qty, totalAmount });
         }
      }
      return Array.from(map.values());
   })();

   // AGGREGATE subgroupTax by menuTaxId + note
   const groupedSubgroupTax = (() => {
      const map = new Map();
      for (const it of taxGroup) {
         const key = `${it.menuTaxId}||${it.note}`;
         const qty = parseInt(it.qty, 10) || 0;
         const totalAmount = parseFloat(it.totalAmount) || 0;
         if (map.has(key)) {
            const cur = map.get(key);
            cur.qty = (parseInt(cur.qty, 10) || 0) + qty;
            cur.totalAmount = (parseFloat(cur.totalAmount) || 0) + totalAmount;
         } else {
            map.set(key, { menuTaxScId: it.menuTaxScId, note: it.note, qty, totalAmount });
         }
      }
      return Array.from(map.values());
   })();



   const [billVersion] = await db.query(`   
        SELECT no  FROM  bill WHERE cartId = '${cartId}' ORDER BY no DESC LIMIT 1
    `);


   // bisa buatkan function hitung totalIAmount dari array items di tampung di variable itemTotal
   const calculateItemTotal = (items) => {
      let total = 0;
      let discount = 0;
      let sc = 0;
      let tax = 0;
      items.forEach(row => {
         total += row['totalAmount'];
         row['modifier'].forEach(mod => {
            if (mod['type'] == 'APPLY_DISCOUNT') {
               discount += mod['totalAmount'];
            }
            if (mod['type'] == 'SC') {
               sc += mod['totalAmount'];
            }
            if (mod['type'] == 'TAX') {
               tax += mod['totalAmount'];
            }
         });
      });
      return {
         itemTotal: total,
         discount: discount,
         subTotal: total - discount,
         sc: sc,
         tax: tax,
         total: (total - discount) + sc + tax
      };
   };

   const summaryFunction = calculateItemTotal(items);
   return {
      groups: subgroup,
      cart: items,
      billVersion: billVersion[0] ? billVersion[0]['no'] : 0,
      subgroupDiscount: groupedSubgroupDiscount,
      scGroup: groupedSubgroupSc,
      taxGroup: groupedSubgroupTax, 

      itemTotal: ceilToTwoDecimal(summaryFunction.itemTotal),
      discount: ceilToTwoDecimal(summaryFunction.discount),
      subTotal: ceilToTwoDecimal(summaryFunction.subTotal),
      sc: ceilToTwoDecimal(summaryFunction.sc),
      tax: ceilToTwoDecimal(summaryFunction.tax),
      total: ceilToTwoDecimal(summaryFunction.total),

   }
}

async function cartHistory(cartId = '', subgroup = 0) {
   let subTotal = 0;
   let grandTotal = 0;
   let totalItem = 0;
   let itemTotal = 0;
   //let subgroup = subgroup;
   const q = ` 
        SELECT t1.* , (t1.totalItem * t1.price) as 'totalAmount', m.name , 0 as 'checkBox', '' as modifier
         FROM (
           SELECT   c.price, c.menuId, COUNT(c.menuId) AS 'totalItem' ,  COUNT(c.void) AS 'totalVoid'
           FROM cart_item AS c
           JOIN menu AS m ON m.id = c.menuId
           WHERE c.cartId = '${cartId}' AND c.presence = 1   
           GROUP BY  c.menuId, c.price,   c.void
           ORDER BY MAX(c.inputDate) ASC
         ) AS t1
        JOIN menu AS m ON m.id = t1.menuId 
    `;
   const [formattedRows] = await db.query(q);

   for (const row of formattedRows) {

      const s = `
            -- MODIFIER 
           SELECT 'MODIFIER' as 'type',  COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price
           FROM (
             SELECT r.modifierId, m.descl, r.price
             FROM cart_item  AS i 
             right JOIN cart_item_modifier AS r ON r.cartItemId = i.id
             JOIN modifier AS m ON m.id = r.modifierId 
             WHERE i.menuId = ${row['menuId']}  
             AND i.cartId = '${cartId}'   AND i.presence = 1
            
             AND r.presence = 1 
           ) AS t1
           GROUP BY t1.descl, t1.price 

              UNION 
        --  CUSTOM NOTES
         SELECT 'MODIFIER' as 'type',  COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price
           FROM (
             SELECT r.modifierId, r.note AS 'descl', r.price
             FROM cart_item  AS i 
             LEFT JOIN cart_item_modifier AS r ON r.cartItemId = i.id  
             WHERE i.menuId = ${row['menuId']}  
             AND i.cartId = '${cartId}'   AND i.presence = 1
            AND r.modifierId = 0 AND r.note != ''
             AND r.presence = 1  
           ) AS t1
           GROUP BY t1.descl, t1.price 

           UNION  
            -- APPLYDISCOUNT
            SELECT 'APPLY_DISCOUNT' as 'type', COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price
           FROM ( SELECT r.modifierId,   r.price, r.applyDiscount, d.name AS 'descl'
             FROM cart_item  AS i
               JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
              JOIN discount AS d ON d.id = r.applyDiscount
             WHERE i.menuId = ${row['menuId']}  
             AND i.cartId = '${cartId}' AND i.presence = 1  
            
             AND r.presence = 1  
         ) AS t1
           GROUP BY t1.descl, t1.price    
         `;
      const [modifier] = await db.query(s);
      row.modifier = modifier; // tambahkan hasil ke properti maps 

   }

   const [sc] = await db.query(`
        SELECT t1.*, 'SC' as 'type' , a.scNote AS 'name' FROM (
            SELECT m.menuTaxScId, SUM(m.price) AS 'totalAmount', COUNT(m.menuTaxScId) AS 'totalQty'
            FROM cart_item_modifier AS m
            JOIN cart_item AS i ON i.id = m.cartItemId
            WHERE m.presence= 1     ${subgroup == 0 ? '' : ' AND i.subgroup = ' + subgroup} 
            AND m.cartId = '${cartId}'  AND m.menuTaxScId != 0 AND m.scStatus != 0
            GROUP BY m.menuTaxScId 
        )AS t1
        JOIN menu_tax_sc AS a ON a.id = t1.menuTaxScId
    `);

   const [tax] = await db.query(`
        SELECT t1.* , 'SC' as 'TAX' , a.taxNote AS 'name' FROM (
            SELECT m.menuTaxScId, SUM(m.price) AS 'totalAmount', COUNT(m.menuTaxScId) AS 'totalQty'
            FROM cart_item_modifier AS m
            JOIN cart_item AS i ON i.id = m.cartItemId
            WHERE m.presence= 1   ${subgroup == 0 ? '' : ' AND i.subgroup = ' + subgroup} 
            AND  m.cartId = '${cartId}' AND m.menuTaxScId != 0 AND m.taxStatus != 0
            GROUP BY menuTaxScId 
        )AS t1
        JOIN menu_tax_sc AS a ON a.id = t1.menuTaxScId
    `);

   const taxSc = [];

   sc.forEach(element => {
      taxSc.push(element);
   });
   tax.forEach(element => {
      taxSc.push(element);
   });

   formattedRows.forEach(element => {
      subTotal += parseInt(element['totalAmount']);
      totalItem += element['total'];
      itemTotal += parseInt(element['totalAmount']);
      element['modifier'].forEach(element => {
         subTotal += parseInt(element['price']);
         if (parseInt(element['price']) > 0) {
            itemTotal += parseInt(element['price']);
         }
      });
   });
   grandTotal = grandTotal + subTotal;
   taxSc.forEach(element => {
      grandTotal += parseInt(element['totalAmount']);
   });

   let paid = 0;
   const [cartPayment] = await db.query(`
        SELECT  c.id, p.name,  c.paid, c.tips, c.submit
        FROM  cart_payment as c
        JOIN check_payment_type AS p ON p.id = c.checkPaymentTypeId
        WHERE c.presence= 1   and c.cartId = '${cartId}' and c.submit = 1
        ORDER BY c.id 
    `);
   let tips = 0;
   cartPayment.forEach(element => {
      paid += element['paid'];
      tips += element['tips'];
   });


   const [discountGroup] = await db.query(`
       SELECT d.name,
            m.applyDiscount, COUNT(m.applyDiscount) AS 'qty', 
        SUM(m.price) AS 'amount'
        FROM cart_item_modifier AS m 
        LEFT JOIN discount AS d ON d.id = m.applyDiscount
        WHERE m.applyDiscount != 0 AND m.cartId = '${cartId}'
        GROUP BY m.applyDiscount
    `);





   return {
      cart: formattedRows,
      taxSc: taxSc,
      itemTotal: itemTotal,
      subTotal: subTotal,
      discountGroup: discountGroup,
      grandTotal: grandTotal,
      totalItem: totalItem,
      cartPayment: cartPayment,
      unpaid: grandTotal - paid < 0 ? 0 : (grandTotal - paid),
      change: grandTotal - paid < 0 ? (grandTotal - paid) * -1 : 0,
      tips: tips,
   }
}

async function taxScUpdate(cartItem = 0) {
   let scAmount = 0;
   let taxAmount = 0;

   const q2 = `
        --  q2
        SELECT IFNULL(SUM(price),0) AS 'total' 
        FROM cart_item_modifier
        WHERE cartItemId = ${cartItem}
        AND presence =1 AND void = 0 and menuTaxScId = 0
    `;
   const [totalAmountModifier] = await db.query(q2);


   const m1 = `
        -- m1
        SELECT price + ${parseInt(totalAmountModifier[0]['total'])} as 'price' 
        FROM cart_item 
        WHERE id = ${cartItem} AND presence =1 AND void = 0 
    `;

   const [itemPriceDb] = await db.query(m1);
   let itemPrice = itemPriceDb[0]['price'];

   const results = [];
   const scQ =
      `SELECT id, scRate
              FROM cart_item_modifier
              WHERE cartItemId = ${cartItem}
              AND presence =1 AND void = 0   and scStatus = 1
            `;
   const [scRow] = await db.query(scQ);

   const taxQ =
      `SELECT id, taxRate
              FROM cart_item_modifier
              WHERE cartItemId = ${cartItem}
              AND presence =1 AND void = 0   and taxStatus = 1
            `;
   const [taxRow] = await db.query(taxQ);

   if (scRow.length > 0) {
      scAmount = itemPrice * (parseFloat(scRow[0]['scRate']) / 100);
   }
   if (taxRow.length > 0) {


      const m3 = ` 
            SELECT price  
            FROM cart_item 
            WHERE id = ${cartItem} AND presence =1 AND void = 0 
        `;

      const [orgPrice] = await db.query(m3);


      taxAmount = (orgPrice[0]['price'] + scAmount) * (parseFloat(taxRow[0]['taxRate']) / 100);
   }

   const a = `
    SELECT c.id, c.menuId, m.name, m.menuTaxScId, t.taxStatus, t.scStatus
        FROM cart_item  AS c
        JOIN menu AS m ON m.id = c.menuId
        JOIN menu_tax_sc AS t ON t.id = m.menuTaxScId
    WHERE c.id = ${cartItem} `;
   const [menu] = await db.query(a);

   // UPDATE SC
   if (scAmount != 0 && menu[0]['scStatus'] == 1) {
      const q2 = `UPDATE cart_item_modifier
                  SET
                    price = ${scAmount}, 
                    updateDate = '${today()}'
                WHERE id = ${scRow[0]['id']}`;
      const [result2] = await db.query(q2);
      if (result2.affectedRows === 0) {
         results.push({ status: 'not found' });
      } else {
         results.push({ status: 'SC cart_item_modifier Update' });
      }

   }



   // UPDATE TAX
   if (taxAmount != 0 && menu[0]['taxStatus'] == 1) {
      const q2 = `UPDATE cart_item_modifier
                  SET
                    price = ${taxAmount}, 
                    updateDate = '${today()}'
                WHERE id = ${taxRow[0]['id']}`;
      const [result2] = await db.query(q2);
      if (result2.affectedRows === 0) {
         results.push({ status: 'not found' });
      } else {
         results.push({ status: 'SC cart_item_modifier Update' });
      }
   }

   return {
      error: false,
      scAmount: scAmount,
      taxAmount: taxAmount
   };
}

// versi static no 7 
// Doc https://docs.google.com/spreadsheets/d/1PwaWb7-uEJ-bTzDbkgKmH-vcuIoJSJmezfw-ZuJBvZQ/edit?usp=sharing 
async function scUpdate(cartItem = 0) {
   let scAmount = 0;
   let taxAmount = 0;

   const q2 = ` 
        SELECT IFNULL(SUM(price),0) AS 'total' 
        FROM cart_item_modifier
        WHERE cartItemId = ${cartItem}
        AND presence =1 AND void = 0 and menuTaxScId = 0
    `;
   const [totalAmountModifier] = await db.query(q2);


   const m1 = `
        -- Harga item + modifier non taxsc - (discount)
        SELECT price + ${parseInt(totalAmountModifier[0]['total'])} as 'price' 
        FROM cart_item 
        WHERE id = ${cartItem} AND presence =1 AND void = 0 
    `;

   const [itemPriceDb] = await db.query(m1);

   let itemPrice = 0;
   // bagaimana jika itemPriceDb kosong
   if (!itemPriceDb || itemPriceDb.length === 0) {
      console.log('CANNOT FIND ITEM PRICE, itemPriceDb is empty');
   } else {
      itemPrice = itemPriceDb[0]['price'];

      const results = [];
      const scQ =
         `SELECT id, scRate
         FROM cart_item_modifier
      WHERE cartItemId = ${cartItem}
         AND presence =1 AND void = 0   and scStatus = 1
      `;
      const [scRow] = await db.query(scQ);


      if (scRow.length > 0) {
         scAmount = itemPrice * (parseFloat(scRow[0]['scRate']) / 100);
      }


      const a = `
      SELECT c.id, c.menuId, m.name, m.menuTaxScId, t.taxStatus, t.scStatus
         FROM cart_item  AS c
         JOIN menu AS m ON m.id = c.menuId
         JOIN menu_tax_sc AS t ON t.id = m.menuTaxScId
      WHERE c.id = ${cartItem} `;
      const [menu] = await db.query(a);

      // UPDATE SC
      if (scAmount != 0 && menu[0]['scStatus'] == 1) {
         const q2 = `UPDATE cart_item_modifier
                  SET
                    price = ${scAmount}, 
                    updateDate = '${today()}'
                WHERE id = ${scRow[0]['id']}`;
         const [result2] = await db.query(q2);
         if (result2.affectedRows === 0) {
            results.push({ status: 'not found' });
         } else {
            results.push({ status: 'SC cart_item_modifier Update' });
         }

      }
   }


   return {
      error: false,
      scAmount: scAmount,
   };
}

// Versi 1 
async function scUpdateDinamic(cartItem = 0) {
   let scAmount = 0;
   let taxAmount = 0;

   const q2 = `
        --  q2
        SELECT IFNULL(SUM(price),0) AS 'total' 
        FROM cart_item_modifier
        WHERE cartItemId = ${cartItem}
        AND presence =1 AND void = 0 and menuTaxScId = 0
    `;
   const [totalAmountModifier] = await db.query(q2);


   const m1 = `
        -- m1
        SELECT price + ${parseInt(totalAmountModifier[0]['total'])} as 'price' 
        FROM cart_item 
        WHERE id = ${cartItem} AND presence =1 AND void = 0 
    `;

   const [itemPriceDb] = await db.query(m1);

   let itemPrice = 0;
   // bagaimana jika itemPriceDb kosong
   if (!itemPriceDb || itemPriceDb.length === 0) {
      console.log('itemPriceDb is empty');
   } else {
      itemPrice = itemPriceDb[0]['price'];



      const results = [];
      const scQ =
         `SELECT id, scRate
              FROM cart_item_modifier
              WHERE cartItemId = ${cartItem}
              AND presence =1 AND void = 0   and scStatus = 1
            `;
      const [scRow] = await db.query(scQ);

      const taxQ =
         `SELECT id, taxRate
              FROM cart_item_modifier
              WHERE cartItemId = ${cartItem}
              AND presence =1 AND void = 0   and taxStatus = 1
            `;
      const [taxRow] = await db.query(taxQ);

      if (scRow.length > 0) {
         scAmount = itemPrice * (parseFloat(scRow[0]['scRate']) / 100);
      }
      if (taxRow.length > 0) {


         const m3 = ` 
            SELECT price  
            FROM cart_item 
            WHERE id = ${cartItem} AND presence =1 AND void = 0 
        `;

         const [orgPrice] = await db.query(m3);


         taxAmount = (orgPrice[0]['price'] + scAmount) * (parseFloat(taxRow[0]['taxRate']) / 100);
      }

      const a = `
    SELECT c.id, c.menuId, m.name, m.menuTaxScId, t.taxStatus, t.scStatus
        FROM cart_item  AS c
        JOIN menu AS m ON m.id = c.menuId
        JOIN menu_tax_sc AS t ON t.id = m.menuTaxScId
    WHERE c.id = ${cartItem} `;
      const [menu] = await db.query(a);

      // UPDATE SC
      if (scAmount != 0 && menu[0]['scStatus'] == 1) {
         const q2 = `UPDATE cart_item_modifier
                  SET
                    price = ${scAmount}, 
                    updateDate = '${today()}'
                WHERE id = ${scRow[0]['id']}`;
         const [result2] = await db.query(q2);
         if (result2.affectedRows === 0) {
            results.push({ status: 'not found' });
         } else {
            results.push({ status: 'SC cart_item_modifier Update' });
         }

      }
   }


   return {
      error: false,
      scAmount: scAmount,
      taxAmount: taxAmount
   };
}

async function taxUpdate(cartItem = 0) {
   let scAmount = 0;
   let taxAmount = 0;

   const q2 = `
        --  q2
        SELECT IFNULL(SUM(price),0) AS 'total' 
        FROM cart_item_modifier
        WHERE cartItemId = ${cartItem}
        AND presence =1 AND void = 0 and menuTaxScId = 0 AND applyDiscount = 0
    `;
   const [totalAmountModifierData] = await db.query(q2);

   const t1 = `
    SELECT c.menuId , m.menuTaxScId, t.scTaxIncluded
        FROM cart_item AS c
        JOIN menu AS m ON m.id = c.menuId
        JOIN menu_tax_sc AS t ON t.id = m.menuTaxScId
        WHERE c.id = ${cartItem};
    `;
   const [menuQuery] = await db.query(t1);


   const totalAmountModifier = parseInt(totalAmountModifierData[0]['total']);


   const m1 = `
        -- m1
        SELECT price + ${totalAmountModifier} as 'price' 
        FROM cart_item 
        WHERE id = ${cartItem} AND presence =1 AND void = 0 
    `;

   const [itemPriceDb] = await db.query(m1);

   let itemPrice = 0;
   // bagaimana jika itemPriceDb kosong
   if (!itemPriceDb || itemPriceDb.length === 0) {
      console.log('itemPriceDb is empty');
   } else {
      itemPrice = itemPriceDb[0]['price'];


      const results = [];
      const sqlSc =
         ` 
         SELECT SUM( price) AS 'price'
            FROM cart_item_modifier
         WHERE cartItemId = ${cartItem}
            AND presence =1 AND void = 0   and scStatus = 1  
        `;
      const [scRow] = await db.query(sqlSc);
      scAmount = (parseFloat(scRow[0]['price']) || 0);

      const taxQ =
         `SELECT id, taxRate
              FROM cart_item_modifier
              WHERE cartItemId = ${cartItem}
              AND presence =1 AND void = 0   and taxStatus = 1
            `;
      const [taxRow] = await db.query(taxQ);


      if (taxRow.length > 0) {
         const taxRate = parseFloat(taxRow[0]['taxRate']) / 100;
         taxAmount = (itemPrice + scAmount) * taxRate;
      }

      const a = `
      SELECT c.id, c.menuId, m.name, m.menuTaxScId, t.taxStatus, t.scStatus
         FROM cart_item  AS c
         JOIN menu AS m ON m.id = c.menuId
         JOIN menu_tax_sc AS t ON t.id = m.menuTaxScId
      WHERE c.id = ${cartItem} `;
      const [menu] = await db.query(a);


      // UPDATE TAX
      if (taxAmount != 0 && menu[0]['taxStatus'] == 1) {
         const q2 = `UPDATE cart_item_modifier
                  SET
                    price = ${taxAmount}, 
                    updateDate = '${today()}'
                WHERE id = ${taxRow[0]['id']}`;
         const [result2] = await db.query(q2);
         if (result2.affectedRows === 0) {
            results.push({ status: 'not found' });
         } else {
            results.push({ status: 'SC cart_item_modifier Update' });
         }
      }
   }
   return {
      error: false,
      taxAmount: taxAmount
   };
}
// ver 1 dynamic tax
async function taxUpdateDinamic(cartItem = 0) {
   let scAmount = 0;
   let taxAmount = 0;

   const q2 = `
        --  q2
        SELECT IFNULL(SUM(price),0) AS 'total' 
        FROM cart_item_modifier
        WHERE cartItemId = ${cartItem}
        AND presence =1 AND void = 0 and menuTaxScId = 0
    `;
   const [totalAmountModifierData] = await db.query(q2);

   const t1 = `
    SELECT c.menuId , m.menuTaxScId, t.scTaxIncluded
        FROM cart_item AS c
        JOIN menu AS m ON m.id = c.menuId
        JOIN menu_tax_sc AS t ON t.id = m.menuTaxScId
        WHERE c.id = ${cartItem};
    `;
   const [menuQuery] = await db.query(t1);
   const scTaxIncluded = menuQuery[0]['scTaxIncluded'];


   const totalAmountModifier = parseInt(totalAmountModifierData[0]['total']);


   const m1 = `
        -- m1
        SELECT price + ${totalAmountModifier} as 'price' 
        FROM cart_item 
        WHERE id = ${cartItem} AND presence =1 AND void = 0 
    `;

   const [itemPriceDb] = await db.query(m1);

   let itemPrice = 0;
   // bagaimana jika itemPriceDb kosong
   if (!itemPriceDb || itemPriceDb.length === 0) {
      console.log('itemPriceDb is empty');
   } else {
      itemPrice = itemPriceDb[0]['price'];


      let addQuery = '';
      if (scTaxIncluded == 1) {

      }

      const results = [];
      const addFee =
         `SELECT SUM(t.price) AS 'price' FROM (
            SELECT id, scRate, price, applyDiscount
                    FROM cart_item_modifier
                WHERE cartItemId = ${cartItem}
                    AND presence =1 AND void = 0   and scStatus = 1 
                    
                UNION 

                SELECT id, scRate, price, applyDiscount
                    FROM cart_item_modifier
                WHERE cartItemId = ${cartItem}
                    AND presence =1 AND void = 0   AND applyDiscount !=0 
            ) AS t 
        `;
      const [scRow] = await db.query(addFee);

      const taxQ =
         `SELECT id, taxRate
              FROM cart_item_modifier
              WHERE cartItemId = ${cartItem}
              AND presence =1 AND void = 0   and taxStatus = 1
            `;
      const [taxRow] = await db.query(taxQ);

      if (scRow.length > 0) {
         scAmount = (parseFloat(scRow[0]['price']) || 0);
      }
      if (taxRow.length > 0) {


         const m3 = ` 
            SELECT price  
            FROM cart_item 
            WHERE id = ${cartItem} AND presence =1 AND void = 0 
        `;

         const [orgPrice] = await db.query(m3);


         taxAmount = (orgPrice[0]['price'] + scAmount) * (parseFloat(taxRow[0]['taxRate']) / 100);
      }

      const a = `
    SELECT c.id, c.menuId, m.name, m.menuTaxScId, t.taxStatus, t.scStatus
        FROM cart_item  AS c
        JOIN menu AS m ON m.id = c.menuId
        JOIN menu_tax_sc AS t ON t.id = m.menuTaxScId
    WHERE c.id = ${cartItem} `;
      const [menu] = await db.query(a);


      // UPDATE TAX
      if (taxAmount != 0 && menu[0]['taxStatus'] == 1) {
         const q2 = `UPDATE cart_item_modifier
                  SET
                    price = ${taxAmount}, 
                    updateDate = '${today()}'
                WHERE id = ${taxRow[0]['id']}`;
         const [result2] = await db.query(q2);
         if (result2.affectedRows === 0) {
            results.push({ status: 'not found' });
         } else {
            results.push({ status: 'SC cart_item_modifier Update' });
         }
      }
   }
   return {
      error: false,
      taxAmount: taxAmount
   };
}


// ver 2 

async function discountMaxAmountByPercent(cartId = '') {
   try {
      // resert all discount to original credit amount
      const resetQuery = `
         SELECT a.id,  a.discountId, i.price, a.rate, i.price * (a.rate/100) AS 'discountAmount'
         FROM cart_item_discount AS a
         LEFT JOIN cart_item AS i ON i.id = a.cartItemId
         WHERE a.cartId= '${cartId}' AND a.presence = 1 AND a.void = 0
         AND a.rate > 0
      `;
      const [discountRows] = await db.query(resetQuery);

      for (const row of discountRows) {
         const updateQuery = `
         UPDATE cart_item_discount
            SET credit = ${row.discountAmount}
         WHERE id = ${row.id}
         `;
         //console.log(updateQuery);
         await db.query(updateQuery);
      }

      const update = 1;
      if (update == 1) {

         const a = `
      SELECT t1.*, d.maxDiscount, d.discRate 
         FROM (
            SELECT  a.discountId, SUM((a.credit) * i.qty) AS 'totalDiscount' 
            FROM cart_item_discount AS a
            LEFT JOIN cart_item AS i ON i.id = a.cartItemId
            WHERE a.cartId= '${cartId}' AND a.presence = 1 AND a.void = 0
            GROUP BY a.discountId
         ) AS t1 
      JOIN discount AS d ON d.id = t1.discountId
      WHERE d.discRate > 0 AND d.maxDiscount > 0  
      AND t1.totalDiscount > d.maxDiscount+1
      `;
     //    console.log(a);
         const [queryA] = await db.query(a);
         for (const rec of queryA) {
            const d = `SELECT  a.discountId, SUM( i.qty) AS 'qty'
            FROM cart_item_discount AS a
            LEFT JOIN cart_item AS i ON i.id = a.cartItemId
            JOIN discount AS d ON d.id = a.discountId
            WHERE a.cartId= '${cartId}' AND a.presence = 1 AND a.void = 0
            AND d.discRate > 0 AND d.maxDiscount > 0 AND a.discountId = ${rec['discountId']}
            GROUP BY a.discountId`;
            const [queryD] = await db.query(d);
            let qtyTotal = parseInt(queryD[0]['qty']) || 0;
           //   console.log(d,queryD, qtyTotal);

            // select cart_item_discount 
            const j = ` 
            SELECT  c.id, i.qty
            FROM cart_item_discount  AS c
            join cart_item AS i ON c.cartItemId = i.id
            WHERE c.cartId = '${cartId}' AND  c.discountId = ${rec['discountId']}
            AND c.presence = 1 AND c.void = 0
            AND i.presence = 1 AND i.void = 0; 
            `;
            //   console.log('j',j)
            const [queryJ] = await db.query(j);
            for (const row of queryJ) {
               // update per item
               let creditAmount = parseFloat((parseInt(rec['maxDiscount']) / qtyTotal)).toFixed(2);

               //  creditAmount = Math.ceil(creditAmount);

               const k1 = `
               UPDATE cart_item_discount SET
                  credit = ${creditAmount}
               WHERE id = ${row['id']}
                  `;
               //  console.log('k1',k1);
               await db.query(k1);
            }
         }
      }
      return { success: true, message: "Discounts updated successfully." };
   } catch (error) {
      console.error('Error in discountMaxAmountByPercent:', error);
      return { success: false, message: "An error occurred while updating discounts.", error };
   }
}


async function discountMaxPerItem(cartId = '') {
   try {

      const a = `
         SELECT d.id AS 'discountId', COUNT(d.id) AS 'totalDiscountMax'
         FROM cart_item_discount AS c
         JOIN discount AS d ON d.id = c.discountId
         WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void = 0
         AND  d.discAmount > 0
         GROUP BY d.id
      `;
      const [queryA] = await db.query(a);
      for (const rec of queryA) {

         const j = ` 
            SELECT 
               d.id AS 'discountId', 
               SUM((i.debit - i.credit) * i.qty) AS totalAmount
            FROM cart_item_discount AS c
               JOIN discount AS d ON d.id = c.discountId 
               JOIN cart_item	 AS i ON i.id = c.cartItemId
            WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void = 0
               AND d.discAmount > 0
               AND d.id = ${rec['discountId']}
            GROUP BY d.id
         `;

         const [totalItem] = await db.query(j);

         // Total amount dari semua item yang dapat diskon ini
         let totalAmount = totalItem[0]?.['totalAmount'] || 0;


         const d = `
            SELECT c.id,  c.cartItemId, i.price, i.qty, i.price * i.qty AS 'totalItem', 
            d.discAmount, 
            ((i.price * i.qty) / ${totalAmount}) * 100 AS 'quotaDiscount', 
            (((i.price * i.qty) / ${totalAmount}) * 100) * (d.discAmount / 100) AS 'discountMaxPerItemXqty',
            ((((i.price * i.qty) / ${totalAmount}) * 100) * (d.discAmount / 100)) / i.qty as 'discountMaxPerItem' 
            FROM cart_item_discount AS c
            JOIN cart_item AS i ON i.id = c.cartItemId
            JOIN discount AS d ON d.id = c.discountId
            WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void = 0 AND i.presence = 1 AND i.void = 0
            AND  d.discAmount > 0
            AND d.id = ${rec['discountId']}
         `;
         const [queryD] = await db.query(d);

         for (const row of queryD) {
            let discoutAmountItem = 0;

            if (parseFloat(row['discountMaxPerItemXqty']) >= row['totalItem']) {
               discoutAmountItem = parseFloat(row['totalItem']) / row['qty'];

               // update lagi jika ada discount percent
               /*
               const k1 = `SELECT  SUM( credit) AS 'discountPercent' 
                  FROM cart_item_discount 
                  WHERE presence = 1 AND void = 0
                  AND cartId = '000220' AND cartItemId = 1 AND  rate > 0
                  `;
               const [discountPercentData] = await db.query(k1);
               discoutAmountItem = discoutAmountItem - parseInt(discountPercentData[0]['discountPercent'] || 0);
               */

            } else {
               discoutAmountItem = parseFloat(row['discountMaxPerItem']);

            }

            const q2 = `
               UPDATE cart_item_discount SET
               credit = ${discoutAmountItem}
               WHERE id = ${row['id']}
            `;

            await db.query(q2);
         }
      }

      // setelah semua di update, jalankan summary untuk mendapatkan subtotal terbaru

      const x1 = `
         SELECT  
            t1.cartItemId, 
            sum(t1.qty) AS 'qty',
            sum(t1.debit-t1.credit) * sum(t1.qty) AS 'subTotal'

         FROM (
            SELECT i.cartId, i.id AS 'cartItemId', i.qty, i.debit, i.credit , i.inputDate
            FROM cart_item AS i
            WHERE i.cartId = '${cartId}' AND (i.debit  - i.credit != 0)
            AND i.presence = 1 AND i.void = 0  
            UNION

            SELECT i.cartId, i.cartItemId, 0 AS 'qty', i.debit, i.credit  , i.inputDate
            FROM cart_item_modifier AS i
            WHERE i.cartId = '${cartId}'   AND (i.debit  - i.credit != 0)
            AND i.presence = 1 AND i.void = 0  
            UNION

            SELECT i.cartId, i.cartItemId, 0 AS 'qty', i.debit, i.credit  , i.inputDate
            FROM cart_item_discount AS i
            WHERE i.cartId = '${cartId}'  AND (i.debit  - i.credit != 0)
            AND i.presence = 1 AND i.void = 0   AND i.rate > 0 
         )
         AS t1
         GROUP BY cartItemId
         ORDER BY t1.cartItemId ASC;
      `;

      const [subTotalRow] = await db.query(x1);

      for (const row of subTotalRow) {
         let subTotal = parseFloat(row['subTotal']);

         const x2 = `
            SELECT    
               i.id, i.cartItemId, r.qty,  
					i.credit AS 'discountMaxPerItem', 
					r.qty *  i.credit AS 'discountMax'
            FROM cart_item_discount AS i
            join cart_item AS r ON r.id = i.cartItemId
            WHERE i.cartId = '${cartId}'  AND (i.debit  - i.credit != 0)
            AND i.presence = 1 AND i.void = 0 AND i.rate <= 0 
            AND i.cartItemId = ${row['cartItemId']}
				ORDER BY i.cartItemId ASC;
         `;
         const [discountMaxOriginal] = await db.query(x2);
         // console.log(subTotal, discountMaxOriginal);


         for (const discRow of discountMaxOriginal) {

            let discountMax = parseFloat(discRow['discountMax']);


            if (subTotal < discountMax) {
               discountMax = subTotal;
            }
            const u = `
               UPDATE cart_item_discount SET
               credit = ${Math.abs(discountMax) / discRow['qty']}
               WHERE id = ${discRow['id']}
            `;

            subTotal = subTotal - discountMax;



            await db.query(u);

         }

      }


      return { success: true, message: "Discounts updated successfully." };
   } catch (error) {
      console.error("Error in discountMaxPerItem:", error);
      return { success: false, message: "An error occurred while updating discounts.", error };
   }
}


async function summary(cartId = '') {
   try {
      const q = `
         SELECT t1.cartItemId, 
         sum(t1.debit) * sum(t1.qty) AS 'itemTotal' ,
         sum(t1.debit-t1.credit) * sum(t1.qty) AS 'subTotal' 

         FROM (
            SELECT i.cartId, i.id AS 'cartItemId', i.qty, i.debit, i.credit , i.inputDate
            FROM cart_item AS i 
            WHERE i.cartId = '${cartId}' AND (i.debit  - i.credit != 0)
            AND i.presence = 1 AND i.void = 0	 
            UNION 
            
            SELECT i.cartId, i.cartItemId, 0 AS 'qty', i.debit, i.credit  , i.inputDate
            FROM cart_item_modifier AS i 
            WHERE i.cartId = '${cartId}'   AND (i.debit  - i.credit != 0)
            AND i.presence = 1 AND i.void = 0 
            UNION 
            
            SELECT i.cartId, i.cartItemId, 0 AS 'qty', i.debit, i.credit  , i.inputDate
            FROM cart_item_discount AS i 
            WHERE i.cartId = '${cartId}'  AND (i.debit  - i.credit != 0) 
            AND i.presence = 1 AND i.void = 0
         ) 
         AS t1 
         GROUP BY cartItemId
         ORDER BY t1.cartItemId ASC;
      `;

      const result = await db.query(q);


      // result[0] convert to array
      const cartItems = Array.isArray(result[0]) ? result[0] : [];

      cartItems.forEach(element => {
         element['itemTotal'] = parseInt(element['itemTotal']);
         element['subTotal'] = parseInt(element['subTotal']);
      });


      return cartItems;
   } catch (error) {
      console.error("Error in taxScUpdate2:", error);
      return [];
   }
}

async function scTaxUpdate2(cartId = '') {
   try {
      const summaryFunction = await summary(cartId);

      for (const rec of summaryFunction) {

         // SC UPDATE
         const s = `
            SELECT s.* , i.qty
            FROM cart_item_sc AS s
            JOIN cart_item AS i ON i.id  =  s.cartItemId
            WHERE s.cartItemId = ${rec.cartItemId} 
            AND s.cartId = '${cartId}'
            AND s.presence = 1 AND s.void = 0 
         `;
         const [scRows] = await db.query(s);

         for (const scRow of scRows) {
            let newScAmount = Math.round((rec.subTotal / scRow['qty']) * (scRow['rate'] / 100));

            const u = `
               UPDATE cart_item_sc SET 
               debit = ${newScAmount < 0 ? 0 : newScAmount},
               credit = 0,
               updateDate = '${today()}'
               WHERE id = ${scRow['id']}
            `;

            await db.query(u);
         }


         // TAX UPDATE
         const t = `
            SELECT s.* , i.qty
            FROM cart_item_tax AS s
            JOIN cart_item AS i ON i.id  =  s.cartItemId
            WHERE s.cartItemId = ${rec.cartItemId} 
            AND s.cartId = '${cartId}'
            AND s.presence = 1 AND s.void = 0 
         `;
         const [taxRows] = await db.query(t);
         for (const taxRow of taxRows) {

            const s = ` 
               SELECT SUM(s.debit) AS 'scTotal' 
               FROM cart_item_sc AS s
               WHERE s.cartItemId =  ${rec.cartItemId} 
               AND s.cartId = '${cartId}'
               AND s.presence = 1 AND s.void = 0;
            `;
            const [scTotalData] = await db.query(s);
            let scTotal = parseInt(scTotalData[0]['scTotal'] || 0);
          //  console.log(taxRow,  scTotal, scTotalData[0]['scTotal'], taxRow['qty']);
            let newTaxAmount = Math.round(((rec.itemTotal / taxRow['qty']) + scTotal) * (taxRow['rate'] / 100));
          //   console.log('newTaxAmount : ', rec.itemTotal, '/', taxRow['qty'],'+' , scTotal, '*', taxRow['rate']);
          //  console.log('newTaxAmount :', newTaxAmount);
            const u = `
               UPDATE cart_item_tax SET 
               debit = ${newTaxAmount < 0 ? 0 : newTaxAmount},
               credit = 0,
               updateDate = '${today()}'
               WHERE id = ${taxRow['id']}
            `;
            await db.query(u);

         }


      }

      // const [cartItems] = await summary(cartId);
      // console.log('taxScUpdate2 cartItems : ', cartItems);
      return { success: true, message: "Tax and SC updated successfully." };
   } catch (error) {
      console.error("Error in taxScUpdate2:", error);
      return { success: false, message: "An error occurred while updating Tax and SC.", error };
   }
}


module.exports = {
   cart, taxScUpdate, cartHistory, taxUpdate, scUpdate, cartGrouping,
   discountMaxPerItem,
   scTaxUpdate2, summary, discountMaxAmountByPercent
};