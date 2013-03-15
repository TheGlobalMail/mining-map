var request = require('request');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Seq = require('seq');
var geojsonify = require('../geojsonify');
var util = require('util');
var downloadUtils = require('./utils');
var async = require('async');
var features = require('../features');

// WA data is available in a series of zip files
exports.download = function (cb){
	var url = process.env.WA_URL || 'http://geodownloads.dmp.wa.gov.au/datacentre/download/mineral_inf/tenements.zip';
	downloadUtils.downloadFromZipFile('wa', url, cb);
};