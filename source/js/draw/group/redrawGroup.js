import {messagesGrouped} from './messagesGrouped';
import {drawGroup} from './drawGroup';
import {drawGroupInner} from './drawGroupInner';
import {elements} from '../../utils/elements';

const $groupsContent = elements.getTabInner('group');

export function redrawGroup(index, isOpen) {
	const $group = $groupsContent.children(`.group[data-index="${index}"]`);
	if ($group.length) {
		if (typeof isOpen !== 'undefined') {
			$group.toggleClass('open', isOpen);
		}
		$group.html(drawGroupInner(messagesGrouped[index], messagesGrouped[index + 1]));
	} else {
		$groupsContent.prepend(drawGroup(messagesGrouped[index], index, isOpen));
	}
}
