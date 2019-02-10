var geolib = require('geolib');
var convert = require('convert-units');
var uuidv4 = require('uuid/v4');

class Koers {
    constructor(polygonCoords) {
        this.id = uuidv4();
        this.polygonCoords = polygonCoords;
    }

    get distanceInKm() {
        let pathLength = geolib.getPathLength(this.polygonCoords);
        return convert(pathLength).from('m').to('km');
    }

    setStartFinish(startFinishProposal) {
        return startFinishProposal;
    }
}

module.exports = Koers;