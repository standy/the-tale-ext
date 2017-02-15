const _towns = module.exports = {};
_towns.init = require('./init');
_towns.mapDataUpdate = require('./mapDataUpdate');
_towns.showMapDialogById = require('./showMapDialogById');
_towns.townQuestUpdate = require('./townQuestUpdate');
_towns.townParams = require('./townParams');
_towns.mapData = require('./mapData');

const $ = require('jquery');


const utils = require('../../utils/');
const _elements = utils.elements;
const _subscribe = utils.subscribe;



const $townsContent = _elements.getTabInner('towns');
$('body')
	.on('click.town', '.town', function() {
		console.log('click .town');
		if (!_towns.mapData) return;
		const id = $(this).data('place-id');
		_towns.showMapDialogById(id);
	})
	.on('click.town', '.reload', function() {
		const map_version = utils.map_version;
		if (map_version) {
			_towns.mapDataUpdate(map_version)
				.done(function(mapData) {
					_towns.townParams(mapData);
				});
		}
	});


$townsContent.html('<span class="link-ajax pull-right reload glyphicon glyphicon-repeat"></span>');


_subscribe('preload', function() {
	const map_version = utils.map_version;
	if (!map_version) return;
	_towns.mapDataUpdate(map_version)
		.done(function() {
			_towns.init();
		});
});



