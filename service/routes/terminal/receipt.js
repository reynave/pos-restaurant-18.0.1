const express = require('express'); 
const router = express.Router();
const r = require('../../controllers/terminal/receiptController');  
  
// receipt/*
router.get('/', r.index);  
 

module.exports = router;