process.env.NODE_ENV = 'test';
var test = require("tap").test;
var downloader = require('../downloaders/wa');
var path = require('path');
var server = require('./server');
var Seq = require('seq');
var helper = require('./helper');
var util = require('util');
var db = require('../db');

// XXX use tas data as wa data takes too long to import!
//process.env.WA_URL = 'http://localhost:' + server.port + '/wa_data.zip';
process.env.WA_URL = 'http://localhost:' + server.port + '/tas_data.zip';

process.env.CONVERTED_DIR = path.join(__dirname, '/converted/');

test("Downloading of WA data and storing in database", function(t){
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
			var query = "select count(*) as wa_features from features where state = 'wa'";
			var done = this;
			db.query(query, function(err, result){
				t.equal(result.rows[0].wa_features, 875);
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