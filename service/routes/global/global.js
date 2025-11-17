const express = require('express');
const router = express.Router();
const menuController = require('../../controllers/admin/menuController'); 

router.get('/menu', menuController.getAllData); 
router.get('/uxFunction', menuController.uxFunction); 
 router.post('/uxFunction/onSaveOrder', menuController.uxFunctionSaveOrder); 
  router.post('/uxFunction/onSaveStatus', menuController.uxFunctionStatus); 
 
module.exports = router;