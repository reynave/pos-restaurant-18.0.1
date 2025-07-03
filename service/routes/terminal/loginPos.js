const express = require('express');
const router = express.Router();
const c = require('../../controllers/terminal/loginController');  
  
// table/*
router.get('/outlet', c.getAllData); 
router.post('/signin', c.signin);

router.post('/terminal', c.terminal);


// router.post('/create', tableMap.postCreate);
// router.post('/delete', tableMap.postDelete);
 
module.exports = router;