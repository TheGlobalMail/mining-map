var request = require('request');
var fs = require('fs');
var AdmZip = require('adm-zip');
var path = require('path');
var _ = require('lodash');
var Seq = require('seq');
var geojsonify = require('../geojsonify');
var util = require('util');
var crypto = require('crypto');
var async = require('async');
var features = require('../features');

exports.download = function (cb){
	var throttle = 3; // number of things to do at once
	Seq()
		// Download zip file and exract each file (5 or so zip files) into /converted/nt
		.seq(function(){
			var _this = this;
			exports.downloadDataFiles(function(err, zipFiles){
				if (err) return _this(err);
				// hmm.. better way to do this??
				_this.apply(null, [null].concat(zipFiles));
			});
		})
		// Take each of the zip files (containing shape files) and convert to geojson
		.parMap(throttle, function(zipShapeFile){
			var _this = this;
			geojsonify.toJson(zipShapeFile, function(err, collections){
				_this(null, collections);
			});
		})
		// Flatten out the list of collections
		.flatten()
		// Filter out any empty collections
		.parFilter(throttle, function(collection){ this(null, !!collection); })
		// Extract all the features from the collections and add some extra metadata
		.seqMap(function(collection){
			features.extractFeatures('nt', collection, this);
		})
		// Store each feature in the database
		seqMap(function(collection){
			features.storeCollectionInDB(collection, this);
		})
		// We're done! call callback.
		.seq(cb, null)
		.catch(cb);
};

exports.downloadDataFiles = function(cb){
	requestShpFiles(function(err, res, body){
		if (err) return cb(err);
		var files = [];
		var convertedPath = process.env.CONVERTED_DIR || path.join(__dirname, '/converted/nt/');
		var download = new AdmZip(body);
		download.extractAllTo(convertedPath, true);
		var zipFiles = _.map(download.getEntries(), function(entry){
			return path.join(convertedPath, entry.entryName);
		});
		cb(null, zipFiles);
	});
};

function requestShpFiles(cb){
	var url = process.env.NT_URL || 'http://geoscience.nt.gov.au/GeosambaU/strike_gs_webclient/downloads.php';
	var post = {
		'action': 'true',
		'Mines': 'Mines',
		'Mines_shp': 'geo_mines_shp.zip',
		'Mineral Exploration Licences': 'Mineral Exploration Licences',
		'Mineral_Exploration_Licences_tab': 'el_data.zip',
		'Extractive Mineral Licences': 'Extractive Mineral Licences',
		'Extractive_Mineral_Licences_tab': 'emel_data.zip',
		'Geothermal Exploration Permits': 'Geothermal Exploration Permits',
		'Geothermal_Exploration_Permits_tab': 'gep_data.zip',
		'Offshore Mineral Exploration': 'Offshore Mineral Exploration',
		'Offshore_Mineral_Exploration_tab': 'mel_data.zip',
		'Petroleum Exploration Permits': 'Petroleum Exploration Permits',
		'Petroleum_Exploration_Permits_tab': 'pet_data.zip',
		'Mining Licences': 'Mining Licences',
		'Mining_Licences_tab': 'ten_data.zip',
		'Historic Mineral Titles': 'Historic Mineral Titles',
		'Historic_Mineral_Titles_shp': 'ten_historic_shp.zip',
		'Historic Petroleum Titles': 'Historic Petroleum Titles',
		'Historic_Petroleum_Titles_shp': 'ten_petro_hist_shp.zip'
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