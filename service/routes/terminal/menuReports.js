const express = require('express');
const router = express.Router();
const m = require('../../controllers/terminal/menuReportsController');  
  
//select 
router.get('/selectReports', m.selectReports); 
router.get('/getUsers', m.getUsers); 
router.get('/getOutlets', m.getOutlets); 
// generate token 
router.post('/createReportToken', m.createReportToken);
 
module.exports = router;