const utils = require('../../utils/');
const _const = utils.const;
const _icons = _const.ICONS;
const isActType = utils.isActType;


function htmlMessage(message) {
	const time = message[1];
	const msg = message[2];
	const act = message[4]; //_parse.message(message, 'message');

	let htmlMsg;
	if (!act || !act.type) return '';
	const isMe = act.isMe;
	const type = act.type;
	const sec = act.sec;
	let t = '';
	const val = act.value || '';
	let icon = _icons[type];
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

