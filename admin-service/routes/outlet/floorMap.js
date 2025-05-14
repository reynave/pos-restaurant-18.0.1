const express = require('express');
const router = express.Router();
const floorMap = require('../../controllers/admin/floorMapController');  

router.get('/map/', floorMap.getAllData);
router.post('/map/update', floorMap.postUpdate); 
router.post('/map/create', floorMap.postCreate);
router.post('/map/delete', floorMap.postDelete); 
 
module.exports = router;