const express = require('express');
const router = express.Router();
const employee = require('../controllers/paymentTypeController'); 

router.get('/paymentType/', employee.getAllData); 
router.post('/paymentType/update', employee.postUpdate);
router.post('/paymentType/create', employee.postCreate);
router.post('/paymentType/delete', employee.postDelete);

 
module.exports = router;
