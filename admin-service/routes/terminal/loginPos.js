const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/terminal/loginController');  
  
// table/*
router.get('/outlet', loginController.getAllData);

//router.post('/signin', loginController.newOrder);


// router.post('/create', tableMap.postCreate);
// router.post('/delete', tableMap.postDelete);
 
module.exports = router;