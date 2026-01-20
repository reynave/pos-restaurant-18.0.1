const e = require('express');
const db = require('../../config/db');
const path = require('path');
const ejs = require('ejs');
const { employeeDb, formatNumber, formatDateTimeID, formatDateOnlyID, fetchReportToken } = require('../../helpers/global');

// DONE::FILTER
exports.salesSummaryReport = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';
  try {

    let whereFilter = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;
    whereFilter += userId ? ` AND c.closeBy = '${userId}' ` : '';


    const overallQuery = `
        SELECT sum(c.summaryItemTotal) AS 'ItemSales', sum(c.summaryDiscount * -1) AS 'discount',
          SUM(c.summaryItemTotal + c.summaryDiscount) AS 'netSales',
          sum(c.summaryTax) AS 'tax', sum(c.summarySc) AS 'sc', sum(c.grandTotal) AS 'grossSales',
          SUM(c.cover) AS 'totalCover', count(c.id) AS 'totalCheck'
        FROM cart as c
        WHERE c.close = 1
          AND c.presence = 1 AND c.void = 0
          ${whereFilter}
      `;
    const [overallResult] = await db.query(overallQuery);
    const overallRow = overallResult[0] || {};
    const overallSummary = {
      itemSales: parseFloat(overallRow.ItemSales || 0),
      discount: parseFloat(overallRow.discount || 0),
      netSales: parseFloat(overallRow.netSales || 0),
      tax: parseFloat(overallRow.tax || 0),
      sc: parseFloat(overallRow.sc || 0),
      grossSales: parseFloat(overallRow.grossSales || 0),
      totalCover: parseFloat(overallRow.totalCover || 0),
      totalCheck: parseFloat(overallRow.totalCheck || 0)
    };
    overallSummary.avgSalesPerCheck = overallSummary.totalCheck ? overallSummary.grossSales / overallSummary.totalCheck : 0;
    overallSummary.avgSalesPerCover = overallSummary.totalCover ? overallSummary.grossSales / overallSummary.totalCover : 0;

    //buat pasrse float 2 digit coma saja
    overallSummary.avgSalesPerCheck = parseFloat(overallSummary.avgSalesPerCheck.toFixed(2));
    overallSummary.avgSalesPerCover = parseFloat(overallSummary.avgSalesPerCover.toFixed(2));

    const salesByModeQuery = `
        SELECT t1.*, p.desc1,  t1.debit * t1.qty AS 'itemSales', t1.credit * t1.qty AS 'discount',
          (t1.debit - t1.credit) * t1.qty AS 'netSales'
        FROM (
          SELECT  p.id, SUM(i.qty) AS 'qty', sum(i.debit) AS 'debit',
            sum(i.credit) AS 'credit'
          FROM cart as c 
          LEFT JOIN cart_item AS i ON i.cartId = c.id
          LEFT JOIN cart_item_discount AS d ON d.cartId = c.id
          LEFT JOIN outlet_table_map AS m ON m.id = c.outletTableMapId
          LEFT JOIN outlet_floor_plan AS p ON p.id = m.outletFloorPlandId
          WHERE c.close = 1  
            AND c.presence = 1 AND c.void = 0  
            AND i.presence = 1 AND i.void = 0
            AND d.presence = 1 AND d.void = 0
            ${whereFilter}
          GROUP BY p.id
        ) AS t1
        LEFT JOIN outlet_floor_plan AS p ON  p.id = t1.id`;

    const [salesByModeResult] = await db.query(salesByModeQuery);
    const totalItemSalesByMode = salesByModeResult.reduce((acc, curr) => acc + parseFloat(curr.itemSales || 0), 0);
    const totalNetSalesByMode = salesByModeResult.reduce((acc, curr) => acc + parseFloat(curr.netSales || 0), 0);
    const salesByMode = salesByModeResult.map(row => {
      const qty = parseFloat(row.qty || 0);
      const itemSales = parseFloat(row.itemSales || 0);
      const discount = parseFloat(row.discount || 0);
      const netSales = parseFloat(row.netSales || 0);
      return {
        id: row.id,
        desc1: row.desc1 || '-',
        qty,
        itemSales,
        discount,
        netSales,
        percentItemSales: totalItemSalesByMode ? ((itemSales / totalItemSalesByMode) * 100).toFixed(2) : '0.00',
        percentNetSales: totalNetSalesByMode ? ((netSales / totalNetSalesByMode) * 100).toFixed(2) : '0.00'
      };
    });

    const salesByDepartmentQuery = `
        SELECT  t1.*, (t1.itemSales - t1.discount) AS 'netSales', d.desc1 FROM (
          SELECT  
            SUM((i.debit * i.qty)) AS 'itemSales',
            SUM((IFNULL(d.credit,0) * i.qty)) AS 'discount', 
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
    const [salesByDepartmentResult] = await db.query(salesByDepartmentQuery);
    const totalItemSalesByDepartment = salesByDepartmentResult.reduce((acc, curr) => acc + parseFloat(curr.itemSales || 0), 0);
    const totalNetSalesByDepartment = salesByDepartmentResult.reduce((acc, curr) => acc + parseFloat(curr.netSales || 0), 0);
    const salesByDepartment = salesByDepartmentResult.map(row => {
      const itemSales = parseFloat(row.itemSales || 0);
      const discount = parseFloat(row.discount || 0);
      const netSales = parseFloat(row.netSales || 0);
      return {
        menuDepartmentId: row.menuDepartmentId,
        desc1: row.desc1 || '-',
        itemSales,
        discount,
        netSales,
        percentItemSales: totalItemSalesByDepartment ? ((itemSales / totalItemSalesByDepartment) * 100).toFixed(2) : '0.00',
        percentNetSales: totalNetSalesByDepartment ? ((netSales / totalNetSalesByDepartment) * 100).toFixed(2) : '0.00'
      };
    });

    const salesByPeriodQuery = `
        SELECT IFNULL(p.name,'no_name') AS 'period',
          count(c.id) AS 'noOfCheck', SUM(c.cover) AS 'noOfCover', sum(c.summaryItemTotal) AS 'itemSales', 
          SUM(c.summaryTax) AS 'tax', SUM(c.summarySc) AS 'sc',
          sum(c.summaryDiscount * -1) AS 'discount', SUM(c.summaryItemTotal + c.summaryDiscount) AS 'netSales',
          SUM(c.grandTotal) AS 'grossSales'
        FROM cart AS  c
        LEFT JOIN period AS p ON p.id = c.periodId
        WHERE c.close = 1
          AND c.presence = 1 AND c.void = 0 
          ${whereFilter}
        GROUP BY c.periodId`;
    const [salesByPeriodResult] = await db.query(salesByPeriodQuery);
    const totalItemSalesByPeriod = salesByPeriodResult.reduce((acc, curr) => acc + parseFloat(curr.itemSales || 0), 0);
    const totalNetSalesByPeriod = salesByPeriodResult.reduce((acc, curr) => acc + parseFloat(curr.netSales || 0), 0);
    const salesByPeriod = salesByPeriodResult.map(row => {
      const itemSales = parseFloat(row.itemSales || 0);
      const discount = parseFloat(row.discount || 0);
      const netSales = parseFloat(row.netSales || 0);
      const tax = parseFloat(row.tax || 0);
      const sc = parseFloat(row.sc || 0);
      const grossSales = parseFloat(row.grossSales || 0);
      return {
        period: row.period || '-',
        noOfCheck: parseFloat(row.noOfCheck || 0),
        noOfCover: parseFloat(row.noOfCover || 0),
        itemSales,
        discount,
        netSales,
        tax,
        sc,
        grossSales,
        percentItemSales: totalItemSalesByPeriod ? ((itemSales / totalItemSalesByPeriod) * 100).toFixed(2) : '0.00',
        percentNetSales: totalNetSalesByPeriod ? ((netSales / totalNetSalesByPeriod) * 100).toFixed(2) : '0.00'
      };
    });

    const paymentAndTipsSummaryQuery = `
        SELECT t1.*, e.name AS 'payType' FROM (
          SELECT  p.checkPaymentTypeId, count(p.paid) AS 'paid',
            SUM(p.paid) AS 'paidAmount', SUM(p.tips) AS 'tipsAmount', SUM(p.paid + p.tips) AS 'subTotal'
          FROM cart as c
          LEFT JOIN cart_payment AS p ON p.cartId = c.id
          WHERE c.close = 1 
            AND p.presence = 1 AND p.void = 0 AND p.submit = 1
            AND c.presence = 1 AND c.void = 0  
            ${whereFilter}
          GROUP BY p.checkPaymentTypeId
        ) as t1
        LEFT JOIN check_payment_type AS e ON t1.checkPaymentTypeId = e.id`;
    const [paymentAndTipsSummaryResult] = await db.query(paymentAndTipsSummaryQuery);
    const paymentAndTipsDetails = paymentAndTipsSummaryResult.map(row => {
      const paid = parseFloat(row.paid || 0);
      const paidAmount = parseFloat(row.paidAmount || 0);
      const tipsAmount = parseFloat(row.tipsAmount || 0);
      const subTotal = parseFloat(row.subTotal || 0);
      return {
        checkPaymentTypeId: row.checkPaymentTypeId,
        payType: row.payType || '-',
        paid,
        paidAmount,
        tipsAmount,
        subTotal
      };
    });
    const paymentSummaryTotals = paymentAndTipsDetails.reduce((acc, row) => {
      acc.totalPaid += row.paid;
      acc.totalPaidAmount += row.paidAmount;
      acc.totalTipsAmount += row.tipsAmount;
      acc.totalSubTotal += row.subTotal;
      return acc;
    }, { totalPaid: 0, totalPaidAmount: 0, totalTipsAmount: 0, totalSubTotal: 0 });

    const taxQuery = ` SELECT t.note , sum(t.debit ) AS 'total'
        FROM cart_item_tax AS t
        LEFT JOIN cart AS c ON c.id = t.cartId 
        WHERE c.close = 1 AND t.presence = 1 AND t.void = 0
          AND c.presence = 1 AND c.void = 0 
              ${whereFilter}
        GROUP BY t.note`;
    const [taxSummaryResult] = await db.query(taxQuery);
    const taxDetails = taxSummaryResult.map(row => ({
      note: row.note || '-',
      total: parseFloat(row.total || 0)
    }));
    const totalTax = taxDetails.reduce((acc, curr) => acc + curr.total, 0);

    const voidItemSummaryQuery = `SELECT t1.*, m.name FROM (
        SELECT p.menuId, sum(p.qty) AS 'qty', sum(p.debit) AS 'total'
        FROM cart AS c 
        LEFT JOIN cart_item AS p ON p.cartId = c.id
        WHERE c.close = 1 
          AND p.presence = 1 AND p.void = 1 
          AND c.presence = 1 AND c.void = 0  
          ${whereFilter}
        GROUP BY p.menuId) t1
        LEFT JOIN menu AS m ON m.id = t1.menuId`;
    const [voidItemSummaryResult] = await db.query(voidItemSummaryQuery);
    const voidItemSummary = voidItemSummaryResult.map(row => ({
      menuId: row.menuId,
      name: row.name || '-',
      qty: parseFloat(row.qty || 0),
      total: parseFloat(row.total || 0)
    }));

    const unpaidQuery = `SELECT 
          sum(c.summaryItemTotal) AS 'ItemSales' , 
          SUM(c.cover) AS 'totalCover', count(c.id) AS 'totalCheck'
        FROM cart as c
        WHERE c.close = 0
          AND c.presence = 1 AND c.void = 0 
         ${whereFilter}
      `;
    const [unpaidResult] = await db.query(unpaidQuery);
    const unpaidRow = unpaidResult[0] || {};
    const unpaidSummary = {
      itemSales: parseFloat(unpaidRow.ItemSales || 0),
      totalCover: parseFloat(unpaidRow.totalCover || 0),
      totalCheck: parseFloat(unpaidRow.totalCheck || 0)
    };

    const voidPaymentSummaryQuery = `
        SELECT t1.*, e.name AS 'payType' FROM (
          SELECT  p.checkPaymentTypeId, count(p.paid) AS 'paid',
            SUM(p.paid) AS 'paidAmount', SUM(p.tips) AS 'tipsAmount', SUM(p.paid + p.tips) AS 'subTotal'
          FROM cart as c
          LEFT JOIN cart_payment AS p ON p.cartId = c.id
          WHERE c.close = 1 
            AND p.presence = 1 AND p.void = 1 AND p.submit = 1
            AND c.presence = 1 AND c.void = 0  
            ${whereFilter}
          GROUP BY p.checkPaymentTypeId
        ) as t1
        LEFT JOIN check_payment_type AS e ON t1.checkPaymentTypeId = e.id`;
    const [voidPaymentSummaryResult] = await db.query(voidPaymentSummaryQuery);
    const voidPaymentSummary = voidPaymentSummaryResult.map(row => ({
      checkPaymentTypeId: row.checkPaymentTypeId,
      payType: row.payType || '-',
      paid: parseFloat(row.paid || 0),
      paidAmount: parseFloat(row.paidAmount || 0),
      tipsAmount: parseFloat(row.tipsAmount || 0),
      subTotal: parseFloat(row.subTotal || 0)
    }));



    const payload = {
      filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },

      overall: overallSummary,
      salesByMode,
      salesByDepartment,
      salesByPeriod,
      paymentAndTipsSummary: {
        details: paymentAndTipsDetails,
        summary: paymentSummaryTotals
      },
      voidItemSummary,
      voidPaymentSummary,
      unpaid: unpaidSummary,
      taxSummary: {
        details: taxDetails,
        totalTax
      }
    };
    const reportPayload = {
      title: 'Sales Summary Report',
      startDate,
      endDate,
      header: await fetchReportToken(req.query.t) || {},
      data: payload
    };
    if (view === 'printable') {
      const templatePath = path.join(__dirname, './../../views/reports/salesSummaryReport.ejs');
      ejs.renderFile(templatePath, {
        report: reportPayload,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID,
        formatNumber: formatNumber
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    } else {
      res.json({ report: reportPayload });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

// DONE::FILTER
exports.cashierReports = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';

  const data = [];
  const overallPaymentTypes = new Map();
  const overallTotals = {
    payment: { qty: 0, amount: 0, tips: 0, total: 0 },
    cash: { cashIn: 0, cashOut: 0 },
    sales: { itemSales: 0, discount: 0, netSales: 0, tax: 0, sc: 0, grossSales: 0, check: 0, cover: 0 },
    fullPaid: { grossSales: 0, check: 0, cover: 0 },
    unpaid: { grossSales: 0, check: 0, cover: 0 }
  };
  try {
    let whereFilterOry = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;
    //  whereFilterOry += userId ? ` AND c.closeBy = '${userId}' ` : '';



    const employeedSelectQuery = `SELECT id, username, name FROM employee 
    WHERE presence = 1   ORDER BY name ASC`;
    const [employees] = await db.query(employeedSelectQuery);

    for (const emp of employees) {
      const whereFilter = whereFilterOry + ` AND c.closeBy = '${emp.id}' `;

      const paymentSummaryQuery = `
        SELECT t.*, pp.name AS 'paytype' FROM (
          SELECT 
            p.checkPaymentTypeId,
            COUNT(p.checkPaymentTypeId) AS 'qty',
            SUM(p.paid) AS 'amount',
            SUM(p.tips) AS 'tips',
            SUM(p.paid + p.tips) AS 'total'
          FROM cart AS c 
          LEFT JOIN cart_payment AS p ON p.cartId = c.id
          WHERE c.close = 1 
            AND p.presence = 1 AND p.void = 0  AND p.submit = 1
            AND c.presence = 1 AND c.void = 0
            ${whereFilter}
          GROUP BY p.checkPaymentTypeId
        ) AS t
        LEFT JOIN check_payment_type AS pp ON pp.id = t.checkPaymentTypeId
      `;
      const [paymentSummaryResult] = await db.query(paymentSummaryQuery);
      const paymentSummary = paymentSummaryResult.map(row => {
        const qty = parseFloat(row.qty || 0);
        const amount = parseFloat(row.amount || 0);
        const tips = parseFloat(row.tips || 0);
        const total = parseFloat(row.total || 0);
        const paytype = row.paytype || 'Unknown';
        const typeKey = row.checkPaymentTypeId !== null && row.checkPaymentTypeId !== undefined
          ? `id-${row.checkPaymentTypeId}`
          : `name-${paytype}`;
        const existing = overallPaymentTypes.get(typeKey) || {
          checkPaymentTypeId: row.checkPaymentTypeId,
          paytype,
          qty: 0,
          amount: 0,
          tips: 0,
          total: 0
        };
        existing.qty += qty;
        existing.amount += amount;
        existing.tips += tips;
        existing.total += total;
        overallPaymentTypes.set(typeKey, existing);
        return {
          checkPaymentTypeId: row.checkPaymentTypeId,
          paytype,
          qty,
          amount,
          tips,
          total
        };
      });

      const paymentTotals = paymentSummary.reduce((acc, row) => {
        acc.qty += row.qty;
        acc.amount += row.amount;
        acc.tips += row.tips;
        acc.total += row.total;
        return acc;
      }, { qty: 0, amount: 0, tips: 0, total: 0 });

      overallTotals.payment.qty += paymentTotals.qty;
      overallTotals.payment.amount += paymentTotals.amount;
      overallTotals.payment.tips += paymentTotals.tips;
      overallTotals.payment.total += paymentTotals.total;

      const cashBalanceQuery = `
        SELECT  
          SUM(p.cashIn) AS 'cashIn',
          SUM(p.cashOut) AS 'cashOut'
        FROM cart AS c 
        LEFT JOIN daily_cash_balance AS p ON p.cartId = c.id
        WHERE c.close = 1 
          AND p.presence = 1  
          AND c.presence = 1 AND c.void = 0
          ${whereFilter}
      `;
      const [cashBalanceResult] = await db.query(cashBalanceQuery);
      const cashRow = cashBalanceResult[0] || {};
      const cashBalance = {
        cashIn: parseFloat(cashRow.cashIn || 0),
        cashOut: parseFloat(cashRow.cashOut || 0)
      };
      cashBalance.netCash = cashBalance.cashIn - cashBalance.cashOut;

      overallTotals.cash.cashIn += cashBalance.cashIn;
      overallTotals.cash.cashOut += cashBalance.cashOut;

      const salesSummaryReport = `
        SELECT
          SUM(c.summaryItemTotal) AS 'itemSales',
          SUM(c.summaryDiscount) AS 'discount',
          SUM(c.summaryItemTotal + c.summaryDiscount) AS 'netSales',
          SUM(c.summaryTax) AS 'tax',
          SUM(c.summarySc) AS 'sc',
          SUM(c.grandTotal) AS 'grossSales',
          COUNT(c.id) AS 'check',
          SUM(c.cover) AS 'cover'
        FROM cart AS c  
        WHERE c.close = 1  
          AND c.presence = 1 AND c.void = 0
          ${whereFilter} 
      `;
      const [salesSummaryResult] = await db.query(salesSummaryReport);
      const salesRow = salesSummaryResult[0] || {};
      const salesSummary = {
        itemSales: parseFloat(salesRow.itemSales || 0),
        discount: parseFloat(salesRow.discount || 0),
        netSales: parseFloat(salesRow.netSales || 0),
        tax: parseFloat(salesRow.tax || 0),
        sc: parseFloat(salesRow.sc || 0),
        grossSales: parseFloat(salesRow.grossSales || 0),
        check: parseFloat(salesRow.check || 0),
        cover: parseFloat(salesRow.cover || 0)
      };
      salesSummary.avgCheck = salesSummary.check ? salesSummary.grossSales / salesSummary.check : 0;
      salesSummary.avgCover = salesSummary.cover ? salesSummary.grossSales / salesSummary.cover : 0;

      overallTotals.sales.itemSales += salesSummary.itemSales;
      overallTotals.sales.discount += salesSummary.discount;
      overallTotals.sales.netSales += salesSummary.netSales;
      overallTotals.sales.tax += salesSummary.tax;
      overallTotals.sales.sc += salesSummary.sc;
      overallTotals.sales.grossSales += salesSummary.grossSales;
      overallTotals.sales.check += salesSummary.check;
      overallTotals.sales.cover += salesSummary.cover;

      const fullPaidChecksQuery = `
        SELECT
          SUM(c.grandTotal) AS 'grossSales',
          COUNT(c.id) AS 'check',
          SUM(c.cover) AS 'cover'
        FROM cart AS c  
        WHERE c.close = 1  
          AND c.presence = 1 AND c.void = 0
          ${whereFilter}`;
      const [fullPaidChecksResult] = await db.query(fullPaidChecksQuery);
      const fullPaidRow = fullPaidChecksResult[0] || {};
      const fullPaidChecks = {
        grossSales: parseFloat(fullPaidRow.grossSales || 0),
        check: parseFloat(fullPaidRow.check || 0),
        cover: parseFloat(fullPaidRow.cover || 0)
      };

      overallTotals.fullPaid.grossSales += fullPaidChecks.grossSales;
      overallTotals.fullPaid.check += fullPaidChecks.check;
      overallTotals.fullPaid.cover += fullPaidChecks.cover;

      const unpaidCheckQuery = `
        SELECT
          SUM(c.grandTotal) AS 'grossSales',
          COUNT(c.id) AS 'check',
          SUM(c.cover) AS 'cover'
        FROM cart AS c  
        WHERE c.close = 0  
          AND c.presence = 1 AND c.void = 0
          ${whereFilter}`;
      const [unpaidCheckResult] = await db.query(unpaidCheckQuery);
      const unpaidRow = unpaidCheckResult[0] || {};
      const unpaidChecks = {
        grossSales: parseFloat(unpaidRow.grossSales || 0),
        check: parseFloat(unpaidRow.check || 0),
        cover: parseFloat(unpaidRow.cover || 0)
      };

      overallTotals.unpaid.grossSales += unpaidChecks.grossSales;
      overallTotals.unpaid.check += unpaidChecks.check;
      overallTotals.unpaid.cover += unpaidChecks.cover;

      const reportItems = {
        paymentSummary,
        grandSummary: {
          tips: paymentTotals.tips,
          payAmount: paymentTotals.amount,
          payAmtPlusTips: paymentTotals.total
        },
        cashBalance,
        salesSummary,
        fullPaidChecks,
        unpaidChecks
      };

      data.push({ employee: emp, report: reportItems });
    }

    overallTotals.cash.netCash = overallTotals.cash.cashIn - overallTotals.cash.cashOut;
    const reportHeader = await fetchReportToken(req.query.t);
    const paymentSummaryTotals = Array.from(overallPaymentTypes.values()).sort((a, b) => {
      const left = (a.paytype || '').toLowerCase();
      const right = (b.paytype || '').toLowerCase();
      if (left < right) return -1;
      if (left > right) return 1;
      return 0;
    });

    const overallSalesAvgCheck = overallTotals.sales.check ? overallTotals.sales.grossSales / overallTotals.sales.check : 0;
    const overallSalesAvgCover = overallTotals.sales.cover ? overallTotals.sales.grossSales / overallTotals.sales.cover : 0;

    const payload = {
      filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },
      employees: data,

      paymentSummary: paymentSummaryTotals,
      totals: {
        payment: overallTotals.payment,
        cash: {
          cashIn: overallTotals.cash.cashIn,
          cashOut: overallTotals.cash.cashOut,
          netCash: overallTotals.cash.netCash
        },
        sales: {
          itemSales: overallTotals.sales.itemSales,
          discount: overallTotals.sales.discount,
          netSales: overallTotals.sales.netSales,
          tax: overallTotals.sales.tax,
          sc: overallTotals.sales.sc,
          grossSales: overallTotals.sales.grossSales,
          check: overallTotals.sales.check,
          cover: overallTotals.sales.cover,
          avgCheck: overallSalesAvgCheck,
          avgCover: overallSalesAvgCover
        },
        fullPaid: overallTotals.fullPaid,
        unpaid: overallTotals.unpaid
      }
    };
    const reportPayload = {
      title: 'Cashier Reports',
      header: reportHeader || {},
      startDate,
      endDate,
      data: payload
    };
    if (view === 'printable') {
      const templatePath = path.join(__dirname, './../../views/reports/cashierReports.ejs');
      ejs.renderFile(templatePath, {
        report: reportPayload,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID,
        formatNumber: formatNumber
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    } else {
      res.json({ report: reportPayload });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

// DONE::FILTER
exports.itemizedSalesDetail = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';
  try {
    const menuDepartmentQuery = `SELECT id, desc1 FROM menu_department WHERE presence = 1 ORDER BY desc1 ASC`;
    const [menuDepartments] = await db.query(menuDepartmentQuery);

    const periodQuery = `
      SELECT DISTINCT periodId, IFNULL(p.name, 'no-name') AS 'period'
      FROM cart AS c
      LEFT JOIN period AS p ON p.id = c.periodId`;
    const [periods] = await db.query(periodQuery);

    let whereFilterDate = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;
    whereFilterDate += userId ? ` AND c.closeBy = '${userId}' ` : '';


    const departmentsData = [];

    for (const menuDept of menuDepartments) {
      const departmentDetail = [];

      for (const period of periods) {
        const periodId = period.periodId;
        const periodFilter = periodId !== null && periodId !== undefined
          ? `${whereFilterDate} AND c.periodId = ${periodId}`
          : `${whereFilterDate} AND c.periodId IS NULL`;

        const itemsSalesQuery = ` 
          SELECT  
              SUM(p.debit * p.qty ) AS 'itemSales', 
              SUM(p.qty) AS 'qty', 
              SUM((IFNULL(d.credit,0))) AS 'discount',
              SUM((p.debit-  IFNULL(d.credit,0)) * p.qty ) AS 'netSales'
          FROM cart AS c 
          LEFT JOIN cart_item AS p ON p.cartId = c.id
          LEFT JOIN cart_item_discount AS d ON d.cartItemId = p.id
          LEFT JOIN menu AS m ON m.id = p.menuId
          WHERE c.close = 1  ${periodFilter}
            AND p.presence = 1 AND p.void = 0  
            AND c.presence = 1 AND c.void = 0  
            AND m.menuDepartmentId = ${menuDept.id}
        `;
        const [itemsSalesResult] = await db.query(itemsSalesQuery);
        const totalsRow = itemsSalesResult[0] || {};
        const totalItemSales = parseFloat(totalsRow.itemSales || 0);
        const totalQty = parseFloat(totalsRow.qty || 0);
        const totalDiscount = parseFloat(totalsRow.discount || 0);
        const totalNetSales = parseFloat(totalsRow.netSales || 0);

        const detailQuery = `
          SELECT m.name, m.plu, t1.* FROM (
            SELECT  
              p.menuId,
              p.debit AS 'price',
              SUM(p.qty) AS 'qty',
              SUM(p.debit * p.qty) AS 'itemSales',
              SUM((IFNULL(d.credit,0))) AS 'discount',
              SUM((p.debit-  IFNULL(d.credit,0)) * p.qty) AS 'netSales'
            FROM cart AS c 
            LEFT JOIN cart_item AS p ON p.cartId = c.id
            LEFT JOIN cart_item_discount AS d ON d.cartItemId = p.id
            WHERE c.close = 1 ${periodFilter}
              AND p.presence = 1 AND p.void = 0  
              AND c.presence = 1 AND c.void = 0  
            GROUP BY p.menuId, p.debit
          ) AS t1
          LEFT JOIN menu AS m ON m.id = t1.menuId
          WHERE m.menuDepartmentId = ${menuDept.id}
          ORDER BY m.name ASC
        `;
        const [detailResult] = await db.query(detailQuery);

        const setMenuQuery = `
          SELECT  CONCAT('*', m.name) AS 'name', m.plu, t1.menuSetMenuId AS 'menuId',
            0 AS 'price', t1.qty, 0 AS 'itemSales', 0 AS 'discount', 0 AS 'netSales'
          FROM (
            SELECT m.menuSetMenuId, SUM(p.qty) AS 'qty'
            FROM cart AS c
            JOIN cart_item_modifier AS m ON m.cartId = c.id
            JOIN cart_item AS p ON p.id = m.cartItemId
            WHERE m.menuSetMenuId > 0 ${periodFilter}
              AND p.presence = 1 AND p.void = 0 AND c.close = 1
            GROUP BY m.menuSetMenuId
          ) AS t1
          LEFT JOIN menu AS m ON m.id = t1.menuSetMenuId
        `;
        const [setMenuResult] = await db.query(setMenuQuery);

        const combinedDetail = [...detailResult, ...setMenuResult].map(row => {
          const qty = parseFloat(row.qty || 0);
          const price = parseFloat(row.price || 0);
          const itemSalesValue = parseFloat(row.itemSales || 0);
          const discountValue = parseFloat(row.discount || 0);
          const netSalesValue = parseFloat(row.netSales || 0);
          const percentItem = totalItemSales ? ((itemSalesValue / totalItemSales) * 100).toFixed(2) : '0.00';
          const percentNet = totalNetSales ? ((netSalesValue / totalNetSales) * 100).toFixed(2) : '0.00';
          return {
            ...row,
            qty,
            price,
            itemSales: itemSalesValue,
            discount: discountValue,
            netSales: netSalesValue,
            percentPerAllItemSales: percentItem,
            percentPerAllNetSales: percentNet
          };
        });

        departmentDetail.push({
          id: period.periodId,
          period: period.period,
          totalQty,
          totalItemSales,
          totalDiscount,
          totalNetSales,
          setMenu: setMenuResult.length,
          itemizedSalesDetail: combinedDetail
        });
      }

      departmentsData.push({
        departmentId: menuDept.id,
        name: menuDept.desc1,
        departments: departmentDetail
      });
    }

    const allDepartmentsQuery = ` 
      SELECT  
          SUM(p.qty) AS 'qty',
          SUM(p.debit * p.qty) AS 'itemSales',  
          SUM((IFNULL(d.credit,0))) AS 'discount', 
          SUM((p.debit-  IFNULL(d.credit,0)) * p.qty) AS 'netSales'
      FROM cart AS c 
      LEFT JOIN cart_item AS p ON p.cartId = c.id
      LEFT JOIN cart_item_discount AS d ON d.cartItemId = p.id
      WHERE c.close = 1 ${whereFilterDate}
        AND p.presence = 1 AND p.void = 0  
        AND c.presence = 1 AND c.void = 0
    `;
    const [allDepartmentsResult] = await db.query(allDepartmentsQuery);
    const allDepartmentsTotals = allDepartmentsResult[0] || { qty: 0, itemSales: 0, discount: 0, netSales: 0 };

    const byPeriod = [];
    for (const period of periods) {
      const periodId = period.periodId;
      const periodFilter = periodId !== null && periodId !== undefined
        ? `${whereFilterDate} AND c.periodId = ${periodId}`
        : `${whereFilterDate} AND c.periodId IS NULL`;

      const totalsByPeriodQuery = `
        SELECT  
            SUM(p.qty) AS 'qty',
            SUM(p.debit * p.qty) AS 'itemSales',  
            SUM((IFNULL(d.credit,0))) AS 'discount', 
            SUM((p.debit-  IFNULL(d.credit,0)) * p.qty) AS 'netSales'
        FROM cart AS c 
        LEFT JOIN cart_item AS p ON p.cartId = c.id
        LEFT JOIN cart_item_discount AS d ON d.cartItemId = p.id
        WHERE c.close = 1 ${periodFilter}
          AND p.presence = 1 AND p.void = 0  
          AND c.presence = 1 AND c.void = 0
      `;
      const [totalsByPeriodResult] = await db.query(totalsByPeriodQuery);
      const totalsRow = totalsByPeriodResult[0] || {};
      byPeriod.push({
        period,
        totalQty: parseFloat(totalsRow.qty || 0),
        totalDiscount: parseFloat(totalsRow.discount || 0),
        totalItemSales: parseFloat(totalsRow.itemSales || 0),
        totalNetSales: parseFloat(totalsRow.netSales || 0)
      });
    }

    const taxQuery = `SELECT SUM(p.debit) AS 'debit' 
      FROM cart AS c  
      LEFT JOIN cart_item_tax AS p ON p.cartId = c.id
      WHERE c.close = 1  ${whereFilterDate}
        AND p.presence = 1 AND p.void = 0  
        AND c.presence = 1 AND c.void = 0`;
    const [taxResult] = await db.query(taxQuery);

    const scQuery = `SELECT SUM(p.debit) AS 'debit' 
      FROM cart AS c  
      LEFT JOIN cart_item_sc AS p ON p.cartId = c.id
      WHERE c.close = 1  ${whereFilterDate}
        AND p.presence = 1 AND p.void = 0  
        AND c.presence = 1 AND c.void = 0`;
    const [scResult] = await db.query(scQuery);

    const grossSalesQuery = `SELECT  
        SUM(c.grandTotal) AS 'grandTotal',
        SUM(c.cover) AS 'totalCover',
        COUNT(c.id) AS 'checks'
      FROM cart AS c
      WHERE c.close = 1 ${whereFilterDate}
        AND c.presence = 1 AND c.void = 0`;
    const [grossSalesResult] = await db.query(grossSalesQuery);
    const grossRow = grossSalesResult[0] || {};

    const taxValue = parseFloat(taxResult[0]?.debit || 0);
    const scValue = parseFloat(scResult[0]?.debit || 0);
    const grossSalesValue = parseFloat(grossRow.grandTotal || 0);
    const totalCoverValue = parseFloat(grossRow.totalCover || 0);
    const totalChecksValue = parseFloat(grossRow.checks || 0);
    const salesPerChecks = totalChecksValue ? grossSalesValue / totalChecksValue : 0;
    const salesPerCover = totalCoverValue ? grossSalesValue / totalCoverValue : 0;


    const summary = {
      totalQty: parseFloat(allDepartmentsTotals.qty || 0),
      itemSales: parseFloat(allDepartmentsTotals.itemSales || 0),
      discount: parseFloat(allDepartmentsTotals.discount || 0),
      netSales: parseFloat(allDepartmentsTotals.netSales || 0),
      tax: taxValue,
      sc: scValue,
      grossSales: grossSalesValue,
      totalCover: totalCoverValue,
      totalChecks: totalChecksValue,
      salesPerChecks,
      salesPerCover
    };

    const payload = {
      filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },
      periods,

      allDepartments: allDepartmentsTotals,
      byPeriod,
      tax: taxValue,
      sc: scValue,
      grossSales: grossSalesValue,
      totalCover: totalCoverValue,
      totalChecks: totalChecksValue,
      salesPerChecks,
      salesPerCover,
      summary,
      data: departmentsData
    };

    const reportPayload = {
      title: 'Itemized Sales Detail',
      startDate,
      endDate,
      header: await fetchReportToken(req.query.t) || {},
      data: payload
    };
    if (view === 'printable') {
      const templatePath = path.join(__dirname, './../../views/reports/itemizedSalesDetail.ejs');


      ejs.renderFile(templatePath, {
        report: reportPayload,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID,
        formatNumber: formatNumber
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    } else {
      res.json({ report: reportPayload });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

// DONE::FILTER
exports.itemizedSalesSummary = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';
  try {
    const menu_department_query = `SELECT id, desc1 FROM menu_department WHERE presence = 1 ORDER BY desc1 ASC`;
    const [menuDepartments] = await db.query(menu_department_query);

    const periodQuery = `
        SELECT DISTINCT periodId, IFNULL(p.name, 'no-name') AS 'period' 
        FROM cart AS c
        LEFT JOIN period AS p ON p.id = c.periodId`;
    const [periods] = await db.query(periodQuery);

    let whereFilterDate = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;
    whereFilterDate += userId ? ` AND c.closeBy = '${userId}' ` : '';

    const items = [];

    for (const menuDept of menuDepartments) {
      const departments = [];

      const departmentTotalsQuery = ` 
      SELECT  
          SUM(p.debit * p.qty ) AS 'itemSales',  
          SUM((IFNULL(d.credit,0))) AS 'discount',
          SUM((p.debit-  IFNULL(d.credit,0)) * p.qty ) AS 'netSales'
      FROM cart AS c 
      LEFT JOIN cart_item AS p ON p.cartId = c.id
      LEFT JOIN cart_item_discount AS d ON d.cartItemId = p.id
      LEFT JOIN menu AS m ON m.id = p.menuId
      WHERE c.close = 1  ${whereFilterDate}
        AND p.presence = 1 AND p.void = 0  
        AND c.presence = 1 AND c.void = 0  
        AND m.menuDepartmentId = ${menuDept.id}
      `;
      const [departmentTotalsResult] = await db.query(departmentTotalsQuery);
      const departmentTotals = departmentTotalsResult[0] || { itemSales: 0, discount: 0, netSales: 0 };

      for (const period of periods) {
        const periodId = period.periodId;
        const periodFilter = periodId !== null && periodId !== undefined
          ? `${whereFilterDate} AND c.periodId = ${periodId}`
          : `${whereFilterDate} AND c.periodId IS NULL`;

        const itemsSalesQuery = ` 
        SELECT  
            SUM(p.debit * p.qty ) AS 'itemSales', 
            SUM(p.qty) AS 'qty', 
            SUM((p.debit-  IFNULL(d.credit,0)) * p.qty ) AS 'netSales',
            SUM((IFNULL(d.credit,0))) AS 'discount'
        FROM cart AS c 
        LEFT JOIN cart_item AS p ON p.cartId = c.id
        LEFT JOIN cart_item_discount AS d ON d.cartItemId = p.id
        LEFT JOIN menu AS m ON m.id = p.menuId
        WHERE c.close = 1  ${periodFilter}
          AND p.presence = 1 AND p.void = 0  
          AND c.presence = 1 AND c.void = 0  
          AND m.menuDepartmentId = ${menuDept.id}
        `;
        const [itemsSalesResult] = await db.query(itemsSalesQuery);
        const row = itemsSalesResult[0] || {};

        const totalItemSales = parseFloat(row.itemSales || 0);
        const totalDiscount = parseFloat(row.discount || 0);
        const totalQty = parseFloat(row.qty || 0);
        const totalNetSales = parseFloat(row.netSales || 0);

        const baseItemSales = parseFloat(departmentTotals.itemSales || 0);
        const baseNetSales = parseFloat(departmentTotals.netSales || 0);

        const percentItemSales = baseItemSales ? ((totalItemSales / baseItemSales) * 100).toFixed(2) : '0.00';
        const percentNetSales = baseNetSales ? ((totalNetSales / baseNetSales) * 100).toFixed(2) : '0.00';

        departments.push({
          id: period.periodId,
          period: period.period,
          totalQty,
          totalItemSales,
          percentItemSales,
          totalDiscount,
          totalNetSales,
          percentNetSales
        });
      }

      items.push({
        departmentId: menuDept.id,
        name: menuDept.desc1,
        departments
      });
    }

    const allDepartmentsQuery = ` 
      SELECT  
          SUM(p.qty) AS 'qty',
          SUM(p.debit * p.qty ) AS 'itemSales',  
          SUM((IFNULL(d.credit,0))) AS 'discount', 
          SUM((p.debit-  IFNULL(d.credit,0)) * p.qty ) AS 'netSales'
      FROM cart AS c 
      LEFT JOIN cart_item AS p ON p.cartId = c.id
      LEFT JOIN cart_item_discount AS d ON d.cartItemId = p.id
      WHERE c.close = 1 ${whereFilterDate}
        AND p.presence = 1 AND p.void = 0  
        AND c.presence = 1 AND c.void = 0   
    `;
    const [allDepartmentsResult] = await db.query(allDepartmentsQuery);
    const allDepartmentsTotals = allDepartmentsResult[0] || { qty: 0, itemSales: 0, discount: 0, netSales: 0 };

    const byPeriod = [];
    for (const period of periods) {
      const periodId = period.periodId;
      const periodFilter = periodId !== null && periodId !== undefined
        ? `${whereFilterDate} AND c.periodId = ${periodId}`
        : `${whereFilterDate} AND c.periodId IS NULL`;

      const totalsByPeriodQuery = `
        SELECT  
            SUM(p.qty) AS 'qty',
            SUM(p.debit * p.qty ) AS 'itemSales',  
            SUM((IFNULL(d.credit,0))) AS 'discount', 
            SUM((p.debit-  IFNULL(d.credit,0)) * p.qty ) AS 'netSales'
        FROM cart AS c 
        LEFT JOIN cart_item AS p ON p.cartId = c.id
        LEFT JOIN cart_item_discount AS d ON d.cartItemId = p.id
        WHERE c.close = 1 ${periodFilter}
          AND p.presence = 1 AND p.void = 0  
          AND c.presence = 1 AND c.void = 0   
      `;
      const [totalsByPeriodResult] = await db.query(totalsByPeriodQuery);
      const totalsRow = totalsByPeriodResult[0] || {};
      byPeriod.push({
        period,
        totalQty: parseFloat(totalsRow.qty || 0),
        totalDiscount: parseFloat(totalsRow.discount || 0),
        totalItemSales: parseFloat(totalsRow.itemSales || 0),
        totalNetSales: parseFloat(totalsRow.netSales || 0)
      });
    }

    const taxQuery = `SELECT SUM(p.debit) AS 'debit' 
      FROM cart AS c  
      LEFT JOIN cart_item_tax AS p ON p.cartId = c.id
      WHERE c.close = 1  ${whereFilterDate}
        AND p.presence = 1 AND p.void = 0  
        AND c.presence = 1 AND c.void = 0`;
    const [taxResult] = await db.query(taxQuery);

    const scQuery = `SELECT SUM(p.debit) AS 'debit' 
      FROM cart AS c  
      LEFT JOIN cart_item_sc AS p ON p.cartId = c.id
      WHERE c.close = 1  ${whereFilterDate}
        AND p.presence = 1 AND p.void = 0  
        AND c.presence = 1 AND c.void = 0`;
    const [scResult] = await db.query(scQuery);

    const grossSalesQuery = `SELECT  
        SUM(c.grandTotal) AS 'grandTotal',
        SUM(c.cover) AS 'totalCover',
        COUNT(c.id) AS 'checks'
      FROM cart AS c
      WHERE c.close = 1 ${whereFilterDate}
        AND c.presence = 1 AND c.void = 0`;
    const [grossSalesResult] = await db.query(grossSalesQuery);
    const grossRow = grossSalesResult[0] || {};

    const summary = {
      totalQty: parseFloat(allDepartmentsTotals.qty || 0),
      itemSales: parseFloat(allDepartmentsTotals.itemSales || 0),
      discount: parseFloat(allDepartmentsTotals.discount || 0),
      netSales: parseFloat(allDepartmentsTotals.netSales || 0),
      tax: parseFloat(taxResult[0]?.debit || 0),
      sc: parseFloat(scResult[0]?.debit || 0),
      grossSales: parseFloat(grossRow.grandTotal || 0),
      totalCover: parseFloat(grossRow.totalCover || 0),
      totalChecks: parseFloat(grossRow.checks || 0)
    };
    summary.salesPerChecks = summary.totalChecks ? summary.grossSales / summary.totalChecks : 0;
    summary.salesPerCover = summary.totalCover ? summary.grossSales / summary.totalCover : 0;

    const payload = {

      filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },

      periods,
      allDepartments: allDepartmentsTotals,
      byPeriod,
      data: items,
      summary
    };
    const reportPayload = {
      title: 'Itemized Sales Summary',
      startDate,
      endDate,
      header: await fetchReportToken(req.query.t) || {},
      data: payload
    };
    if (view === 'printable') {
      const templatePath = path.join(__dirname, './../../views/reports/itemizedSalesSummary.ejs');


      ejs.renderFile(templatePath, {
        report: reportPayload,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID,
        formatNumber: formatNumber
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    } else {
      res.json({
        report: reportPayload,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

// DONE::FILTER
exports.checkDiscountListing = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';
  try {
    const items = [];
    let whereFilterDate = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;
    whereFilterDate += userId ? ` AND c.closeBy = '${userId}' ` : '';


    const discountQuery = `
    SELECT c.id,  t.tableName, 
      c.cover, d.inputDate, c.closeBy, e.name, d.credit AS 'discountAmount'
      FROM cart AS c 
      LEFT JOIN cart_item_discount AS d ON d.cartId = c.id
      LEFT JOIN outlet_table_map AS t ON t.id = c.outletTableMapId
      LEFT JOIN employee AS e ON e.id = c.closeBy
      WHERE 
      c.close = 1 ${whereFilterDate}
      AND c.presence = 1    AND c.void = 0
      AND d.presence = 1 AND d.void = 0
      `;
    const [discountResult] = await db.query(discountQuery);


    const discountTotalQuery = `
    SELECT  COUNT(d.id) AS 'totalDisc', sum(c.cover) AS 'totalCover', SUM( d.credit ) AS 'subTotal'
      FROM cart AS c 
      LEFT JOIN cart_item_discount AS d ON d.cartId = c.id 
      WHERE 
      c.close = 1  ${whereFilterDate}
      AND c.presence = 1    AND c.void = 0
      AND d.presence = 1 AND d.void = 0
      `;
    const [discountTotalResult] = await db.query(discountTotalQuery);


    const summary = discountTotalResult[0] || {
      totalDisc: 0,
      totalCover: 0,
      subTotal: 0
    };

    const payload = {
      filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },
      discounts: discountResult,
      summary
    };
    const reportPayload = {
      title: 'Check Discount Listing',
      startDate,
      endDate,
      header: await fetchReportToken(req.query.t) || {},
      data: payload
    };
    if (view === 'printable') {
      const templatePath = path.join(__dirname, './../../views/reports/checkDiscountListing.ejs');


      ejs.renderFile(templatePath, {
        report: reportPayload,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID,
        formatNumber: formatNumber
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    } else {
      res.json({ report: reportPayload });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}
// DONE::FILTER
exports.salesHistoryReport = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';
  try {
    let whereFilterDate = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;
    whereFilterDate += userId ? ` AND c.closeBy = '${userId}' ` : '';

    const q = `
    SELECT DATE(c.endDate) AS DATE, SUM(c.summaryItemTotal) AS 'itemSales',
    SUM(c.summaryDiscount * -1) AS 'discount',
    SUM(c.grandTotal) AS 'grandTotal',
    COUNT(c.id) AS 'check', 
    SUM(c.grandTotal) /COUNT(c.id)  AS 'avgSalesCheck',
      SUM(c.cover)  AS 'cover',
      SUM(c.grandTotal) /  SUM(c.cover)  AS 'avgSalesCover' 
    FROM cart AS c
    WHERE c.close = 1 AND c.presence = 1 AND c.void = 0 ${whereFilterDate}
    GROUP BY DATE(c.endDate)
    ORDER BY DATE(c.endDate) DESC`;
    const [salesHistory] = await db.query(q);

    // buat total total per field dari salesHistory
    const totalItemSales = salesHistory.reduce((acc, curr) => acc + parseFloat(curr.itemSales || 0), 0);
    const totalDiscount = salesHistory.reduce((acc, curr) => acc + parseFloat(curr.discount || 0), 0);
    const totalGrandTotal = salesHistory.reduce((acc, curr) => acc + parseFloat(curr.grandTotal || 0), 0);
    const totalCheck = salesHistory.reduce((acc, curr) => acc + parseFloat(curr.check || 0), 0);
    const totalCover = salesHistory.reduce((acc, curr) => acc + parseFloat(curr.cover || 0), 0);
    const avgSalesCheck = totalCheck ? totalGrandTotal / totalCheck : 0;
    const avgSalesCover = totalCover ? totalGrandTotal / totalCover : 0;

    const data = {
      filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },

      salesHistory: salesHistory,
      summary: {
        totalItemSales: totalItemSales,
        totalDiscount: totalDiscount,
        totalGrandTotal: totalGrandTotal,
        totalCheck: totalCheck,
        totalCover: totalCover,
        avgSalesCheck,
        avgSalesCover
      }
    }
    const reportPayload = {
      title: 'Sales History Report',
      startDate,
      endDate,
      header: await fetchReportToken(req.query.t) || {},
      data: data
    };
    if (view === 'printable') {
      const templatePath = path.join(__dirname, './../../views/reports/salesHistoryReport.ejs');


      ejs.renderFile(templatePath, {
        report: reportPayload,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID,
        formatNumber: formatNumber
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    } else {
      res.json({ report: reportPayload });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.salesReportPerHour = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';
  try {
    let whereFilter = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;
    whereFilter += userId ? ` AND c.closeBy = '${userId}' ` : '';

    const hours = [];
    for (let h = 0; h < 24; h++) {
      const hh = String(h).padStart(2, '0');
      hours.push({
        from: `${hh}:00:00`,
        to: `${hh}:59:59`,
        label: `${hh}:00 to ${hh}:59`,
      });
    }

    const items = [];
    for (const hour of hours) {
      const salesQuery = `SELECT 
                '${hour.label}' as 'timePeriod',
            SUM(c.summaryItemTotal) AS 'itemSales',
            SUM(c.summaryDiscount * -1 ) AS 'discount',
            SUM(c.summaryItemTotal + c.summaryDiscount) AS 'NetSales' ,
            SUM(c.summaryTax) AS 'tax',
            SUM(c.summarySc) AS 'sc',
            SUM(c.grandTotal) AS 'grossSales',
            count(c.id) AS 'checks',
            SUM(c.cover) AS 'covers', 
            SUM(c.grandTotal) / count(c.id) AS 'avgSalesPerChecks',
            SUM(c.grandTotal) / SUM(c.cover) AS 'avgSalesPerCovers' 
          FROM cart AS c
          WHERE c.close = 1 AND c.presence = 1 AND c.void = 0 ${whereFilter} 
            AND TIME(c.inputDate) BETWEEN '${hour.from}' AND '${hour.to}'`;
      const [salesResult] = await db.query(salesQuery);
      items.push(salesResult[0]);
    }

    // hapus jika semua fieldnya null atau 0
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if ((!item.itemSales || item.itemSales == 0)) {
        items.splice(i, 1);
      }
    }

    // bisa hutung berapa persen dari total itemSales dan netSales
    const totalItemSales = items.reduce((acc, curr) => acc + parseFloat(curr.itemSales || 0), 0);
    const totalDiscount = items.reduce((acc, curr) => acc + parseFloat(curr.discount || 0), 0);
    const totalNetSales = items.reduce((acc, curr) => acc + parseFloat(curr.NetSales || 0), 0);
    const totalTax = items.reduce((acc, curr) => acc + parseFloat(curr.tax || 0), 0);
    const totalSc = items.reduce((acc, curr) => acc + parseFloat(curr.sc || 0), 0);
    const totalGrossSales = items.reduce((acc, curr) => acc + parseFloat(curr.grossSales || 0), 0);
    const totalChecks = items.reduce((acc, curr) => acc + parseFloat(curr.checks || 0), 0);
    const totalCovers = items.reduce((acc, curr) => acc + parseFloat(curr.covers || 0), 0);

    const avgSalesPerChecks = totalChecks ? totalGrossSales / totalChecks : 0;
    const avgSalesPerCovers = totalCovers ? totalGrossSales / totalCovers : 0;

    items.forEach(item => {
      item.percentItemSales = totalItemSales ? ((item.itemSales / totalItemSales) * 100).toFixed(2) : '0.00';
      item.percentNetSales = totalNetSales ? ((item.NetSales / totalNetSales) * 100).toFixed(2) : '0.00';
    });

    const summary = {
      totalItemSales,
      totalDiscount,
      totalNetSales,
      totalTax,
      totalSc,
      totalGrossSales,
      totalChecks,
      totalCovers,
      avgSalesPerChecks,
      avgSalesPerCovers
    };

    const payload = {
      filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },
      items,
      summary
    };
    const reportPayload = {
      title: 'Sales Report Per Hour',
      startDate,
      endDate,
      header: await fetchReportToken(req.query.t) || {},
      data: payload
    };
    if (view === 'printable') {
      const templatePath = path.join(__dirname, './../../views/reports/salesReportPerHour.ejs');


      ejs.renderFile(templatePath, {
        report: reportPayload,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID,
        formatNumber: formatNumber
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    } else {
      res.json({ report: reportPayload });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.closeCheckReports = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';
  try {
    let whereFilter = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;
    whereFilter += userId ? ` AND c.closeBy = '${userId}' ` : '';


    const overallQuery = ` 
    SELECT 
      c.id, c.startDate, c.grandTotal,   p.paid, c.changePayment, p.tips, t.name, 
      e.name AS 'closeEmployee', c.endDate
    FROM cart AS c
    LEFT JOIN cart_payment AS p ON p.cartId = c.id
    LEFT JOIN check_payment_type AS t ON t.id = p.checkPaymentTypeId
    LEFT JOIN employee AS e  ON e.id = c.closeBy
    WHERE c.close = 1 AND c.presence = 1 AND c.void = 0 ${whereFilter}
    AND p.submit = 1 AND p.presence = 1 AND p.void = 0`;
    const [overall] = await db.query(overallQuery);

    const summary = overall.reduce((acc, curr) => {
      acc.totalGrandTotal += parseFloat(curr.grandTotal || 0);
      acc.totalPaid += parseFloat(curr.paid || 0);
      acc.totalTips += parseFloat(curr.tips || 0);
      acc.totalChange += parseFloat(curr.changePayment || 0);
      return acc;
    }, {
      totalGrandTotal: 0,
      totalPaid: 0,
      totalTips: 0,
      totalChange: 0
    });

    const payload = {
      filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },

      items: overall,
      summary
    };
    const reportPayload = {
      title: 'Close Check Report',
      startDate,
      endDate,
      header: await fetchReportToken(req.query.t) || {},
      data: payload
    };
    if (view === 'printable') {
      const templatePath = path.join(__dirname, './../../views/reports/closeCheckReports.ejs');


      ejs.renderFile(templatePath, {
        report: reportPayload,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID,
        formatNumber: formatNumber
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    } else {
      res.json({ report: reportPayload });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};



exports.ccPayment = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';
  try {

    const paymentType = `
    SELECT id, name FROM 
    check_payment_type 
    WHERE presence = 1 and openDrawer = 0 ORDER BY name ASC`;
    const [paymentTypes] = await db.query(paymentType);
    let whereFilter = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;
    whereFilter += userId ? ` AND c.closeBy = '${userId}' ` : '';
    const items = [];
    for (const pt of paymentTypes) {


      const overallQuery = `
      SELECT c.id , p.checkPaymentTypeId,  p.cardNumber, p.expCard, p.paid, p.tips, (p.paid+p.tips) AS 'total'
        FROM cart AS c 
      LEFT JOIN cart_payment AS p ON p.cartId = c.id 
      WHERE 
        c.close = 1 AND c.presence = 1 AND c.void = 0 and p.checkPaymentTypeId = ${pt.id}
        AND p.presence = 1 AND p.void = 0 AND p.submit = 1
        ${whereFilter}`;
      const [overall] = await db.query(overallQuery);

      // hitung total dari paid, tips, total
      const totalPaid = overall.reduce((acc, curr) => acc + parseFloat(curr.paid), 0);
      const totalTips = overall.reduce((acc, curr) => acc + parseFloat(curr.tips), 0);
      const totalTotal = overall.reduce((acc, curr) => acc + parseFloat(curr.total), 0);

      items.push({

        paymentType: pt,
        data: overall,
        summary: {
          totalPaid: totalPaid,
          totalTips: totalTips,
          totalTotal: totalTotal
        }
      });
    }

    // hapus jika data kosong
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (item.data.length === 0) {
        items.splice(i, 1);
      }
    }

    const payload = {

      filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },

      items
    };
    const reportPayload = {
      title: 'Credit Card Payment Report',
      startDate,
      endDate,
      header: await fetchReportToken(req.query.t) || {},
      data: payload
    };
    if (view === 'printable') {
      const templatePath = path.join(__dirname, './../../views/reports/ccPayment.ejs');


      ejs.renderFile(templatePath, {
        report: reportPayload,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID,
        formatNumber: formatNumber
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    } else {
      res.json({ report: reportPayload });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.scHistory = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';
  try {
    let whereFilter = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;
    whereFilter += userId ? ` AND c.closeBy = '${userId}' ` : '';

    const taxQuery = `SELECT 
      id, scNote as  name 
      FROM menu_tax_sc
    WHERE presence = 1 `;
    const [tax] = await db.query(taxQuery);

    let whereSc = '';
    let headerSc = [];
    tax.forEach(t => {
      headerSc.push({ id: t.id, name: t.name, field: `sc${t.id}` });
      whereSc += ` SUM(CASE WHEN i.menuTaxScId = ${t.id} THEN i.debit ELSE 0 END) AS 'sc${t.id}', `;
    });


    let grandTotal = 0;
    const overallQuery = ` 
        SELECT
          DATE_FORMAT(c.endDate, '%Y-%m-%d') AS 'Business Date',
          ${whereSc}
          SUM(i.debit) AS 'Total sc'
        FROM cart c
        LEFT JOIN cart_item_sc i ON i.cartId = c.id AND i.presence = 1 AND i.void = 0
        WHERE c.close = 1 AND c.presence = 1 AND c.void = 0 ${whereFilter} 
        GROUP BY DATE(c.endDate)
        ORDER BY DATE(c.endDate) ASC`;
    const [overall] = await db.query(overallQuery);


    // hitung sub total per tax1, tax2, tax3 dst,  footer object
    const footer = {};
    headerSc.forEach(ht => {
      footer[ht.field] = overall.reduce((acc, curr) => acc + parseFloat(curr[ht.field]), 0);
    });

    // hitung grand total dari footer totalTax
    grandTotal = overall.reduce((acc, curr) => acc + parseFloat(curr['Total sc']), 0);

    const payload = {
      filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },

      headerSc: headerSc,
      items: overall,
      footer: footer,
      grandTotal: grandTotal
    };
    const reportPayload = {
      title: 'Service Charge History Report',
      startDate,
      endDate,
      header: await fetchReportToken(req.query.t) || {},
      data: payload
    };
    if (view === 'printable') {
      const templatePath = path.join(__dirname, './../../views/reports/scHistory.ejs');


      ejs.renderFile(templatePath, {
        report: reportPayload,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID,
        formatNumber: formatNumber
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    } else {
      res.json({ report: reportPayload });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.taxHistory = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';
  try {
    let whereFilter = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;
    whereFilter += userId ? ` AND c.closeBy = '${userId}' ` : '';

    const taxQuery = `SELECT 
      id, taxNote as name 
      FROM menu_tax_sc
    WHERE presence = 1 `;
    const [tax] = await db.query(taxQuery);

    let whereTax = '';
    let headerTax = [];
    tax.forEach(t => {
      headerTax.push({ id: t.id, name: t.name, field: `tax${t.id}` });
      whereTax += ` SUM(CASE WHEN i.menuTaxScId = ${t.id} THEN i.debit ELSE 0 END) AS 'tax${t.id}', `;
    });


    let grandTotal = 0;
    const overallQuery = ` 
        SELECT
          DATE_FORMAT(c.endDate, '%Y-%m-%d') AS 'Business Date',
          ${whereTax}
          SUM(i.debit) AS 'Total Tax'
        FROM cart c
        LEFT JOIN cart_item_tax i ON i.cartId = c.id AND i.presence = 1 AND i.void = 0
        WHERE c.close = 1 AND c.presence = 1 AND c.void = 0 ${whereFilter} 
        GROUP BY DATE(c.endDate)
        ORDER BY DATE(c.endDate) ASC`;
    const [overall] = await db.query(overallQuery);


    // hitung sub total per tax1, tax2, tax3 dst,  footer object
    const footer = {};
    headerTax.forEach(ht => {
      footer[ht.field] = overall.reduce((acc, curr) => acc + parseFloat(curr[ht.field]), 0);
    });

    // hitung grand total dari footer totalTax
    grandTotal = overall.reduce((acc, curr) => acc + parseFloat(curr['Total Tax']), 0);

    const payload = {
      filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },

      headerTax: headerTax,
      items: overall,
      footer: footer,
      grandTotal: grandTotal
    };
    const reportPayload = {
      title: 'Tax History Report',
      startDate,
      endDate,
      header: await fetchReportToken(req.query.t) || {},
      data: payload
    };

    if (view === 'printable') {
      const templatePath = path.join(__dirname, './../../views/reports/taxHistory.ejs');

      ejs.renderFile(templatePath, {
        report: reportPayload,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID,
        formatNumber: formatNumber
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    } else {
      res.json({ report: reportPayload });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

// DONE
exports.itemizedSales = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';
  try {
    let globalQty = 0;
    let globalItemSales = 0;
    let whereFilter = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;
    whereFilter += userId ? ` AND c.closeBy = '${userId}' ` : '';

    const menuDepartmentsQuery = `
        SELECT id, desc1 
          FROM menu_department 
        WHERE presence = 1 ORDER BY desc1 ASC`;
    const [menuDepartments] = await db.query(menuDepartmentsQuery);

    const data = [];
    for (const md of menuDepartments) {
      const itemsQuery = ` 
      SELECT m.name , m.plu, t1.qty , t1.itemSales , 0 as 'unserMenuSet' FROM (
        SELECT p.menuId, SUM( p.qty) AS 'qty', sum(p.debit * p.qty) AS 'itemSales'
        FROM cart AS c 
        LEFT JOIN cart_item AS p ON p.cartId = c.id 
        left join menu as m on m.id = p.menuId 
        WHERE p.presence = 1 AND p.void = 0  AND  c.close = 1
        AND m.menuDepartmentId = ${md.id}
        ${whereFilter}
        GROUP BY p.menuId
      ) AS t1
      LEFT JOIN menu AS m ON m.id = t1.menuId

      UNION ALL 

      SELECT CONCAT('*',m.name) AS 'name' , m.plu, t1.qty , t1.itemSales, 1 as 'unserMenuSet'  FROM (
      SELECT p.menuSetMenuId AS 'menuId',  SUM( (p.debit * i.qty) + (p.debit * p.menuSetQty)) AS 'itemSales' , sum(i.qty) AS 'qty'
      FROM cart AS c 
      LEFT JOIN cart_item_modifier AS p ON p.cartId = c.id 
      LEFT JOIN cart_item AS i ON i.id = p.cartItemId
      left join menu as m on m.id = p.menuSetMenuId 
     
      WHERE p.presence = 1 AND p.void = 0  AND c.close = 1 AND i.presence =1 AND i.void = 0  
      AND m.menuDepartmentId = ${md.id}
       ${whereFilter}
      AND p.menuSetMenuId != 0
      GROUP BY p.menuSetMenuId
      
      ) AS t1
      LEFT JOIN menu AS m ON m.id = t1.menuId 

      ORDER BY plu, name
    `;
      const [items] = await db.query(itemsQuery);

      // hitung total qyt, itemSales
      let totalQty = 0;
      let totalItemSales = 0;
      let unserMenuSet = 0;
      items.forEach(i => {
        totalQty += parseFloat(i.qty);
        totalItemSales += parseFloat(i.itemSales);
        unserMenuSet += parseInt(i.unserMenuSet);
      });

      globalQty += totalQty;
      globalItemSales += totalItemSales;

      data.push({
        menuDepartment: md.desc1,
        items: items,
        menuSetIncluded: unserMenuSet > 0 ? 1 : 0,
        summary: {
          totalRow: items.length, totalQty: totalQty, totalItemSales: totalItemSales
        }
      });
    }


    // tolong hapus data jika item kosong
    for (let i = data.length - 1; i >= 0; i--) {
      const item = data[i];
      if (item.items.length === 0) {
        data.splice(i, 1);
      }
    }
    const payload = {
      filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },
      itemizedSales: data,
      globalSummary: {
        totalDepartments: data.length,
        globalQty: globalQty,
        globalItemSales: globalItemSales
      }
    }

    const reportPayload = {
      title: 'Itemized Sales',
      startDate: `${startDate}`,
      endDate: `${endDate}`,
      header: await fetchReportToken(req.query.t) || {},
      data: payload
    };

    if (view === 'printable') {

      const templatePath = path.join(__dirname, './../../views/reports/itemizedSales.ejs');
      ejs.renderFile(templatePath, { report: reportPayload, }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });

    } else {
      res.json({ report: reportPayload, });
    }



  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};



exports.itemCount = async (req, res) => {
  const view = req.query.view || '';
  try {
    let items = [];

    const menuDepartmentsQuery = `
        SELECT id, desc1 
          FROM menu_department 
        WHERE presence = 1 ORDER BY desc1 ASC`;
    const [menuDepartments] = await db.query(menuDepartmentsQuery);

    for (const md of menuDepartments) {
      const overallQuery = ` 
      SELECT name, qty, adjustItemsId , menuDepartmentId FROM menu  
      WHERE adjustItemsId != ''
      AND presence = 1 and menuDepartmentId = ${md.id}
      ORDER BY name ASC`;

      const [overall] = await db.query(overallQuery);
      items.push({
        menuDepartment: md.desc1,
        items: overall
      });

    }


    if (view === 'printable') {
      const templatePath = path.join(__dirname, './../../views/reports/itemCount.ejs');
      const reportPayload = {
        title: 'Item Count Report',
        createdDate: formatDateTimeID(new Date()),
        header: await fetchReportToken(req.query.t) || {},
        data: items
      };

      ejs.renderFile(templatePath, {
        report: reportPayload,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    } else {
      res.json({ data: items });
    }




  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.employeeItemizedSales = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';

  try {
    let globalQty = 0;
    let globalItemSales = 0;
    let whereFilter = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;
    whereFilter += userId ? ` AND c.closeBy = '${userId}' ` : '';

    const employeedSelectQuery = `
        SELECT id, name FROM employee order by name asc;`;
    const [employee] = await db.query(employeedSelectQuery);

    const data = [];
    for (const md of employee) {
      const itemsQuery = ` 
      SELECT m.name , m.plu, t1.qty , t1.itemSales , 0 as 'unserMenuSet' FROM (
        SELECT  p.menuId, SUM( p.qty) AS 'qty', sum(p.debit * p.qty) AS 'itemSales'
        FROM cart AS c 
        LEFT JOIN cart_item AS p ON p.cartId = c.id  
        WHERE p.presence = 1 AND p.void = 0  AND  c.close = 1
        AND c.closeBy = ${md.id}
        ${whereFilter}
        GROUP BY p.menuId
      ) AS t1
      LEFT JOIN menu AS m ON m.id = t1.menuId

      UNION ALL 

      SELECT CONCAT('*',m.name) AS 'name' , m.plu, t1.qty , t1.itemSales, 1 as 'unserMenuSet'  FROM (
        SELECT  p.menuSetMenuId,  SUM( (p.debit * i.qty) + (p.debit * p.menuSetQty)) AS 'itemSales' , sum(i.qty) AS 'qty'
        FROM cart AS c 
        LEFT JOIN cart_item_modifier AS p ON p.cartId = c.id 
        LEFT JOIN cart_item AS i ON i.id = p.cartItemId 
      
        WHERE p.presence = 1 AND p.void = 0  AND c.close = 1 AND i.presence =1 AND i.void = 0  
         AND c.closeBy = ${md.id}
        ${whereFilter}
        AND p.menuSetMenuId != 0
        GROUP BY p.menuSetMenuId
        
      ) AS t1
      LEFT JOIN menu AS m ON m.id = t1.menuSetMenuId 

      ORDER BY plu, name
      `;
      const [items] = await db.query(itemsQuery);

      // hitung total qyt, itemSales
      let totalQty = 0;
      let totalItemSales = 0;
      let unserMenuSet = 0;
      items.forEach(i => {
        totalQty += parseFloat(i.qty);
        totalItemSales += parseFloat(i.itemSales);
        unserMenuSet += parseInt(i.unserMenuSet);
      });

      globalQty += totalQty;
      globalItemSales += totalItemSales;

      data.push({
        employee: md,
        items: items,
        menuSetIncluded: unserMenuSet > 0 ? 1 : 0,
        summary: {
          totalRow: items.length, totalQty: totalQty, totalItemSales: totalItemSales
        }
      });
    }


    // tolong hapus data jika item kosong
    for (let i = data.length - 1; i >= 0; i--) {
      const item = data[i];
      if (item.items.length === 0) {
        data.splice(i, 1);
      }
    }
    const payload = {
      filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },

      data: data,
      globalSummary: {
        totalDepartments: data.length,
        globalQty: globalQty,
        globalItemSales: globalItemSales
      }
    };
    const reportPayload = {
      title: 'Employee Itemized Sales',
      startDate,
      endDate,
      header: await fetchReportToken(req.query.t) || {},
      data: payload
    };
    if (view === 'printable') {
      const templatePath = path.join(__dirname, './../../views/reports/employeeItemizedSales.ejs');


      ejs.renderFile(templatePath, {
        report: reportPayload,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    } else {
      res.json({ report: reportPayload });
    }


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};



exports.managerClose = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';

  try {
    let whereFilter = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;
    whereFilter += userId ? ` AND c.closeBy = '${userId}' ` : '';

    const employeedSelectQuery = `
        SELECT id, name FROM employee order by name asc;`;
    const [employee] = await db.query(employeedSelectQuery);

    const data = [];
    for (const md of employee) {
      const itemsQuery = ` 
        SELECT 
          SUM(c.summaryItemTotal) AS 'itemTotal',
          SUM(c.summaryDiscount * -1 ) AS 'itemDiscount',
          SUM(c.summaryItemTotal + c.summaryDiscount) AS 'netItemSales' ,
          sum(c.cover) AS 'totalCover',
          COUNT(c.id) AS 'totalCheck'
        FROM cart AS c
        WHERE c.close = 1
          and c.presence = 1 and c.void = 0 
          and c.closeBy = ${md.id}
          ${whereFilter}
        `;
      const [itemsSales] = await db.query(itemsQuery);


      const taxQuery = ` 
                SELECT   t.note, SUM( t.debit) AS 'amount',  COUNT(t.id) AS 'total'
        FROM cart AS c
        LEFT JOIN cart_item_tax AS t ON t.cartId = c.id
        WHERE c.close = 1  
        and c.presence = 1 and c.void = 0 
        and t.presence = 1 and t.void = 0 
        and c.closeBy = ${md.id}  ${whereFilter}
        GROUP BY t.note 
        ORDER BY t.note ASC 
        `;
      const [taxSales] = await db.query(taxQuery);
      // buatkan total tax sales dari taxSales
      let totalTax = 0;
      taxSales.forEach(ts => {
        totalTax += parseFloat(ts.amount);
      });

      const scQuery = ` 
        SELECT 
          t.note, SUM( t.debit) AS 'amount',  COUNT(t.id) AS 'total'
        FROM cart AS c
        LEFT JOIN cart_item_sc AS t ON t.cartId = c.id
        WHERE c.close = 1  
          and c.presence = 1 and c.void = 0 
          and t.presence = 1 and t.void = 0 
          and c.closeBy = ${md.id}  ${whereFilter}
        GROUP BY t.note 
        ORDER BY t.note ASC 
        `;
      const [scSales] = await db.query(scQuery);
      // buatkan total sc sales dari scSales
      let totalSc = 0;
      taxSales.forEach(ts => {
        totalSc += parseFloat(ts.amount);
      });

      // hitung gross total, avg sales per check, total cover, avg sales per cover
      let grossTotal = parseInt(itemsSales[0].netItemSales) + totalTax + totalSc;


      const cashSummaryQuery = `
       SELECT 
      sum(p.paid) AS 'pay', sum(p.tips) AS 'tips', SUM(p.paid + p.tips) AS 'totalRecv' , t.name 
      FROM cart AS c
      LEFT JOIN cart_payment AS  p ON p.cartId = c.id
      LEFT JOIN check_payment_type AS t ON t.id = p.checkPaymentTypeId
      WHERE p.submit = 1 AND p.presence = 1 AND p.void = 0
      AND c.presence = 1 AND p.void = 0 AND c.close = 1 
      AND t.openDrawer = 1
      and c.closeBy = ${md.id}  ${whereFilter}
      GROUP BY t.name
       `;
      const [cashSummary] = await db.query(cashSummaryQuery);
      // buatkan total semua dari select cash summary
      const cashSummaryTotals = {
        totalPay: cashSummary.reduce((acc, curr) => acc + parseFloat(curr.pay || 0), 0),
        totalTips: cashSummary.reduce((acc, curr) => acc + parseFloat(curr.tips || 0), 0),
        totalRecv: cashSummary.reduce((acc, curr) => acc + parseFloat(curr.totalRecv || 0), 0),
      };




      const cardSummaryQuery = `
       SELECT 
      sum(p.paid) AS 'pay', sum(p.tips) AS 'tips', SUM(p.paid + p.tips) AS 'totalRecv' , t.name 
      FROM cart AS c
      LEFT JOIN cart_payment AS  p ON p.cartId = c.id
      LEFT JOIN check_payment_type AS t ON t.id = p.checkPaymentTypeId
      WHERE p.submit = 1 AND p.presence = 1 AND p.void = 0
      AND c.presence = 1 AND p.void = 0 AND c.close = 1 
      AND t.openDrawer = 0
      and c.closeBy = ${md.id}  ${whereFilter}
      GROUP BY t.name
       `;
      const [cardSummary] = await db.query(cardSummaryQuery);
      // buatkan total semua dari select cash summary
      const cardSummaryTotals = {
        totalPay: cardSummary.reduce((acc, curr) => acc + parseFloat(curr.pay || 0), 0),
        totalTips: cardSummary.reduce((acc, curr) => acc + parseFloat(curr.tips || 0), 0),
        totalRecv: cardSummary.reduce((acc, curr) => acc + parseFloat(curr.totalRecv || 0), 0),
      };


      const cashBalanceQuery = `
       SELECT  SUM( d.cashIn) AS 'cashIn',  sum(d.cashOut ) AS 'cashOut', SUM(d.cashIn - d.cashOut) AS 'CashRecv'
        FROM cart AS c
        LEFT JOIN daily_cash_balance AS d ON d.cartId = c.id
        WHERE c.close = 1 
        AND c.presence = 1 AND c.void = 0 AND d.openingBalance = 0
        AND d.presence = 1
      and c.closeBy = ${md.id}  ${whereFilter}
      `;
      const [cashBalance] = await db.query(cashBalanceQuery);




      data.push({
        employee: md,
        itemsSales: itemsSales,
        taxSales: {
          details: taxSales,
          totalTax: totalTax,
        },
        scSales: {
          details: scSales,
          totalSc: totalSc,
        },
        grossTotal: grossTotal,
        totalCover: itemsSales[0].totalCover,
        avgSalesPerCheck: itemsSales[0].totalCheck ? (grossTotal / itemsSales[0].totalCheck) : 0,
        avgSalesPerCover: itemsSales[0].totalCover ? (grossTotal / itemsSales[0].totalCover) : 0,

        cashSummary: {
          details: cashSummary,
          summary: cashSummaryTotals
        },
        cardSummary: {
          details: cardSummary,
          summary: cardSummaryTotals
        },
        cashBalance: cashBalance[0],
      });
    }

    // hapus jika itemsSales semua 0
    for (let i = data.length - 1; i >= 0; i--) {
      const item = data[i];
      if ((!item.itemsSales[0].itemTotal || item.itemsSales[0].itemTotal == 0) &&
        (!item.itemsSales[0].itemDiscount || item.itemsSales[0].itemDiscount == 0) &&
        (!item.itemsSales[0].netItemSales || item.itemsSales[0].netItemSales == 0)
      ) {
        data.splice(i, 1);
      }
    }

    const payload = {
      filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },

      data: data,
    };

    const reportPayload = {
      title: 'Manager Close Report',
      startDate,
      endDate,
      header: await fetchReportToken(req.query.t) || {},
      data: payload
    };

    if (view === 'printable') {
      const templatePath = path.join(__dirname, './../../views/reports/managerClose.ejs');


      ejs.renderFile(templatePath, {
        report: reportPayload,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    } else {
      res.json({ report: reportPayload });
    }


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};



exports.serverCloseReport = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';

  try {
    let whereFilter = ` AND (c.startDate >= '${startDate} 00:00:00' and c.endDate <= '${endDate} 23:59:59') `;
    whereFilter += userId ? ` AND c.closeBy = '${userId}' ` : '';

    const grandTotalQuery = `SELECT  
          sum(i.debit) AS 'grandTotal'
        FROM cart AS c
        LEFT JOIN cart_item AS i ON i.cartId = c.id  
        WHERE c.close = 1 
        AND c.presence = 1 AND c.void = 0  
        AND i.presence = 1 AND i.void = 0  ${whereFilter}`;

    const [grandTotalResult] = await db.query(grandTotalQuery);
    const grandTotal = grandTotalResult[0].grandTotal || 0;


    const overallQuery = ` 
      SELECT t1.debit as 'itemSales', t1.percent,  m.desc1 FROM (
        SELECT  sum(i.debit) as debit, ((sum(i.debit) / ${grandTotal}) * 100) as 'percent', i.menuCategoryId
        FROM cart AS c
        LEFT JOIN cart_item AS i ON i.cartId = c.id  
        WHERE c.close = 1 
        AND c.presence = 1 AND c.void = 0  
        AND i.presence = 1 AND i.void = 0  ${whereFilter}
        GROUP BY i.menuCategoryId
      ) AS t1
      LEFT JOIN menu_category AS m ON m.id = t1.menuCategoryId`;
    const [overall] = await db.query(overallQuery);

    // tolong buat t1.percent di round 2 desimal
    overall.forEach(o => {
      o.percent = parseFloat(o.percent).toFixed(2);
    });

    // hitung total itemSales
    const totalItemSales = overall.reduce((acc, curr) => acc + parseFloat(curr.itemSales), 0);
    const percentTotal = overall.reduce((acc, curr) => acc + parseFloat(curr.percent), 0);


    const itemDiscountQuery = `SELECT  sum(i.credit) AS 'itemDisc'
        FROM cart AS c
        LEFT JOIN cart_item_discount AS i ON i.cartId = c.id  
        WHERE c.close = 1 
        AND c.presence = 1 AND c.void = 0  
        AND i.presence = 1 AND i.void = 0 
        ${whereFilter}`;
    const [itemDiscountResult] = await db.query(itemDiscountQuery);
    const itemDisc = itemDiscountResult[0].itemDisc || 0



    const itemTaxQuery = ` 
    SELECT i.note, sum(i.debit) AS 'amount'
    FROM cart AS c
    LEFT JOIN cart_item_tax AS i ON i.cartId = c.id  
    WHERE c.close = 1 
    AND c.presence = 1 AND c.void = 0  
    AND i.presence = 1 AND i.void = 0   ${whereFilter}
    GROUP BY i.note  `;
    const [itemTaxResult] = await db.query(itemTaxQuery);

    let totalTax = itemTaxResult.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const checkTotal = totalItemSales - itemDisc + totalTax;

    const qtyQuery = ` 
    SELECT count(c.id) AS 'check', sum(c.cover) AS 'cover'
    FROM cart AS c 
    WHERE c.close = 1 
    AND c.presence = 1 AND c.void = 0  ${whereFilter}  `;
    const [qtyResult] = await db.query(qtyQuery);


    const itemScQuery = ` 
    SELECT i.note, sum(i.debit) AS 'amount'
    FROM cart AS c
    LEFT JOIN cart_item_sc AS i ON i.cartId = c.id  
    WHERE c.close = 1 
    AND c.presence = 1 AND c.void = 0  
    AND i.presence = 1 AND i.void = 0   ${whereFilter}
    GROUP BY i.note  `;
    const [itemScResult] = await db.query(itemScQuery);


    const voidPayment = `
    SELECT  t.name, p.paid, p.tips  
    FROM cart AS c
    LEFT JOIN cart_payment AS p ON p.cartId = c.id
    LEFT JOIN check_payment_type AS t ON t.id = p.checkPaymentTypeId
    WHERE 
      c.close = 1 AND c.presence = 1 AND c.void = 0 
      and p.presence	 = 1 
      AND p.void = 1 AND p.submit = 1
    ${whereFilter} 
    `;
    const [voidPaymentResult] = await db.query(voidPayment);


    const paymentTypeQuery = `
        SELECT  t.name, count(t.id) AS 'qty', sum(p.paid) AS 'pay', sum(p.tips) AS 'tips'  
    FROM cart AS c
    LEFT JOIN cart_payment AS p ON p.cartId = c.id
    LEFT JOIN check_payment_type AS t ON t.id = p.checkPaymentTypeId
    WHERE c.close = 1 AND c.presence = 1 AND c.void = 0 
    AND p.presence	 = 1  AND p.void = 0 AND p.submit = 1   ${whereFilter} 
    GROUP BY t.name`;
    const [paymentTypeResult] = await db.query(paymentTypeQuery);


    const payment = []
    let qty = 0;
    const checkPaymentTypeQuery = `
    SELECT id, name FROM check_payment_type  
    WHERE presence = 1 ORDER BY name ASC`;
    const [checkPaymentTypes] = await db.query(checkPaymentTypeQuery);
    for (const cpt of checkPaymentTypes) {

      const paymentListQuery = `
        SELECT c.id, p.paid, p.tips , c.endDate
      FROM cart AS c
      LEFT JOIN cart_payment AS p ON p.cartId = c.id 
      WHERE c.close = 1 AND c.presence = 1 AND c.void = 0 
      AND p.presence	 = 1  AND p.void = 0 AND p.submit = 1
      AND p.checkPaymentTypeId = ${cpt.id}
      ${whereFilter} 
        ORDER BY c.endDate ASC
      `;
      const [paymentListResult] = await db.query(paymentListQuery);
      qty += paymentListResult.length;
      payment.push({
        paymentType: cpt.name,
        details: paymentListResult,
        total: {
          pay: paymentListResult.reduce((acc, curr) => acc + parseFloat(curr.paid), 0),
          tips: paymentListResult.reduce((acc, curr) => acc + parseFloat(curr.tips), 0),
          qty: paymentListResult.length
        }
      });
    }

    // hapus jika payment detailsnya kosong
    for (let i = payment.length - 1; i >= 0; i--) {
      const item = payment[i];
      if (item.details.length === 0) {
        payment.splice(i, 1);
      }
    }






    const payload = {
      filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },
      department: {
        detail: overall,
        totalItemSales: totalItemSales,
        percentTotal: percentTotal,
      },
      itemDisc: itemDisc,
      itemSales: totalItemSales,
      checkDisc: 0,
      netItemSales: totalItemSales - itemDisc,
      tax: {
        detail: itemTaxResult,
        totalTax: totalTax
      },

      sc: {
        itemScResult: itemScResult,
        totalSc: itemScResult.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
      },
      checkTotal: checkTotal,
      qtyResult: qtyResult,
      avgSalesPerCheck: qtyResult[0].check ? (checkTotal / qtyResult[0].check).toFixed(2) : 0,
      avgSalesPerCover: qtyResult[0].cover ? (checkTotal / qtyResult[0].cover).toFixed(2) : 0,
      voidPayment: voidPaymentResult,
      paymentType: {
        detail: paymentTypeResult,
        totalPay: paymentTypeResult.reduce((acc, curr) => acc + parseFloat(curr.pay), 0),
        totalTips: paymentTypeResult.reduce((acc, curr) => acc + parseFloat(curr.tips), 0),
        totalQty: paymentTypeResult.reduce((acc, curr) => acc + parseFloat(curr.qty), 0),
      },
      payment: {
        details: payment,
        totalQty: qty
      }
    };
    const reportData = {
      title: 'Server Close Report',
      startDate,
      endDate,
      header: await fetchReportToken(req.query.t) || {},
      data: payload
    };

    if (view === 'printable') {
      const templatePath = path.join(__dirname, './../../views/reports/serverCloseReport.ejs');

      ejs.renderFile(templatePath, {
        report: reportData,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    } else {
      res.json({ report: reportPayload });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

//DONE view=printable
exports.dailyStartCloseHistory = async (req, res) => {
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  const userId = req.query.userId || '';
  const outletId = req.query.outletId || '';
  const view = req.query.view || '';

  try {
    let whereFilter = ` AND (c.startDate >= '${startDate} 00:00:00' and c.closeDate <= '${endDate} 23:59:59') `;
    whereFilter += userId ? ` AND c.inputBy = '${userId}' ` : '';

    const overallQuery = `  
     SELECT c.* , a.name AS startBy, b.name AS endby
      FROM daily_check   as c
        LEFT JOIN employee AS a ON a.id = c.inputBy
        LEFT JOIN employee AS b ON b.id = c.updateBy 
      WHERE 
     c.presence = 1  ${whereFilter}`;
    const [overall] = await db.query(overallQuery);



    const payload = { 
       filter: {
        startDate,
        endDate,
        userId,
        outletId,
        employee: await employeeDb(userId) || {},
      },
	  
      data: overall, 
    };
    const reportPayload = {
      startDate: `${startDate}`,
      endDate: `${endDate}`,
      header: await fetchReportToken(req.query.t) || {},
      data: payload,
      title: 'Daily Start/Close History'
    }

    if (view === 'printable') {


      const templatePath = path.join(__dirname, './../../views/reports/dailyStartCloseHistory.ejs');
      ejs.renderFile(templatePath, {
        report: reportPayload,
        formatDate: formatDateTimeID,
        formatDateOnly: formatDateOnlyID
      }, {}, (err, html) => {
        if (err) {
          console.error('EJS render error', err);
          return res.status(500).send('Template render error');
        }
        res.send(html);
      });
    }
    else {
      res.json({ report: reportPayload });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};