const express = require('express');
const router = express.Router();
const specialHour = require('./../../controllers/specialHourController');

router.get('/', specialHour.getAllData);
router.post('/update', specialHour.postUpdate);
router.post('/create', specialHour.postCreate);
router.post('/delete', specialHour.postDelete);


module.exports = router;