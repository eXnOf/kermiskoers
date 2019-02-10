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
    let correctedStartFinish = koers.setStartFinish(startFinishProposal);
    koersRepository.store(koers);
    
    debug(correctedStartFinish);

    return res.send(correctedStartFinish);
}