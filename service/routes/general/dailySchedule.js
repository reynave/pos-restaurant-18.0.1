const express = require('express');
const router = express.Router();
const d = require('../../controllers/admin/general/dailyScheduleController'); 

router.get('/', d.getAllData);
router.post('/update', d.postUpdate);
router.post('/create', d.postCreate);
router.post('/delete', d.postDelete); 

module.exports = router;