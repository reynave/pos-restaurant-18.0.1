const express = require('express');
const router = express.Router();
const menuItemPos = require('../../controllers/terminal/menuItemPosController');  
  
// terminal/*
router.get('/', menuItemPos.getMenuItem);
router.get('/cart', menuItemPos.cart);
router.post('/addToCart', menuItemPos.addToCart);
router.post('/updateQty', menuItemPos.updateQty);
router.post('/voidItem', menuItemPos.voidItem);
router.post('/addToItemModifier', menuItemPos.addToItemModifier);
router.post('/addDiscountGroup', menuItemPos.addDiscountGroup);

router.post('/sendOrder', menuItemPos.sendOrder);
router.post('/exitWithoutOrder', menuItemPos.exitWithoutOrder);


router.get('/getModifier', menuItemPos.getModifier);
router.get('/cartDetail', menuItemPos.cartDetail);
router.post('/voidItemDetail', menuItemPos.voidItemDetail);
router.post('/addModifier', menuItemPos.addModifier);
router.post('/removeDetailModifier', menuItemPos.removeDetailModifier);

// router.post('/create', menuItemPos.postCreate);
// router.post('/delete', menuItemPos.postDelete);
 
module.exports = router;