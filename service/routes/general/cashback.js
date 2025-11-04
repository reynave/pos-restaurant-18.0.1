const express = require('express');
const router = express.Router();
const cb = require('../../controllers/admin/general/cashbackController'); 

router.get('/', cb.index);
router.get('/detail', cb.detail);

router.post('/update', cb.postUpdate);
router.post('/create', cb.postCreate);
router.post('/delete', cb.postDelete);
 

module.exports = router;