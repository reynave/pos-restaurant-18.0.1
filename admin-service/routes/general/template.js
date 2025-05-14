const express = require('express');
const router = express.Router();
const template = require('../../controllers/admin/templateController');

router.get('/', template.getAllData);
router.get('/detail', template.getDetail);
router.post('/update', template.postUpdate);
router.post('/create', template.postCreate);
router.post('/delete', template.postDelete);


module.exports = router;