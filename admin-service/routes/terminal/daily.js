const express = require('express');
const router = express.Router();
const c = require('../../controllers/terminal/dailyController');  
  
// table/*
router.get('/', c.getAllData); 
router.get('/getData', c.getAllData);
router.post('/start', c.dailyStart);


// router.post('/create', tableMap.postCreate);
// router.post('/delete', tableMap.postDelete);
 
module.exports = router;