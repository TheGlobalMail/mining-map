var es = require('event-stream');
var toJSON = require('shp2json');
var AdmZip = require('adm-zip');
var ZipFile = require('adm-zip/zipFile');
var ZipEntry = require('adm-zip/zipEntry');
var fs = require('fs');
var BufferedStream = require('bufferedstream');

exports.createStream = function(){
	es.map(function(entry, cb){
	console.error("got data!" + entry.path);
	var fileName = entry.path;
	toJSON(entry).pipe(es.join(function(err, json){
		if (entry.path === 'geo_mines_shp.zip'){
			console.error('starting on zip file');
			processMiningShapeFiles(new ZipFile(entry), cb);
		}else{
			console.error("Unknown entry:" + entry.path);
			cb();
		}
	}));
	});
};


exports.processMiningShapeFiles = function(zipFile, cb){
	gzipData = new BufferedStream();

	toJSON(gzipData).pipe(es.wait(function(err, json){
		console.error("got this json for mining:");
		console.error(json);
		cb(null, json);
	}));
	gzipData.end(zipFile.toBuffer());
};