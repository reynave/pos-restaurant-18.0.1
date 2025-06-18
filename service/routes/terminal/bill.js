const express = require('express'); 
const router = express.Router();
const bill = require('../../controllers/terminal/billController');  
  
// table/*
router.get('/', bill.getData);  
router.get('/printing', bill.printing);   
router.post('/ipPrint', bill.ipPrint);  


module.exports = router;