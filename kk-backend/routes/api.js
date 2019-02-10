var express = require('express');
var router = express.Router();

var koersSservice = require('../services/koers');

/* GET users listing. */
router.post('/koers/', koersSservice.create);
router.post('/koers/:id/startfinish', koersSservice.setStartFinish);

module.exports = router;
