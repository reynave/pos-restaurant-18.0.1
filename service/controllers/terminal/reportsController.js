const db = require('../../config/db');
const { today, formatDateOnly, headerUserId } = require('../../helpers/global');

//buatkan getUser dari table user
exports.getUsers = async (req, res) => {
  try {
    const q = `SELECT id, username, name FROM employee WHERE presence = 1 `;
    const [users] = await db.query(q);

    res.json({ users: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

//buatkan getOutlets dari table outlet
exports.getOutlets = async (req, res) => {
  try {
    const q = `SELECT id,name FROM outlet WHERE presence = 1`;
    const [outlets] = await db.query(q);
    res.json({ outlets: outlets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};




exports.salesSummaryReport = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  // AND (c.startDate >= '2025-12-18 00:00:00' AND c.endDate <= '2025-12-18 23:59:59' )
  try {
    let whereFilter = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;

    const q = `
      SELECT sum(c.summaryItemTotal) AS 'ItemSales', sum(c.summaryDiscount) AS 'discount', 
      SUM( c.summaryItemTotal - c.summaryDiscount ) AS 'netSales',
        sum(c.summaryTax) AS 'tax', sum(c.summarySc) AS 'sc',  sum(c.grandTotal) AS 'grossSales', 
        SUM(c.cover) AS 'totalCover', count(c.id) AS 'totalCheck', 0 as salesPerCheck, 0 as salesPerCover
      FROM cart as c
      WHERE c.close = 1
      AND c.presence = 1 AND c.void =0 
      ${whereFilter}
    `;
    const [overall] = await db.query(q);


    const salesByModeQuery = `
      SELECT t1.*, p.desc1,  t1.debit * t1.qty AS 'itemSales', t1.credit * t1.qty AS 'discount',
        (t1.debit - t1.credit) * t1.qty AS 'netSales'
        FROM (
        SELECT  p.id, SUM( i.qty) AS 'qty',  sum(i.debit)  AS 'debit',
          sum(i.credit) AS 'credit'
        FROM cart as c 
        LEFT JOIN cart_item AS i ON i.cartId = c.id
        LEFT JOIN cart_item_discount AS d ON d.cartId = c.id
        LEFT JOIN outlet_table_map AS m ON m.id = c.outletTableMapId
        LEFT JOIN outlet_floor_plan AS p ON p.id = m.outletFloorPlandId
        WHERE 
        c.close = 1  
        AND c.presence = 1 AND c.void = 0  
        AND i.presence = 1 AND i.void = 0
        AND d.presence = 1 AND d.void = 0
        ${whereFilter}
        GROUP BY  p.id
      ) AS t1
      LEFT JOIN outlet_floor_plan AS p ON  p.id = t1.id`;

    const [salesByMode] = await db.query(salesByModeQuery);
    // saya mau hitung total itemSales dari salesByMode 
    const totalItemSales = salesByMode.reduce((acc, curr) => acc + parseFloat(curr.itemSales), 0);
    const totalNetSales = salesByMode.reduce((acc, curr) => acc + parseFloat(curr.netSales), 0);
    // saya mau hitung percentItemSales  dan update ke salesByMode
    salesByMode.forEach(item => {
      item.percentItemSales = totalItemSales ? ((item.itemSales / totalItemSales) * 100).toFixed(2) : '0.00';
      item.percentNetSales = totalNetSales ? ((item.netSales / totalNetSales) * 100).toFixed(2) : '0.00';
    });

    const salesByDepartmentQuery = `
    SELECT  t1.* , (t1.itemSales - t1.discount) AS 'netSales',  d.desc1 FROM (

      SELECT  
        SUM( ( i.debit *  i.qty))  AS 'itemSales', SUM( (IFNULL(d.credit,0) *  i.qty)) AS 'discount', 
        m.menuDepartmentId
      FROM cart as c
      LEFT JOIN cart_item AS i ON i.cartId = c.id
      LEFT JOIN menu AS m ON m.id = i.menuId 
      LEFT JOIN cart_item_discount AS d ON d.cartItemId = i.id
      WHERE c.close = 1
      AND d.presence = 1 AND d.void = 0
      AND c.presence = 1 AND c.void = 0 
      AND i.presence = 1 AND i.void = 0 
       ${whereFilter}
      GROUP BY m.menuDepartmentId

    ) AS t1 
    LEFT JOIN menu_department AS d ON d.id = t1.menuDepartmentId
    `;
    const [salesByDepartment] = await db.query(salesByDepartmentQuery);
    const totalItemSalesByDepartment = salesByDepartment.reduce((acc, curr) => acc + parseFloat(curr.itemSales), 0);
    const totalNetSalesByDepartment = salesByDepartment.reduce((acc, curr) => acc + parseFloat(curr.netSales), 0);

    salesByDepartment.forEach(item => {
      item.percentItemSales = totalItemSalesByDepartment ? ((item.itemSales / totalItemSalesByDepartment) * 100).toFixed(2) : '0.00';
      item.percentNetSales = totalNetSalesByDepartment ? ((item.netSales / totalNetSalesByDepartment) * 100).toFixed(2) : '0.00';
    });



    const salesByPeriodQuery = `
      SELECT IFNULL(p.name,'no_name') AS 'period',
        count(c.id) AS 'noOfCheck', SUM(c.cover) AS 'noOfCover', sum(c.summaryItemTotal) AS 'itemSales', 
        SUM(c.summaryTax) AS 'tax', SUM(c.summarySc) AS 'sc',
		  
		  0 AS 'percentItemSales',
        sum(c.summaryDiscount) AS 'discount', SUM( c.summaryItemTotal - c.summaryDiscount ) AS 'netSales',
        0 AS 'percentNetSales',
        SUM(c.grandTotal) AS 'GrossSales'
      FROM cart AS  c
      LEFT JOIN period AS p ON p.id = c.periodId
      WHERE c.close = 1
      AND c.presence = 1 AND c.void =0 
        ${whereFilter}
      GROUP BY c.periodId`;
    const [salesByPeriod] = await db.query(salesByPeriodQuery);
    // saya mau hitung total itemSales dari salesByPeriod 
    const totalItemSalesByPeriod = salesByPeriod.reduce((acc, curr) => acc + parseFloat(curr.itemSales), 0);
    const totalNetSalesByPeriod = salesByPeriod.reduce((acc, curr) => acc + parseFloat(curr.netSales), 0);
    // saya mau hitung percentItemSales  dan update ke salesByPeriod
    salesByPeriod.forEach(item => {
      item.percentItemSales = totalItemSalesByPeriod ? ((item.itemSales / totalItemSalesByPeriod) * 100).toFixed(2) : '0.00';
      item.percentNetSales = totalNetSalesByPeriod ? ((item.netSales / totalNetSalesByPeriod) * 100).toFixed(2) : '0.00';
    });

    const paymentAndTipsSummaryQuery = `
    SELECT t1.*, e.name AS 'payType' FROM (
        SELECT  p.checkPaymentTypeId, count( p.paid) AS 'paid',
        SUM( p.paid) AS 'paidAmount', SUM( p.tips) AS 'tipsAmount',  SUM( p.paid + p.tips) AS 'subTotal'
        FROM cart as c
        LEFT JOIN cart_payment AS p ON p.cartId = c.id
        WHERE 
        c.close = 1 
        AND p.presence = 1 AND p.void = 0 AND p.submit = 1
        AND c.presence = 1 AND c.void = 0  
        ${whereFilter}
        GROUP BY p.checkPaymentTypeId ) as t1
      LEFT JOIN check_payment_type AS e ON t1.checkPaymentTypeId = e.id`;
    const [paymentAndTipsSummary] = await db.query(paymentAndTipsSummaryQuery);
    // paymentAndTipsSummary total
    const totalPaid = paymentAndTipsSummary.reduce((acc, curr) => acc + parseFloat(curr.paid), 0);
    const totalPaidAmount = paymentAndTipsSummary.reduce((acc, curr) => acc + parseFloat(curr.paidAmount), 0);
    const totalTipsAmount = paymentAndTipsSummary.reduce((acc, curr) => acc + parseFloat(curr.tipsAmount), 0);
    const totalSubTotal = paymentAndTipsSummary.reduce((acc, curr) => acc + parseFloat(curr.subTotal), 0);




    const taxQuery = ` SELECT t.note , sum(t.debit ) AS 'total'
        FROM cart_item_tax AS t
      LEFT JOIN cart AS c ON c.id = t.cartId 
      WHERE c.close = 1 AND t.presence = 1 AND t.void = 0
      AND c.presence = 1 AND c.void =0 AND 
        (c.startDate >= ${startDate} or c.endDate <= ${endDate})
      GROUP BY t.note`;
    const [taxSummary] = await db.query(taxQuery);

    const voidItemSummaryQuery = `SELECT t1.*, m.name FROM (
      SELECT p.menuId, sum(p.qty) AS 'qty', sum(p.debit) AS 'total'
      FROM cart AS c 
      LEFT JOIN cart_item AS p ON p.cartId = c.id
      WHERE 
      c.close = 1 
      AND p.presence = 1 AND p.void = 1 
      AND c.presence = 1 AND c.void = 0  
      ${whereFilter}
      GROUP BY p.menuId) t1
      LEFT JOIN menu AS m ON m.id = t1.menuId`;
    const [voidItemSummary] = await db.query(voidItemSummaryQuery);


    const unpaidQuery = `SELECT 
        sum(c.summaryItemTotal) AS 'ItemSales' , 
        SUM(c.cover) AS 'totalCover', count(c.id) AS 'totalCheck'
      FROM cart as c
      WHERE c.close = 0
      AND c.presence = 1 AND c.void =0 AND 
        (c.startDate >= ${startDate} or c.endDate <= ${endDate}) 
    `;
    const [unpaid] = await db.query(unpaidQuery);


    const voidPaymentSummaryQuery = `
    SELECT t1.*, e.name AS 'payType' FROM (
        SELECT  p.checkPaymentTypeId, count( p.paid) AS 'paid',
        SUM( p.paid) AS 'paidAmount', SUM( p.tips) AS 'tipsAmount',  SUM( p.paid + p.tips) AS 'subTotal'
        FROM cart as c
        LEFT JOIN cart_payment AS p ON p.cartId = c.id
        WHERE 
        c.close = 1 
        AND p.presence = 1 AND p.void = 1 AND p.submit = 1
        AND c.presence = 1 AND c.void = 0  
        ${whereFilter}
        GROUP BY p.checkPaymentTypeId ) as t1
      LEFT JOIN check_payment_type AS e ON t1.checkPaymentTypeId = e.id`;
    const [voidPaymentSummary] = await db.query(voidPaymentSummaryQuery);


    res.json({
      filter: {
        startDate: startDate,
        endDate: endDate
      },
      overall: overall[0],
      salesByMode: salesByMode,
      salesByDepartment: salesByDepartment,
      salesByPeriod: salesByPeriod,
      paymentAndTipsSummary: {
        details: paymentAndTipsSummary,
        summary: {
          totalPaid: totalPaid,
          totalPaidAmount: totalPaidAmount,
          totalTipsAmount: totalTipsAmount,
          totalSubTotal: totalSubTotal
        }
      },
      voidItemSummary: voidItemSummary,
      voidPaymentSummary: voidPaymentSummary,
      unpaid: unpaid,
      taxSummary: {
        details: taxSummary,
        totalTax: taxSummary.reduce((acc, curr) => acc + parseFloat(curr.total), 0)
      },

    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.cashierPosPrinterPaper = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const data = [];
  try {

    let whereFilterOry = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;


    const employeedSelectQuery = `SELECT id, username, name FROM employee 
    WHERE presence = 1   order by name  asc`;
    const [employees] = await db.query(employeedSelectQuery);


    for (const emp of employees) {
      let whereFilter = whereFilterOry + ` AND c.closeBy = '${emp.id}' `;


      const q1 = `
    SELECT t.*, pp.name AS 'paytype' FROM (SELECT 
      p.checkPaymentTypeId, COUNT(p.checkPaymentTypeId) AS 'qty',
      sum(p.paid) AS 'amount', sum(p.tips) AS 'tips' , sum(p.paid + p.tips) AS 'total'
    FROM cart AS c 
    LEFT JOIN cart_payment AS p ON p.cartId = c.id
    WHERE c.close = 1 
    AND p.presence = 1 AND p.void = 0  AND p.submit = 1
    AND c.presence = 1 AND c.void = 0
    ${whereFilter}
    GROUP BY p.checkPaymentTypeId) AS t
    LEFT join check_payment_type AS pp ON pp.id = t.checkPaymentTypeId
    `;
  
      const [paymentSummary] = await db.query(q1);

      const totalTips = paymentSummary.reduce((acc, curr) => acc + parseFloat(curr.tips), 0);
      const totalAmount = paymentSummary.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
      const totalTotal = paymentSummary.reduce((acc, curr) => acc + parseFloat(curr.total), 0);

      const cashBalanceQuery = `SELECT  
      SUM( p.cashIn) AS 'cashIn' , sum(p.cashOut) AS 'cashOut', SUM(p.cashIn - p.cashOut) AS 'netCash' 
      FROM cart AS c 
      LEFT JOIN daily_cash_balance AS p ON p.cartId = c.id
      WHERE c.close = 1 
      AND p.presence = 1  
      AND c.presence = 1 AND c.void = 0
      ${whereFilter}
      `;
      const [cashBalanceResult] = await db.query(cashBalanceQuery);
      const cashBalance = cashBalanceResult[0];


      const salesSummaryReport = `
    SELECT  SUM(c.summaryItemTotal) AS 'itemSales', SUM(c.summaryDiscount) AS 'discount',
      SUM(c.summaryItemTotal - c.summaryDiscount) AS 'netSales', 
      SUM(c.summaryTax) AS 'tax', 
      SUM(c.summarySc) AS 'sc', SUM(c.grandTotal) AS 'grossSales',
      COUNT(c.id) AS 'check', SUM(c.cover) AS 'cover',  

      SUM(c.grandTotal) / COUNT(c.id)  AS 'avgCheck',
      SUM(c.grandTotal) / COUNT(c.cover)  AS 'avgCover' 
    FROM cart AS c  
    WHERE c.close = 1  
    AND c.presence = 1 AND c.void = 0
     ${whereFilter} 
    `;
      const [salesSummaryResult] = await db.query(salesSummaryReport);
      const salesSummary = salesSummaryResult[0];


      const fullPaidChecksQuery = `
    SELECT   SUM(c.grandTotal) AS 'grossSales',
      COUNT(c.id) AS 'check', SUM(c.cover) AS 'cover'  
      FROM cart AS c  
      WHERE c.close = 1  
      AND c.presence = 1 AND c.void = 0
      ${whereFilter}`;
      const [fullPaidChecksResult] = await db.query(fullPaidChecksQuery);
      const fullPaidChecks = fullPaidChecksResult[0];

      const unpaidCheckQuery = `
    SELECT   SUM(c.grandTotal) AS 'grossSales',
      COUNT(c.id) AS 'check', SUM(c.cover) AS 'cover'  
      FROM cart AS c  
      WHERE c.close = 0  
      AND c.presence = 1 AND c.void = 0
      ${whereFilter}`;
      const [unpaidCheckResult] = await db.query(unpaidCheckQuery);
      const unpaidChecks = unpaidCheckResult[0];


      const items = {
        paymentSummary: paymentSummary,
        grandSummary: {
          tips: totalTips,
          payAmount: totalAmount,
          payAmtPlusTips: totalTotal
        },
        cashBalance: cashBalance,
        salesSummary: salesSummary,
        fullPaidChecks: fullPaidChecks,
        unpaidChecks: unpaidChecks

      };
      data.push({ employee: emp, report: items });

    }


    res.json(data);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};