const express = require('express');
const router = express.Router();
const outlet = require('../../controllers/admin/outlet/outletController');  
const payment = require('../../controllers/admin/outletPaymentController');  
const cashType = require('../../controllers/admin/outletCashTypesController');   
const funcAuthority = require('../../controllers/admin/funcAuthorityController');   

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
 
 
 
router.get('/funcAuthority/', funcAuthority.getAllData); 
router.post('/funcAuthority/update', funcAuthority.postUpdate);
router.post('/funcAuthority/create', funcAuthority.postCreate);
router.post('/funcAuthority/delete', funcAuthority.postDelete); 
 
 



module.exports = router;