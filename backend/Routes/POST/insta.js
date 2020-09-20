var express = require('express');
var router = express.Router();

var models =  require('../../Models');

router.get('/followers_count',models.fetchFollowerCount);

module.exports = router;