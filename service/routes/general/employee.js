const express = require('express');
const router = express.Router();
const employee = require('./../../controllers/admin/general/employeeController');
const employeeAuthLevel = require('./../../controllers/admin/general/employeeAuthLevelController');
const employeeDept = require('./../../controllers/admin/general/employeeDeptController');
const employeeOrderLevel = require('./../../controllers/admin/general/employeeOrderLevelController');
const a = require('./../../controllers/admin/general/employeeAccessRightController');

router.get('/', employee.getAllData);
router.get('/select', employee.getSelect); 
router.post('/update', employee.postUpdate);
router.post('/create', employee.postCreate);
router.post('/delete', employee.postDelete);
router.post('/changePassword', employee.changePassword);
router.post('/duplicate', employee.duplicate);

// employee_auth_level
router.get('/authLevel/', employeeAuthLevel.getAllData); 
router.post('/authLevel/update', employeeAuthLevel.postUpdate);
router.post('/authLevel/create', employeeAuthLevel.postCreate);
router.post('/authLevel/delete', employeeAuthLevel.postDelete);

// employee_auth_level
router.get('/accessRight/', a.getAllData); 
router.post('/accessRight/update', a.postUpdate);
router.post('/accessRight/create', a.postCreate);
router.post('/accessRight/delete', a.postDelete); 


// employeeDept
router.get('/dept/', employeeDept.getAllData); 
router.post('/dept/update', employeeDept.postUpdate);
router.post('/dept/create', employeeDept.postCreate);
router.post('/dept/delete', employeeDept.postDelete);

// employee_order_level
router.get('/orderLevel/', employeeOrderLevel.getAllData); 
router.post('/orderLevel/update', employeeOrderLevel.postUpdate);
router.post('/orderLevel/create', employeeOrderLevel.postCreate);
router.post('/orderLevel/delete', employeeOrderLevel.postDelete);

module.exports = router;
