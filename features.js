var db = require('./db');
var _ = require('lodash');
var crypto = require('crypto');
var path = require('path');
var async = require('async');


exports.extractFeatures = function(state, collection, cb){
	var featureType = lookupFeatureType(collection.file);
	var features = _.map(collection.features, function(feature){
		// Add extra meta data to the properties of the feature
		feature.properties.state = state;
		feature.properties.importedAt = new Date();
		feature.properties.featureType = featureType;
		return feature;
	});
	cb(null, features);
};

exports.storeCollectionInDB = function(collection, cb){
	var done = cb;
	console.error('storying ' + collection.length);
	async.forEachSeries(collection, storeFeatureInDB, function(err){
		// Need a little delay or else connection pool freaks out. 
		// Listening for drain in db.js would be nicer
		setTimeout(function(err){
			console.error("completed: " + collection.length);
			done(err);
		}, process.env.NODE_ENV === 'test' ? 200 : 30000);
	});
};

function storeFeatureInDB(feature, cb){
	// only store features with geometry??
	if (!feature.geometry || !feature.geometry.coordinates || !feature.geometry.coordinates.length){
		return cb();
	}
	var id = feature.properties.state + '-' + feature.properties.featureType + '-' +
		crypto.createHash('md5').update(feature.geometry.coordinates.toString()).digest('hex');
	var values = {
		state: feature.properties.state,
		type: feature.properties.featureType,
		geometry: JSON.stringify(feature.geometry),
		properties: JSON.stringify(feature.properties)
	};
	db.upsert('features', id, values, cb);
}

exports.find = function(cb){
	var sql = "select properties, geometry from features where feat";
	db.query(sql, [], function(err, result){
		if (err) return cb(err);
		var collection = { "type": "FeatureCollection"};
		collection.features = _.map(result.rows, function(row){
			var feature = {};
			feature.type = 'Feature';
			feature.properties = JSON.parse(row.properties);
			feature.geometry = JSON.parse(row.geometry);
			return feature;
		});
		cb(null, collection);
	});
};

function lookupFeatureType(file){
	return path.basename(file).replace(/\.shp$/, '').toLowerCase();
}