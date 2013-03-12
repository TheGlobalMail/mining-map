process.env.NODE_ENV = 'test';
var test = require('tap').test;
var helper = require('./helper');
var db = require('../db');
var Seq = require('seq');

test("Upserts upsert", function(t){
	Seq()
		.seq(function(){
			helper.loadSchema(this);
		})
		.seq(function(){
			db.upsert('datafiles', 'nsw-geomines', {state: 'nsw', file: 'geomines.zip', checksum: '1'}, this);
		})
		.seq(function(){
			db.upsert('datafiles', 'nsw-geomines', {state: 'vic', file: 'geomines.zip', checksum: '1'}, this);
		})
		.seq(function(){
			db.selectById('datafiles', 'nsw-geomines', this);
		})
		.seq(function(dataFile){
			t.equal('vic', dataFile.state);
			t.end();
		})
		.catch(function(err){
			t.ok(!err, "No error should occur: " + err);
			t.end();
		});
});