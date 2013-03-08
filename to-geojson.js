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

AdmZip.prototype.fixEntry = function(entryName, newEntryName){
	_zip.fixEntry(entryName, newEntryName);
};

exports.processMiningShapeFiles = function(zipFile, cb){
	//var newZipFile = new ZipFile();

	var shpFiles = ['NT_Mines.dbf', 'NT_Mines.prj', 'NT_Mines.sbn','NT_Mines.sbx', 'NT_Mines.shp', 'NT_Mines.shx'];
	var gzipData;
	/*shpFiles.forEach(function(file){
		var entry = zipFile.getEntry('Shp/' + file);
		console.error("setting entry: " + file + " with " + entry.toString());
		var newEntry = new ZipEntry();
		newEntry.entryName = file;
		newEntry.header.time = new Date();
		newEntry.comment = "redone " + file;
		var data = entry.getData();
		console.error(data);
		newEntry.setData(data);
		if (file.match(/shp/)){
			console.error("setting entry: " + file + " with " + newEntry.toString());
		}
		newZipFile.setEntry(newEntry);
	});*/
	shpFiles.forEach(function(file){
		zipFile.fixEntry('Shp/' + file, file);
	});
	var stream = fs.createWriteStream('data/redone.zip');
	stream.on('end', function(){
		cb(null, "done");
		/*
		gzipData = new BufferedStream();

		toJSON(gzipData).pipe(es.wait(function(err, json){
			console.error("got this json for mining:");
			console.error(json);
			cb(null, json);
		}));
		gzipData.end(zipFile.toBuffer());
		*/
	});


	stream.end(zipFile.toBuffer());
	

	/*
	gzipData = new BufferedStream();

	toJSON(gzipData).pipe(es.wait(function(err, json){
		console.error("got this json for mining:");
		console.error(json);
		cb(null, json);
	}));
	gzipData.end(newZipFile.toBuffer());
	*/
};