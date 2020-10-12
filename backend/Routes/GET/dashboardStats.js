var express = require('express');
var router = express.Router();

var models =  require('../../Models');

router.get('/totalDocs',models.totalDocs);
router.get('/calcRev',models.calculateRevenue);
router.get('/totalCust',models.totalCustomers);

module.exports = router;