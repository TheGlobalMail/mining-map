process.env.NODE_ENV = 'test';
var test = require("tap").test;
var downloader = require('../downloaders/qld');
var path = require('path');
var server = require('./server');
var Seq = require('seq');
var helper = require('./helper');
var util = require('util');

process.env.QLD_URL = 'http://localhost:' + server.port + '/qld_data.tar';
process.env.CONVERTED_DIR = path.join(__dirname, '/converted/');

test("Downloading of NT data and storing in database", function(t){
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
			// check database
			t.ok(true);
			testServer.close();
			testServer.on('close', function(){ t.end(); });
		})
		.catch(function(err){
			t.ok(!err, err);
			testServer.close();
			testServer.on('close', function(){ t.end(); });
		});
});