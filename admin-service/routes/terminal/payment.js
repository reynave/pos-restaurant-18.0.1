const express = require('express');
const router = express.Router();
const payment = require('../../controllers/terminal/paymentController');  
  
// table/*
router.get('/cart', payment.cart);  
router.post('/submit', payment.submit);  
router.get('/paymentType', payment.paymentType);   
router.get('/paid', payment.paid);  


router.post('/addPayment', payment.addPayment);  
router.post('/deletePayment', payment.deletePayment);  

module.exports = router;