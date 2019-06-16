var express = require('express');
var router = express.Router();

var koersService = require('../services/koers');

/* GET users listing. */
router.post('/koers/', koersService.create);
router.post('/koers/:id/startfinish', koersService.setStartFinish);
router.post('/koers/:id/evaluate', koersService.evaluatePoint);
router.post('/koers/:id/reverse', koersService.reverseKoers);
router.get('/koers/info', koersService.getInfo);

module.exports = router;
