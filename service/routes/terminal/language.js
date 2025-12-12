const express = require('express'); 
const router = express.Router();
const a = require('../../controllers/terminal/languageController');  
  
// table/*
router.get('/', a.getData);  

module.exports = router;