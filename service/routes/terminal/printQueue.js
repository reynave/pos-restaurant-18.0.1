const express = require('express'); 
const router = express.Router();
const c = require('../../controllers/terminal/printQueueController');  
    
router.get('/queue', c.queue);    
router.post('/fnReprint', c.fnReprint);    
router.post('/fnRushPrint', c.fnRushPrint);    

router.post('/template', c.template);    

module.exports = router;