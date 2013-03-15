var utils = require('./utils');

// All tasmania data is in one zip file
exports.download = function (cb){
	var url = process.env.TAS_URL || 'http://www.mrt.tas.gov.au/mrtdoc/public_files/tas_tenements.zip';
	utils.downloadFromZipFile('tas', url, cb);
};