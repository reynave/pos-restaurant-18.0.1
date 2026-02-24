const express = require('express');
const router = express.Router();
const tableMap = require('../../controllers/admin/outlet/tableMapController');  

router.get('/table/', tableMap.index);
router.get('/table/master', tableMap.getMaster);
router.get('/table/icon', tableMap.getIcon);

router.post('/table/postUpdatePosXY', tableMap.postUpdatePosXY);

router.post('/table/create', tableMap.postCreate);
router.post('/table/delete', tableMap.postDelete);   
router.post('/table/duplicate', tableMap.duplicate);
router.post('/table/deleteCheckAll', tableMap.deleteCheckAll);


router.post('/table/submitDetail', tableMap.submitDetail);
module.exports = router;