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
        let lineParts = turf.lineSplit(this._lineGeoJSON, snappedStartFinish);

        let startToPoint = lineParts.features[0];
        let pointToEnd = lineParts.features[1];

        let joinedCoordinates = [];
        pointToEnd.geometry.coordinates.forEach(coord => { joinedCoordinates.push(coord) });
        startToPoint.geometry.coordinates.forEach(coord => { joinedCoordinates.push(coord) });

        let previousStartFinish = this._lineGeoJSON.geometry.coordinates[0];
        let previousStartFinishOccurence = joinedCoordinates.findIndex(item => item[0] === previousStartFinish[0] && item[1] === previousStartFinish[1]);
        if (previousStartFinishOccurence > 0) {
             joinedCoordinates.splice(previousStartFinishOccurence, 1);
        }

        this._lineGeoJSON = turf.lineString(joinedCoordinates);

        //Redraw on map

        //Define direction! (use reverse, but how to visualize?)

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

        let lineParts = turf.lineSplit(this._lineGeoJSON, snappedPoint);
        let pointToEnd = lineParts.features[1];
        let distanceToEnd = turf.length(pointToEnd, { units: 'kilometers'});

        snappedPoint.properties.distToEnd = distanceToEnd;
        return snappedPoint;
    }

    reverse() {
        this._lineGeoJSON.geometry.coordinates.reverse();
    }
}

module.exports = Koers;