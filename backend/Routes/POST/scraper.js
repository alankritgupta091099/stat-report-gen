var express = require('express');
var router = express.Router();

var models =  require('../../Models');

router.post('/heading',models.webScraper);
router.post('/stats',models.scrapStatShow);

module.exports = router;