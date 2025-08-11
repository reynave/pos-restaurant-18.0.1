const express = require('express');
const router = express.Router();
const c = require('../../controllers/admin/login/loginAdminController');  
  
// table/* 
router.post('/admin', c.signin);  
 
module.exports = router;