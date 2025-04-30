const express = require('express');
const router = express.Router();
const complaintCategory = require('../../controllers/complaintCategoryController');
const complaintType = require('../../controllers/complaintTypeController');

router.get('/category/', complaintCategory.getAllData);
router.post('/category/update', complaintCategory.postUpdate);
router.post('/category/create', complaintCategory.postCreate);
router.post('/category/delete', complaintCategory.postDelete);

router.get('/type/', complaintType.getAllData);
router.post('/type/update', complaintType.postUpdate);
router.post('/type/create', complaintType.postCreate);
router.post('/type/delete', complaintType.postDelete);

module.exports = router;