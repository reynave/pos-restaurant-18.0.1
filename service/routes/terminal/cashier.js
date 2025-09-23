const express = require('express');
const router = express.Router();
const c = require('../../controllers/terminal/cashierController');  


router.get('/queue', c.queue);
router.post('/newOrder', c.newOrder);
router.post('/deleteOrder', c.deleteOrder);
    
router.get('/test', (req, res) => {
    res.json({ message: 'Cashier route is working!' });
});

// router.post('/create', tableMap.postCreate);
// router.post('/delete', tableMap.postDelete);
 
module.exports = router;