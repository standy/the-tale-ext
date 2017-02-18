import $ from 'jquery';


import {mapData} from './mapData';
import {publish} from '../../utils/pubsub';

export function mapDataUpdate(map_version) {
	return $.ajax({
		url: '/game/map/api/region?api_version=0.1&api_client=' + window.API_CLIENT,
		dataType: 'json',
		type: 'get',
	})
		.done(function(map_data) {
			for (const key in mapData) {
				if (mapData.hasOwnProperty(key)) {
					delete mapData[key];
				}
			}
			$.extend(mapData, map_data);
			publish('townsInit', map_data);
		});
}
