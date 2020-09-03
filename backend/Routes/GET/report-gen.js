var express = require('express');
var router = express.Router();

var models =  require('../../Models');

router.get('/gen',models.generateReport);

module.exports = router;