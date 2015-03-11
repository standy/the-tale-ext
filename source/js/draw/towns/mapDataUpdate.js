var $ = require('jquery');
var utils = require('../../utils/');
var _publish = utils.publish;


var mapData = require('./mapData');

function mapDataUpdate(map_version) {
	return $.ajax({
		url: '/dcont/map/region-' + map_version + '.js',
		dataType: 'json',
		type: 'get'
	})
		.done(function(map_data) {
			for (var key in mapData) if (mapData.hasOwnProperty(key)) {
				delete mapData[key];
			}
			$.extend(mapData, map_data);
			_publish('townsInit', map_data);
		});
}


module.exports = mapDataUpdate;
