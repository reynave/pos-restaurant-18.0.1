const express = require('express');
const router = express.Router();
const cb = require('../../controllers/admin/general/cashbackController'); 

router.get('/', cb.index);
router.get('/detail', cb.detail);
router.post('/updateDetail', cb.updateDetail);

router.get('/amount', cb.amount);
router.post('/updateAmount', cb.updateAmount);
router.post('/addAmount', cb.addAmount); 
router.post('/deleteAmount', cb.deleteAmount); 
router.post('/duplicate', cb.duplicate); 

router.get('/selectPaymentMethod', cb.selectPaymentMethod);

//updatePaymentLink
router.post('/updatePaymentLink', cb.updatePaymentLink);


router.post('/update', cb.postUpdate);


router.post('/create', cb.postCreate);
router.post('/delete', cb.postDelete);
 

module.exports = router;