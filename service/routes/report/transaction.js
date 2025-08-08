const express = require('express');
const router = express.Router();
const d = require('../../controllers/admin/report/transactionController'); 

router.get('/', d.getAllData);
router.get('/detail', d.detail);
router.get('/detailGroup', d.detailGroup);

/*
router.post('/dailyClose/update', complaintCategory.postUpdate);
router.post('/dailyClose/create', complaintCategory.postCreate);
router.post('/dailyClose/delete', complaintCategory.postDelete);
 */

module.exports = router;