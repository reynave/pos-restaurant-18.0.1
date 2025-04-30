const express = require('express');
const router = express.Router();
const customerInfo = require('../../controllers/customerInfoController'); 
const customerInfoGrp = require('../../controllers/customerInfoGrpController'); 

router.get('/info/', customerInfo.getAllData);
router.get('/info/select', customerInfo.getSelect);
router.post('/info/update', customerInfo.postUpdate);
router.post('/info/create', customerInfo.postCreate);
router.post('/info/delete', customerInfo.postDelete);

router.get('/grp/', customerInfoGrp.getAllData);
router.post('/grp/update', customerInfoGrp.postUpdate);
router.post('/grp/create', customerInfoGrp.postCreate);
router.post('/grp/delete', customerInfoGrp.postDelete);

module.exports = router;