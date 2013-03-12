var geojsonify = require('../geojsonify');
var test = require('tap').test;
var path = require('path');
var util = require('util');

test("geojsonify.toJson", function(t){
	var zip = path.join(__dirname, 'el_data.zip');
	geojsonify.toJson(zip, function(err, jsonForAllFiles){
		t.ok(!err, util.inspect(err));
		t.equal(jsonForAllFiles.length, 6);
		t.equal(jsonForAllFiles[0].features[0].geometry.type, 'Polygon');
		t.end();
	});
});