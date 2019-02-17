var debug = require('debug')('kk-backend:api')
var turf = require('@turf/turf');
var uuidv4 = require('uuid/v4');

class Koers {
    constructor(polygonGeoJSON) {
        this.id = uuidv4();
        
        this._polygonGeoJSON = polygonGeoJSON;
        this._lineGeoJSON = turf.polygonToLine(this._polygonGeoJSON);
        this._length = turf.lineDistance(this._polygonGeoJSON, { units: 'kilometers'});
    }

    get distanceInKm() {
        return this._length;
    }

    set startFinish(startFinishProposal) {
        let snappedStartFinish = this.snapPointToKoers(startFinishProposal);

        //TODO: recalculate line to start with starting point

        //Redraw on map

        //Define direction!

        this._startFinish = snappedStartFinish;
    }

    get startFinish() {
        return this._startFinish;
    }

    snapPointToKoers(point) {
        let snapped = turf.nearestPointOnLine(this._lineGeoJSON, point, {units: 'kilometers'});
        return snapped;
    }

    evaluatePoint(point) {
        let snappedPoint = this.snapPointToKoers(point);
        return snappedPoint;
    }
}

module.exports = Koers;