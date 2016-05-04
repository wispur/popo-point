import geolib from 'geolib';
import _ from 'lodash';

class PoPoPoint {

  inside = [];

  restriction = [];

  point = [];

  constructor(inside = [], restriction = [], point = []) {
    this.inside = inside;
    this.restriction = restriction;
    this.point = point;
  }

  isPointInside(latlng) {
    return geolib.isPointInside(latlng, this.inside);
  }

  isFreeZone(latlng) {
    return !_.find(this.restriction, restriction => {
      return geolib.isPointInside(latlng, restriction)
    });
  }

  findPointByDistance(latlng, distance, limit) {
    if (!distance) distance = 2000;
    if (!limit) limit = 2000;

    const results = geolib.orderByDistance(latlng, this.point);

    const index = _.findIndex(results, (result, idx) => {
      return result.distance > distance || idx >= limit
    });

    return _.take(results, index === -1 ? limit : index);
  }

  // TODO
  hasService(latlng) {

  }

  // TODO
  getServicePoint(latlng) {

  }
}

module.exports = PoPoPoint;
