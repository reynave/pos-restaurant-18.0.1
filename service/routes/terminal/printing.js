const express = require('express'); 
const router = express.Router();
const c = require('../../controllers/terminal/printingController');  
  
// table/*
router.get('/', (req, res) => {
  res.json({
    error: false, 
  });
});

router.get('/tableChecker', c.tableChecker);   
router.get('/kitchen', c.kitchen);  
router.post('/test', c.test);  
router.post('/print', c.print);  

router.post('/cashDrawer', c.cashDrawer);  
router.get('/viewPrinters', c.viewPrinters);  


module.exports = router;