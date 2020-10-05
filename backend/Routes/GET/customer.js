var express = require('express');
var router = express.Router();

var models =  require('../../Models');
const authMiddleware = require('../../Middlewares/auth.js');

router.get('/all',models.fetchCustomers); 

module.exports = router;