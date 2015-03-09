var $ = require('jquery');
var pgf = require('pgf');

function traceStop() {
	$(document).unbind(pgf.game.events.DATA_REFRESHED + '.ext-trace');
}

module.exports = traceStop;
