/**
========================================================================================================
  Private
========================================================================================================
**/

var path = require('path');
var dir = require('./dir.js');
var ext = require( path.join(dir.CONFIG, 'ext.js') );
/**
========================================================================================================
  Exports
========================================================================================================
**/

//Server
exports.DOMAIN = "localhost";
exports.PORT_DEV = 8080;
exports.PORT_INTEG = 8080;
exports.PORT_STAG = 8080;
exports.PORT_PROD = 80;

//APIs Keys
exports.API_KEY_SKYSCANNER = "sk564329123559689834443338426555"
