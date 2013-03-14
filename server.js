var express = require('express');
var app = express();
var _ = require('lodash');
var db = require('./db');
var features = require('./features');

var cors = function(req, res, next) {
  res.header('Cache-Control', 'max-age=300');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Expose-Headers', 'If-None-Match,Etag');
  res.header('Access-Control-Max-Age', '36000');
  next();
};

app.configure(function(){
  app.use(express.responseTime()); 
  app.use(cors);
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.errorHandler()); 
});

app.get('/api/features', function(req, res, next){
  features.find(function(err, collection){
    if (err) return next(err);
    res.json(collection);
  });
});

module.exports = app;

if (!module.parent){
  server = app.listen(process.env.PORT || 8080);
  server.on('close', function(){
    db.end();
  });
}