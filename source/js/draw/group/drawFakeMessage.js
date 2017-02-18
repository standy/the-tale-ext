import {elements} from '../../utils/elements';
import {htmlLongMessage} from '../short/htmlLongMessage';

const $groupsContent = elements.getTabInner('group');

export function drawFakeMessage(message) {
	const $lastGroup = $groupsContent.children('.group').first();

	const html = htmlLongMessage(message);
	$lastGroup.prepend(html);
}
