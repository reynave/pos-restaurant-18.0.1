const express = require('express');
const router = express.Router();
const menuCategory = require('../../controllers/admin/menuCategoryController');   
const department = require('../../controllers/admin/menuDepartmentController');   
const menuClass = require('../../controllers/admin/menuClassController');   
const menuItem = require('../../controllers/admin/menuItemController');   
const menuLookup = require('../../controllers/admin/menuLookupController');   

//router.get('/', outlet.getMaster); 
router.get('/category/', menuCategory.getAllData);
router.post('/category/update', menuCategory.postUpdate);
router.post('/category/create', menuCategory.postCreate);
router.post('/category/delete', menuCategory.postDelete); 
  
//router.get('/', outlet.getMaster); 
router.get('/department/', department.getAllData);
router.post('/department/update', department.postUpdate);
router.post('/department/create', department.postCreate);
router.post('/department/delete', department.postDelete); 
  
router.get('/class/', menuClass.getAllData);
router.post('/class/update', menuClass.postUpdate);
router.post('/class/create', menuClass.postCreate);
router.post('/class/delete', menuClass.postDelete); 
  

router.get('/item/', menuItem.getAllData);
router.get('/master/', menuItem.getMasterData);

router.post('/item/update', menuItem.postUpdate);
router.post('/item/create', menuItem.postCreate);
router.post('/item/delete', menuItem.postDelete); 
  



router.get('/menuLookup/', menuLookup.getAllData);
router.get('/menuLookup/items', menuLookup.items);

module.exports = router;