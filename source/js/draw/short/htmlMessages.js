import {htmlLongMessage} from './htmlLongMessage';
import {htmlMessage} from './htmlMessage';


export function htmlMessages(messages) {
	let html = '';
	for (let i = 0; i < messages.length; i++) {
		const message = messages[i];
//		var m = JSON.stringify(message);  data-m=\''+ m +'\'
		let htmlShortMsg = htmlMessage(message);
		const timestamp = message[0];
		const time = message[1];
		let htmlMsg = '';
		if (htmlShortMsg) {
			while (messages[i + 1] && messages[i + 1][1] === time) {
				const htmlShortMsg2 = htmlMessage(messages[i + 1]);
				if (!htmlShortMsg2) break;
				htmlShortMsg += htmlShortMsg2;
				i++;
			}
			htmlMsg = `<li data-ts="${timestamp}" class="log-record-short">${htmlShortMsg}</li>`;
		} else {
			const htmlLongMsg = htmlLongMessage(message);
			htmlMsg = `<li data-ts="${timestamp}" class="log-record">${htmlLongMsg}</li>`;
		}
		html = htmlMsg + html;
	}
	return html;
}

