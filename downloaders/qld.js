var request = require('request');
var fs = require('fs');
var AdmZip = require('adm-zip');
var path = require('path');
var _ = require('lodash');
var Seq = require('seq');
var geojsonify = require('../geojsonify');
var util = require('util');
var async = require('async');
var features = require('../features');
var tar = require('tar');
var mkdirp = require('mkdirp');

exports.download = function (cb){
	var extractPath = path.join(process.env.CONVERTED_DIR, 'qld');
	Seq()
		// Crate extract dir if doesn't exist
		.seq(mkdirp, extractPath, Seq)
		// Download tar file and extract to extractionPath
		.seq(downloadDataFile, extractPath, Seq)
		// Jsonify all the shape files in the extracted path
		.seq(geojsonify.toJsonFromDir, extractPath, Seq)
		// Extract features from the one collection
		.seq(function(collection){
			features.extractFeatures('qld', collection[0], this);
		})
		// Store each feature in the database
		.seqMap(function(collection){
			features.storeCollectionInDB(collection, this);
		})
		// We're done! call callback.
		.seq(cb, null)
		.catch(cb);
};

function downloadDataFile(extractTo, cb){
	var url = process.env.QLD_URL || 'https://webgis.dme.qld.gov.au/webgis/webqmin/shapes/qmin_all.tar';
	var options = {
		url: url,
		followRedirect: true,
		followAllRedirects: true,
		encoding: null,
		headers: {
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			'Accept-Encoding': 'gzip,deflate,sdch',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.152 Safari/537.22'
		}
	};

	request(options)
		.pipe(tar.Extract({ path: extractTo}))
		.on('error', cb)
		.on('end', cb);
};