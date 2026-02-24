const express = require('express');
const router = express.Router();
const tableMap = require('../../controllers/admin/outlet/tableMapTemplateController');  

router.get('/', tableMap.getAllData);  
router.post('/create', tableMap.postCreate);
router.post('/delete', tableMap.postDelete);  
router.post('/update', tableMap.postUpdate);  
 router.post('/updateImg', tableMap.updateImg);  
 router.post('/duplicate', tableMap.duplicate);
module.exports = router;