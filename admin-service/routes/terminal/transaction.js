const express = require('express');
const router = express.Router();
const transactionController = require('../../controllers/terminal/transactionController');  
  
// table/*
router.get('/', transactionController.getAllData);
router.get('/cart', transactionController.cart);
router.get('/getCopyBill', transactionController.getCopyBill);
router.post('/addCopyBill', transactionController.addCopyBill);

//router.post('/signin', loginController.newOrder);


// router.post('/create', tableMap.postCreate);
// router.post('/delete', tableMap.postDelete);
 
module.exports = router;