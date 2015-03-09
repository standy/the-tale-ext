var $ = require('jquery');
var utils = require('../../utils/index.js');
var _subscribe = utils.subscribe;
var _elements = utils.elements;
var _settings = utils.settings;
var _log = utils.log;

var htmlMessage = require('./htmlMessage.js');
var htmlLongMessage = require('./htmlLongMessage.js');


function htmlMessages(messages) {
	var html = '';
	for (var i = 0; i < messages.length; i++) {
		var message = messages[i];
//		var m = JSON.stringify(message);  data-m=\''+ m +'\'
		var htmlShortMsg = htmlMessage(message);
		var timestamp = message[0];
		var time = message[1];
		var htmlMsg;
		if (htmlShortMsg) {
			while (messages[i + 1] && messages[i + 1][1] === time) {
				var htmlShortMsg2 = htmlMessage(messages[i + 1]);
				if (!htmlShortMsg2) break;
				htmlShortMsg += htmlShortMsg2;
				i++;
			}
			htmlMsg = '<li data-ts="' + timestamp + '" class="log-record-short">' + htmlShortMsg + '</li>';
		} else {
			var htmlLongMsg = htmlLongMessage(message);
			htmlMsg = '<li data-ts="' + timestamp + '" class="log-record">' + htmlLongMsg + '</li>';
		}
		html = htmlMsg + html;
	}
	return html;
}

module.exports = htmlMessages;

