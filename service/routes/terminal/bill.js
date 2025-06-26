const express = require('express'); 
const router = express.Router();
const bill = require('../../controllers/terminal/billController');  
  
// table/*
router.get('/', bill.getData);  
router.get('/printing', bill.printing);   
router.post('/ipPrint', bill.ipPrint);  

router.get('/getCartCopyBill', bill.getCartCopyBill);      
router.post('/copyBill', bill.copyBill);      


router.get('/splitBill', bill.splitBill);   
router.post('/updateGroup', bill.updateGroup);   

module.exports = router;