const express = require('express'); 
const router = express.Router();
const bill = require('../../controllers/terminal/billController');  
  
// table/*
router.get('/', bill.getData);  
router.get('/printing', bill.printing); 
router.get('/printing2', bill.printing2); 
  
router.post('/ipPrint', bill.ipPrint);  

router.get('/getCartCopyBill', bill.getCartCopyBill);      
router.post('/copyBill', bill.copyBill);      

router.post('/billUpdate', bill.billUpdate);
router.get('/splitBill', bill.splitBill);   
router.post('/updateGroup', bill.updateGroup);   
router.post('/resetGroup', bill.resetGroup);   


router.post('/createPayment', bill.createPayment);   

module.exports = router;