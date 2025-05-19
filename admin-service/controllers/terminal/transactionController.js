const db = require('../../config/db');
const { today, formatDateOnly } = require('../../helpers/global');
const { cart } = require('../../helpers/bill');

const ejs = require('ejs');
const path = require('path');

exports.getAllData = async (req, res) => {
 const outletId = req.query.outletId;

    try {
       
        const [formattedRows] = await db.query(`

            SELECT c.*, o.name AS 'outlet' , m.tableName, '' as paymentType
            FROM cart AS c
            JOIN outlet AS o ON o.id = c.outletId 
            JOIN outlet_table_map AS m ON m.id = c.outletTableMapId
            WHERE c.presence = 1 and c.close = 1    ${outletId ? 'and c.outletId = '+outletId:''}
            order BY c.id DESC 
 
        `);

       for (const row of formattedRows) {
      
            const s = `
                SELECT c.id, c.checkPaymentTypeId, p.name
                FROM cart_payment  AS c
                JOIN check_payment_type AS p ON p.id = c.checkPaymentTypeId
                WHERE c.presence = 1 and  c.cartId = '${row['id']}'
            `;
      
            const [paymentType] = await db.query(s);
            row.paymentType = paymentType;  
       
          }


        res.json({
            error: false,
            items: formattedRows,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.cart = async (req, res) => {
  
  try {
    const cartId = req.query.id;
 
    const {orderItems} = await cart(cartId);


    res.json({
      error: false,
     items: orderItems,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.cartOri = async (req, res) => {
  let totalItem = 0;
  try {
    const cartId = req.query.id;

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
          LEFT JOIN modifier AS m ON m.id = r.modifierId 
          WHERE i.menuId = ${row['menuId']} AND i.price = ${row['price']}
          AND i.cartId = '${cartId}' AND i.void = 0 AND i.presence = 1
          AND r.presence = 1 AND i.void = 0 and r.applyDiscount = 0
        ) AS t1
        GROUP BY t1.descl, t1.price
      `;

      const [modifier] = await db.query(s);
      row.modifier = modifier; // tambahkan hasil ke properti maps 

      let totalAmountModifier = 0;
      modifier.forEach(el => {
        totalAmountModifier += parseInt(el['totalAmount']);
      });
      totalAmount += row['totalAmount'] + totalAmountModifier;

    }

    // formattedRows.forEach(row => {
    //   row['modifier'].forEach(el => {
    //     row['totalAmount'] += parseInt(el['totalAmount']);
    //   });
    // });

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
      grandTotal += el['amount'];
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

          SELECT id, price  AS 'bill', 0 AS 'paid' FROM cart_item
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

    if( parseInt(closePaymentQuery[0]['amount'] ) <= 0  ){
      const q = `UPDATE cart
            SET
              close =  1, 
              totalAmount = '${totalAmount}',
              grandTotal = '${grandTotal}',
              totalItem = '${totalItem}',
              endDate = '${today()}',
              updateDate = '${today()}'
              
          WHERE id = ${cartId} and presence = 1  `;
      const [result] = await db.query(q);

    }
    


    res.json({
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
      closePayment : parseInt(closePaymentQuery[0]['amount'] ) <= 0  ? true : false,
      closePaymentAmount : parseInt(closePaymentQuery[0]['amount'] ),
      get: req.query
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};