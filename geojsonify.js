var temp = require('temp');
var AdmZip = require('adm-zip');
var glob = require('glob');
var Seq = require('seq');
var path = require('path');
var util = require('util');
var shapefile = require('shapefile');

exports.toJson = function(zipFile, cb){
	var zip = new AdmZip(zipFile);
	exports.toJsonFromZipFile(zip, cb);
};

exports.toJsonFromZipFile = function(zip, cb){
	temp.mkdir('geojsonify', function(err, dirPath){
		zip.extractAllTo(dirPath, true);
		exports.toJsonFromDir(dirPath, cb);
	});
};

exports.toJsonFromDir = function(dirPath, cb){
	var shapeFiles = glob.sync(path.join(dirPath, '**/*.shp'));
	if (!shapeFiles.length) return cb("No shapefiles found in " + dirPath);
	convertShapeFiles(shapeFiles, cb);
};

function convertShapeFiles(shapeFiles, cb){
	Seq(shapeFiles)
		.seqMap(function(file, index){
			var _this = this;
			var object = {
				file: path.basename(file),
				type: "FeatureCollection",
				features: []
			};
			shapefile.readStream(file)
				.on("error", this)
				.on("feature", function(feature) { object.features.push(feature); })
				.on("end", function(){
					_this(null, object);
				});
		})
		.seq(function(){
			cb(null, this.stack);
		})
		.catch(cb);
}
