import chai from 'chai';
import spies from 'chai-spies';
import _ from 'lodash';

const { expect } = chai;
chai.use(spies);

const PoPoPoint = require('../index');
const { inside, restriction, point } = require('../sample.json');

let popopoint;

describe('constructor', function() {
  it('new PoPoPoint', function() {
    popopoint = new PoPoPoint(inside, restriction, point);
    expect(popopoint.inside.length).to.equal(inside.length);
    expect(popopoint.restriction.length).to.equal(restriction.length);
    expect(popopoint.point.length).to.equal(point.length);
  });
});

describe('isPointInside', function() {
  it('is inside', function() {
    expect(popopoint.isPointInside({
      latitude: 25.043038, longitude: 121.505253
    })).to.be.ok;
    expect(popopoint.isPointInside({
      latitude: 25.040947, longitude: 121.504667
    })).to.be.ok;
    expect(popopoint.isPointInside({
      latitude: 25.043056, longitude: 121.504871
    })).to.be.ok;
    expect(popopoint.isPointInside({
      latitude: 25.045622, longitude: 121.504367
    })).to.be.ok;
    expect(popopoint.isPointInside({
      latitude: 25.041919, longitude: 121.502618
    })).to.be.ok;
    expect(popopoint.isPointInside({
      latitude: 25.043484, longitude: 121.508573
    })).to.be.ok;
  });

  it('not inside', function() {
    expect(popopoint.isPointInside({
      latitude: 25.043709, longitude: 121.509545
    })).to.not.be.ok;
    expect(popopoint.isPointInside({
      latitude: 25.045749, longitude: 121.503784
    })).to.not.be.ok;
    expect(popopoint.isPointInside({
      latitude: 25.041151, longitude: 121.503527
    })).to.not.be.ok;
    expect(popopoint.isPointInside({
      latitude: 25.047722, longitude: 121.516962
    })).to.not.be.ok;
  });
});

describe('isFreeZone', function() {
  it('is free zone', function() {
    expect(popopoint.isFreeZone({
      latitude: 25.041558, longitude: 121.506944
    })).to.be.ok;
    expect(popopoint.isFreeZone({
      latitude: 25.041558, longitude: 121.506944
    })).to.be.ok;
    expect(popopoint.isFreeZone({
      latitude: 25.043551, longitude: 121.505131
    })).to.be.ok;
    expect(popopoint.isFreeZone({
      latitude: 25.044795, longitude: 121.503908
    })).to.be.ok;
    expect(popopoint.isFreeZone({
      latitude: 25.045505, longitude: 121.506719
    })).to.be.ok;
    expect(popopoint.isFreeZone({
      latitude: 25.042695, longitude: 121.506033
    })).to.be.ok;
  });

  it('not free zone', function() {
    expect(popopoint.isFreeZone({
      latitude: 25.042861, longitude: 121.507567
    })).to.not.be.ok;
    expect(popopoint.isFreeZone({
      latitude: 25.042053, longitude: 121.505582
    })).to.not.be.ok;
    expect(popopoint.isFreeZone({
      latitude: 25.044377, longitude: 121.505497
    })).to.not.be.ok;
    expect(popopoint.isFreeZone({
      latitude: 25.044639, longitude: 121.506484
    })).to.not.be.ok;
  });
});

describe('findPointByDistance', function() {
  it('find 2 limit', function() {
    const results = popopoint.findPointByDistance({
      latitude: 25.045358, longitude: 121.506087
    }, null, 2);

    expect(results.length).to.equal(2);
  });

  it('should get length 6 when find 10 limit', function() {
    const results = popopoint.findPointByDistance({
      latitude: 25.045358, longitude: 121.506087
    }, null, 10);

    expect(results.length).to.equal(6);
    expect(_.minBy(results, 'distance')).to.equal(results[0]);
  });

  it('find 300 distance', function() {
    const results = popopoint.findPointByDistance({
      latitude: 25.045358, longitude: 121.506087
    }, 300);

    expect(results.length).to.equal(4);
    expect(_.maxBy(results, 'distance').distance).to.be.below(300);
  });

  it('should get length 6 when find 400 distance', function() {
    const results = popopoint.findPointByDistance({
      latitude: 25.045358, longitude: 121.506087
    }, 400);

    expect(results.length).to.equal(6);
    expect(_.maxBy(results, 'distance').distance).to.be.below(400);
  });

  it('should get length 2 when find 90 distance & 4 limit', function() {
    const results = popopoint.findPointByDistance({
      latitude: 25.045358, longitude: 121.506087
    }, 90, 4);

    expect(results.length).to.equal(2);
    expect(_.maxBy(results, 'distance').distance).to.be.below(90);
  });
});

describe('hasService', function() {
  it('has service', function() {
    expect(popopoint.hasService({
      latitude: 25.043774, longitude: 121.504957
    })).to.be.ok;
  });

  it('no service when point in restriction', function() {
    expect(popopoint.hasService({
      latitude: 25.043473, longitude: 121.507242
    })).to.not.be.ok;
  });

  it('no service when point in outside', function() {
    expect(popopoint.hasService({
      latitude: 25.045864, longitude: 121.505472
    })).to.not.be.ok;
  });
});

describe('getServicePoint', function() {
  it('get single point when point in free zone', function() {
    const results = popopoint.getServicePoint({
      latitude: 25.043774, longitude: 121.504957
    });

    expect(results.length).to.equal(1);
    expect(results[0].latitude).to.equal(25.043774);
    expect(results[0].longitude).to.equal(121.504957);
  });

  it('get multi-point when point in restriction', function() {
    const results = popopoint.getServicePoint({
      latitude: 25.044262, longitude: 121.506390
    });

    expect(results.length).to.be.above(1);
    expect(results[0].latitude).to.not.equal(25.043774);
    expect(results[0].longitude).to.not.equal(121.504957);
    expect(results[0].distance).to.be.above(1);
  });

  it('no results when point in outside', function() {
    const results = popopoint.getServicePoint({
      latitude: 25.041725, longitude: 121.543703
    });

    expect(results.length).to.equal(0);
  });
});
