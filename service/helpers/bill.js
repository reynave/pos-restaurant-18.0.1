const db = require('../config/db'); // sesuaikan path kalau perlu 
const { today } = require('./global');

async function cart(cartId = '') {
    let subTotal = 0;
    let grandTotal = 0;
    let totalItem = 0;
    const q = `
         SELECT t1.* , (t1.total * t1.price) as 'totalAmount', m.name , 0 as 'checkBox', '' as modifier
         FROM (
           SELECT   c.price, c.menuId, COUNT(c.menuId) AS 'total', c.sendOrder
           FROM cart_item AS c
           JOIN menu AS m ON m.id = c.menuId
           WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void  = 0 
           GROUP BY  c.menuId
           ORDER BY MAX(c.inputDate) ASC
         ) AS t1
         JOIN menu AS m ON m.id = t1.menuId 
       `;
    const [formattedRows] = await db.query(q);

    for (const row of formattedRows) {

        const s = `
            -- MODIFIER 
           SELECT COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price
           FROM (
             SELECT r.modifierId, m.descl, r.price
             FROM cart_item  AS i 
             right JOIN cart_item_modifier AS r ON r.cartItemId = i.id
             JOIN modifier AS m ON m.id = r.modifierId 
             WHERE i.menuId = ${row['menuId']}  
             AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
            
             AND r.presence = 1 AND i.void = 0   
           ) AS t1
           GROUP BY t1.descl, t1.price 

           UNION  
            -- APPLYDISCOUNT
            SELECT COUNT(t1.descl) AS 'total', t1.descl, SUM(t1.price) AS 'totalAmount', t1.price
           FROM ( SELECT r.modifierId,   r.price, r.applyDiscount, d.name AS 'descl'
             FROM cart_item  AS i
               JOIN cart_item_modifier AS r ON r.cartItemId = i.id 
              JOIN check_disc_type AS d ON d.id = r.applyDiscount
             WHERE i.menuId = ${row['menuId']}  
             AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1  
            
             AND r.presence = 1 AND i.void = 0 
         ) AS t1
           GROUP BY t1.descl, t1.price    
   ;
         `;
        const [modifier] = await db.query(s);
        row.modifier = modifier; // tambahkan hasil ke properti maps 

    }


    const [tax] = await db.query(`
         SELECT t1.* , a.name FROM (
            SELECT menuTaxScId, SUM(price) AS 'totalAmount', COUNT(menuTaxScId) AS 'totalQty'
            FROM cart_item_modifier  
            WHERE presence= 1 AND void = 0 AND 
            cartId = '${cartId}' AND menuTaxScId != 0 AND taxStatus != 0
            GROUP BY menuTaxScId )AS t1
            JOIN check_tax_type AS a ON a.id = t1.menuTaxScId
       `);
    const [sc] = await db.query(`
         SELECT t1.* , a.name FROM (
            SELECT menuTaxScId, SUM(price) AS 'totalAmount', COUNT(menuTaxScId) AS 'totalQty'
            FROM cart_item_modifier  
            WHERE presence= 1 AND void = 0 AND 
            cartId = '${cartId}'  AND menuTaxScId != 0 AND scStatus != 0
            GROUP BY menuTaxScId )AS t1
            JOIN check_sc_type AS a ON a.id = t1.menuTaxScId
       `);

    const taxSc = [];

    sc.forEach(element => {
        taxSc.push(element);
    });
    tax.forEach(element => {
        taxSc.push(element);
    });

    formattedRows.forEach(element => {
        subTotal += parseInt(element['price']);
        totalItem += 1;
        element['modifier'].forEach(element => {
            subTotal += parseInt(element['price']);
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


    return { 
        cart: formattedRows,
        taxSc: taxSc,
        subTotal: subTotal,
        grandTotal: grandTotal,
        totalItem: totalItem,
        cartPayment: cartPayment,
        unpaid: grandTotal - paid < 0 ? 0 : (grandTotal - paid),
        change: grandTotal - paid < 0 ? (grandTotal - paid) * -1 : 0,
        tips: tips,
    }
}
async function cart_ver1(cartId = '') {
    let totalItem = 0;

    const [formattedRows] = await db.query(`
        SELECT t1.* , (t1.total * t1.price) as 'totalAmount', m.name , 0 as 'checkBox', '' as modifier
         FROM (
           SELECT   c.price, c.menuId, COUNT(c.menuId) AS 'total', c.sendOrder
           FROM cart_item AS c
           LEFT JOIN menu AS m ON m.id = c.menuId
           WHERE c.cartId = '${cartId}'
           AND c.presence = 1 AND c.void  = 0
           GROUP BY c.price, c.menuId, c.sendOrder
           ORDER BY MAX(c.inputDate) ASC
         ) AS t1
         JOIN menu AS m ON m.id = t1.menuId
       `);
    let totalAmount = 0;
    for (const row of formattedRows) {
        totalItem += 1;
        const s = `
           SELECT COUNT(t1.descl) AS 'total', t1.descl, t1.price, SUM(t1.price) AS 'totalAmount'
           FROM (
             SELECT r.modifierId, m.descl, r.price
             FROM cart_item  AS i 
             right JOIN cart_item_modifier AS r ON r.cartItemId = i.id
              JOIN modifier AS m ON m.id = r.modifierId 
             WHERE i.menuId = ${row['menuId']} AND i.price = ${row['price']}
             AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
             AND r.presence = 1 AND i.void = 0 
           ) AS t1
           GROUP BY t1.descl, t1.price
         `;
        console.log(s);
        const [modifier] = await db.query(s);
        row.modifier = modifier; // tambahkan hasil ke properti maps 

        let totalAmountModifier = 0;
        modifier.forEach(el => {
            totalAmountModifier += parseInt(el['totalAmount']);
        });
        totalAmount += row['totalAmount'] + totalAmountModifier;

    }

    const orderItems = [];
    for (let i = 0; i < formattedRows.length; i++) {
        orderItems.push({
            menuId: formattedRows[i]['menuId'],
            parentMenuId: 0,
            name: formattedRows[i]['name'] + (formattedRows[i]['modifier'].length > 0 ? '*' : ''),
            price: formattedRows[i]['price'],
            total: formattedRows[i]['total'],
            totalAmount: parseInt(formattedRows[i]['totalAmount']),
        })
        formattedRows[i]['modifier'].forEach(el => {
            orderItems.push({
                menuId: 0,
                parentMenuId: formattedRows[i]['menuId'],
                name: el['descl'],
                price: el['price'],
                total: el['total'],
                totalAmount: parseInt(el['totalAmount']),
            })
        });
    }
    let grandTotal = totalAmount;

    const s2 = `
        SELECT '0' AS 'id', SUM(c.taxAmount ) AS 'amount', t.taxNote AS 'name'
        FROM cart_item  AS c
        LEFT JOIN menu_tax_sc AS t ON t.id = c.menuTaxScId
        WHERE c.cartId = '${cartId}'
        AND  c.presence = 1 AND c.void = 0 and c.taxStatus = 1
        GROUP BY t.taxNote

        UNION

        SELECT '0' AS 'id', SUM(c.scAmount ) AS 'amount', t.scNote as 'name'
        FROM cart_item  AS c
        LEFT JOIN menu_tax_sc AS t ON t.id = c.menuTaxScId
        WHERE c.cartId = '${cartId}'
        AND  c.presence = 1 AND c.void = 0 and c.scStatus = 1
        GROUP BY t.scNote

        UNION

         SELECT c.id, c.bill as 'amount', t.name 
         FROM cart_payment  AS c
         JOIN check_sc_type AS t ON t.id = c.checkScTypeId  
         WHERE c.cartId = '${cartId}' and c.presence = 1 
   
         UNION 
   
         SELECT  c.id, c.bill as 'amount',  a.name
         FROM cart_payment  AS c 
         JOIN check_tax_type AS a ON a.id = c.checkTaxTypeId 
         WHERE c.cartId = '${cartId}' and c.presence = 1 
         `;
    const [bill] = await db.query(s2);

    bill.forEach(el => {
        grandTotal += parseInt(el['amount']);
    });


    const s3 = `
         SELECT c.id, c.paid as 'amount', t.name 
         FROM cart_payment  AS c
         JOIN check_payment_type AS t ON t.id = c.checkPaymentTypeId
         WHERE c.cartId = '${cartId}' and c.presence = 1 and  submit = 1
         `;
    const [paided] = await db.query(s3);



    const s5 = `
           SELECT SUM(t1.bill - t1.paid) AS 'amount'  FROM (
   
             SELECT id, price  AS 'bill', 0 AS 'paid' 
             FROM cart_item_modifier
             WHERE cartId = '${cartId}' AND presence =1 AND void = 0
             UNION
   
             SELECT id,  price  AS 'bill', 0 AS 'paid' 
             FROM cart_item 
             WHERE cartId = '${cartId}'  AND presence =1 AND void = 0

             UNION 
   
             SELECT c.id, c.bill  , c.paid
             FROM cart_payment  AS c 
             WHERE c.cartId = '${cartId}' AND presence =1  and submit = 1
   
             UNION 
   
             SELECT  c.id, c.bill  , c.paid
             FROM cart_payment  AS c  
             WHERE c.cartId = '${cartId}' AND presence =1  and submit = 1
         ) AS t1
         `;
    const [closePaymentQuery] = await db.query(s5);

    if (parseInt(closePaymentQuery[0]['amount']) <= 0) {
        const q = `UPDATE cart
               SET
                 close =  1, 
                 tableMapStatusId = 20,
                 totalAmount = '${totalAmount}',
                 grandTotal = '${grandTotal}',
                 totalItem = '${totalItem}',
                 endDate = '${today()}',
                 updateDate = '${today()}'
                 
             WHERE id = ${cartId} and presence = 1  `;
        const [result] = await db.query(q);

    }



    return {
        error: false,
        preview: "https://[YOUR_HOST]:[PORT]/terminal/bill/?id=" + cartId,
        id: cartId,
        items: formattedRows,
        orderItems: orderItems,
        totalAmount: totalAmount,
        grandTotal: grandTotal,
        totalItem: totalItem,
        bill: bill,
        paided: paided,
        closePayment: parseInt(closePaymentQuery[0]['amount']) <= 0 ? true : false,
        closePaymentAmount: parseInt(closePaymentQuery[0]['amount']),
    };
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
        taxAmount = (itemPrice + scAmount) * (parseFloat(taxRow[0]['taxRate']) / 100);
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


module.exports = {
    cart, taxScUpdate
};