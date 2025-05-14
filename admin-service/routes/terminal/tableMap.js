const express = require('express');
const router = express.Router();
const tableMap = require('../../controllers/terminal/tableMapController');  
  
// table/*
router.get('/', tableMap.getAllData);

router.post('/newOrder', tableMap.newOrder);


router.post('/create', tableMap.postCreate);
router.post('/delete', tableMap.postDelete);
 
module.exports = router;