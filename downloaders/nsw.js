var Seq = require('seq');
var utils = require('./utils');
var layers = ['coalbore', 'coalapp', 'coalttl'];
var url = process.env.NSW_URL || 'http://minview.minerals.nsw.gov.au/mv2web/mv2?cmd=FileDownload&xmin=136.92857142857144&ymin=-39.42857142857143&xmax=158.08928571428572&ymax=-26.57142857142857&llist=FILETYPE&file=.FILETYPE,136_9286,-39_4286,158_0893,-26_5714';

// Repeat for each zip file
exports.download = function (cb){
	Seq(layers)
    .seqEach(function(layer){
      var layerUrl = url.replace(/FILETYPE/g, layer)
      console.error('downloading nsw: ' + layerUrl);
	    utils.downloadFromZipFile('nsw', layerUrl, this);
    })
		.seq(cb, null)
		.catch(cb);
};
