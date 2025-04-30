const express = require('express');
const router = express.Router();
const holidayList = require('./../../controllers/holidayListController');

router.get('/', holidayList.getAllData);
router.post('/update', holidayList.postUpdate);
router.post('/create', holidayList.postCreate);
router.post('/delete', holidayList.postDelete);


module.exports = router;