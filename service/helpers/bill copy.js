const db = require('../config/db'); // sesuaikan path kalau perlu 
const { today } = require('./global');

async function cart(cartId = '', subgroup = 0) {
    let subTotal = 0;
    let grandTotal = 0;
    let totalItem = 0;
    let itemTotal = 0;
    //let subgroup = subgroup;
    const qOLD = `
         SELECT t1.* , (t1.total * t1.price) as 'totalAmount', m.name , 0 as 'checkBox', '' as modifier, t1.printerId
         FROM (
           SELECT   c.price, c.menuId, COUNT(c.menuId) AS 'total' , m.printerId
           FROM cart_item AS c
           JOIN menu AS m ON m.id = c.menuId
           WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void  = 0  ${subgroup == 0 ? '' : ' and c.subgroup = ' + subgroup}
           GROUP BY  c.menuId, c.price,  m.printerId
           ORDER BY MAX(c.inputDate) ASC
         ) AS t1
         JOIN menu AS m ON m.id = t1.menuId 
       `;


      const q = `
       SELECT  c.id,  c.menuId, c.price, c.qty AS 'total', c.ta, (c.qty * c.price) AS 'totalAmount', 
         m.name, 0 AS 'checkBox', 
        '' AS 'modifier',   m.modifierGroupId, m.discountGroupId, 
        c.sendOrder, c.inputDate, c.inputBy, c.updateDate, c.updateBy, e.name AS 'employeeName',  '' as printerRows
        FROM cart_item AS c
        JOIN menu AS m ON m.id = c.menuId
        left join employee as e on e.id = c.inputBy
        WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void  = 0  ${subgroup == 0 ? '' : ' and c.subgroup = ' + subgroup}
        ORDER BY  c.inputDate ASC 
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
             AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
            
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
             AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
            AND r.modifierId = 0 AND r.note != ''
             AND r.presence = 1 AND i.void = 0   
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
             AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1  
            
             AND r.presence = 1 AND i.void = 0 
         ) AS t1
           GROUP BY t1.descl, t1.price    
   ;
         `;
        const [modifier] = await db.query(s);
        row.modifier = modifier; // tambahkan hasil ke properti maps 

    }

    const [sc] = await db.query(`
        SELECT t1.*, 'SC' as 'type' , a.scNote AS 'name' FROM (
            SELECT m.menuTaxScId, SUM(m.price) AS 'totalAmount', COUNT(m.menuTaxScId) AS 'totalQty'
            FROM cart_item_modifier AS m
            JOIN cart_item AS i ON i.id = m.cartItemId
            WHERE m.presence= 1 AND m.void = 0    ${subgroup == 0 ? '' : ' AND i.subgroup = ' + subgroup} 
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
            WHERE m.presence= 1 AND m.void = 0  ${subgroup == 0 ? '' : ' AND i.subgroup = ' + subgroup} 
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
            m.applyDiscount, count(m.id) AS 'qty', SUM(i.price ) AS 'subTotal', 0 as 'maxDiscount',  
           (SUM(i.price )  - d.discAmount)  * -1 as 'amount', d.discAmount, 0 as 'def'
        FROM cart_item_modifier AS m 
        LEFT JOIN cart_item AS i ON i.id = m.cartItemId
        LEFT JOIN discount AS d ON d.id = m.applyDiscount
        WHERE m.applyDiscount != 0 AND m.cartId = '${cartId}'
        AND m.presence = 1 AND m.void = 0  AND d.discAmount > 0
        GROUP BY  m.applyDiscount, d.discAmount `;
    const [discountAmount] = await db.query(ds)

    discountAmount.forEach(el => {
        if (el['amount'] > 0) {
            el['amount'] = el['amount'] - el['discAmount'];
        }
    });


    let [discountGroup] = await db.query(`  
        
        SELECT a.* FROM (

 			SELECT d.name,
                m.applyDiscount, COUNT(m.applyDiscount) AS 'qty',   d.maxDiscount,
            SUM(m.price) AS 'amount' ,  0 as  discAmount , d.maxDiscount+SUM(m.price) AS 'def'
            FROM cart_item_modifier AS m 
            LEFT JOIN discount AS d ON d.id = m.applyDiscount
            WHERE m.applyDiscount != 0 AND m.cartId = '${cartId}' AND m.presence = 1 AND m.void =0
            GROUP BY m.applyDiscount,   d.maxDiscount
            
            ) AS a 
        WHERE a.amount < 0

    `);
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
    taxSc.forEach(element => {
        grandTotal += parseInt(element['totalAmount']);
    });


    const [billVersion] = await db.query(`   
        SELECT no  FROM  bill WHERE cartId = '${cartId}' ORDER BY no DESC LIMIT 1
    `);


    return {
        cart: formattedRows,
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


async function scUpdate(cartItem = 0) {
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
    console.log(m1)
    const [itemPriceDb] = await db.query(m1);
    console.log('itemPriceDb', itemPriceDb)

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
        AND presence =1 AND void = 0 and menuTaxScId = 0
    `;
    const [totalAmountModifier] = await db.query(q2);

    const t1 = `
    SELECT c.menuId , m.menuTaxScId, t.scTaxIncluded
        FROM cart_item AS c
        JOIN menu AS m ON m.id = c.menuId
        JOIN menu_tax_sc AS t ON t.id = m.menuTaxScId
        WHERE c.id = ${cartItem};
    `;
    const [menuQuery] = await db.query(q2);
    const scTaxIncluded = menuQuery[0]['scTaxIncluded'];

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
    cart, taxScUpdate, cartHistory, taxUpdate, scUpdate
};