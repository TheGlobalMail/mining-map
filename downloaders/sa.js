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

exports.download = function(cb){
	var state = 'sa';
	Seq()
		// Download zip file and return a ZipFile object
		.seq(downloadDataFile, Seq)
		// Take each of the zip files (containing shape files) and convert to geojson
		.seq(function(zipShapeFile){
			//console.error('found:');
			//console.error(_.map(zipShapeFile.getEntries(), function(e){ return e.entryName; }));
			var _this = this;
			geojsonify.toJsonFromZipFile(zipShapeFile, function(err, collections){
				_this(null, collections);
			});
		})
		.flatten()
		// Extract features from each collection
		.seqMap(function(collection){
			features.extractFeatures(state, collection, this);
		})
		// Store each feature in the database
		.seqMap(function(collection){
			features.storeCollectionInDB(collection, this);
		})
		// We're done! call callback.
		.seq(cb, null)
		.catch(cb);
};

function downloadDataFile(cb){
	requestDataFile(function(err, res, body){
		if (err) return cb(err);
		cb(null, new AdmZip(body));
	});
}

function requestDataFile(cb){
	var url = process.env.SA_URL || 'https://sarig.pir.sa.gov.au/Map/Download/Download/';

	var post = {
		'DownloadFile.Format': 'SHP',
		'DownloadFile.Projection': '',
		'DownloadFile.FileNames': 'Major Mines',
		'DownloadFile.MultiZip': 'false',
		'DownloadFile.DownloadName': 'Major Mines',
		'DownloadFile.ImageDownloadFlag': 'N'
	};
	var options = {
		url: url,
		method: 'POST',
		followRedirect: true,
		followAllRedirects: true,
		encoding: null,
		headers: {
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			'Accept-Encoding': 'gzip,deflate,sdch',
			'Referer': 'http://geoscience.nt.gov.au/GeosambaU/strike_gs_webclient/panel_new.aspx',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.152 Safari/537.22'
		},
		form: post
	};
	var r = request(options, cb);
}