const express = require('express');
const router = express.Router();
const menuItemPos = require('../../controllers/terminal/menuItemPosController');
const menuItemFunc = require('../../controllers/terminal/menuItemFuncController');
const c = require('../../controllers/terminal/menuItemCartController');

// terminal/*
router.get('/', menuItemPos.getMenuItem);



router.get('/cart', c.cart);
router.post('/updateQty', c.updateQty);

//router.get('/cart', menuItemPos.cart);
router.get('/menuLookUp', menuItemPos.menuLookUp);
router.get('/selectMenuSet', menuItemPos.selectMenuSet);
 

router.post('/addToCart', menuItemPos.addToCart);

router.post('/voidItem', c.voidItem);
router.post('/addToItemModifier', c.addToItemModifier);
router.post('/addDiscountGroup', c.addDiscountGroup);
router.post('/lockTable', menuItemPos.lockTable);
router.post('/clearLockTable', menuItemPos.clearLockTable);


router.get('/printQueue', menuItemPos.printQueue);
router.post('/sendOrder', menuItemPos.sendOrder);
router.post('/exitWithoutOrder', menuItemPos.exitWithoutOrder); 
router.post('/voidTransacton', menuItemPos.voidTransacton);
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


router.get('/voidReason', menuItemPos.voidReason);
router.get('/mergeLog', menuItemPos.mergeLog);
router.post('/addCustomNotes', c.addCustomNotes);
router.post('/addCustomNotesDetail', menuItemPos.addCustomNotesDetail);
router.post('/changeTable', c.changeTable);

router.post('/voidItemSo', menuItemPos.voidItemSo);

router.get('/tableChecker', menuItemFunc.tableChecker);
router.get('/tableCheckerDetail', menuItemFunc.tableCheckerDetail);


module.exports = router;