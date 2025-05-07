const express = require('express');
const router = express.Router();
const outlet = require('../../controllers/outletController');  
const payment = require('../../controllers/outletPaymentController');  
const cashType = require('../../controllers/outletCashTypesController');  
const tipsPool = require('../../controllers/tipsPoolController');  
const mixAndMatch = require('../../controllers/mixAndMatchController');  

router.get('/index/', outlet.getAllData);
//router.get('/list/master', outlet.getMaster); 
router.post('/index/update', outlet.postUpdate);
router.post('/index/create', outlet.postCreate);
router.post('/index/delete', outlet.postDelete); 


router.get('/payment/', payment.getAllData);
router.get('/payment/masterData', payment.getMasterData);
router.post('/payment/update', payment.postUpdate);
router.post('/payment/create', payment.postCreate);
router.post('/payment/delete', payment.postDelete); 
 

router.get('/cashType/', cashType.getAllData);
router.get('/cashType/masterData', cashType.getMasterData);
router.post('/cashType/update', cashType.postUpdate);
router.post('/cashType/create', cashType.postCreate);
router.post('/cashType/delete', cashType.postDelete); 
 
router.get('/tipsPool/', tipsPool.getAllData); 
router.post('/tipsPool/update', tipsPool.postUpdate);
router.post('/tipsPool/create', tipsPool.postCreate);
router.post('/tipsPool/delete', tipsPool.postDelete); 
 
router.get('/mixAndMatch/', mixAndMatch.getAllData); 
router.post('/mixAndMatch/update', mixAndMatch.postUpdate);
router.post('/mixAndMatch/create', mixAndMatch.postCreate);
router.post('/mixAndMatch/delete', mixAndMatch.postDelete); 
 



module.exports = router;