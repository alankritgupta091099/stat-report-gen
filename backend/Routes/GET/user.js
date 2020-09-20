var express = require('express');
var router = express.Router();

var models =  require('../../Models');
const authMiddleware = require('../../Middlewares/auth.js');

router.get('/fromToken',authMiddleware,models.getUserFromToken);

module.exports = router;