var express = require('express');
var router = express.Router();

var models =  require('../../Models');

router.post('/gen',models.generateReport);

module.exports = router;