const express = require('express');
const router = express.Router();
const l = require('../../controllers/admin/general/languageController'); 

router.get('/', l.index);  
router.post('/update', l.postUpdate);

/*
router.post('/create', cb.postCreate);
router.post('/delete', cb.postDelete);
 */

module.exports = router;