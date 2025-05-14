const express = require('express');
const router = express.Router();
const member = require('../../controllers/admin/memberProfileController'); 
const memberClass = require('../../controllers/admin/memberClassController'); 
const memberPeriod = require('../../controllers/admin/memberPeriodController'); 
const memberAccountHolder = require('../../controllers/admin/memberAccountHolderController'); 
const memberAccount = require('../../controllers/admin/memberAccountController'); 

const costCentre = require('../../controllers/admin/costCentreController'); 



router.get('/profile', member.getAllData);
router.post('/profile/update', member.postUpdate);
router.post('/profile/create', member.postCreate);
router.post('/profile/delete', member.postDelete); 


router.get('/class', memberClass.getAllData);
router.post('/class/update', memberClass.postUpdate);
router.post('/class/create', memberClass.postCreate);
router.post('/class/delete', memberClass.postDelete); 

router.get('/period', memberPeriod.getAllData);
router.post('/period/update', memberPeriod.postUpdate);
router.post('/period/create', memberPeriod.postCreate);
router.post('/period/delete', memberPeriod.postDelete); 
 
router.get('/account', memberAccount.getAllData);
router.post('/account/update', memberAccount.postUpdate);
router.post('/account/create', memberAccount.postCreate);
router.post('/account/delete', memberAccount.postDelete); 
 
router.get('/accountHolder', memberAccountHolder.getAllData);
router.post('/accountHolder/update', memberAccountHolder.postUpdate);
router.post('/accountHolder/create', memberAccountHolder.postCreate);
router.post('/accountHolder/delete', memberAccountHolder.postDelete); 
  
router.get('/costCentre', costCentre.getAllData);
router.post('/costCentre/update', costCentre.postUpdate);
router.post('/costCentre/create', costCentre.postCreate);
router.post('/costCentre/delete', costCentre.postDelete); 




module.exports = router;