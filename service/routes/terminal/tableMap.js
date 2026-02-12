const express = require('express');
const router = express.Router();
const tableMap = require('../../controllers/terminal/tableMapController');  
  
// tableMap/*
router.get('/', tableMap.index);
router.get('/detail', tableMap.tableDetail);

router.post('/newOrder', tableMap.newOrder);


// router.post('/create', tableMap.postCreate);
// router.post('/delete', tableMap.postDelete);
 
module.exports = router;