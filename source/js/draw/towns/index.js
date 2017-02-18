import $ from 'jquery';
import {init} from './init';
import {mapDataUpdate} from './mapDataUpdate';
import {showMapDialogById} from './showMapDialogById';
import {townQuestUpdate} from './townQuestUpdate';
import {townParams} from './townParams';
import {mapData} from './mapData';
import {elements} from '../../utils/elements';
import {utils} from '../../utils/initUtils';
import {subscribe} from '../../utils/pubsub';



const $townsContent = elements.getTabInner('towns');
$('body')
	.on('click.town', '.town', function() {
		console.log('click .town');
		if (!mapData) return;
		const id = $(this).data('place-id');
		showMapDialogById(id);
	})
	.on('click.town', '.reload', function() {
		const map_version = utils.map_version;
		if (map_version) {
			mapDataUpdate(map_version)
				.done(function(mapData) {
					townParams(mapData);
				});
		}
	});


$townsContent.html('<span class="link-ajax pull-right reload glyphicon glyphicon-repeat"></span>');


subscribe('preload', function() {
	const map_version = utils.map_version;
	if (!map_version) return;
	mapDataUpdate(map_version)
		.done(function() {
			init();
		});
});


subscribe('questUpdate', function(quest) {
	townQuestUpdate(quest);
});
