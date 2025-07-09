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


module.exports = router;