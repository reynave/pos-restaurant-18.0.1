const db = require('../config/db'); // sesuaikan path kalau perlu 
const { today } = require('./global');

async function cart(cartId = '') {
   let subTotal = 0;
   let grandTotal = 0;
   let totalItem = 0;
   let isGrouping = 0;
   let itemTotal = 0;
   let subgroup = 1;

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
        c.sendOrder, c.inputDate, c.inputBy, c.updateDate, c.updateBy, e.name AS 'employeeName',  '' as printerRows
        FROM cart_item AS c
        JOIN menu AS m ON m.id = c.menuId
        left join employee as e on e.id = c.inputBy
        WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void  = 0 
        ORDER BY  c.inputDate ASC 
      `;
   const [formattedRows] = await db.query(q);

   let itemCart = formattedRows;

   // qty * price
   itemCart.forEach(row => {
      row['totalAmount'] = row['price'] * row['total'];
   });



   // DETAIL / MODIFIER 
   const s = ` 
        -- CUSTOM NOTES
          SELECT  'MODIFIER' as 'type',  r.id, i.id AS cartItemId, r.menuTaxScId AS modifierId, r.note AS descl, r.price, 
          NULL AS rateOrDiscount, NULL AS remark, 1 as 'modifier', 0 as 'checkBox', r.sendOrder, i.inputDate, i.inputBy, i.updateDate, i.updateBy
          FROM cart_item  AS i
          RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
          WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
          AND r.presence = 1 AND i.void = 0 AND r.modifierId = 0 AND r.note != ''
    
          UNION
    
          -- MODIFIER
          SELECT  'MODIFIER' as 'type',  r.id, i.id AS cartItemId, r.modifierId, m.descl, r.price, 
          NULL AS rateOrDiscount, r.remark, 1 as 'modifier', 0 as 'checkBox', r.sendOrder, i.inputDate, i.inputBy, i.updateDate, i.updateBy
          FROM cart_item  AS i 
          RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id
          JOIN modifier AS m ON m.id = r.modifierId 
          WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
          AND r.presence = 1 AND i.void = 0   
    
          UNION
    
          -- DISCOUNT
          SELECT 'APPLY_DISCOUNT' as 'type',  r.id,i.id AS cartItemId, r.modifierId, d.name AS descl, r.price,
           r.applyDiscount AS rateOrDiscount, r.remark, 1 as 'modifier', 0 as 'checkBox', r.sendOrder, i.inputDate, i.inputBy, i.updateDate, i.updateBy
          FROM cart_item  AS i
             JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
             JOIN discount AS d ON d.id = r.applyDiscount
          WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
             AND r.presence = 1 AND i.void = 0  
     
          `;
   const [modifier] = await db.query(s);


   // Merge detail into header
   const items = itemCart.map(header => {
      const itemModifier = modifier
         .filter(detail => detail.cartItemId === header.id)
         .map(detail => ({ ...detail, totalAmount: detail.price * header.total, total: header.total })); // Add qty from header to each modifier
      return { ...header, modifier: itemModifier };
   });



   const [sc] = await db.query(`
        SELECT t1.*, 'SC' as 'type' , a.scNote AS 'name', a.scRate as 'rate' FROM (
           SELECT m.menuTaxScId,  SUM( i.qty) AS 'totalQty', 
            sum(m.price * i.qty) AS 'totalAmount'
            FROM cart_item_modifier AS m
            JOIN cart_item AS i ON i.id = m.cartItemId
            WHERE m.presence= 1 AND m.void = 0      
            AND m.cartId = '${cartId}'  AND m.menuTaxScId != 0 AND m.scStatus != 0 and i.presence = 1
            GROUP BY m.menuTaxScId 
        )AS t1
        JOIN menu_tax_sc AS a ON a.id = t1.menuTaxScId
    `);

   const taxq = `
        SELECT t1.* , 'TAX' as 'type' , a.taxNote AS 'name', a.taxRate as 'rate'  FROM (
            SELECT m.menuTaxScId,  SUM( i.qty) AS 'totalQty', 
            sum(m.price * i.qty) AS 'totalAmount'
            FROM cart_item_modifier AS m
            JOIN cart_item AS i ON i.id = m.cartItemId
            WHERE m.presence= 1 AND m.void = 0  
            AND  m.cartId = '${cartId}' AND m.menuTaxScId != 0 AND m.taxStatus != 0 and i.presence = 1
            GROUP BY menuTaxScId 
        )AS t1
        JOIN menu_tax_sc AS a ON a.id = t1.menuTaxScId
    `;
   const [tax] = await db.query(taxq);

   const taxSc = [];

   sc.forEach(element => {
      taxSc.push(element);
   });
   tax.forEach(element => {
      taxSc.push(element);
   });

   items.forEach(element => {
      //  subTotal += parseInt(element['totalAmount']);
      totalItem += element['total'];
      itemTotal += parseInt(element['totalAmount']);
      element['modifier'].forEach(element => {
         //   subTotal += parseInt(element['price']);
         if (parseInt(element['price']) > 0) {
            itemTotal += parseInt(element['price']);
         }
      });
   });
   grandTotal = 0;
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

   const ds = ` SELECT  d.name,
            m.applyDiscount,  sum(i.qty), SUM(i.price * i.qty ) AS 'subTotal', 0 as 'maxDiscount',  
          0  as 'amount', d.discAmount, 0 as 'def'
        FROM cart_item_modifier AS m 
        LEFT JOIN cart_item AS i ON i.id = m.cartItemId
        LEFT JOIN discount AS d ON d.id = m.applyDiscount
        WHERE m.applyDiscount != 0 AND m.cartId = '${cartId}'
        AND m.presence = 1 AND m.void = 0  AND d.discAmount > 0
        GROUP BY  m.applyDiscount, d.discAmount `;

   const [discountAmount] = await db.query(ds)

   discountAmount.forEach(el => {
      el['subTotal'] = parseInt(el['subTotal']);

      if ( el['discAmount'] > el['subTotal'] ) {
         el['amount'] = el['subTotal'];
      }else{
         el['amount'] = el['discAmount'];
      }

      el['amount'] = el['amount'] * -1;

   });

   const q912 = `
    SELECT a.*
      FROM (
         SELECT 
            d.name,
            m.applyDiscount,
            sum(i.qty) AS qty,
            d.maxDiscount,
            SUM(m.price * i.qty) AS amount,
            0 AS discAmount,
            SUM( d.maxDiscount + ((m.price) * (i.qty))) AS def
         FROM cart_item_modifier AS m 
         JOIN cart_item AS i ON i.id = m.cartItemId
         LEFT JOIN discount AS d ON d.id = m.applyDiscount
         WHERE m.applyDiscount != 0 
         AND m.cartId = '${cartId}' 
         AND m.presence = 1 
         AND m.void = 0
         GROUP BY m.applyDiscount, d.maxDiscount, d.name
      ) AS a 
      WHERE a.amount < 0;
`;
   let [discountGroup] = await db.query(q912);
   let fixDiscountGroup = 0; 
   discountGroup = [...discountGroup, ...discountAmount]; 

   discountGroup.forEach(row => {
      if (row['maxDiscount'] > 0 && (row['amount'] * -1) > row['maxDiscount']) {
         row['amount'] = row['maxDiscount'] * -1;
         row['name'] = row['name'] + '(Max: ' + Number(row['maxDiscount']).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\./g, ',') + ')';
      }
   });

   for (const d of discountGroup) {
      fixDiscountGroup += parseInt(d['def']);
   } 
   subTotal = itemTotal;
   discountGroup.forEach(element => {
      subTotal += parseInt(element['amount']);
   });

   grandTotal = subTotal;


   // HERE
   let newSC = subTotal * ((taxSc[0]?.['rate'] || 0) / 100);
   taxSc[0]['totalAmount'] = Math.round(newSC);


   let newTax = (itemTotal + newSC) * (taxSc[1]['rate'] / 100);
   taxSc[1]['totalAmount'] = Math.round(newTax);



   taxSc.forEach(element => {
      grandTotal += parseInt(element['totalAmount']);
   });


   const [billVersion] = await db.query(`   
        SELECT no  FROM  bill WHERE cartId = '${cartId}' ORDER BY no DESC LIMIT 1
    `);

   // bisa buatkan foreach untuk array Items, jika total = 0 maka hapus dari array
   const filteredItems = items.filter(item => item.total > 0);

   return {
      cart: items,
      billVersion: billVersion[0] ? billVersion[0]['no'] : 0,
      itemTotal: itemTotal,
      fixDiscountGroup: fixDiscountGroup,
      discountGroup: discountGroup,
      discountAmount: discountAmount,
      subTotal: subTotal,
      taxSc: taxSc,
      grandTotal: grandTotal,

      totalItem: totalItem,
      cartPayment: cartPayment,
      unpaid: grandTotal - paid < 0 ? 0 : (grandTotal - paid),
      change: grandTotal - paid < 0 ? (grandTotal - paid) * -1 : 0,
      tips: tips,
      groups: groups
   }
}

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
          SELECT  'MODIFIER' as 'type',  r.id, i.id AS cartItemId, r.menuTaxScId AS modifierId, r.note AS descl, r.price,
            0 AS 'discAmount', 0 AS 'maxDiscount', 
          NULL AS rateOrDiscount, NULL AS remark, 1 as 'modifier', 0 as 'checkBox', r.sendOrder
          FROM cart_item  AS i
          RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
          WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
          AND r.presence = 1 AND i.void = 0 AND r.modifierId = 0 AND r.note != '' and ( ${whereCartId} )
    
          UNION
    
          -- MODIFIER
          SELECT  'MODIFIER' as 'type',  r.id, i.id AS cartItemId, r.modifierId, m.descl, r.price, 
          0 AS 'discAmount', 0 AS 'maxDiscount',
          NULL AS rateOrDiscount, r.remark, 1 as 'modifier', 0 as 'checkBox', r.sendOrder
          FROM cart_item  AS i 
          RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id
          JOIN modifier AS m ON m.id = r.modifierId 
          WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
          AND r.presence = 1 AND i.void = 0   and ( ${whereCartId} )
    
      UNION 
          -- DISCOUNT
          SELECT 'APPLY_DISCOUNT' as 'type',  r.id,i.id AS cartItemId, r.modifierId, d.name AS descl,   
          r.price, d.discAmount * -1 AS 'discAmount', d.maxDiscount * -1 AS 'maxDiscount', 
           r.applyDiscount AS rateOrDiscount, r.remark, 1 as 'modifier', 0 as 'checkBox', 
           r.sendOrder
          FROM cart_item  AS i
             JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
             JOIN discount AS d ON d.id = r.applyDiscount
          WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
             AND r.presence = 1 AND i.void = 0   and ( ${whereCartId} )

      UNION
      -- SC
      SELECT 'SC' as 'type', r.id, i.id AS cartItemId, r.menuTaxScId AS modifierId, t.scNote AS descl, r.price, 
        0 AS 'discAmount', 0 AS 'maxDiscount',
      r.scRate AS rateOrDiscount, r.remark, 0 as 'modifier', 0 as 'checkBox', i.sendOrder
         FROM cart_item  AS i
         RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
         JOIN menu_tax_sc AS t ON t.id = r.menuTaxScId
      WHERE  i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
         AND r.presence = 1 AND i.void = 0 AND r.scRate != 0

      UNION 

      -- TAX
          SELECT 'TAX' as 'type', r.id, i.id AS cartItemId, r.menuTaxScId AS modifierId, t.taxNote AS descl, r.price,
        0 AS 'discAmount', 0 AS 'maxDiscount', 
      r.taxRate AS rateOrDiscount, r.remark, 0 as 'modifier', 0 as 'checkBox', i.sendOrder
         FROM cart_item  AS i
         RIGHT JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
         JOIN menu_tax_sc AS t ON t.id = r.menuTaxScId
      WHERE   i.cartId = '${cartId}' AND r.void = 0 AND r.presence = 1 
         AND r.presence = 1 AND i.void = 0 AND r.taxRate != 0
          `;
   const [modifier] = await db.query(s);


   // Merge detail into header
   const items = itemCart.map(header => {
      const itemModifier = modifier
         .filter(detail => detail.cartItemId === header.id)
         .map(detail => ({ ...detail, totalAmount: detail.price * header.total, total: header.total })); // Add qty from header to each modifier
      return { ...header, modifier: itemModifier };
   });
   let discountPercentGroup = [];
   let discountAmountGroup = [];

   let discountAmount = 0;

   let scGroup = [];
   let taxGroup = [];



   items.forEach(element => {
      itemTotal += parseInt(element['totalAmount']);

      element['modifier'].forEach(row => {
         if (row['type'] == 'APPLY_DISCOUNT' && parseInt(row['price']) < 0) {
            discountPercentGroup.push(row);
            discount += parseInt(row['totalAmount']);
         }
         if (row['type'] == 'APPLY_DISCOUNT' && parseInt(row['discAmount']) < 0) {

            const temp = {
               id: row['rateOrDiscount'],
               name: row['descl'], 
               discAmount: Math.abs(parseInt(row['discAmount']) || 0),
               totalItemPrice: Math.abs(parseInt(element['totalAmount']) || 0)
            }
            discountAmountGroup.push(temp);
         }


         if (row['type'] == 'SC') {
            sc += parseInt(row['totalAmount']);
            scGroup.push(row);
         }

         if (row['type'] == 'TAX') {
            tax += parseInt(row['totalAmount']);
            taxGroup.push(row);
         }


      });
   });


   // bisa buatkan foreach untuk array scGroup, jika rateOrDiscount  sama, maka jumlahkan totalAmount 
   // di dalam array baru yang isi nya hanya descl dan totalAmount 
   const scGroupSummary = [];
   scGroup.forEach(row => {
      const existing = scGroupSummary.find(item => item.descl === row.descl);
      if (existing) {
         existing.totalAmount += row.totalAmount;
      } else {
         scGroupSummary.push({ descl: row.descl, totalAmount: row.totalAmount });
      }
   });

   // buatkan juga untuk taxGroup
   const taxGroupSummary = [];
   taxGroup.forEach(row => {
      const existing = taxGroupSummary.find(item => item.descl === row.descl);
      if (existing) {
         existing.totalAmount += row.totalAmount;
      } else {
         taxGroupSummary.push({ descl: row.descl, totalAmount: row.totalAmount });
      }
   });

   // bisa buatkan untuk discountPercentGroup
   const discountPercentGroupSummary = [];
   discountPercentGroup.forEach(row => {
      const existing = discountPercentGroupSummary.find(item => item.rateOrDiscount === row.rateOrDiscount);   
      if (existing) {
         existing.totalAmount += row.totalAmount;
         existing.totalItem += row.total;
      } else {
         discountPercentGroupSummary.push({ rateOrDiscount: row.rateOrDiscount, name: row.descl, totalAmount: row.totalAmount, totalItem: row.total });
      }
   });
   discountPercentGroup = discountPercentGroupSummary;

   // bisa buatkan untuk discountAmountGroup sama seperti di atas, hanya saja berdasarkan id
   const discountAmountGroupSummary = [];
   discountAmountGroup.forEach(row => {
      const existing = discountAmountGroupSummary.find(item => item.id === row.id);
   

      if (existing) { 
         existing.totalItemPrice += row.totalItemPrice;
      } else {
         discountAmountGroupSummary.push({ 
            id: row.id,
            name: row.name,
            discAmount: row.discAmount,
            totalItemPrice: row.totalItemPrice
         }); 
      }
   });
   discountAmountGroup = discountAmountGroupSummary;


   const [billVersion] = await db.query(`   
        SELECT no  FROM  bill WHERE cartId = '${cartId}' ORDER BY no DESC LIMIT 1
    `);


   const result = [];
   const map = new Map();

   discountAmountGroup.forEach(item => {
      if (map.has(item.id)) {
         map.get(item.id).totalItemPrice += item.totalItemPrice;
      } else {
         // Clone object agar tidak mengubah referensi asli
         map.set(item.id, { ...item });
      }
   });

   map.forEach(val => result.push(val));
   discountAmountGroup = result;
 
   discountAmount = 0;
   discountAmountGroup.forEach(element => { 
     // element['discount'] = element['totalItemPrice'] + element['discAmount'] <= 0 ? element['totalItemPrice'] * -1 : element['discAmount'];
     // discountAmount += element['discount'];

      let subTotal = parseInt(element['totalItemPrice']) + discount; 
 
      let discAmount = parseInt(element['discAmount']) ;

      console.log('subTotal : ',subTotal, ' discount % : ',discount, ' totalItemPrice : ',element['totalItemPrice'], 'discAmount :',element['discAmount']); 
      console.log(' '); 
      
      
      let amount = 0; 

      if ( subTotal > element['discAmount'] ) {
         amount = parseInt(element['discAmount']);
      }else{
         // DISCAMOUNT < SUBTOTAL 
         //       amount = parseInt(element['discAmount']);
         amount = subTotal; 
      }
 
      element['discount'] = amount; 
      element['name'] = element['name'];
      discountAmount += amount * -1;
      // string saja
      element['discAmount'] =  discountAmount; 
   }); 
   
   discountTotal =  discount  +  discountAmount; 
   subTotal = itemTotal + discountTotal;



   scGroupSummary[0]['totalAmount'] = Math.round(subTotal * (scGroup[0]['rateOrDiscount']/100));
   // NEW update SC  based on subtotal
   sc = scGroupSummary[0]['totalAmount'];
   // NEW TAX based on subtotal + sc
   taxGroupSummary[0]['totalAmount'] =Math.round( (itemTotal + sc) *  (taxGroup[0]['rateOrDiscount']/100));
   tax = taxGroupSummary[0]['totalAmount'];

   return { 
      groups: subgroup,
      cart: items,
      billVersion: billVersion[0] ? billVersion[0]['no'] : 0,

      discountAmountGroup: discountAmountGroup,
      discountPercentGroup: discountPercentGroup,

      scGroup: scGroup,
      scGroupSummary: scGroupSummary,
      taxGroup: taxGroup,
      taxGroupSummary: taxGroupSummary,


      itemTotal: itemTotal,
      discount: discountTotal,
      subTotal: subTotal,
      sc: sc,
      tax: tax,
      total: subTotal + sc + tax, 

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
         console.log({ 'itemPrice':itemPrice, 'scAmount':scAmount, 'taxRate': taxRate, 'taxAmount': taxAmount });
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


module.exports = {
   cart, taxScUpdate, cartHistory, taxUpdate, scUpdate, cartGrouping
};