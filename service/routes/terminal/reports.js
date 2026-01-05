const express = require('express');
const router = express.Router();
const c = require('../../controllers/terminal/reportsController');  
  
// table/*
router.get('/salesSummaryReport', c.salesSummaryReport); 

//router.post('/signin', loginController.newOrder);


// router.post('/create', tableMap.postCreate);
// router.post('/delete', tableMap.postDelete);
 
module.exports = router;