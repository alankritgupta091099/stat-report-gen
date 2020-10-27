var express = require('express');
var router = express.Router();

var models =  require('../../Models');
const authMiddleware = require('../../Middlewares/auth.js');

router.post('/reg',authMiddleware,models.createUser);
router.post('/login',models.loginUser);
router.post('/forgot',models.forgotPassword);
router.post('/reset',models.resetPassword);

module.exports = router;