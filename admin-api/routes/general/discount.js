const express = require('express');
const router = express.Router();
const discGroup = require('./../../controllers/discGroupController');
const discType = require('./../../controllers/discTypeController');

router.get('/discGroup', discGroup.getAllData);
router.post('/discGroup/update', discGroup.postUpdate);
router.post('/discGroup/create', discGroup.postCreate);
router.post('/discGroup/delete', discGroup.postDelete);

router.get('/discType', discType.getAllData);
router.post('/discType/update', discType.postUpdate);
router.post('/discType/create', discType.postCreate);
router.post('/discType/delete', discType.postDelete);

module.exports = router;