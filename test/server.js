var connect = require('connect');
var http = require('http');

exports.port = 9124;

exports.createServer = function(cb){
	var app = connect();
	var static = connect.static(__dirname);
	app.use(function(req, res, next){
		req.method = 'GET';
		static(req, res, next);
	});
	var server = http.createServer(app);
	server.listen(exports.port, function(err){
		cb(err, server);
	});
};