var debug = require('debug')('kk-backend:api')
var Koers = require('../domain/koers');
var koersRepository = require('../data/koersRepository');


exports.create = function (req, res, next) {

    debug(req.body); //TODO: Validate

    let koers = new Koers(null ,req.body);
    debug(koers);

    koersRepository.create(koers, (err, savedData) =>  {
        if(err) {
            next(err);
            return;
        }
        
        return res.send(savedData);
    });
}

exports.setStartFinish = function (req, res, next) {

    debug(req.body); //TODO: Validate

    let id = req.params.id;
    let startFinishProposal = req.body;

    koersRepository.read(id, (err, readData) => {
        if(err) {
            next(err);
            return;
        }

        readData.startFinish = startFinishProposal;
        debug(readData.startFinish);

        koersRepository.update(id, readData, (err, savedData) => {
            if(err) {
                next(err);
                return;
            }

            return res.send(savedData.startFinish);
        });
    });
}

exports.evaluatePoint = function (req, res, next) {

    debug(req.body); //TODO: Validate

    let id = req.params.id;
    let point = req.body;

    koersRepository.read(id, (err, readData) => {
        if(err) {
            next(err);
            return;
        }

        let pointOnKoers = readData.evaluatePoint(point);
        debug(pointOnKoers);

        return res.send(pointOnKoers);
    });
}

exports.reverseKoers = function (req, res, next) {
    let id = req.params.id;

    let koers = koersRepository.load(id);
    koers.reverse();
    koersRepository.store(koers);

    return res.send(JSON.stringify('Success'));
}

exports.getInfo = function (req, res, next) {
    
    let date = new Date();
    let info = [ { "DistanceToFinish": date.getSeconds() + " km" } ];
    return res.send(JSON.stringify(info));
}