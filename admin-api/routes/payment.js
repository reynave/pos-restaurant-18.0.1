const express = require('express');
const router = express.Router();
const paymentType = require('../controllers/paymentTypeController'); 
const paymentGroup = require('../controllers/paymentGroupController'); 
const cashType = require('../controllers/cashTypeController'); 
const taxType = require('../controllers/taxTypeController'); 
const serviceCharge = require('../controllers/serviceChargeController'); 

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

router.get('/serviceCharge/', serviceCharge.getAllData); 
router.post('/serviceCharge/update', serviceCharge.postUpdate);
router.post('/serviceCharge/create', serviceCharge.postCreate);
router.post('/serviceCharge/delete', serviceCharge.postDelete);

 
module.exports = router;
