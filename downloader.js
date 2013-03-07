var request = require('request');
var fs = require('fs');
var toGeoJSONStream = require('./to-geojson');
var AdmZip = require('adm-zip');
var ZipFile = require('adm-zip/zipFile');

// stream to parse csv

// stream to 

// stream to save data into postgres



function nt(){
	var data = {
		'action': 'true',
		'Mines': 'Mines',
		'Mines_shp': 'geo_mines_shp.zip',
		'Mineral Exploration Licences': 'Mineral Exploration Licences',
		'Mineral_Exploration_Licences_tab': 'el_data.zip',
		'Petroleum Exploration Permits': 'Petroleum Exploration Permits',
		'Petroleum_Exploration_Permits_tab': 'pet_data.zip',
		'Mining Licences': 'Mining Licences',
		'Mining_Licences_tab': 'ten_data.zip'
	};
	var r = request({
		url: 'http://geoscience.nt.gov.au/GeosambaU/strike_gs_webclient/downloads.php',
		method: 'POST',
		followRedirect: true,
		followAllRedirects: true,
		encoding: null,
		headers: {
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			'Accept-Encoding': 'gzip,deflate,sdch',
			'Referer': 'http://geoscience.nt.gov.au/GeosambaU/strike_gs_webclient/panel_new.aspx',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.152 Safari/537.22'
		},
		form: data
	}, function(err, res, body){
		var download = new ZipFile(body);
		var geoMines = download.getEntry('geo_mines_shp.zip');
		toGeoJSONStream.processMiningShapeFiles(new ZipFile(geoMines.getData()), function(err, json){
			console.error("complete!");
			console.error(json);
		});
	});
}

nt();
