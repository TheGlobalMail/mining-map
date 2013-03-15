process.env.NODE_ENV = 'test';
var test = require("tap").test;
var downloader = require('../downloaders/sa');
var path = require('path');
var server = require('./server');
var Seq = require('seq');
var helper = require('./helper');
var util = require('util');
var db = require('../db');

process.env.SA_URL = 'http://localhost:' + server.port + '/sa_data.zip';
process.env.CONVERTED_DIR = path.join(__dirname, '/converted/');

test("Downloading of SA data and storing in database", function(t){
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
			var done = this;
			var query = "select count(*) from features where state = 'sa'";
			db.query(query, function(err, result){
				t.equal(result.rows[0].count, 19);
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
