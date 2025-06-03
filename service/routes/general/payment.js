const express = require('express');
const router = express.Router();
const paymentType = require('./../../controllers/admin/paymentTypeController'); 
const paymentGroup = require('./../../controllers/admin/paymentGroupController'); 
const cashType = require('./../../controllers/admin/cashTypeController'); 
const taxType = require('./../../controllers/admin/taxTypeController'); 
const serviceCharge = require('./../../controllers/admin/serviceChargeController'); 
const foreignCurrency = require('./../../controllers/admin/foreignCurrencyController'); 
const wbDeposit = require('./../../controllers/admin/wbDepositController'); 
const wbSvcCard = require('./../../controllers/admin/wbSvcCardController'); 
const icCard = require('./../../controllers/admin/icCardController'); 

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

router.get('/foreignCurrency/', foreignCurrency.getAllData); 
router.post('/foreignCurrency/update', foreignCurrency.postUpdate);
router.post('/foreignCurrency/create', foreignCurrency.postCreate);
router.post('/foreignCurrency/delete', foreignCurrency.postDelete);


router.get('/wbDeposit/', wbDeposit.getAllData); 
router.post('/wbDeposit/update', wbDeposit.postUpdate);
router.post('/wbDeposit/create', wbDeposit.postCreate);
router.post('/wbDeposit/delete', wbDeposit.postDelete);

router.get('/wbSvcCard/', wbSvcCard.getAllData); 
router.post('/wbSvcCard/update', wbSvcCard.postUpdate);
router.post('/wbSvcCard/create', wbSvcCard.postCreate);
router.post('/wbSvcCard/delete', wbSvcCard.postDelete);

router.get('/icCard/', icCard.getAllData); 
router.post('/icCard/update', icCard.postUpdate);
router.post('/icCard/create', icCard.postCreate);
router.post('/icCard/delete', icCard.postDelete);

module.exports = router;
