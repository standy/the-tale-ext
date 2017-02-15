const $ = require('jquery');
const pgf = require('pgf');

function traceStop() {
	$(document).unbind(pgf.game.events.DATA_REFRESHED + '.ext-trace');
}

module.exports = traceStop;
