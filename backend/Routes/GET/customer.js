var express = require('express');
var router = express.Router();

var models =  require('../../Models');
const authMiddleware = require('../../Middlewares/auth.js');

router.get('/all',authMiddleware,models.fetchCustomers); 

module.exports = router;