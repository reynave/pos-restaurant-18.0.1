const express = require('express');
 const router = express.Router();
// const stationTaxRun = require('../../controllers/admin/stationTaxRunController'); 
// const pantryStation = require('../../controllers/admin/pantryStationController'); 
// const printQueue = require('../../controllers/admin/printQueueController'); 
const t = require('../../controllers/admin/general/terminalController'); 
const printer = require('../../controllers/admin/general/printerController'); 
const pg = require('../../controllers/admin/general/printerGroupController'); 

router.get('/terminal/', t.getAllData); 
router.post('/terminal/update', t.postUpdate);
router.post('/terminal/delete', t.postDelete);
router.get('/terminal/loadKey', t.loadKey);



router.get('/printer/', printer.getAllData);
router.post('/printer/update', printer.postUpdate);
router.post('/printer/delete', printer.postDelete);
router.post('/printer/create', printer.postCreate);

router.post('/printer/test/', printer.testPrinting);
//router.get('/printer/test/ip', printer.testPrintingIP);
// router.get('/printer/test/com', printer.testPrintingCom);



router.get('/printerGroup/', pg.getAllData);
router.post('/printerGroup/update', pg.postUpdate);
router.post('/printerGroup/delete', pg.postDelete);
router.post('/printerGroup/create', pg.postCreate);


// router.get('/taxRun/', stationTaxRun.getAllData);
// router.post('/taxRun/update', stationTaxRun.postUpdate);
// router.post('/taxRun/create', stationTaxRun.postCreate);
// router.post('/taxRun/delete', stationTaxRun.postDelete);

// router.get('/pantryStation/', pantryStation.getAllData);
// router.post('/pantryStation/update', pantryStation.postUpdate);
// router.post('/pantryStation/create', pantryStation.postCreate);
// router.post('/pantryStation/delete', pantryStation.postDelete);
 

// router.get('/printQueue/', printQueue.getAllData);
// router.post('/printQueue/update', printQueue.postUpdate);
// router.post('/printQueue/create', printQueue.postCreate);
// router.post('/printQueue/delete', printQueue.postDelete);
 
module.exports = router;