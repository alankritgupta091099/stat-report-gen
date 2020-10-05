var express = require('express');
var router = express.Router();

var models =  require('../../Models');

router.post('/:id',models.editCustomer);

module.exports = router;