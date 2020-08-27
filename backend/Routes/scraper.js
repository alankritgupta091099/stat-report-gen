var express = require('express');
var router = express.Router();
//var bodyParser = require('body-parser');

var models =  require('../Models');

// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({extended:true}));

router.get('/heading',models.webScraper);
router.get('/stats',models.scrapStatShow);

module.exports = router;