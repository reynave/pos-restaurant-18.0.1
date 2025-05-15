const express = require('express');
const router = express.Router();
const menuItemPos = require('../../controllers/terminal/menuItemPosController');  
  
// table/*
router.get('/', menuItemPos.getMenuItem);
router.get('/cart', menuItemPos.cart);
router.post('/addToCart', menuItemPos.addToCart);
router.post('/updateQty', menuItemPos.updateQty);


router.get('/cartDetail', menuItemPos.cartDetail);


// router.post('/create', menuItemPos.postCreate);
// router.post('/delete', menuItemPos.postDelete);
 
module.exports = router;