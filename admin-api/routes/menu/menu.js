const express = require('express');
const router = express.Router();
const menuCategory = require('../../controllers/menuCategoryController');   
const department = require('../../controllers/menuDepartmentController');   
const menuClass = require('../../controllers/menuClassController');   
const menuItem = require('../../controllers/menuItemController');   

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
router.post('/item/update', menuItem.postUpdate);
router.post('/item/create', menuItem.postCreate);
router.post('/item/delete', menuItem.postDelete); 
  


module.exports = router;