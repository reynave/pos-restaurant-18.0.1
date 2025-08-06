const express = require('express');
const router = express.Router();
const paymentType = require('./../../controllers/admin/general/paymentTypeController'); 
const paymentGroup = require('./../../controllers/admin/general/paymentGroupController'); 
const cashType = require('./../../controllers/admin/general/cashTypeController'); 
const taxType = require('./../../controllers/admin/general/taxTypeController'); 
const serviceCharge = require('./../../controllers/admin/serviceChargeController'); 
const foreignCurrency = require('../../controllers/admin/general/foreignCurrencyController'); 


router.get('/paymentType/', paymentType.getAllData); 
router.post('/paymentType/update', paymentType.postUpdate);
router.post('/paymentType/create', paymentType.postCreate);
router.post('/paymentType/delete', paymentType.postDelete);

router.get('/paymentGroup/', paymentGroup.getAllData); 
router.post('/paymentGroup/update', paymentGroup.postUpdate);
router.post('/paymentGroup/create', paymentGroup.postCreate);
router.post('/paymentGroup/delete', paymentGroup.postDelete);

router.get('/cashType/', cashType.getAllData); 
router.post('/cashType/update', cashType.postUpdate);
router.post('/cashType/create', cashType.postCreate);
router.post('/cashType/delete', cashType.postDelete);

router.get('/taxType/', taxType.getAllData); 
router.post('/taxType/update', taxType.postUpdate);
router.post('/taxType/create', taxType.postCreate);
router.post('/taxType/delete', taxType.postDelete);
 
router.get('/foreignCurrency/', foreignCurrency.getAllData); 
router.post('/foreignCurrency/update', foreignCurrency.postUpdate);
router.post('/foreignCurrency/create', foreignCurrency.postCreate);
router.post('/foreignCurrency/delete', foreignCurrency.postDelete);

module.exports = router;
