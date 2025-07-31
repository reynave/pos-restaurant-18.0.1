const express = require('express');
const router = express.Router();
const menuCategory = require('../../controllers/admin/menu/menuCategoryController');   
const department = require('../../controllers/admin/menu/menuDepartmentController');   
const menuClass = require('../../controllers/admin/menu/menuClassController');   
const menuItem = require('../../controllers/admin/menu/menuItemController');   
const menuLookup = require('../../controllers/admin/menu/menuLookupController');   
const modifierList = require('../../controllers/admin/menu/modifierListController');   
const modifierGroup = require('../../controllers/admin/menu/modifierGroupController');   
const modifier = require('../../controllers/admin/menu/modifierController');   


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
router.get('/itemsList/', menuItem.itemsList);
router.get('/menuSetDetail/', menuItem.menuSetDetail);
router.post('/addMenuSet/', menuItem.addMenuSet);
router.post('/updateMenuDetail/', menuItem.updateMenuDetail);
router.post('/removeMenuSet/', menuItem.removeMenuSet);


router.post('/item/update', menuItem.postUpdate);
router.post('/item/create', menuItem.postCreate);
router.post('/item/delete', menuItem.postDelete); 
  
 
router.get('/menuLookup/', menuLookup.getAllData)
router.get('/menuLookup/allItem', menuLookup.allItem);
router.get('/menuLookup/items', menuLookup.items);
router.post('/menuLookup/removeLookup', menuLookup.removeLookup);
router.post('/menuLookup/onSubmitLookupMenu', menuLookup.onSubmitLookupMenu);
router.post('/menuLookup/updateLookUp', menuLookup.updateLookUp);
router.post('/menuLookup/postCreate', menuLookup.postCreate);
router.post('/menuLookup/deleteTree', menuLookup.deleteTree);
router.post('/menuLookup/addParent', menuLookup.addParent);


router.get('/modifierList', modifierList.getAllData); 
router.post('/modifierList/update', modifierList.postUpdate);
router.post('/modifierList/create', modifierList.postCreate);
router.post('/modifierList/delete', modifierList.postDelete); 

router.get('/modifierGroup', modifierGroup.getAllData); 
router.post('/modifierGroup/update', modifierGroup.postUpdate);
router.post('/modifierGroup/create', modifierGroup.postCreate);
router.post('/modifierGroup/delete', modifierGroup.postDelete); 


router.get('/modifier', modifier.getAllData);
 router.get('/modifier/master', modifier.getMasterData);
 
router.get('/modifier/master/', menuItem.getMasterData);
router.post('/modifier/update', modifier.postUpdate);
router.post('/modifier/create', modifier.postCreate);
router.post('/modifier/delete', modifier.postDelete); 
  
module.exports = router;