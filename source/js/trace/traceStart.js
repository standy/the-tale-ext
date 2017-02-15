const $ = require('jquery');
const pgf = require('pgf');

const traceData = require('./traceData');

function traceStart() {
	$(document).bind(pgf.game.events.DATA_REFRESHED + '.ext-trace', function(e, game_data) {
		traceData(game_data);
	});
}

module.exports = traceStart;
