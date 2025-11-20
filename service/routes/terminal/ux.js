const express = require('express'); 
const router = express.Router();
const c = require('../../controllers/terminal/uxFunctionController');  
 
router.get('/', c.index); 
 

module.exports = router;