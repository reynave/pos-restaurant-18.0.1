const express = require('express');
const router = express.Router();
const menuItemPos = require('../../controllers/terminal/menuItemPosController');

// terminal/*
router.get('/', menuItemPos.getMenuItem);
router.get('/cart', menuItemPos.cart);
router.get('/menuLookUp', menuItemPos.menuLookUp);

router.get('/cartOrdered', menuItemPos.cartOrdered);

router.post('/addToCart', menuItemPos.addToCart);
router.post('/updateQty', menuItemPos.updateQty);
router.post('/voidItem', menuItemPos.voidItem);
router.post('/addToItemModifier', menuItemPos.addToItemModifier);
router.post('/addDiscountGroup', menuItemPos.addDiscountGroup);

router.post('/sendOrder', menuItemPos.sendOrder);
router.post('/exitWithoutOrder', menuItemPos.exitWithoutOrder);
router.post('/updateCover', menuItemPos.updateCover);


router.get('/getModifier', menuItemPos.getModifier);
router.get('/cartDetail', menuItemPos.cartDetail);
router.post('/voidItemDetail', menuItemPos.voidItemDetail);
router.post('/addModifier', menuItemPos.addModifier);
router.post('/removeDetailModifier', menuItemPos.removeDetailModifier);


router.get('/transferItems', menuItemPos.transferItems);
router.get('/transferItemsGroup', menuItemPos.transferItemsGroup);

router.post('/transferTable', menuItemPos.transferTable);
router.get('/transferLog', menuItemPos.transferLog);
router.post('/takeOut', menuItemPos.takeOut);
router.post('/takeOutDetail', menuItemPos.takeOutDetail);
router.post('/mergerCheck', menuItemPos.mergerCheck);


router.get('/mergeLog', menuItemPos.mergeLog);
router.post('/addCustomNotes', menuItemPos.addCustomNotes);
router.post('/addCustomNotesDetail', menuItemPos.addCustomNotesDetail);


module.exports = router;