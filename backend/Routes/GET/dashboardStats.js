var express = require('express');
var router = express.Router();

var models =  require('../../Models');

router.get('/totalDocs',models.totalDocs);

module.exports = router;