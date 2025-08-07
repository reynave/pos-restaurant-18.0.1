const express = require('express');
const router = express.Router();
const d = require('../../controllers/admin/report/dailyCloseController'); 

router.get('/', d.getAllData);
/*
router.post('/dailyClose/update', complaintCategory.postUpdate);
router.post('/dailyClose/create', complaintCategory.postCreate);
router.post('/dailyClose/delete', complaintCategory.postDelete);
 */

module.exports = router;