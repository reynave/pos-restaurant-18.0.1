const express = require('express');
const router = express.Router();
const outlet = require('../../controllers/admin/outletController');  
const payment = require('../../controllers/admin/outletPaymentController');  
const cashType = require('../../controllers/admin/outletCashTypesController');  
const tipsPool = require('../../controllers/admin/tipsPoolController');  
const mixAndMatch = require('../../controllers/admin/mixAndMatchController');  
const bonusRules = require('../../controllers/admin/bonusRulesController');  
const funcAuthority = require('../../controllers/admin/funcAuthorityController');  
const specialHour = require('../../controllers/admin/outletSpecialHourController');  

router.get('/index', outlet.getAllData);
router.get('/select', outlet.getSelect); 
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
 
router.get('/bonusRules/', bonusRules.getAllData); 
router.post('/bonusRules/update', bonusRules.postUpdate);
router.post('/bonusRules/create', bonusRules.postCreate);
router.post('/bonusRules/delete', bonusRules.postDelete); 
 
 
router.get('/funcAuthority/', funcAuthority.getAllData); 
router.post('/funcAuthority/update', funcAuthority.postUpdate);
router.post('/funcAuthority/create', funcAuthority.postCreate);
router.post('/funcAuthority/delete', funcAuthority.postDelete); 
 

router.get('/specialHour/', specialHour.getAllData); 
router.post('/specialHour/update', specialHour.postUpdate);
router.post('/specialHour/create', specialHour.postCreate);
router.post('/specialHour/delete', specialHour.postDelete); 
 



module.exports = router;