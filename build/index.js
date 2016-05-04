'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _geolib = require('geolib');

var _geolib2 = _interopRequireDefault(_geolib);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PoPoPoint = function () {
  function PoPoPoint() {
    var inside = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var restriction = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var point = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    _classCallCheck(this, PoPoPoint);

    this.inside = [];
    this.restriction = [];
    this.point = [];

    this.inside = inside;
    this.restriction = restriction;
    this.point = point;
  }

  _createClass(PoPoPoint, [{
    key: 'isPointInside',
    value: function isPointInside(latlng) {
      return _geolib2.default.isPointInside(latlng, this.inside);
    }
  }, {
    key: 'isFreeZone',
    value: function isFreeZone(latlng) {
      return !_lodash2.default.find(this.restriction, function (restriction) {
        return _geolib2.default.isPointInside(latlng, restriction);
      });
    }
  }, {
    key: 'findPointByDistance',
    value: function findPointByDistance(latlng, distance, limit) {
      if (!distance) distance = 2000;
      if (!limit) limit = 2000;

      var results = _geolib2.default.orderByDistance(latlng, this.point);

      var index = _lodash2.default.findIndex(results, function (result, idx) {
        return result.distance > distance || idx >= limit;
      });

      return _lodash2.default.take(results, index === -1 ? limit : index);
    }
  }, {
    key: 'hasService',
    value: function hasService(latlng) {
      return this.isPointInside(latlng) && this.isFreeZone(latlng);
    }
  }, {
    key: 'getServicePoint',
    value: function getServicePoint(latlng) {
      return this.hasService(latlng) ? [latlng] : this.findPointByDistance(latlng, 500, 10);
    }
  }]);

  return PoPoPoint;
}();

module.exports = PoPoPoint;
