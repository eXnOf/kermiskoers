var express = require('express');
var router = express.Router();

var parcoursService = require('../services/parcours');

/* GET users listing. */
router.post('/parcours/', parcoursService.create);
router.get('/parcours/:id', parcoursService.get);
router.get('/parcours/:id/geojson', parcoursService.getGeoJson)
router.put('/parcours/:id', parcoursService.update);
router.post('/parcours/:id/startfinish', parcoursService.setStartFinish);
router.post('/parcours/:id/evaluate', parcoursService.evaluatePoint);
router.post('/parcours/:id/reverse', parcoursService.reverseParcours);
router.get('/parcours/info', parcoursService.getInfo);

module.exports = router;
