var debug = require('debug')('kk-backend:api')
var turf = require('@turf/turf');
var uuidv4 = require('uuid/v4');

class Koers {
    constructor(polygonGeoJSON) {
        this.id = uuidv4();
        this.polygonGeoJSON = polygonGeoJSON;

        this.length = turf.lineDistance(this.polygonGeoJSON, { units: 'kilometers'});
    }

    get distanceInKm() {
        let length = turf.lineDistance(this.polygonGeoJSON, { units: 'kilometers'});
        return length;        
    }

    setStartFinish(startFinishProposal) {

        var line = turf.polygonToLine(this.polygonGeoJSON);                
        var snapped = turf.nearestPointOnLine(line, startFinishProposal, {units: 'kilometers'});
        return snapped;
    }
}

module.exports = Koers;