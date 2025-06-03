const express = require('express');
const router = express.Router();
const c = require('../../controllers/terminal/itemsController');  
  
// table/*
router.get('/', c.getItems);  
router.post('/resetAdjust', c.resetAdjust);  
router.post('/addQty', c.addQty);  

// router.post('/create', tableMap.postCreate);
// router.post('/delete', tableMap.postDelete);
 
module.exports = router;