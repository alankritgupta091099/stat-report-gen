var express = require('express');
var router = express.Router();

var models =  require('../Models');

router.get('/heading',models.webScraper);
router.get('/stats',models.scrapStatShow);

module.exports = router;