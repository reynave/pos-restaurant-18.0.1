const db = require('../config/db'); // sesuaikan path kalau perlu 
 

async function sendOrder(so = '', subgroup = 0) {
 
    let itemTotal = 0; 
    const q = `
         SELECT c.qty, c.menuId, m.name , m.printerId
        FROM cart_item AS c
        JOIN menu AS m ON m.id = c.menuId
        WHERE c.sendOrder = '${so}' 
        AND c.presence = 1 AND c.void  = 0
        ORDER BY c.id ASC
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
             AND i.sendOrder = '${so}' AND i.void = 0 AND i.presence = 1
            
             AND r.presence = 1 AND i.void = 0   
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
             AND i.sendOrder = '${so}' AND i.void = 0 AND i.presence = 1
            AND r.modifierId = 0 AND r.note != ''
             AND r.presence = 1 AND i.void = 0   
           ) AS t1
           GROUP BY t1.descl, t1.price  
   ;
         `;
        const [modifier] = await db.query(s);
        row.modifier = modifier; // tambahkan hasil ke properti maps 

    }
  
   



    return {
        cart: formattedRows, 
        itemTotal: itemTotal,
      
    }
}
 
module.exports = {
    sendOrder
};