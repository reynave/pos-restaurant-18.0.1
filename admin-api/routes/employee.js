const express = require('express');
const router = express.Router();
const employee = require('../controllers/employeeController');

router.get('/', employee.getAllData);
router.get('/select', employee.getSelect);

router.get('/detail', employee.getDetail);
router.post('/update', employee.postUpdate);
router.post('/create', employee.postCreate);
router.post('/delete', employee.postDelete);

module.exports = router;
