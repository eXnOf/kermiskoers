var debug = require('debug')('kk-backend:api')
var Parcours = require('../domain/parcours');
var parcoursRepository = require('../data/parcoursRepository');


exports.create = function (req, res, next) {

    let parcours = new Parcours(null ,req.body);

    parcoursRepository.create(parcours, (err, savedData) =>  {
        if(err) {
            next(err);
            return;
        }
        
        return res.send(savedData);
    });
}

exports.get = function (req, res, next) {

    let id = req.params.id;
    parcoursRepository.read(id, (err, savedData) =>  {
        if(err) {
            next(err);
            return;
        }
        
        return res.send(savedData);
    });
}

exports.getGeoJson = function (req, res, next) {

    let id = req.params.id;
    parcoursRepository.read(id, (err, savedData) =>  {
        if(err) {
            next(err);
            return;
        }
        
        return res.send(savedData._lineGeoJSON);
    });
}

exports.update = function (req, res, next) {

    let id = req.params.id;
    let parcours = new Parcours(id ,req.body);

    parcoursRepository.update(id, parcours, (err, savedData) =>  {
        if(err) {
            next(err);
            return;
        }
        
        return res.send(savedData);
    });
}

exports.setStartFinish = function (req, res, next) {

    let id = req.params.id;
    let startFinishProposal = req.body;

    parcoursRepository.read(id, (err, readData) => {
        if(err) {
            next(err);
            return;
        }

        readData.startFinish = startFinishProposal;
        debug(readData.startFinish);

        parcoursRepository.update(id, readData, (err, savedData) => {
            if(err) {
                next(err);
                return;
            }

            return res.send(savedData.startFinish);
        });
    });
}

exports.evaluatePoint = function (req, res, next) {

    let id = req.params.id;
    let point = req.body;

    parcoursRepository.read(id, (err, readData) => {
        if(err) {
            next(err);
            return;
        }

        let pointOnParcours = readData.evaluatePoint(point);
        debug(pointOnParcours);

        return res.send(pointOnParcours);
    });
}

exports.reverseParcours = function (req, res, next) {
    let id = req.params.id;

    let parcours = parcoursRepository.load(id);
    parcours.reverse();
    parcoursRepository.store(parcours);

    return res.send(JSON.stringify('Success'));
}

exports.getInfo = function (req, res, next) {
    
    let date = new Date();
    let info = [ { "DistanceToFinish": date.getSeconds() + " km" } ];
    return res.send(JSON.stringify(info));
}