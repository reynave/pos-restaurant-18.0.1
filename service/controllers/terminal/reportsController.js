const db = require('../../config/db');
const { today, formatDateOnly, headerUserId } = require('../../helpers/global'); 

//http://localhost:3000/terminal/reports/salesSummaryReport?startDate=2025-12-18&endDate=2025-12-18
exports.salesSummaryReport = async (req, res) => { 
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  try {
    const q = `
      SELECT sum(c.summaryItemTotal) AS 'ItemSales', sum(c.summaryDiscount) AS 'discount', 
      SUM( c.summaryItemTotal - c.summaryDiscount ) AS 'netSales',
        sum(c.summaryTax) AS 'tax', sum(c.summarySc) AS 'sc',  sum(c.grandTotal) AS 'grossSales', 
        SUM(c.cover) AS 'totalCover', count(c.id) AS 'totalCheck'
      FROM cart as c
      WHERE c.close = 1
      AND c.presence = 1 AND c.void =0 AND 
      (c.startDate >= ${startDate} or c.endDate <= ${endDate})
    `; 
    const [overall] = await db.query(q);
 

    const salesByModeQuery = `
     SELECT IFNULL(p.name,'no_name') AS 'period',
      count(c.id) AS 'qty', sum(c.summaryItemTotal) AS 'itemSales', 0 AS 'percentItemSales',
      sum(c.summaryDiscount) AS 'discount', SUM( c.summaryItemTotal - c.summaryDiscount ) AS 'netSales',
      0 AS 'percentNetSales'
    FROM cart AS  c
    LEFT JOIN period AS p ON p.id = c.periodId
    WHERE c.close = 1
    AND c.presence = 1 AND c.void =0 
    AND (c.startDate >= ${startDate} or c.endDate <= ${endDate})
    GROUP BY c.periodId`;
    const [salesByMode] = await db.query(salesByModeQuery);

    // saya mau hitung total itemSales dari salesByMode 
    const totalItemSales = salesByMode.reduce((acc, curr) => acc + parseFloat(curr.itemSales), 0);
     const totalNetSales = salesByMode.reduce((acc, curr) => acc + parseFloat(curr.netSales), 0);
    

    // saya mau hitung percentItemSales  dan update ke salesByMode
    salesByMode.forEach(item => {
      item.percentItemSales =totalItemSales ? ((item.itemSales / totalItemSales) * 100).toFixed(2) : '0.00';
      item.percentNetSales = totalNetSales ? ((item.netSales / totalNetSales) * 100).toFixed(2) : '0.00';
    });



    const taxQuery = `
    SELECT t.note , sum(t.debit ) AS 'total'
    FROM cart_item_tax AS t
    LEFT JOIN cart AS c ON c.id = t.cartId

    WHERE c.close = 1 AND t.presence = 1 AND t.void = 0
    AND c.presence = 1 AND c.void =0 AND 
    (c.startDate >= ${startDate} or c.endDate <= ${endDate})
    GROUP BY t.note`;
    const [taxSummary] = await db.query(taxQuery);


    const unpaidQuery = `SELECT sum(c.summaryItemTotal) AS 'ItemSales' , 
      SUM(c.cover) AS 'totalCover', count(c.id) AS 'totalCheck'
      FROM cart as c
      WHERE c.close = 0
      AND c.presence = 1 AND c.void =0 AND 
      (c.startDate >= ${startDate} or c.endDate <= ${endDate}) 
    `;
    const [unpaid] = await db.query(unpaidQuery);

    res.json({
      filter : {
        startDate: startDate,
        endDate: endDate
      },
      overall: overall,
      salesByMode : {
        data : salesByMode,
        nonItemDiscount : salesByMode.reduce((acc, curr) => acc + parseFloat(curr.itemSales), 0),
        totalDiscount : salesByMode.reduce((acc, curr) => acc + parseFloat(curr.discount), 0),
        
      },
      salesByDepartment:'',
      salesByPoriod : '',
      paymentAndTipsSummary : '',
      voidItemSummary : '',
      voidPaymentSummary : '',
      unpaid : unpaid,
      taxSummary : {
        details : taxSummary,
        totalTax : taxSummary.reduce((acc, curr) => acc + parseFloat(curr.total), 0)
      },
      
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}; 