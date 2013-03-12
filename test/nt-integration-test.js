process.env.NODE_ENV = 'test';
var test = require("tap").test;
var downloader = require('../downloader');
var path = require('path');
var server = require('./server');
var Seq = require('seq');
var helper = require('./helper');
var util = require('util');

process.env.NT_URL = 'http://localhost:' + server.port + '/nt_data.zip';
process.env.CONVERTED_DIR = path.join(__dirname, '/converted/');

test("Downloading of NT shape file", function(t){

	server.createServer(function(err, testServer){
		downloader.downloadNTDataFiles(function(err, shpFiles){
			t.ok(!err, "Error should be: " + err);
			t.equal(path.basename(shpFiles[0]), 'el_data.zip');
			testServer.close();
			testServer.on('close', function(){ t.end(); });
		});
	});
});

test("Downloading of NT shape file", function(t){
	var testServer;

	Seq()
		.par(function(){
			_this = this;
			server.createServer(function(err, _testServer){
				if (err) return Seq(err);
				testServer = _testServer;
				_this();
			});
		})
		.par(helper.loadSchema, Seq)
		.seq(downloader.downloadNT, Seq)
		// do it again, why not
		//.seq(downloader.downloadNT, Seq)
		// Check the feature count
		// Check the first featue
		.seq(function(){

			/*
			t.equal(features.length, 20178);
			t.equal(features[0].properties.state, 'nt');
			t.equal(features[0].properties.featureType, 'nt_mines');
			t.equal(features[0].properties.MAP100K, 'Mckinlay River');
			t.equal(features[0].geometry.type, 'Point');
			*/
			testServer.close();
			testServer.on('close', function(){ t.end(); });
		})
		.catch(function(err){
			t.ok(!err, err);
			testServer.close();
			testServer.on('close', function(){ t.end(); });
		});
});