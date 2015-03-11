var $ = require('jquery');
var utils = require('../../utils/');
var _const = utils.const;
var _icons = _const.ICONS;
var isActType = utils.isActType;


function htmlMessage(message) {
	var time = message[1];
	var msg = message[2];
	var act = message[4]; //_parse.message(message, 'message');

	var htmlMsg;
	if (!act || !act.type) return '';
	var isMe = act.isMe;
	var type = act.type;
	var sec = act.sec;
	var t = '';
	var val = act.value || '';
	var icon = _icons[type];
//	if (sec) console.log(sec, message[3], time)
	if (sec) {
		icon += '<span class="sub-icon">' + _icons[sec] + '</span>';
	}
	if (type === 'hit') {
		t = val;
	} else if (type === 'vamp') {
		t = val + icon + '<span class="vamp">' + act.vamp + '</span>';
	} else if (isActType('SHORT', type)) {
		t = val + icon;
	}

	if (t) {
		htmlMsg = '<span class="submessage act act-' + act.type + (isMe ? ' me' : ' enemy') + '" title="' + time + '> ' + msg + '">' + t + '</span>';
	}
	return htmlMsg || '';
}

module.exports = htmlMessage;

