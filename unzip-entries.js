var stream = require('stream')
var util = require('util')
   
module.exports = function() {
  stream.Stream.call(this)
  xhr.onreadystatechange = function () { me.handle() }
  xhr.send(null)
}

util.inherits(XHRStream, stream.Stream)