const utils = require('../../utils/');
const _elements = utils.elements;

const messagesGrouped = require('./list');
const drawGroup = require('./drawGroup');
const drawGroupInner = require('./drawGroupInner');

const $groupsContent = _elements.getTabInner('group');

function redrawGroup(index, isOpen) {
	const $group = $groupsContent.children('.group[data-index="' + index + '"]');
	if ($group.length) {
		if (typeof isOpen !== 'undefined') {
			$group.toggleClass('open', isOpen);
		}
		$group.html(drawGroupInner(messagesGrouped[index], messagesGrouped[index + 1]));
	} else {
		$groupsContent.prepend(drawGroup(messagesGrouped[index], index, isOpen));
	}
}

module.exports = redrawGroup;
