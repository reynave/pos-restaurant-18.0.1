const express = require('express'); 
const router = express.Router();
const c = require('../../controllers/terminal/userLogController');  
  
// table/*
router.post('/', c.inputLog); 
//  router.post('/', c.userLogIndex);  ver log file, tidak pakai lagi
  
router.get('/getLog', c.getLog);   
router.get('/downloadLog', c.downloadLog);   


module.exports = router;