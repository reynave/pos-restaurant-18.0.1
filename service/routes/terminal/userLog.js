const express = require('express'); 
const router = express.Router();
const c = require('../../controllers/terminal/userLogController');  
  
// table/*
router.post('/', c.userLogIndex); 
  
router.get('/getLog', c.getLog);   


module.exports = router;