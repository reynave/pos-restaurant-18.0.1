const express = require('express');
const router = express.Router();
const employee = require('../controllers/employeeController');

router.get('/', employee.getAllData);

module.exports = router;
