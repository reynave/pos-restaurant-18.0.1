const express = require('express');
const router = express.Router();
 
const discount = require('./../../controllers/admin/general/discountController');
const discountLevel = require('./../../controllers/admin/general/discountLevelController');
const discountGroup = require('./../../controllers/admin/general/discountGroupController');
const outlet = require('./../../controllers/admin/general/discountOutletController');


router.get('/', discount.getAllData);
router.post('/update', discount.postUpdate);
router.post('/create', discount.postCreate);
router.post('/delete', discount.postDelete);

router.get('/group', discountGroup.getAllData);
router.post('/group/update', discountGroup.postUpdate);
router.post('/group/create', discountGroup.postCreate);
router.post('/group/delete', discountGroup.postDelete);

router.get('/level', discountLevel.getAllData);
router.post('/level/update', discountLevel.postUpdate);
 
router.get('/outlet', outlet.getAllData);
router.post('/outlet/update', outlet.postUpdate);

module.exports = router;