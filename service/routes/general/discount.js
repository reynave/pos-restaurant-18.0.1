const express = require('express');
const router = express.Router();
 
const discountType = require('./../../controllers/admin/general/discController');
const discountLevel = require('./../../controllers/admin/general/discountLevelController');
const discountGroup = require('./../../controllers/admin/general/discountGroupController');


router.get('/type', discountType.getAllData);
router.post('/type/update', discountType.postUpdate);
router.post('/type/create', discountType.postCreate);
router.post('/type/delete', discountType.postDelete);

router.get('/group', discountGroup.getAllData);
router.post('/group/update', discountGroup.postUpdate);
router.post('/group/create', discountGroup.postCreate);
router.post('/group/delete', discountGroup.postDelete);

router.get('/level', discountLevel.getAllData);
router.post('/level/update', discountLevel.postUpdate);
router.post('/level/create', discountLevel.postCreate);
router.post('/level/delete', discountLevel.postDelete);

module.exports = router;