import {drawGroup} from './drawGroup';
import {elements} from '../../utils/elements';


export function drawMessages(messagesGrouped) {
	let html = '';
	for (let i = 0; i < messagesGrouped.length; i++) {
		html = drawGroup(messagesGrouped[i], i) + html;
	}
	elements.getTabInner('group').html(html);
}
