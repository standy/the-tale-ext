const _parse = require('../parse/');
const messagesLog = require('./messagesLog');
const _utils = require('../utils');
const _subscribe = _utils.subscribe;


function traceInit() {
	for (let i = 0; i < messagesLog.length; i++) {
		const messageNew = messagesLog[i];
		messageNew[4] = _parse.short(messageNew[2]) || false;
	}
}

module.exports = traceInit;


_subscribe('settingsChange', function(key/*, value*/) {
	if (key === 'heroNameStart') {
		traceInit();
	}
});

