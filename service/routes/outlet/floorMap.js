const express = require('express');
const router = express.Router();
const floorMap = require('../../controllers/admin/outlet/floorMapController');  

router.get('/map/', floorMap.getAllData);
router.get('/map/getIcon', floorMap.getIcon);


router.post('/map/update', floorMap.postUpdate); 
router.post('/map/create', floorMap.postCreate);
router.post('/map/delete', floorMap.postDelete); 
 router.post('/map/updateImg', floorMap.updateImg); 
 router.post('/map/duplicate', floorMap.duplicate);

module.exports = router;