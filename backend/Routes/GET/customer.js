var express = require('express');
var router = express.Router();

var models =  require('../../Models');

router.get('/all',models.fetchCustomers); 

module.exports = router;