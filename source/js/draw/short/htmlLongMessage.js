var _parse = require('../../parse/');



function htmlLongMessage(message) {
	var time = message[1];
	var msg = message[2];
	var act = message[4];

	var actType = '';
	if (act && act.type) {
		var isMe = act.isMe;
		actType = ' msg msg-' + act.type + (isMe ? ' me' : ' enemy');
	}
	var messageHighlight = _parse.highlight(msg, act);


	var htmlLongMsg =
		'<div class="pgf-time time">' + time + '</div>' +
			'<div class="pgf-message message">' +
			'<div class="submessage' + actType + '">' + messageHighlight + '</div>' +
		'</div>';

	return htmlLongMsg;
}


module.exports = htmlLongMessage;
