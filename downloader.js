var nt = require('./downloaders/nt.js');
var tas = require('./downloaders/tas.js');
var qld = require('./downloaders/qld.js');
var Seq = require('seq');

//Seq([nt, tas, qld])
Seq([qld])
	.seqEach(function(downloader){
		downloader.download(this);
	})
	.seq(function(){
		console.error('OK');
	})
	.catch(function(err){
		throw err;
	});