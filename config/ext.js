/**
========================================================================================================
  Private
========================================================================================================
**/



/**
========================================================================================================
  Exports
========================================================================================================
**/

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

module.exports = {
  util: require('util'),
  http: require('http'),
  url: require('url'),
  express: require('express'),
  async: require('async'),
  fs: require('fs'),
  bodyParser: require("body-parser"),
  request: require("request"),
  //os: require('os'),
  unirest: require('unirest'),
  isEmptyObject: isEmptyObject
  //formidable: require('formidable')
};
