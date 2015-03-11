var _parse = require('../parse/');
var messagesLog = require('./messagesLog');
var _utils = require('../utils');
var _subscribe = _utils.subscribe;


function traceInit() {
	for (var i = 0; i < messagesLog.length; i++) {
		var messageNew = messagesLog[i];
		messageNew[4] = _parse.short(messageNew[2]) || false;
	}
}

module.exports = traceInit;


_subscribe('settingsChange', function(key/*, value*/) {
	if (key === 'heroNameStart') {
		traceInit();
	}
});

