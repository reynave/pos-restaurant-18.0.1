const db = require('../../config/db');
const { headerUserId, mapUpdateByName, formatDateOnly, today, convertCustomDateTime, formatDateTime, parseTimeString, addTime } = require('../../helpers/global');
const { autoNumber } = require('../../helpers/autoNumber');
const { taxScUpdate, scUpdate, taxUpdate } = require('../../helpers/bill');
const { printQueueInternal } = require('../../helpers/printer');
const { csvFile, txtTableChecker } = require('../../helpers/exportToFile');


const { logger } = require('./userLogController');
const fs = require('fs');
const path = require('path');
const { table } = require('console');

// LOOKUP 
// http://localhost:3000/terminal/menuItemPos?menuLookupId=3&outletId=15
exports.getMenuItem = async (req, res) => {
  let i = 1;
  let employeeAuthLevelId = 0;
  try {
    let header;
    let decodedToken = {};
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    // Decode JWT payload safely
    if (token) {
      try {
        // JWT format: header.payload.signature
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = parts[1];
          // Add padding if necessary
          const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
          const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
          const decodedStr = Buffer.from(padded, 'base64').toString('utf-8');
          decodedToken = JSON.parse(decodedStr);

        } else {
          decodedToken = {};
        }
      } catch (e) {
        console.error('Failed to decode authorization header:', e.message);
        decodedToken = {};
      }
    }
    employeeAuthLevelId = decodedToken['employeeAuthLevelId'] || 0;

    try {
      header = JSON.parse(req.headers['x-terminal']);
      const [terminal] = await db.query(`SELECT priceNo FROM terminal WHERE terminalId = ${header['terminalId']}`);
      if (terminal[0]['priceNo'] != 0) {
        i = terminal[0]['priceNo'];
      }
    } catch (e) {
      i = 1;
    }

    const menuLookupId = req.query.menuLookupId;
    const outletId = req.query.outletId;

    if (outletId) {
      const [outlet] = await db.query(`SELECT id, priceNo FROM outlet WHERE id = ${outletId}`);
      i = outlet[0]['priceNo'];
    }




    const q = `
       
        SELECT 
          m.id, m.name, m.price${i} as 'price' , m.adjustItemsId, m.qty, m.menuSet, m.menuSetMinQty,
          m.menuDepartmentId, m.menuCategoryId, m.menuTaxScId,
          t.desc, t.taxRate, t.taxNote, t.taxStatus, t.scTaxIncluded, m.openPrice,
            CASE 
              WHEN t.taxStatus = 2 THEN m.price${i} - (m.price${i} / (1+ (t.taxRate/100) ))
              WHEN t.taxStatus = 1 THEN m.price${i}*(t.taxRate/100)
              ELSE  0
            END AS 'taxAmount',  
          t.scRate, t.scNote, t.scStatus,
            CASE 
              WHEN t.scStatus = 2 THEN m.price${i} - (m.price${i} / (1+ (t.scRate/100) ))
              WHEN t.scStatus = 1 THEN m.price${i}*(t.scRate/100)
              ELSE  0
            END AS 'scAmount' ,

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
            ) AS usedQty
        FROM menu AS m
        LEFT JOIN menu_tax_sc AS t ON t.id = m.menuTaxScId
        WHERE 
          m.presence = 1 and m.menuLookupId = ${menuLookupId} and m.menuLookupId != 0 and 
          m.startDate < NOW() AND m.endDate > NOW()
    `;



    const [items] = await db.query(q);

    items.forEach(el => {
      el['price'] = parseInt(el['price']) || 0;
      if (el['adjustItemsId'] == '') {
        el['qty'] = 99999999
      }
    });

    const levelDiscount = 'l.employeeAuthLevelId = ' + employeeAuthLevelId;
    // DISCOUNT GROUP
    const q0 = `SELECT id, name , '' as discount 
    FROM discount_group 
    WHERE presence = 1 ORDER BY name ASC`;
    const [discountGroup] = await db.query(q0);

    for (const row of discountGroup) {
      const q1 = `
        SELECT d.* 
          FROM discount AS d
          left JOIN discount_group AS g ON g.id  = d.discountGroupId
          WHERE 
            d.presence = 1 AND d.allLevel = 1 AND 
            d.allDiscountGroup = 0 AND d.discountGroupId = ${row['id']} 
      `;
      const [discount] = await db.query(q1);

      const q9 = `
        SELECT d.* 
          FROM discount AS d
          left JOIN discount_group AS g ON g.id  = d.discountGroupId
          WHERE 
            d.presence = 1 AND d.allLevel = 0 AND 
            d.allDiscountGroup = 0 AND d.discountGroupId = ${row['id']} 
      `;
      // const [discountMyLevel] = await db.query(q9);



      const q51 = `
        SELECT t1.* , t2.* 
        FROM (
          SELECT d.id, COUNT(d.id) 'totalLevel'
          FROM discount AS d
          LEFT JOIN discount_group AS g ON g.id  = d.discountGroupId
          jOIN discount_level AS l ON l.discountId = d.id
          WHERE d.presence = 1 AND d.allDiscountGroup = 0 AND d.allLevel = 0 AND d.discountGroupId = ${row['id']}   
          AND (${levelDiscount})
        GROUP BY d.id
        ) AS t1 
        JOIN discount AS t2 ON t2.id = t1.id
      `;
      const [discountMyLevel] = await db.query(q51);



      row.discount = [...discount, ...discountMyLevel];
    }

    // ALL DISCOUNT GROUP
    const q3 = `SELECT 0 as 'id', 'all Group' as 'name' , '' as discount `;
    const [discountGroupAll] = await db.query(q3);

    for (const row of discountGroupAll) {
      const q5 = `
        SELECT d.* , 'AllLevel' as 'totalLevel'
          FROM discount AS d
          left JOIN discount_group AS g ON g.id  = d.discountGroupId
        WHERE d.presence = 1 AND d.allDiscountGroup = 1 and d.allLevel = 1 and d.status = 1
      `;
      const [discount] = await db.query(q5);


      const q51 = `
        SELECT t1.* , t2.* 
        FROM (
          SELECT d.id, COUNT(d.id) 'totalLevel'
          FROM discount AS d
          LEFT JOIN discount_group AS g ON g.id  = d.discountGroupId
          jOIN discount_level AS l ON l.discountId = d.id
          WHERE d.presence = 1 AND d.allDiscountGroup = 1 AND d.allLevel = 0  and d.status = 1
          AND (${levelDiscount})
        GROUP BY d.id
        ) AS t1 
        JOIN discount AS t2 ON t2.id = t1.id
      `;
      const [discountMyLevel] = await db.query(q51);


      row.discount = [...discount, ...discountMyLevel];
    }


    res.json({
      priceNo: i,
      items: items,
      discountGroup: [...discountGroupAll, ...discountGroup],
      get: req.query
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.lookUpMenu = async (req, res) => {
  let i = 1;
  let employeeAuthLevelId = 0;
  try {
    let header;
    let decodedToken = {};
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    try {
      header = JSON.parse(req.headers['x-terminal']);
      const [terminal] = await db.query(`SELECT priceNo FROM terminal WHERE terminalId = ${header['terminalId']}`);
      if (terminal[0]['priceNo'] != 0) {
        i = terminal[0]['priceNo'];
      }
    } catch (e) {
      i = 1;
    }

    const menuLookupId = req.query.menuLookupId;
    const outletId = req.query.outletId;

    if (outletId) {
      const [outlet] = await db.query(`SELECT id, priceNo FROM outlet WHERE id = ${outletId}`);
      i = outlet[0]['priceNo'];
    }




    const q = `
       
        SELECT 
          m.id, m.name, m.price${i} as 'price' , m.adjustItemsId, m.qty, m.menuSet, m.menuSetMinQty,
          m.menuDepartmentId, m.menuCategoryId, m.menuTaxScId,
          t.desc, t.taxRate, t.taxNote, t.taxStatus, t.scTaxIncluded, m.openPrice,
            CASE 
              WHEN t.taxStatus = 2 THEN m.price${i} - (m.price${i} / (1+ (t.taxRate/100) ))
              WHEN t.taxStatus = 1 THEN m.price${i}*(t.taxRate/100)
              ELSE  0
            END AS 'taxAmount',  
          t.scRate, t.scNote, t.scStatus,
            CASE 
              WHEN t.scStatus = 2 THEN m.price${i} - (m.price${i} / (1+ (t.scRate/100) ))
              WHEN t.scStatus = 1 THEN m.price${i}*(t.scRate/100)
              ELSE  0
            END AS 'scAmount' ,

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
            ) AS usedQty
        FROM menu AS m
        LEFT JOIN menu_tax_sc AS t ON t.id = m.menuTaxScId
        WHERE 
          m.presence = 1 and m.menuLookupId = ${menuLookupId} and m.menuLookupId != 0 and 
          m.startDate < NOW() AND m.endDate > NOW()
    `;



    const [itemsRow] = await db.query(q);


    const items = [];

    for (const row of itemsRow) {
      let journal = [];
      row['price'] = parseInt(row['price']) || 0;
      if (row['adjustItemsId'] == '') {
        row['qty'] = 99999999
      }

      // journal.push({
      //   table: 'cart_item',
      //   rate : 0, 
      //   note : '',
      //   debit: row['price'],
      //   credit: 0
      // });

      journal.push({
        table: 'cart_item_sc',
        rate: row['scRate'],
        note: row['scNote'],
        debit: parseInt(row['scAmount']),
        credit: 0
      });
      journal.push({
        table: 'cart_item_tax',
        rate: row['taxRate'],
        note: row['taxNote'],
        debit: ( parseInt(row['scAmount']) * (parseFloat(row['taxRate'])/100)) + parseInt(row['taxAmount']),
        credit: 0
      });


      items.push({
        ...row,
        id: row['id'],
        name: row['name'],
        journal: journal,
      });

    }

    res.json({
      priceNo: i,
      items: items,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.discountGroup = async (req, res) => {
  let i = 1;
  let employeeAuthLevelId = 0;
  try {
    let header;
    let decodedToken = {};
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    // Decode JWT payload safely
    if (token) {
      try {
        // JWT format: header.payload.signature
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = parts[1];
          // Add padding if necessary
          const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
          const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
          const decodedStr = Buffer.from(padded, 'base64').toString('utf-8');
          decodedToken = JSON.parse(decodedStr);

        } else {
          decodedToken = {};
        }
      } catch (e) {
        console.error('Failed to decode authorization header:', e.message);
        decodedToken = {};
      }
    }
    employeeAuthLevelId = decodedToken['employeeAuthLevelId'] || 0;

    try {
      header = JSON.parse(req.headers['x-terminal']);
      const [terminal] = await db.query(`SELECT priceNo FROM terminal WHERE terminalId = ${header['terminalId']}`);
      if (terminal[0]['priceNo'] != 0) {
        i = terminal[0]['priceNo'];
      }
    } catch (e) {
      i = 1;
    }



    const levelDiscount = 'l.employeeAuthLevelId = ' + employeeAuthLevelId;
    // DISCOUNT GROUP
    const q0 = `SELECT id, name , '' as discount 
    FROM discount_group 
    WHERE presence = 1 ORDER BY name ASC`;
    const [discountGroup] = await db.query(q0);

    for (const row of discountGroup) {
      const q1 = `
        SELECT d.* 
          FROM discount AS d
          left JOIN discount_group AS g ON g.id  = d.discountGroupId
          WHERE 
            d.presence = 1 AND d.allLevel = 1 AND 
            d.allDiscountGroup = 0 AND d.discountGroupId = ${row['id']} 
      `;
      const [discount] = await db.query(q1);

      const q9 = `
        SELECT d.* 
          FROM discount AS d
          left JOIN discount_group AS g ON g.id  = d.discountGroupId
          WHERE 
            d.presence = 1 AND d.allLevel = 0 AND 
            d.allDiscountGroup = 0 AND d.discountGroupId = ${row['id']} 
      `;
      // const [discountMyLevel] = await db.query(q9);



      const q51 = `
        SELECT t1.* , t2.* 
        FROM (
          SELECT d.id, COUNT(d.id) 'totalLevel'
          FROM discount AS d
          LEFT JOIN discount_group AS g ON g.id  = d.discountGroupId
          jOIN discount_level AS l ON l.discountId = d.id
          WHERE d.presence = 1 AND d.allDiscountGroup = 0 AND d.allLevel = 0 AND d.discountGroupId = ${row['id']}   
          AND (${levelDiscount})
        GROUP BY d.id
        ) AS t1 
        JOIN discount AS t2 ON t2.id = t1.id
      `;
      const [discountMyLevel] = await db.query(q51);



      row.discount = [...discount, ...discountMyLevel];
    }

    // ALL DISCOUNT GROUP
    const q3 = `SELECT 0 as 'id', 'all Group' as 'name' , '' as discount `;
    const [discountGroupAll] = await db.query(q3);

    for (const row of discountGroupAll) {
      const q5 = `
        SELECT d.* , 'AllLevel' as 'totalLevel'
          FROM discount AS d
          left JOIN discount_group AS g ON g.id  = d.discountGroupId
        WHERE d.presence = 1 AND d.allDiscountGroup = 1 and d.allLevel = 1 and d.status = 1
      `;
      const [discount] = await db.query(q5);


      const q51 = `
        SELECT t1.* , t2.* 
        FROM (
          SELECT d.id, COUNT(d.id) 'totalLevel'
          FROM discount AS d
          LEFT JOIN discount_group AS g ON g.id  = d.discountGroupId
          jOIN discount_level AS l ON l.discountId = d.id
          WHERE d.presence = 1 AND d.allDiscountGroup = 1 AND d.allLevel = 0  and d.status = 1
          AND (${levelDiscount})
        GROUP BY d.id
        ) AS t1 
        JOIN discount AS t2 ON t2.id = t1.id
      `;
      const [discountMyLevel] = await db.query(q51);


      row.discount = [...discount, ...discountMyLevel];
    }


    res.json({
      items: [...discountGroupAll, ...discountGroup],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.selectMenuSet = async (req, res) => {
  const itemId = req.query.itemId;

  try {
    const q1 = `
       SELECT   m.id,  m.name, s.minQty, s.maxQty, m.adjustItemsId,
        m.qty - ( COALESCE(
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
            )) AS currentQty, 
         
        0 as 'select'
        FROM menu_set AS s
        JOIN menu AS m ON m.id = s.detailMenuId
        WHERE s.menuId = ${itemId} 
      `;
    const [menuSet] = await db.query(q1);

    res.json({
      error: false,
      menuSet: menuSet,
      get: req.query
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

exports.addToCart = async (req, res) => {
  const menu = req.body['menu'];
  const cartId = req.body['id'];
  const userId = headerUserId(req);
  let inputDate = today();
  const results = [];
  const openPrice = req.body['openPrice'] || 0;

  if (openPrice == 1) {
     menu['price'] = parseInt(req.body['price']) || 0;

      menu['journal'] = [];
 
      const q = `
       SELECT 
         m.id, m.name, ${menu['price']} as 'price', m.qty, m.menuSet, m.menuSetMinQty,
         m.menuTaxScId,
         t.desc, t.taxRate, t.taxNote, t.taxStatus, t.scTaxIncluded, m.openPrice,
           CASE 
             WHEN t.taxStatus = 2 THEN ${menu['price']} - (${menu['price']} / (1+ (t.taxRate/100) ))
             WHEN t.taxStatus = 1 THEN ${menu['price']}*(t.taxRate/100)
              ELSE  0
            END AS 'taxAmount',  
          t.scRate, t.scNote, t.scStatus,
            CASE 
              WHEN t.scStatus = 2 THEN ${menu['price']} - (${menu['price']} / (1+ (t.scRate/100) ))
              WHEN t.scStatus = 1 THEN ${menu['price']}*(t.scRate/100)
              ELSE  0
            END AS 'scAmount' ,
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
            ) AS usedQty
        FROM menu AS m
        LEFT JOIN menu_tax_sc AS t ON t.id = m.menuTaxScId
        WHERE 
          m.presence = 1 and m.id =  ${menu['id']}
      `; 
      const [itemsRow] = await db.query(q);
      menu['journal'].push({
        table: 'cart_item_sc',
        rate: itemsRow[0]['scRate'],
        note: itemsRow[0]['scNote'],
        debit: parseInt(itemsRow[0]['scAmount']),
        credit: 0
      });
      menu['journal'].push({
        table: 'cart_item_tax',
        rate: itemsRow[0]['taxRate'],
        note: itemsRow[0]['taxNote'],
        debit: ( parseInt(itemsRow[0]['scAmount']) * (parseFloat(itemsRow[0]['taxRate'])/100)) + parseInt(itemsRow[0]['taxAmount']),
        credit: 0
      });
      
  }
  try {

    let q =
      `INSERT INTO cart_item (presence, inputDate, updateDate, menuId, price, cartId,
      menuDepartmentId, menuCategoryId, adjustItemsId, inputBy, updateBy,
      debit, credit
      )
      VALUES (1, '${inputDate}', '${inputDate}',  ${menu['id']}, ${menu['price']}, '${cartId}',
        ${menu['menuDepartmentId']}, ${menu['menuCategoryId']}, '${!menu['adjustItemsId'] ? '' : menu['adjustItemsId']}',
        ${userId}, ${userId},
        ${menu['price']}, 0
      )`;

    const [result] = await db.query(q);
    const cartItemId = result.insertId;

    if (result.affectedRows === 0) {
      results.push({ cartItemId, status: 'not found' });
    } else {
      results.push({ cartItemId, status: 'cart_item insert' });
    }

    // console.log(menu, menu['journal']);
    for (const row of menu['journal']) {
      let q =
        `INSERT INTO ${row['table']} (
        presence, inputDate, updateDate,  cartId, cartItemId,
        menuTaxScId, rate, note, 
        debit, credit
      )
      VALUES (1, '${inputDate}', '${inputDate}',  '${cartId}', ${cartItemId},
          ${menu['menuTaxScId']}, ${row['rate']}, '${row['note']}',
          ${row['debit']}, ${row['credit']}
      )`;
      const [result] = await db.query(q);

      if (result.affectedRows === 0) {
        results.push({ status: 'journal not found' });
      } else {
        results.push({ status: 'journal insert' });
      }
    }



    if (menu['menuSet'] == 'FIXED') {

      const q6 = `
      SELECT s.id , m.name , s.detailMenuId, m.adjustItemsId, m.id as 'menuId'
        FROM menu_set as s
      JOIN menu AS m ON m.id = s.detailMenuId
      WHERE 
        s.menuId = ${menu['id']}  
      `;

      const [result6] = await db.query(q6);
      for (const row of result6) {
        let q3 =
          `INSERT INTO cart_item_modifier (
            presence, inputDate, updateDate,  
            cartId, cartItemId, note, menuSetMenuId, 
            menuSetAdjustItemsId,
            inputBy, updateBy
          )
          VALUES (
            1, '${inputDate}', '${inputDate}', 
            '${cartId}',  ${cartItemId} , '${row['name']}', '${row['detailMenuId']}',  
            '${row['adjustItemsId']}', ${userId}, ${userId}
          )`;
        const [result3] = await db.query(q3);
        if (result3.affectedRows === 0) {
          results.push({ cartId, status: 'not found' });
        } else {
          results.push({ cartId, status: 'FIXED menu set insert' });
        }
      }

    }
    if (menu['menuSet'] == 'SELECT') {

      const menuSet = req.body['menuSet'];
      for (const row of menuSet) {

        let q3 =
          `INSERT INTO cart_item_modifier (
            presence, inputDate, updateDate,  
            cartId, cartItemId, note, menuSetMenuId,
            menuSetAdjustItemsId,
            inputBy, updateBy
          )
          VALUES (
            1, '${inputDate}', '${inputDate}', 
            '${cartId}',  ${cartItemId} , '${row['name']}', '${row['id']}',
            '${row['adjustItemsId']}', ${userId}, ${userId}
          )`;

        if (row['select'] > 0) {
          const [result3] = await db.query(q3);

          if (result3.affectedRows === 0) {
            results.push({ cartId, status: 'not found' });
          } else {
            results.push({ cartId, status: 'FIXED menu set insert' });
          }


        }

      }

    }

    const q1 = `
      UPDATE cart SET
        paymentId = '', 
        updateDate = '${today()}',
        updateBy = ${userId}
      WHERE id = '${cartId}'  `;
    await db.query(q1);

    res.status(201).json({
      error: false,
      db: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};


exports.addToCart_verLama = async (req, res) => {
  const menu = req.body['menu'];
  const cartId = req.body['id'];
  const userId = headerUserId(req);
  let inputDate = today();
  const results = [];
  const openPrice = req.body['openPrice'] || 0;

  if (openPrice == 1) {
    menu['price'] = parseInt(req.body['price']) || 0;
  }
  try {

    //let price = parseInt(menu['price']) + parseInt(menu['taxAmount']) + parseInt(menu['scAmount']);
    let c =
      `SELECT * FROM cart_item
      WHERE cartId = '${cartId}' and   menuId = ${menu['id']} and 
      sendOrder = '' and presence = 1 and void = 0 order by inputDate ASC limit 1`;

    const [cek] = await db.query(c);
    if (cek.length) {
      inputDate = formatDateTime(cek[0]['inputDate']);
    }

    let q =
      `INSERT INTO cart_item (presence, inputDate, updateDate, menuId, price, cartId,
      menuDepartmentId, menuCategoryId, adjustItemsId, inputBy, updateBy,
      debit, credit
      )
      VALUES (1, '${inputDate}', '${inputDate}',  ${menu['id']}, ${menu['price']}, '${cartId}',
        ${menu['menuDepartmentId']}, ${menu['menuCategoryId']}, '${!menu['adjustItemsId'] ? '' : menu['adjustItemsId']}',
        ${userId}, ${userId},
        ${menu['price']}, 0
      )`;

    const [result] = await db.query(q);
    const cartItemId = result.insertId;

    if (result.affectedRows === 0) {
      results.push({ cartId, status: 'not found' });
    } else {
      results.push({ cartId, status: 'cart_item insert' });
    }


    /*
    
        let scAmount = menu['price'] * (menu['scRate'] / 100);
    
    
    
        if (menu['scStatus'] == 1) {
          let q2 =
            `INSERT INTO cart_item_modifier (
            presence, inputDate, updateDate,  
            cartId, cartItemId, menuTaxScId, 
            scRate, scStatus , price, priceIncluded,
            inputBy, updateBy
          )
          VALUES (
            1, '${inputDate}', '${inputDate}', 
            '${cartId}',  ${cartItemId}, ${menu['menuTaxScId']}, 
            ${menu['scRate']},  ${menu['scStatus']} , ${scAmount}, 0,
            ${userId}, ${userId},
            ${scAmount}, 0,
          )`;
          const [result2] = await db.query(q2);
    
          if (result2.affectedRows === 0) {
            results.push({ cartId, status: 'not found' });
          } else {
            results.push({ cartId, status: 'SC cart_item_modifier insert' });
          }
        }
        else if (menu['scStatus'] == 2) {
          let q2 =
            `INSERT INTO cart_item_modifier (
            presence, inputDate, updateDate,  
            cartId, cartItemId, menuTaxScId, 
            scRate, scStatus , 
            price, priceIncluded,
            inputBy, updateBy
          )
          VALUES (
            1, '${inputDate}', '${inputDate}', 
            '${cartId}',  ${cartItemId}, ${menu['menuTaxScId']}, 
            ${menu['scRate']},  ${menu['scStatus']} , 0, ${menu['scAmount']},
            ${userId}, ${userId}
          )`;
          const [result2] = await db.query(q2);
    
          if (result2.affectedRows === 0) {
            results.push({ cartId, status: 'not found' });
          } else {
            results.push({ cartId, status: 'SC cart_item_modifier insert' });
          }
        }
    
        let scTaxIncd = 0;
        // SC TAX INCLUDED
        if (menu['scTaxIncluded'] == 1) { 
          scTaxIncd = scAmount * (menu['taxRate'] / 100); 
        }
      
    
        let taxAmount = ((parseInt(menu['price']) + scAmount) * (menu['taxRate'] / 100)) + scTaxIncd;
    
    
        if (menu['taxStatus'] == 1) {
          let q3 =
            `INSERT INTO cart_item_modifier (
            presence, inputDate, updateDate,  
            cartId, cartItemId, menuTaxScId,
            taxRate, taxStatus,
              price, priceIncluded,
              inputBy, updateBy
          )
          VALUES (
            1, '${inputDate}', '${inputDate}', 
            '${cartId}',  ${cartItemId}, ${menu['menuTaxScId']},
            ${menu['taxRate']},  ${menu['taxStatus']},
              ${taxAmount}, 0,
              ${userId}, ${userId}
          )`;
    
          const [result3] = await db.query(q3);
    
          if (result3.affectedRows === 0) {
            results.push({ cartId, status: 'not found' });
          } else {
            results.push({ cartId, status: 'TAX cart_item_modifier insert' });
          }
        }
        else if (menu['taxStatus'] == 2) {
          let q3 =
            `INSERT INTO cart_item_modifier (
            presence, inputDate, updateDate,  
            cartId, cartItemId, menuTaxScId,
            taxRate, taxStatus,  price, priceIncluded,
            inputBy, updateBy 
          )
          VALUES (
            1, '${inputDate}', '${inputDate}', 
            '${cartId}',  ${cartItemId}, ${menu['menuTaxScId']},
            ${menu['taxRate']},  ${menu['taxStatus']}, 0, ${menu['taxAmount']},
            ${userId}, ${userId}
          )`;
    
          const [result3] = await db.query(q3);
    
          if (result3.affectedRows === 0) {
            results.push({ cartId, status: 'not found' });
          } else {
            results.push({ cartId, status: 'TAX cart_item_modifier insert' });
          }
        }
    */

    if (menu['menuSet'] == 'FIXED') {

      const q6 = `
      SELECT s.id , m.name , s.detailMenuId, m.adjustItemsId, m.id as 'menuId'
        FROM menu_set as s
      JOIN menu AS m ON m.id = s.detailMenuId
      WHERE 
        s.menuId = ${menu['id']}  
      `;

      const [result6] = await db.query(q6);
      for (const row of result6) {
        let q3 =
          `INSERT INTO cart_item_modifier (
            presence, inputDate, updateDate,  
            cartId, cartItemId, note, menuSetMenuId, 
            menuSetAdjustItemsId,
            inputBy, updateBy
          )
          VALUES (
            1, '${inputDate}', '${inputDate}', 
            '${cartId}',  ${cartItemId} , '${row['name']}', '${row['detailMenuId']}',  
            '${row['adjustItemsId']}', ${userId}, ${userId}
          )`;
        const [result3] = await db.query(q3);
        if (result3.affectedRows === 0) {
          results.push({ cartId, status: 'not found' });
        } else {
          results.push({ cartId, status: 'FIXED menu set insert' });
        }
      }

    }
    if (menu['menuSet'] == 'SELECT') {

      const menuSet = req.body['menuSet'];
      for (const row of menuSet) {

        let q3 =
          `INSERT INTO cart_item_modifier (
            presence, inputDate, updateDate,  
            cartId, cartItemId, note, menuSetMenuId,
            menuSetAdjustItemsId,
            inputBy, updateBy
          )
          VALUES (
            1, '${inputDate}', '${inputDate}', 
            '${cartId}',  ${cartItemId} , '${row['name']}', '${row['id']}',
            '${row['adjustItemsId']}', ${userId}, ${userId}
          )`;

        if (row['select'] > 0) {
          const [result3] = await db.query(q3);

          if (result3.affectedRows === 0) {
            results.push({ cartId, status: 'not found' });
          } else {
            results.push({ cartId, status: 'FIXED menu set insert' });
          }


        }

      }

    }

    const q1 = `
      UPDATE cart SET
        paymentId = '', 
        updateDate = '${today()}',
        updateBy = ${userId}
      WHERE id = '${cartId}'  `;
    await db.query(q1);

    res.status(201).json({
      error: false,
      cek: cek,
      db: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, note: 'Database insert error' });
  }
};


exports.updateCover = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const userId = headerUserId(req);
  const model = req.body['model'];
  const cartId = req.body['cartId'];

  let inputDate = today();
  const results = [];

  try {

    const q = `UPDATE cart
            SET
              cover = ${model['newQty']}, 
              updateDate = '${today()}',
              updateBy = ${userId}
          WHERE  id = '${cartId}'   `;

    const [result] = await db.query(q);
    if (result.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'UPDATE updated' });
    }

    res.status(201).json({
      error: false,
      results: results
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

exports.lockTable = async (req, res) => {
  const userId = headerUserId(req);
  const cartId = req.body['cartId'];
  const terminalId = req.body['terminalId'];

  let inputDate = today();
  const results = [];

  try {

    const q = `UPDATE cart
        SET
          lockBy = '${terminalId}', 
          updateDate = '${today()}',
          updateBy = ${userId}
      WHERE  id = '${cartId}' `;
    const [result] = await db.query(q);
    if (result.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'UPDATE updated' });
    }

    res.status(201).json({
      error: false,
      results: results
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

exports.clearLockTable = async (req, res) => {
  const userId = headerUserId(req);
  const terminalId = req.body['terminalId'];


  const results = [];

  try {

    const q = `UPDATE cart
        SET
          lockBy = '', 
          updateDate = '${today()}',
          updateBy = ${userId}
      WHERE  lockBy = '${terminalId}' `;

    const [result] = await db.query(q);
    if (result.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'clearLockTable UPDATE updated' });
    }

    res.status(201).json({
      error: false,
      results: results
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

exports.voidReason = async (req, res) => {
  try {
    const q = `
      SELECT * from void_reason 
      where status = 1 and presence = 1
      order by name ASC
    `;
    const [items] = await db.query(q);
    res.json({
      items: items,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.voidItemSo = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const userId = headerUserId(req);
  const reason = req.body['reason'];
  const itemsTransfer = req.body['itemsTransfer'];
  const items = req.body['items'];

  const id = req.body['id'];

  let inputDate = today();
  const results = [];

  try {
    for (const item of items) {
      const q = `UPDATE cart_item
            SET
              qty = ${item['total']}, 
              updateDate = '${today()}',
              updateBy = ${userId}
          WHERE  id = '${item['id']}'  and cartId = '${id}' `;

      const [result] = await db.query(q);
      if (result.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'UPDATE QTY updated' });
      }
    }

    for (const item of itemsTransfer) {
      const q1 = `INSERT INTO cart_item_void_reason (
            cartId, cartItemId, reason, qty,
            presence, 
            inputDate, updateDate,  
            inputBy, updateBy
        )
        VALUES (
          '${id}', ${item['id']}, '${reason}', ${item['total']},
          1, 
          '${today()}', '${today()}', 
          ${userId}, ${userId}
        )`;
      const [result1] = await db.query(q1);
      if (result1.affectedRows === 0) {
        results.push({ status: 'not found' });
      }
      else {
        results.push({ status: 'INSERT VOID REASON inserted' });
      }
    }

    const q2 = `UPDATE cart_item
            SET
              presence = 0,
              void = 1
          WHERE   qty = 0  and cartId = '${id}' `;

    const [result2] = await db.query(q2);
    if (result2.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'UPDATE VOID updated' });
    }



    res.status(201).json({
      results: results
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};


exports.cartDetail = async (req, res) => {
  const cartId = req.query.id;
  const menuId = req.query.menuId;
  const price = req.query.price;
  let sendOrder = !req.query.sendOrder ? '' : req.query.sendOrder;

  if (sendOrder == 'undefined') {
    sendOrder = '';
  }

  try {

    const q = `
      SELECT c.id, c.price, c.menuId , m.name, 0 as 'checkBox', '' as 'modifier', c.sendOrder, c.ta
      FROM cart_item AS c
      LEFT JOIN menu AS m ON m.id = c.menuId
      WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void = 0
      AND c.menuId = ${menuId} 
    `;

    const [formattedRows] = await db.query(q);
    let totalAmount = 0;
    let grandAmount = 0;


    // Loop dengan for...of agar bisa pakai await
    for (const row of formattedRows) {
      const q = `

        -- GENERAL
        SELECT 
            c.id, c.modifierId, c.price, m.descl, c.cartItemId, c.applyDiscount,  c.menuTaxScId, c.menuSetMenuId,
            c.priceIncluded,  0 as 'checkBox'
          FROM cart_item_modifier AS c
           JOIN modifier AS m ON m.id = c.modifierId
          where c.cartItemId = ${row.id}
          and c.presence = 1 and c.void = 0 and c.modifierId != 0
        and c.applyDiscount = 0

        UNION
        -- MEMO
        SELECT c.id, c.modifierId, c.price, c.note AS 'descl', c.cartItemId, c.applyDiscount,  c.menuTaxScId, c.menuSetMenuId,
            c.priceIncluded,   0 as 'checkBox'
        FROM cart_item_modifier AS c 
        WHERE c.cartItemId = ${row.id}
          and c.presence = 1 and c.void = 0  and c.modifierId = 0 AND    c.note  != ''
          and c.applyDiscount = 0
 
        UNION 
        -- APPLYDISCOUNT
        SELECT c.id, c.modifierId, c.price, m.name AS 'descl' , c.cartItemId, c.applyDiscount, c.menuTaxScId, c.menuSetMenuId,
         c.priceIncluded, 
        0 as 'checkBox'
        FROM cart_item_modifier AS c
         JOIN discount AS m ON m.id = c.applyDiscount
        where c.cartItemId =  ${row.id}
        and c.presence = 1 and c.void = 0  and c.modifierId = 0 


        UNION 
        -- SC 
        SELECT c.id, c.modifierId, c.price,  t.scNote AS 'descl' ,  c.cartItemId, c.applyDiscount, c.menuTaxScId, c.menuSetMenuId,
         c.priceIncluded, 
        0 as 'checkBox'
        FROM cart_item_modifier AS c
        JOIN menu_tax_sc AS t ON t.id = c.menuTaxScId
        where c.cartItemId =   ${row.id}
        and c.presence = 1 and c.void = 0  and c.scStatus != 0


        UNION 
        -- TAX 
        SELECT c.id, c.modifierId, c.price,  t.taxNote AS 'descl' ,  c.cartItemId, c.applyDiscount, c.menuTaxScId, c.menuSetMenuId,
        c.priceIncluded, 
        0 as 'checkBox'
        FROM cart_item_modifier AS c
        JOIN menu_tax_sc AS t ON t.id = c.menuTaxScId
        where c.cartItemId =   ${row.id}
        and c.presence = 1 and c.void = 0  and c.taxStatus != 0 
      `;


      const [modifier] = await db.query(q);

      row.modifier = modifier; // tambahkan hasil ke properti maps

    }



    const orderItems = [];
    let no = 1;
    for (let i = 0; i < formattedRows.length; i++) {

      orderItems.push({
        no: no++,
        id: formattedRows[i]['id'],
        menuId: formattedRows[i]['menuId'],
        parentId: 0,
        name: formattedRows[i]['name'] + (formattedRows[i]['modifier'].length > 0 ? '*' : ''),
        price: parseInt(formattedRows[i]['price']),
        priceIncluded: 0,
        checkBox: 0,
        sendOrder: formattedRows[i]['sendOrder'],
        modifierId: 'parent',
        applyDiscount: 0,
        menuTaxScId: 0,
        ta: formattedRows[i]['ta'],
        menuSetMenuId: 0,

      })
      formattedRows[i]['modifier'].forEach(el => {
        orderItems.push({
          no: 0,
          id: el['id'] == null ? 0 : el['id'],
          menuId: 0,
          parentId: el['cartItemId'],
          name: el['descl'],
          price: parseInt(el['price']),
          priceIncluded: parseInt(el['priceIncluded']),

          checkBox: 0,
          sendOrder: formattedRows[i]['sendOrder'],
          modifierId: el['modifierId'],
          applyDiscount: el['applyDiscount'],
          menuTaxScId: el['menuTaxScId'],
          menuSetMenuId: el['menuSetMenuId'],
        })
        grandAmount += parseInt(el['price']);

        if (el['menuTaxScId'] == 0) {
          totalAmount += parseInt(el['price']);
        }
      });

      grandAmount += parseInt(formattedRows[i]['price']);
      totalAmount += parseInt(formattedRows[i]['price']);

    }

    res.json({
      error: false,
      items: formattedRows,
      totalAmount: totalAmount,
      grandAmount: grandAmount,
      get: req.query,
      orderItems: orderItems,

    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getModifier = async (req, res) => {
  let i = 1;

  const outletId = req.query.outletId;
  const header = JSON.parse(req.headers['x-terminal']);

  try {

    if (outletId) {
      const [outlet] = await db.query(`SELECT id, priceNo FROM outlet WHERE id = ${outletId}`);
      i = outlet[0]['priceNo'];
    }

    const [terminal] = await db.query(`SELECT priceNo FROM terminal WHERE terminalId = ${header['terminalId']}`);
    if (terminal[0]['priceNo'] != 0) {
      i = terminal[0]['priceNo'];
    }

    const [formattedRows] = await db.query(`
      SELECT id, name,min,max, '' as detail
      FROM modifier_list
      WHERE presence = 1
    `);

    // Loop dengan for...of agar bisa pakai await
    for (const row of formattedRows) {
      const [detail] = await db.query(`
        SELECT id, descl, descm,descs, price${i}  as 'price' ,printing, modifierGroupId, 0 as checkBox
        FROM modifier
        where modifierListId = ?
        order by sorting ASC
      `, [row.id]);

      row.detail = detail; // tambahkan hasil ke properti maps
    }


    res.json({
      error: false,
      items: formattedRows,
      get: req.query
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.voidItemDetail = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const userId = headerUserId(req);
  const data = req.body['cart'];
  const cartId = req.body['cartId'];

  const results = [];

  try {
    for (const emp of data) {
      const { id, checkBox } = emp;

      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      if (checkBox == 1) {
        const q = `UPDATE cart_item
            SET
              void = 1,
              presence = 0,
              updateDate = '${today()}',
              updateBy = ${userId}
          WHERE id = ${id}  AND  sendOrder = ''  AND  cartId = '${cartId}'`;
        const [result] = await db.query(q);
        if (result.affectedRows === 0) {
          results.push({ id, status: 'not found', query: q, });
        } else {
          results.push({ id, status: 'updated', query: q, });
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

exports.addModifier = async (req, res) => {
  const userId = headerUserId(req);
  const data = req.body['cart'];
  const menu = req.body['menu'];
  const cartId = req.body['id'];

  const results = [];

  try {

    for (const emp of data) {
      const { id, checkBox } = emp;

      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      if (checkBox == 1) {
        const q2 = `
          SELECT count(id) as 'total'
            FROM cart_item_modifier
          WHERE
          cartId = '${cartId}' and
          cartItemId = ${id} and
          modifierId = ${menu['id']} and
          presence = 1 and void = 0
        `;
        const [isDouble] = await db.query(q2);
        if (isDouble[0]['total'] == 0) {

          const q =
            `INSERT INTO cart_item_modifier (
            presence, inputDate, updateDate, void,
            cartId, cartItemId, modifierId,
            note, price,
            inputBy, updateBy
          )
          VALUES (
            1, '${today()}', '${today()}',  0,
            '${cartId}',  ${id}, ${menu['id']},
            '', ${menu['price']},
            ${userId}, ${userId}
         )`;
          const [result] = await db.query(q);

          if (result.affectedRows === 0) {
            results.push({ id, status: 'not found', query: q, });
          } else {
            results.push({ id, status: 'updated', query: q, });

            const taxScUpdateRest = await taxScUpdate(id);
          }
        } else {
          results.push({ id, status: 'cannot double' });
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

exports.removeDetailModifier = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const userId = headerUserId(req);
  const data = req.body['cart'];
  const cartId = req.body['cartId'];

  const results = [];

  try {
    for (const emp of data) {
      const { id, checkBox, parentId } = emp;

      if (checkBox == 1) {
        if (parentId == 0) {
          const q = `UPDATE cart_item_modifier
            SET
              void = 1,
              presence = 0,
              updateDate = '${today()}',
              updateBy = ${userId}

          WHERE menuTaxScId = 0 AND sendOrder ='' AND  cartItemId = '${id}'`;
          const [result] = await db.query(q);
          if (result.affectedRows === 0) {
            results.push({ id, status: 'not found' });
          } else {
            results.push({ id, status: 'updated' });
            const taxScUpdateRest = await taxScUpdate(id);
          }

        }
        else {
          const q = `UPDATE cart_item_modifier
            SET
              void = 1,
              presence = 0,
              updateDate = '${today()}',
              updateBy = ${userId}
          WHERE menuTaxScId = 0  AND sendOrder ='' AND   id = '${id}'`;
          const [result] = await db.query(q);
          if (result.affectedRows === 0) {
            results.push({ id, status: 'not found' });
          } else {
            results.push({ id, status: 'updated' });
            const taxScUpdateRest = await taxScUpdate(parentId);
          }
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

exports.printQueue = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const userId = headerUserId(req);
  const results = [];
  const sendOrder = req.query.sendOrder;
  try {

    const { items } = await printQueueInternal(db, sendOrder, userId);

    res.status(201).json({
      items
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

exports.sendOrder = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const userId = headerUserId(req);
  let cartId = req.body['cartId'];
  const tableSendOrder = req.body['tableSendOrder'];

  const inputDate = today();
  const results = [];
  const { insertId: so } = await autoNumber('sendOrder');
  let tableMapStatusId = 12;
  try {

    const qcart = `
      SELECT id, tableMapStatusId, sendOrder 
      FROM cart
      WHERE id = ${cartId}
    `;
    const [dbCart] = await db.query(qcart);
    if (dbCart.length > 0) {
      if (dbCart[0]['tableMapStatusId'] >= 13) {
        tableMapStatusId = dbCart[0]['tableMapStatusId'];
      }
    }

    if (tableSendOrder == 0) {
      const { insertId } = await autoNumber('cart');

      const q2 = `
      UPDATE cart SET
        id =  '${insertId}', 
        sendOrder = 1,
        tableMapStatusId = ${tableMapStatusId}, 
        updateDate = '${today()}',
        updateBy = ${userId},
        lockBy = ''
      WHERE id = ${cartId} and sendOrder = 0`;
      await db.query(q2);

      const q3 = `
      UPDATE cart_item SET
        cartId =  '${insertId}'
      WHERE cartId = ${cartId}`;
      await db.query(q3);

      const q4 = `
      UPDATE cart_item_modifier SET
        cartId =  '${insertId}'
      WHERE cartId = ${cartId}`;
      await db.query(q4);


      const q6 = `
      UPDATE cart_item_group SET
        cartId =  '${insertId}'
      WHERE cartId = ${cartId}`;
      await db.query(q6);

       const q7 = `
      UPDATE cart_item_discount SET
        cartId =  '${insertId}'
      WHERE cartId = ${cartId}`;
      await db.query(q7);

       const q8 = `
      UPDATE cart_item_sc SET
        cartId =  '${insertId}'
      WHERE cartId = ${cartId}`;
      await db.query(q8);

       const q9 = `
      UPDATE cart_item_tax SET
        cartId =  '${insertId}'
      WHERE cartId = ${cartId}`;
      await db.query(q9);


      // ADD payment record

      const [checkPaymentType] = await db.query(`
        SELECT * FROM check_payment_type WHERE setDefault = 1 and presence = 1 order by name asc;
      `);

      if (checkPaymentType.length > 0) {
        for (const row of checkPaymentType) {
          const q12 = `
            INSERT INTO cart_payment (
                presence, inputDate,  updateDate,
                cartId,  checkPaymentTypeId, paid, tips,
                inputBy, updateBy
                  ) 
              VALUES (
                1, '${today()}',  '${today()}',
                '${insertId}',  ${row['id']}, 0, 0, 
                ${userId}, ${userId}
              )`;
          await db.query(q12);
        }
      }





      cartId = insertId;
    }




    const q1 = `
    UPDATE cart SET
      tableMapStatusId = ${tableMapStatusId}, 
      updateDate = '${today()}',
      updateBy = ${userId}
    WHERE id = ${cartId}  `;
    await db.query(q1);

    const q = `
    UPDATE cart_item SET
      sendOrder = '${so}', 
      updateDate = '${today()}',
      updateBy = ${userId}
    WHERE cartId = ${cartId}  and presence = 1 and void = 0 and sendOrder = '' `;
    await db.query(q);


     const q4 = `
    UPDATE cart_item_discount SET
      sendOrder =  '${so}', 
      updateDate = '${today()}',
      updateBy = ${userId}
    WHERE cartId = ${cartId}  and presence = 1 and void = 0 and sendOrder = ''`;
      await db.query(q4);

     const q5 = `
    UPDATE cart_item_sc SET
      sendOrder =  '${so}', 
      updateDate = '${today()}',
      updateBy = ${userId}
    WHERE cartId = ${cartId}  and presence = 1 and void = 0 and sendOrder = ''`;
     await db.query(q5);


     const q6 = `
    UPDATE cart_item_tax SET
      sendOrder =  '${so}', 
      updateDate = '${today()}',
      updateBy = ${userId}
    WHERE cartId = ${cartId}  and presence = 1 and void = 0 and sendOrder = ''`;
    await db.query(q6);


    const q2 = `
    UPDATE cart_item_modifier SET
      sendOrder =  '${so}', 
      updateDate = '${today()}',
      updateBy = ${userId}
    WHERE cartId = ${cartId}  and presence = 1 and void = 0 and sendOrder = ''`;
    const [result2] = await db.query(q2);

    if (result2.affectedRows !== 0) {


      const q1 = `
      UPDATE cart SET
        paymentId = '', 
        updateDate = '${today()}',
        updateBy = ${userId}
      WHERE id = ${cartId}  `;
      await db.query(q1);

      const q3 =
        `INSERT INTO send_order (
        presence, inputDate, updateDate,  
        cartId, sendOrderDate, id,
        inputBy, updateBy
      )
      VALUES (
        1, '${today()}', '${today()}',
        '${cartId}',  '${today()}', '${so}',
        ${userId}, ${userId}
      )`;
      await db.query(q3);
    }

    const { printResults: printQueue } = await printQueueInternal(db, so, userId);

    // Cetak printQueue ke file txt (JSON dan CSV)


    csvFile(cartId, so, printQueue);


    const { sendOrder } = require('../../helpers/sendOrder');
    const data = await sendOrder(so);

    const qq = `
        SELECT 
            c.id , c.id as 'bill', c.void,  c.dailyCheckId, c.cover, c.outletId,
            o.name AS 'outlet', c.startDate, c.endDate , 
            c.close,   t.tableName, t.tableNameExt, 'UAT PERSON' as 'servedBy' 
        FROM cart AS c
        JOIN outlet AS o ON o.id = c.outletId
        JOIN outlet_table_map AS t ON t.id = c.outletTableMapId
        WHERE c.presence = 1 AND  c.id = '${cartId}'
    `;
    const [transactionq] = await db.query(qq);

    const transaction = transactionq.map(row => ({
      ...row,
      startDate: formatDateTime(row.startDate),
      endDate: row.close == 0 ? '' : formatDateTime(row.endDate),
    }));

    txtTableChecker(cartId, so, data['cart'], transaction[0]);

    res.status(201).json({
      error: false,
      sendOrder: so,
      printQueue: printQueue,
      message: 'printQueue send Order',
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

exports.exitWithoutOrder = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const results = [];
  const userId = headerUserId(req);
  const cartId = req.body['cartId'];
  try {

    const a = `
      UPDATE cart SET
        void = 1,
        close = 1,
        tableMapStatusId = 42,
        endDate =  '${today()}', 
        updateDate = '${today()}',
        updateBy = ${userId}
      WHERE id = '${cartId}' and sendOrder != 1 `;
    const [resulta] = await db.query(a);

    if (resulta.affectedRows === 0) {
      results.push({ cartId, status: 'not found', });
    } else {
      results.push({ cartId, status: 'cart updated', });
    }


    const q = `
      UPDATE cart_item SET
        void  = 1, 
        updateDate = '${today()}',
        updateBy = ${userId}
      WHERE cartId = '${cartId}' and sendOrder = '' `;
    const [result] = await db.query(q);
    if (result.affectedRows === 0) {
      results.push({ cartId, status: 'not found', });
    } else {
      results.push({ cartId, status: 'cart_item updated', });
    }


    const a5 = `
      UPDATE cart_item_modifier SET
        void = 1,
        updateDate = '${today()}',
        updateBy = ${userId}
      WHERE cartId = '${cartId}'  and sendOrder = '' `;
    const [result5] = await db.query(a5);

    if (result5.affectedRows === 0) {
      results.push({ cartId, status: 'not found', });
    } else {
      results.push({ cartId, status: 'cart_item adjustItemsId = "DELETE"  updated', });
    }


    res.status(201).json({
      error: false,
      results: results,
      message: 'cart_item close Order',
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

exports.voidTransacton = async (req, res) => {
  // const { id, name, position, email } = req.body;
  const results = [];
  const userId = headerUserId(req);
  const cartId = req.body['cartId'];
  try {


    const a = `
      UPDATE cart SET
        void = 1,
        close = 1,
        tableMapStatusId = 41,
        endDate =  '${today()}', 
        updateDate = '${today()}',
        updateBy = ${userId}
      WHERE id = '${cartId}' `;
    const [resulta] = await db.query(a);

    if (resulta.affectedRows === 0) {
      results.push({ cartId, status: 'not found', });
    } else {
      results.push({ cartId, status: 'cart updated', });
    }


    const q = `
      UPDATE cart_item SET
        void  = 1, 
        updateDate = '${today()}',
        updateBy = ${userId}
      WHERE cartId = '${cartId}'  `;
    const [result] = await db.query(q);
    if (result.affectedRows === 0) {
      results.push({ cartId, status: 'not found', });
    } else {
      results.push({ cartId, status: 'cart_item updated', });
    }


    const a5 = `
      UPDATE cart_item_modifier SET
        void = 1,
        updateDate = '${today()}',
        updateBy = ${userId}
      WHERE cartId = '${cartId}'   `;
    const [result5] = await db.query(a5);

    if (result5.affectedRows === 0) {
      results.push({ cartId, status: 'not found', });
    } else {
      results.push({ cartId, status: 'cart_item adjustItemsId = "DELETE"  updated', });
    }




    res.status(201).json({
      error: false,
      results: results,
      message: 'cart_item close Order',
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

exports.menuLookUp = async (req, res) => {
  // const { id, name, position, email } = req.body;
  let parentId = req.query.parentId;

  if (parentId == 'undefined' || !parentId) parentId = 0;

  try {

    const q = `
      SELECT m.id, m.parentId, m.name, m.departmentId, p.name as 'parent'
      FROM menu_lookup  as m
      left join  menu_lookup as p on p.id = m.parentId
      WHERE m.presence = 1 and m.parentId = ${parentId}
      ORDER BY m.sorting ASC
    `;
    const [rows] = await db.query(q);

    const q2 = `
      SELECT id, parentId,  name 
      FROM menu_lookup 
      WHERE presence = 1 and id = ${parentId} 
    `;
    const [lookUpHeader] = await db.query(q2);

    res.status(201).json({
      error: false,
      parent: lookUpHeader,
      //  lookUpHeader: parentId == 0 ? 'Menu' : lookUpHeader[0]['name'],
      //  parentId: parentId == 0 ? 0 : parseInt(lookUpHeader[0]['parentId']),
      results: rows,
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database update error', details: err.message });
  }
};

exports.transferItems = async (req, res) => {

  try {
    const cartId = req.query.id;
    const q = `
      SELECT 
        i.id,   i.price, i.sendOrder, i.inputDate, c.id AS 'cartId' , c.outletTableMapId, c.outletId, t.tableName,
        m.name AS 'menu', 0 AS 'checkBox'
        FROM cart_item AS i
        JOIN cart AS c ON c.id = i.cartId
        JOIN menu AS m ON m.id = i.menuId
        JOIN outlet_table_map AS t ON t.id = c.outletTableMapId
        WHERE i.cartId = '${cartId}' AND i.presence = 1 AND i.void = 0 
        ORDER BY i.inputDate ASC;
    `;
    const [items] = await db.query(q);


    const q1 = `
      SELECT  * 
      FROM cart 
      WHERE id = '${cartId}' AND  presence = 1 AND void = 0
    `;
    const [table] = await db.query(q1);

    res.json({
      table: table[0],
      error: false,
      items: items,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.transferItemsGroup = async (req, res) => {
  const i = 1;
  try {
    const cartId = req.query.id;
    let totalItem = 0;
    const q = ` 
SELECT c.id, c.price,   c.menuId,  c.qty  AS 'total' , c.qty  AS 'totalReset', m.name
FROM cart_item AS c
JOIN menu AS m ON m.id = c.menuId
WHERE c.cartId = '${cartId}' AND c.presence = 1 AND c.void  = 0  AND c.sendOrder != ''
ORDER BY c.inputDate ASC 
 
    `;
    const [headerRow] = await db.query(q);

    const m = ` 
      SELECT c.id, c.cartItemId, concat(c.note, m.descs) AS 'note' FROM cart_item_modifier AS c
        LEFT JOIN modifier AS m ON m.id = c.modifierId
        WHERE c.cartId = '${cartId}' 
      AND c.presence = 1 AND c.void  = 0  AND c.sendOrder != ''
      AND c.applyDiscount = 0 AND c.menuTaxScId = 0
      union

      SELECT c.id, c.cartItemId, CONCAT(d.name) AS 'note' 
        FROM cart_item_modifier AS c
        LEFT JOIN discount AS d ON d.id = c.applyDiscount
      WHERE c.cartId = '${cartId}'  
      AND c.presence = 1 AND c.void  = 0  AND c.sendOrder != ''
      AND c.applyDiscount != 0 AND c.menuTaxScId = 0
   `;
    const [modifierRows] = await db.query(m);


    // bisa buatkan loop gabung for headerRow dan modifierRows
    for (const header of headerRow) {
      header['modifier'] = [];
      for (const modifier of modifierRows) {
        if (header.id === modifier.cartItemId) {
          header['modifier'].push(modifier);
        }
      }
    }

    const q2 = `
      SELECT * FROM cart WHERE id = '${cartId}' and presence = 1;
    `;

    const [table] = await db.query(q2);

    res.json({
      error: false,
      table: table[0],
      items: headerRow,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};



exports.transferTable = async (req, res) => {
  const userId = headerUserId(req);
  const table = req.body['table'];
  const cart = req.body['cart'];
  const itemsTransfer = req.body['itemsTransfer'];
  const dailyCheckId = req.body['dailyCheckId'];
  const outletId = req.body['outletId'];

  const inputDate = today();
  const results = [];

  try {
    let cartId = table['cardId'];

    // CART
    if (cartId == '') {
      const originalDate = inputDate;
      const timeToAdd = '01:01:00';

      const { hours, minutes, seconds } = parseTimeString(timeToAdd);
      const updatedDate = addTime(originalDate, hours, minutes, seconds);

      // Format hasil 
      let overDue = updatedDate.toLocaleString(process.env.TO_LOCALE_STRING).replace('T', ' ').substring(0, 19);
      overDue = convertCustomDateTime(overDue.toString())


      const { insertId } = await autoNumber('cart');
      cartId = insertId;


      const [newOrder] = await db.query(
        `INSERT INTO cart (
          presence, inputDate,   outletTableMapId, 
          cover,  id, outletId, dailyCheckId, tableMapStatusId,
          startDate, endDate, overDue, updateDate, updateBy, inputBy
          ) 
        VALUES (
          1, '${inputDate}',  ${table['outletTableMapId']}, 
          1,  '${insertId}',  ${outletId}, '${dailyCheckId}',   ${cart['tableMapStatusId']}, 
          '${inputDate}', '${inputDate}', '${overDue}', '${today()}', ${userId}, ${userId})`
      );
      if (newOrder.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'insert new table' });
      }
    }
    else {
      const q0 = `
          UPDATE cart SET 
            tableMapStatusId = '${cart['tableMapStatusId']}',  
            updateDate = '${today()}',
            updateBy = ${userId}
          WHERE id = ${cartId}`;

      const [result] = await db.query(q0);
      if (result.affectedRows === 0) {
        results.push({ cartId, status: 'not found' });
      } else {
        results.push({ cartId, status: 'updated table' });
      }
    }

    // CARD Detail 
    for (const emp of itemsTransfer) {
      const { id, total, totalOriginal, modifier, menuId } = emp;

      if (!id) {
        results.push({ id, status: 'failed', reason: 'id Missing fields' });
        continue;
      }


      // START :: TRANSFER ITEM
      const q02 = `
        INSERT INTO cart_item (
          cartId, subgroup, qty, menuId, adjustItemsId, ta, price, closedPrice, sendOrder, void,
          menuCategoryId, menuDepartmentId, presence, inputDate, inputBy, updateDate, updateBy
        )
        SELECT
          '${cartId}', subgroup, ${total}, menuId, adjustItemsId, ta, price, closedPrice, sendOrder, void,
          menuCategoryId, menuDepartmentId, presence, inputDate, ${userId}, '${today()}', ${userId}
        FROM cart_item
        WHERE id = ${id}`;
      const [resultq02] = await db.query(q02);
      let newCartItemId = null;
      if (resultq02.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        newCartItemId = resultq02.insertId;
        results.push({ status: 'cart_item INSERT TRANSFER', newCartItemId });
      }

      if (newCartItemId != null) {

        const q13 = `
        INSERT INTO cart_item_modifier (
          cartId, cartItemId, menuSetMenuId, menuSetQty, menuSetAdjustItemsId,
          modifierId, applyDiscount, menuTaxScId, scRate, scTaxInclude, scStatus,
          taxRate, taxStatus, note, remark, price, priceIncluded, sendOrder, void,
          presence, inputDate, inputBy, updateDate, updateBy
        )
        SELECT
          '${cartId}', ${newCartItemId}, menuSetMenuId, menuSetQty, menuSetAdjustItemsId,
          modifierId, applyDiscount, menuTaxScId, scRate, scTaxInclude, scStatus,
          taxRate, taxStatus, note, remark, price, priceIncluded, sendOrder, void,
          presence, inputDate, ${userId}, '${today()}', ${userId}
        FROM cart_item_modifier
        WHERE cartItemId = ${id}
      `;
        const [m1] = await db.query(q13);
        if (m1.affectedRows === 0) {
          results.push({ status: 'not found' });
        } else {
          results.push({ status: 'cart_item_modifier INSERT TRANSFER' });
        }

        // END :: TRANSFER ITEM


        // REMOVE OLD ITEM   
        const q03 = `
        UPDATE cart_item
        SET 
          qty = ${totalOriginal - total},  
          presence =  ${(totalOriginal - total) <= 0 ? 0 : 1},
          updateDate = '${today()}',
          updateBy = ${userId}
        WHERE id = ${id}`;
        const [resultq03] = await db.query(q03);
        if (resultq03.affectedRows === 0) {
          results.push({ status: 'not found' });
        } else {
          results.push({ status: 'cart_item REMOVE OLD ITEM' });
        }

        const [cart_transfer_items] = await db.query(
          `INSERT INTO cart_transfer_items (
            presence, inputDate,  outletTableMapId, outletTableMapIdNew,
            cartItemId, cartId, cartIdNew, dailyCheckId,
            inputBy
               ) 
        VALUES (1, '${inputDate}',  ${cart['outletTableMapId']},  ${table['outletTableMapId']}, 
             ${id}, '${cart['id']}' ,'${cartId}',  '${dailyCheckId}', ${userId} )`
        );
        if (cart_transfer_items.affectedRows === 0) {
          results.push({ status: 'not found' });
        } else {
          results.push({ status: 'cart_transfer_items INSERT' });
        }



        // PRINTER MOVE TABLE  

        /*
       {  
        "tableName":"TA1",
        "dateTime":"2025-09-16 16:17:21",
        "date":"2025-09-16",
        "time":"16:17:21",
        "cartItemId":1,
        "qty":18,
        "descs":"PASSION CCNT DELIGHT",
        "modifier":""
      }
      */

        const m8 = `
          SELECT * FROM print_queue
          WHERE cartItemId = '${id}' and menuId = ${menuId}`;
        const [printQueue] = await db.query(m8);

        let messageOld = printQueue[0]['message'] ? JSON.parse(printQueue[0]['message']) : {};

        messageOld['qty'] = (totalOriginal - total) <= 0 ? 0 : (totalOriginal - total);

        // UPDATE PRINTER KITCHEN OLD ITEM
        const q01 = `
        UPDATE print_queue SET 
          rushPrinting = 0, 
          message = '${JSON.stringify(messageOld)}',
          updateDate = '${today()}',
          updateBy = ${userId}
        WHERE cartItemId = '${id}' and menuId = ${menuId}`;
        const [resultq01] = await db.query(q01);
        if (resultq01.affectedRows === 0) {
          results.push({ status: 'not found' });
        } else {
          results.push({ status: 'PRINTER KITCHEN CHANGE BILL updated' });
        }


        let messageNew = printQueue[0]['message'] ? JSON.parse(printQueue[0]['message']) : {};
        messageNew['qty'] = total;
        // INSERT NEW PRINT QUEUE
        const insertPrintQueue = `
          INSERT INTO print_queue (
            cartId, cartItemId, menuId, rushPrinting, message, updateDate, updateBy,
            dailyCheckId, so, printerId, consoleError, 
            status, inputDate, inputBy
          ) VALUES (
            '${cartId}', '${id}', ${menuId}, 0, '${JSON.stringify(messageNew)}', '${today()}', ${userId},
            '${dailyCheckId}', '${printQueue[0]['so']}', ${printQueue[0]['printerId']}, '${printQueue[0]['consoleError']}',
             ${printQueue[0]['status']}, '${today()}', ${userId}
          )
        `;
        const [insertResult] = await db.query(insertPrintQueue);
        if (insertResult.affectedRows === 0) {
          results.push({ status: 'not found (insert)' });
        } else {
          results.push({ status: 'PRINTER KITCHEN CHANGE BILL inserted' });
        }

        // END >> PRINTER KITCHEN CHANGE BILL

      }

    }






    res.json({
      error: false,
      cartId: cartId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.transferLog = async (req, res) => {

  try {
    const cartId = req.query.cartId;
    const q = `
      SELECT  t.*, m.name 'menu', o.tableName FROM cart_transfer_items AS t 
      JOIN cart_item AS c ON c.id = t.cartItemId
      JOIN menu AS m ON m.id = c.menuId
      JOIN outlet_table_map AS o ON o.id = t.outletTableMapId
      WHERE t.cartIdNew = '${cartId}';
    `;
    const [transferIn] = await db.query(q);

    const q2 = `
     SELECT  t.*, m.name 'menu', o.tableName FROM cart_transfer_items AS t 
      JOIN cart_item AS c ON c.id = t.cartItemId
      JOIN menu AS m ON m.id = c.menuId
      JOIN outlet_table_map AS o ON o.id = t.outletTableMapIdNew
      WHERE t.cartId = '${cartId}';
    `;
    const [transferOut] = await db.query(q2);

    const transferInData = [];
    for (let i = 0; i < transferIn.length; i++) {
      const targetId = transferIn[i]['menu'];

      const index = transferInData.findIndex((item) => item.menu === targetId);
      if (index == -1) {
        const temp = {
          menu: transferIn[i]['menu'],
          total: 1,
          tableName: transferIn[i]['tableName'],
          inputDate: transferIn[i]['inputDate'],
        }
        transferInData.push(temp);
      } else {
        transferInData[index]['total']++;
      }
    }


    const transferOutData = [];
    for (let i = 0; i < transferOut.length; i++) {
      const targetId = transferOut[i]['menu'];

      const index = transferOutData.findIndex((item) => item.menu === targetId);
      if (index == -1) {
        const temp = {
          menu: transferOut[i]['menu'],
          total: 1,
          tableName: transferOut[i]['tableName'],
          inputDate: transferOut[i]['inputDate'],
        }
        transferOutData.push(temp);
      } else {
        transferOutData[index]['total']++;
      }
    }


    res.json({
      error: false,
      transferIn: transferInData,
      transferOut: transferOutData,

    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.takeOut = async (req, res) => {
  const cart = req.body['cart'];
  const userId = headerUserId(req);
  const results = [];
  try {

    for (const emp of cart) {
      const { id, menuId, ta } = emp;

      if (!menuId) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const intTa = parseInt(ta) > 0 ? 0 : 1;
      const q = `UPDATE cart_item
            SET
              ta = ${intTa}, 
              updateDate = '${today()}',
              updateBy = ${userId}
          WHERE id = ${id} `;
      const [result] = await db.query(q);
      if (result.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'cart_item updated' });
      }

      const q2 = `UPDATE cart_item_modifier
          SET
            void =  ${intTa}, 
            updateDate = '${today()}',
            updateBy = ${userId}
        WHERE cartItemId = ${id}  and scStatus  = 1  `;

      const [result2] = await db.query(q2);
      if (result2.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'cart_item_modifier updated' });
      }


      const taxScUpdateRest = await taxUpdate(id);



    }



    res.json({
      error: false,

    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.takeOutDetail = async (req, res) => {
  const data = req.body['cart'];
  const cartId = req.body['cartId'];

  const inputDate = today();
  const results = [];
  try {

    for (const emp of data) {
      const { id, ta } = emp;

      if (!id) {
        results.push({ id, status: 'failed', reason: 'Missing fields' });
        continue;
      }

      const q = `UPDATE cart_item
            SET
              ta = ${parseInt(ta) > 0 ? 0 : 1}, 
              updateDate = '${today()}'
          WHERE id = ${id}  `;
      const [result] = await db.query(q);
      if (result.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'cart_item updated' });
      }

    }


    // JIKA TA maka SC harus di hapus
    const q2 = `SELECT id, ta FROM  cart_item 
      WHERE  cartId = '${cartId}'  AND presence = 1 AND void = 0 `;
    const [result] = await db.query(q2);
    for (const data of result) {

      const q = `UPDATE cart_item_modifier
            SET
              void = ${parseInt(data['ta'])}, 
              updateDate = '${today()}'
          WHERE cartItemId = ${data['id']}  and scStatus  = 1  `;



      const [result] = await db.query(q);
      if (result.affectedRows === 0) {
        results.push({ status: 'not found' });
      } else {
        results.push({ status: 'cart_item_modifier updated' });
      }

    }


    res.json({
      error: false,

    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.mergerCheck = async (req, res) => {
  const newTable = req.body['newTable'];
  const cartId = req.body['cartId'];
  const table = req.body['table'];
  const dailyCheckId = req.body['dailyCheckId'];
  const inputDate = today();
  const results = [];
  const userId = headerUserId(req);
  try {


    const q1 = `UPDATE cart SET 
          void = 1,   
          close = 1,
          tableMapStatusId = 40,
          endDate = '${today()}',
          updateDate = '${today()}',
          updateBy = ${userId}
        WHERE id = '${cartId}'`;
    const [result1] = await db.query(q1);

    if (result1.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'header void cart  ' + cartId });
    }

    const q0 = `UPDATE cart SET   
          cover = ${table['cover'] + newTable['cover']}, 
          updateDate = '${today()}', 
          updateBy = ${userId}
        WHERE id ='${newTable['cardId']}'`;
    const [result0] = await db.query(q0);

    if (result0.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'header other update cart updated ' + newTable['cardId'] });
    }

    const q2 = `UPDATE cart_item SET 
          cartId = '${newTable['cardId']}',
          updateDate = '${today()}',
          updateBy = ${userId}
        WHERE cartId = ${cartId}`;
    const [result2] = await db.query(q2);
    if (result2.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'cart updated' });
    }

    const q3 = `UPDATE cart_item_modifier SET 
          cartId = '${newTable['cardId']}',
          updateDate = '${today()}',
          updateBy = ${userId}
        WHERE cartId = ${cartId}`;
    const [result3] = await db.query(q3);
    if (result3.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'cart updated' });
    }


    // LOG
    let q =
      `INSERT INTO cart_merge_log (
        presence, inputDate, inputBy,
        cartId, cartIdNew, 
        outletTableMapId, outletTableMapIdNew, 
        cover1, cover2,  coverNew, 
        dailyCheckId
      )
      VALUES (
        1, '${inputDate}', ${userId}, 
        '${cartId}',  '${newTable['cardId']}',
        '${table['outletTableMapId']}', '${newTable['outletTableMapId']}', 
        ${table['cover']}, ${newTable['cover']}, ${table['cover'] + newTable['cover']},
        '${dailyCheckId}'
      )`;
    const [resultlog] = await db.query(q);

    if (resultlog.affectedRows === 0) {
      results.push({ status: 'not found' });
    } else {
      results.push({ status: 'cart updated' });
    }

    res.json({
      error: false,
      results: results
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getChildrenRecursive = async (parentId, db) => {
  const [children] = await db.query(`SELECT *  FROM cart_merge_log WHERE cartId = '${parentId}'`);

  // Rekursif: untuk setiap anak, cari anak-anaknya
  for (const child of children) {
    child.children = await getChildrenRecursive(child.cartIdNew, db);
  }

  return children;
};

const getAncestorRecursive = async (childId, db) => {
  // Ambil data dirinya
  const q = `SELECT m.*, t1.tableName AS 'oldTable', t2.tableName AS 'newTable'
    FROM cart_merge_log AS m
    LEFT JOIN outlet_table_map AS t1 ON t1.id = m.outletTableMapId
    LEFT JOIN outlet_table_map AS t2 ON t2.id = m.outletTableMapIdNew
  WHERE m.cartIdNew = '${childId}' `;
  const [rows] = await db.query(q);

  if (rows.length === 0) return null;

  const current = rows[0];

  // Jika tidak ada parent (sudah paling atas), stop
  if (!current.cartId) return current;

  // Ambil parent-nya
  current.parent = await getAncestorRecursive(current.cartId, db);

  return current;
};

exports.mergeLog = async (req, res) => {
  const cartId = req.query.cartId;
  try {

    if (isNaN(cartId)) {
      return res.status(400).json({ error: 'Invalid cartId ID' });
    }
    const items = await getAncestorRecursive(cartId, db);

    res.json({
      items,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
};

exports.addCustomNotes_DEL = async (req, res) => {
  const cartId = req.body['cartId'];
  const model = req.body['model'];
  const items = req.body['items'];
  const userId = headerUserId(req);
  const inputDate = today();
  const results = [];
  try {

    for (const emp of items) {
      const { menuId, price } = emp;

      const q = `
        SELECT * FROM cart_item 
        WHERE cartId = '${cartId}' AND menuId = ${menuId} AND price = ${price} AND presence = 1 AND void = 0 `;

      const [result] = await db.query(q);

      for (const row of result) {

        const q3 =
          `INSERT INTO cart_item_modifier (
            presence, inputDate, updateDate,  
            cartId , note, cartItemId,
            updateBy, inputBy
          )
          VALUES (
            1, '${inputDate}', '${inputDate}',  
            '${cartId}', '${model['note']}', ${row['id']}, ${userId}, ${userId}
          )`;
        const [result3] = await db.query(q3);
        if (result3.affectedRows === 0) {
          results.push({ status: 'cart_item_modifier not found', });
        } else {
          results.push({ status: 'cart_item_modifier insert', });
        }
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

exports.addCustomNotesDetail = async (req, res) => {
  const cartId = req.body['cartId'];
  const model = req.body['model'];
  const items = req.body['items'];
  const userId = headerUserId(req);
  const inputDate = today();
  const results = [];
  try {

    for (const row of items) {
      const q3 =
        `INSERT INTO cart_item_modifier (
            presence, inputDate, updateDate,  
            cartId , note, cartItemId,
            updateBy, inputBy
          )
          VALUES (
            1, '${inputDate}', '${inputDate}',  
            '${cartId}', '${model['note']}', ${row['id']}, ${userId}, ${userId}
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