const express = require('express');
const router = express.Router();
const voidCode = require('./../../controllers/admin/voidCodeController'); 
const pantryMessage = require('./../../controllers/admin/pantryMessageController'); 
const functionAuthority = require('./../../controllers/admin/functionAuthorityController'); 
const functionShortCuts = require('./../../controllers/admin/functionShortCutsController'); 

router.get('/voidCode', voidCode.getAllData);
router.post('/voidCode/update', voidCode.postUpdate);
router.post('/voidCode/create', voidCode.postCreate);
router.post('/voidCode/delete', voidCode.postDelete);
 
router.get('/pantryMessage', pantryMessage.getAllData);
router.post('/pantryMessage/update', pantryMessage.postUpdate);
router.post('/pantryMessage/create', pantryMessage.postCreate);
router.post('/pantryMessage/delete', pantryMessage.postDelete);
 

router.get('/functionAuthority', functionAuthority.getAllData);
router.post('/functionAuthority/update', functionAuthority.postUpdate);
router.post('/functionAuthority/create', functionAuthority.postCreate);
router.post('/functionAuthority/delete', functionAuthority.postDelete);
 
router.get('/functionShortCuts', functionShortCuts.getAllData);
router.post('/functionShortCuts/update', functionShortCuts.postUpdate);
router.post('/functionShortCuts/create', functionShortCuts.postCreate);
router.post('/functionShortCuts/delete', functionShortCuts.postDelete);
 


module.exports = router;