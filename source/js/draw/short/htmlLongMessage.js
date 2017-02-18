import {parseHighlight} from '../../parse/parseHighlight';

export function htmlLongMessage(message) {
	const time = message[1];
	const msg = message[2];
	const act = message[4];

	let actType = '';
	if (act && act.type) {
		const isMe = act.isMe;
		actType = ' msg msg-' + act.type + (isMe ? ' me' : ' enemy');
	}
	const messageHighlight = parseHighlight(msg, act);


	const htmlLongMsg =
		'<div class="pgf-time time">' + time + '</div>' +
			'<div class="pgf-message message">' +
			'<div class="submessage' + actType + '">' + messageHighlight + '</div>' +
		'</div>';

	return htmlLongMsg;
}
