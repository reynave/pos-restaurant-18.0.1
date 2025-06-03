const express = require('express');
const router = express.Router();
const menuController = require('../../controllers/admin/menuController'); 

router.get('/menu', menuController.getAllData); 
 
module.exports = router;