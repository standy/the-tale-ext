var $ = require('jquery');
var pgf = require('pgf');

var traceData = require('./traceData');

function traceStart() {
	$(document).bind(pgf.game.events.DATA_REFRESHED + '.ext-trace', function(e, game_data) {
		traceData(game_data);
	});
}

module.exports = traceStart;
