var $ = require('jquery');


function townParams(mapData) {
	var places = mapData.places;
	for (var i in places) if (places.hasOwnProperty(i)) {
		(function(placeIndex) {
			var place = places[placeIndex];
			requestPlace(place.pos.x, place.pos.y)
				.done(function(html) {
					var parsed = parsePlaceHtml(html);
					var $placeRow = $('.place-row[data-place-id="' + placeIndex + '"]');
					parsed.cityParams.forEach(function(item) {
						var val = item.value;
						if (val < 100) val = '&nbsp;' + val;
						$placeRow.children('[data-city-param="' + item.name + '"]').html(val);
					});
				});
		})(i);
	}
}


function parsePlaceHtml(html) {
	var $info = $(html);

	var cityParams = [];
	var $cityParamsRows = $info.find('#pgf-cell-place-parameters').find('tr').slice(1);
	$cityParamsRows.each(function() {
		var $row = $(this);
		var paramName = $.trim($row.children('th').first().text());
		var valueText = $row.children('td').first().text();
		var value = parseFloat(valueText);
		cityParams.push({
			name: paramName,
			value: value
		});
	});
	return {
		cityParams: cityParams
	};
}

function requestPlace(x, y) {
	return $.ajax({
		url: '/game/map/cell-info?x=' + x + '&y=' + y + '&_=' + (+new Date()),
		method: 'get',
		dataType: 'html'
	});
}

module.exports = townParams;
