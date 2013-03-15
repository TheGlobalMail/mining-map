var nt = require('./downloaders/nt.js');
var tas = require('./downloaders/tas.js');
var qld = require('./downloaders/qld.js');
var wa = require('./downloaders/wa.js');
var sa = require('./downloaders/sa.js');
var Seq = require('seq');

Seq([nt, tas, qld, wa, sa])
//Seq([sa])
	.seqEach(function(downloader){
		downloader.download(this);
	})
	.seq(function(){
		console.error('OK');
	})
	.catch(function(err){
		throw err;
	});
