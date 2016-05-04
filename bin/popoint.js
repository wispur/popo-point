#!/usr/bin/env node

var program = require('commander');
var path = require('path');

var PoPoPoint = require('../build/index');

function getJson(json) {
  return require(path.join(process.cwd(), json));
}

function getLatLng(latlng) {
  latlng = latlng.split(',');
  return { latitude: parseFloat(latlng[0]), longitude: parseFloat(latlng[1]) };
}

program
  .version('1.0.0')
  .usage('<cmd> [options] <json> <latitude>,<longitude>');

program
  .command('service <json> <latitude>,<longitude>')
  .action(function (json, latlng) {
    const data = getJson(json);
    const popo = new PoPoPoint(data.inside, data.restriction, data.point);
    console.log(JSON.stringify({
      reply: popo.hasService(getLatLng(latlng)) ? 1 : 0,
    }));
  });

program
  .command('inside <json> <latitude>,<longitude>')
  .action(function (json, latlng) {
    const data = getJson(json);
    const popo = new PoPoPoint(data.inside, data.restriction, data.point);
    console.log(JSON.stringify({
      reply: popo.isPointInside(getLatLng(latlng)) ? 1 : 0,
    }));
  });

program
  .command('freezone <json> <latitude>,<longitude>')
  .action(function (json, latlng) {
    const data = getJson(json);
    const popo = new PoPoPoint(data.inside, data.restriction, data.point);
    console.log(JSON.stringify({
      reply: popo.isFreeZone(getLatLng(latlng)) ? 1 : 0,
    }));
  });

program
  .command('distance <json> <latitude>,<longitude>')
  .action(function (json, latlng) {
    const data = getJson(json);
    const popo = new PoPoPoint(data.inside, data.restriction, data.point);
    const results = popo.findPointByDistance(getLatLng(latlng));
    console.log(JSON.stringify({
      reply: results.length ? 1 : 0,
      results: results
    }));
  });

program
  .command('point <json> <latitude>,<longitude>')
  .action(function (json, latlng) {
    const data = getJson(json);
    const popo = new PoPoPoint(data.inside, data.restriction, data.point);
    const results = popo.getServicePoint(getLatLng(latlng));
    
    console.log(JSON.stringify({
      reply: results.length ? 1 : 0,
      results: results
    }));
  });

program.parse(process.argv);
