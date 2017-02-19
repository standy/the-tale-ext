import $ from 'jquery';


export function townParams(mapData) {
	const places = mapData.places;
	for (const i in places) {
		if (places.hasOwnProperty(i)) {
			((placeIndex => {
				const place = places[placeIndex];
				requestPlace(place.pos.x, place.pos.y)
					.done(html => {
						const parsed = parsePlaceHtml(html);
						const $placeRow = $(`.place-row[data-place-id="${placeIndex}"]`);
						parsed.cityParams.forEach(item => {
							let val = item.value;
							if (val < 100) val = `&nbsp;${val}`;
							$placeRow.children(`[data-city-param="${item.name}"]`).html(val);
						});
					});
			}))(i);
		}
	}
}


function parsePlaceHtml(html) {
	const $info = $(html);

	const cityParams = [];
	const $cityParamsRows = $info.find('#pgf-cell-place-parameters').find('tr').slice(1);
	$cityParamsRows.each(function() {
		const $row = $(this);
		const paramName = $.trim($row.children('th').first().text());
		const valueText = $row.children('td').first().text();
		const value = parseFloat(valueText);
		cityParams.push({
			name: paramName,
			value: value,
		});
	});
	return {
		cityParams: cityParams,
	};
}

function requestPlace(x, y) {
	return $.ajax({
		url: `/game/map/cell-info?x=${x}&y=${y}&_=${+new Date()}`,
		method: 'get',
		dataType: 'html',
	});
}
