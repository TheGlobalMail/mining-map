var pg = require('pg');
var util = require('util');
var _ = require('lodash');

var testTimeout;

exports.connect = function(cb){
  var connection;
  if (process.env.DATABASE_URL){
    connection = process.env.DATABASE_URL;
  }else{
    connection = 'tcp://localhost/mining';
    if (process.env.NODE_ENV){
      connection += '_' + process.env.NODE_ENV;
    }
  }
  if (process.env.NODE_ENV === 'test' && !testTimeout){
    testTimeout = setTimeout(function(){
      pg.end();
    }, 30000);
  }
  pg.connect(connection, cb);
};

exports.query = function(sql, parameters, cb){
  exports.connect(function(err, client, done){
    var callback, params, query;
    if (err) return cb(err);
    if (!cb){
      callback = parameters;
      params = null;
    }else{
      callback = cb;
      params = parameters;
    }
    query = client.query(sql, params, function(err, result){
      done();
      callback(err, result);
    });
  });
};

exports.selectById = function(table, id, cb){
  exports.query('select * from ' + table + " where id = $1", [id], function(err, result){
    if (err) return cb(err);
    if (result.rowCount !== 1) return cb("Unexpected count " + result.rowCount);
    cb(null, result.rows[0]);
  });
};

exports.upsert = function(table, id, values, cb){
  var keys = _.keys(values).sort();
  var valueParams = [];
  var updateFields = [];
  var params = [id];
  keys.forEach(function(key, index){
    var valueIndex = index + 2;
    valueParams.push('cast($' + valueIndex + ' as varchar)');
    updateFields.push(key + " = $" + valueIndex);
    params.push(values[key]);
  });
  exports.connect(function(err, client, done){
    client.query('begin');
    client.query("UPDATE " + table + " SET " + updateFields + " WHERE id = $1;", params);
    var insert = "INSERT INTO " + table + " (id, " + keys.join(', ') + ") " +
      "SELECT cast($1 as varchar), " + valueParams.join(', ') + " WHERE NOT EXISTS " +
      "  (SELECT 1 FROM " + table + " WHERE id = $1);";
    client.query(insert, params, function(err, result){
      if (err){
        done();
        return cb(err);
      }
      client.query('COMMIT');
      done();
      cb();
    });
  });
};