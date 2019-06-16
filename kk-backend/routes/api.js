var express = require('express');
var router = express.Router();

var koersService = require('../services/koers');

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

/* GET users listing. */
router.post('/koers/', koersService.create);
router.post('/koers/:id/startfinish', koersService.setStartFinish);
router.post('/koers/:id/evaluate', koersService.evaluatePoint);
router.post('/koers/:id/reverse', koersService.reverseKoers);


var sheetService = require('../domain/sheetService');

router.post('/sheettest/', sheetService.updateSheet);


module.exports = router;
