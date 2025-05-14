const express = require('express');
const router = express.Router();
const printer = require('../../controllers/admin/printerController');  
 

router.get('/test/', printer.testPrintingIp);
router.get('/test/ip', printer.testPrintingIp);
router.get('/test/com', printer.testPrintingCom);


router.get('/', printer.getAllData);

router.post('/update', printer.postUpdate);
router.post('/create', printer.postCreate);
router.post('/delete', printer.postDelete);
 
module.exports = router;