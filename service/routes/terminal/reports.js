const express = require('express');
const router = express.Router();
const c = require('../../controllers/terminal/reportsController');  
const m = require('../../controllers/terminal/menuReportsController');  
  
//select 
router.get('/selectReports', m.selectReports); 
router.get('/getUsers', m.getUsers); 
router.get('/getOutlets', m.getOutlets); 

// report/*
//http://localhost:3000/terminal/reports/salesSummaryReport?startDate=2025-12-18&endDate=2025-12-18
router.get('/salesSummaryReport', c.salesSummaryReport); 

//2a. Cashier Report  
router.get('/cashierReports', c.cashierReports); 
 
//3a. Itemized Sales Report - Detail.pdf
router.get('/itemizedSalesDetail', c.itemizedSalesDetail); 
router.get('/itemizedSalesSummary', c.itemizedSalesSummary); 

//4. Check Discount Listing Report.pdf
router.get('/checkDiscountListing', c.checkDiscountListing);

//5. Sales History Report.pdf
router.get('/salesHistoryReport', c.salesHistoryReport);


//6
router.get('/salesReportPerHour', c.salesReportPerHour);

//7
router.get('/closeCheckReports', c.closeCheckReports);
//8
router.get('/ccPayment', c.ccPayment);

//9
router.get('/scHistory', c.scHistory);
//10
router.get('/taxHistory', c.taxHistory);

//11
router.get('/itemizedSales', c.itemizedSales);

//12
router.get('/itemCount', c.itemCount);

//13
router.get('/employeeItemizedSales', c.employeeItemizedSales);

//14
router.get('/managerClose', c.managerClose);

//15
router.get('/serverCloseReport', c.serverCloseReport);

//16
router.get('/dailyStartCloseHistory', c.dailyStartCloseHistory);
 



module.exports = router;