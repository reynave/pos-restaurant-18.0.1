const express = require('express');
const router = express.Router();
const employee = require('./../../controllers/admin/general/employeeController');
const employeeAuthLevel = require('./../../controllers/admin/general/employeeAuthLevelController');
const employeeDept = require('./../../controllers/admin/general/employeeDeptController');
const employeeOrderLevel = require('./../../controllers/admin/general/employeeOrderLevelController');

router.get('/', employee.getAllData);
router.get('/select', employee.getSelect); 
router.post('/update', employee.postUpdate);
router.post('/create', employee.postCreate);
router.post('/delete', employee.postDelete);

// employee_auth_level
router.get('/authLevel/', employeeAuthLevel.getAllData); 
router.post('/authLevel/update', employeeAuthLevel.postUpdate);
router.post('/authLevel/create', employeeAuthLevel.postCreate);
router.post('/authLevel/delete', employeeAuthLevel.postDelete);

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
