var $ = require('jquery');
var utils = require('../../utils/');
var _subscribe = utils.subscribe;
var _const = utils.const;
var _elements = utils.elements;
var _log = utils.log;

var mapData = require('./mapData');

var $townsContent = _elements.getTabInner('towns');


var init = function() {
	var places = mapData.places;
	var html = '';
	for (var i in places) if (places.hasOwnProperty(i)) {
		var place = places[i];
		html +=
			'<tr class="place-row" data-place-id="' + place.id + '">' +
				'<td class="size"><span class="badge">' + place.size + '</span></td>' +
				'<td>' +
					'<span class="link-ajax town" data-place-id="' + place.id + '">' + place.name + '</span> ' +
					'<span class="quest"></span>' +
				'</td>' +
//						'<td data-city-param="1" class="production"></td>' +
				'<td data-city-param="размер экономики"></td>' +
				'<td data-city-param="безопасность"></td>' +
				'<td data-city-param="транспорт"></td>' +
				'<td data-city-param="свобода"></td>' +
			'</tr>';
	}
	html =
		'<table class="table table-towns table-noborder table-hover-dark table-condensed">' +
			'<thead>' +
				'<th class="size" title="Размер города">Р</th>' +
				'<th>Название</th>' +
//						'<th>Произв.</th>' +
				'<th title="Размер экономики">Э</th>' +
				'<th title="Безопасность">Безоп.</th>' +
				'<th title="Транспорт">Транс.</th>' +
				'<th title="Свобода">Своб.</th>' +
			'</thead>' +
			'<tbody>' +
				html +
			'</tbody>' +
		'</table>';
	var $table = $(html).appendTo($townsContent);
	window.tables.makeSortable($table);
};

init.isInited = true;

module.exports = init;

