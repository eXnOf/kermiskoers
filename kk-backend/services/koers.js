var debug = require('debug')('kk-backend:api')
var Koers = require('../domain/koers');
var koersRepository = require('../data/koersRepository');


exports.create = function(req, res, next) {

    debug(req.body); //TODO: Validate

    let koers = new Koers(req.body);
    koersRepository.store(koers);

    debug(koers);

    return res.send(koers);
}

exports.setStartFinish = function(req, res, next) {

    debug(req.body); //TODO: Validate
    
    let id = req.params.id;
    let startFinishProposal = req.body;
    
    let koers = koersRepository.load(id);
    koers.startFinish = startFinishProposal;
    koersRepository.store(koers);
    
    debug(koers.startFinish);

    return res.send(koers.startFinish);
}

exports.evaluatePoint = function(req, res, next) {

    debug(req.body); //TODO: Validate
        
    let id = req.params.id;
    let point = req.body;
    
    let koers = koersRepository.load(id);
    
    return koers.evaluatePoint(point, (err, data) => {
        if(err) {
            res.sendStatus(500);
        }
        else {
            debug(data);
            res.send(data);
        }
    });
}

exports.reverseKoers = function(req, res, next) {
    let id = req.params.id;
    
    let koers = koersRepository.load(id);
    koers.reverse();
    koersRepository.store(koers);

    return res.send(JSON.stringify('Success'));
}