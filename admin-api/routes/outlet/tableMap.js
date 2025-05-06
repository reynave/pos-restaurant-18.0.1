const express = require('express');
const router = express.Router();
const tableMap = require('../../controllers/tableMapController');  

router.get('/table/', tableMap.getAllData);
router.get('/table/master', tableMap.getMaster);
router.post('/table/postUpdatePosXY', tableMap.postUpdatePosXY);

router.post('/table/create', tableMap.postCreate);
router.post('/table/delete', tableMap.postDelete); 
 
module.exports = router;