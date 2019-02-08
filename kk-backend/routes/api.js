var debug = require('debug')('kk-backend:api')
var express = require('express');
var router = express.Router();

var geolib = require('geolib');
var convert = require('convert-units')

/* GET users listing. */
router.post('/', function(req, res, next) {
  
  

  debug(req.body);

  var pathLength = geolib.getPathLength(req.body);
  var pathLengthInKm = convert(pathLength).from('m').to('km');
  
  res.send({pathLengthInKm});
});

module.exports = router;
