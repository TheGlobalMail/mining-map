process.env.NODE_ENV = 'test';
var test = require("tap").test;
var downloader = require('../downloaders/tas');
var path = require('path');
var server = require('./server');
var Seq = require('seq');
var helper = require('./helper');
var util = require('util');
var db = require('../db');

process.env.TAS_URL = 'http://localhost:' + server.port + '/tas_data.zip';
process.env.CONVERTED_DIR = path.join(__dirname, '/converted/');

test("Downloading of TAS data and storing in database", function(t){
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
		.seq(downloader.download, Seq)
		.seq(function(){
			var query = "select count(*) as state_features from features where state = 'tas'";
			var done = this;
			db.query(query, function(err, result){
				t.equal(result.rows[0].state_features, 875);
				done();
			});
		})
		.seq(function(){
			testServer.close();
			testServer.on('close', function(){ t.end(); });
		})
		.catch(function(err){
			t.ok(!err, err);
			testServer.close();
			testServer.on('close', function(){ t.end(); });
		});
});