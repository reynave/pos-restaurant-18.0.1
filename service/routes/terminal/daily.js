const express = require('express');
const router = express.Router();
const c = require('../../controllers/terminal/dailyController');  
  
// table/*
router.get('/', c.getAllData); 
router.get('/getDailyStart', c.getDailyStart);

router.get('/getData', c.getAllData);
router.post('/start', c.dailyStart);

router.post('/close', c.dailyClose);

router.get('/cashbalance', c.cashbalance);
router.get('/checkCashType', c.checkCashType);
router.post('/addCashIn', c.addCashIn);


router.get('/checkItems', c.checkItems);

// router.post('/create', tableMap.postCreate);
// router.post('/delete', tableMap.postDelete);
 
module.exports = router;