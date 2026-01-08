const express = require('express');
const router = express.Router();
const c = require('../../controllers/terminal/reportsController');  
  
//select 

router.get('/getUsers', c.getUsers); 
router.get('/getOutlets', c.getOutlets); 

// report/*
//http://localhost:3000/terminal/reports/salesSummaryReport?startDate=2025-12-18&endDate=2025-12-18
router.get('/salesSummaryReport', c.salesSummaryReport); 

//2a. Cashier Report - POS Printer Paper.pdf
router.get('/cashierReports', c.cashierReports); 

//router.post('/signin', loginController.newOrder);


// router.post('/create', tableMap.postCreate);
// router.post('/delete', tableMap.postDelete);
 
module.exports = router;