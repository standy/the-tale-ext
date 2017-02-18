import {drawGroup} from './drawGroup';
import {elements} from '../../utils/elements';


const $groupsContent = elements.getTabInner('group');

export function drawMessages(messagesGrouped) {
	let html = '';
	for (let i = 0; i < messagesGrouped.length; i++) {
		html = drawGroup(messagesGrouped[i], i) + html;
	}
	$groupsContent.html(html);
}
