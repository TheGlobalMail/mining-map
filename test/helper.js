var db = require('../db');
var schemaLoaded = false;
var fs = require('fs');

exports.loadSchema = function(cb){
	var query = fs.readFileSync(__dirname + '/../db/schema.sql').toString();
	schemaLoaded = true;
	db.query(query, null, cb);
};