var express = require('express');
var router = express.Router();

var models =  require('../../Models');

router.get('/all',models.fetchCustomers); 
router.get('/history/:id',models.fetchCustomerHistory);

module.exports = router;