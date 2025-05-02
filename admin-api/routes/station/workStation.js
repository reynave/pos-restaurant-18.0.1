const express = require('express');
const router = express.Router();
const stationTaxRun = require('../../controllers/stationTaxRunController'); 
const pantryStation = require('../../controllers/pantryStationController'); 
const printQueue = require('../../controllers/printQueueController'); 


router.get('/taxRun/', stationTaxRun.getAllData);
router.post('/taxRun/update', stationTaxRun.postUpdate);
router.post('/taxRun/create', stationTaxRun.postCreate);
router.post('/taxRun/delete', stationTaxRun.postDelete);

router.get('/pantryStation/', pantryStation.getAllData);
router.post('/pantryStation/update', pantryStation.postUpdate);
router.post('/pantryStation/create', pantryStation.postCreate);
router.post('/pantryStation/delete', pantryStation.postDelete);
 

router.get('/printQueue/', printQueue.getAllData);
router.post('/printQueue/update', printQueue.postUpdate);
router.post('/printQueue/create', printQueue.postCreate);
router.post('/printQueue/delete', printQueue.postDelete);
 
module.exports = router;