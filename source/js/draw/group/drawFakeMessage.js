const utils = require('../../utils/');
const _elements = utils.elements;
const _shortMessages = require('../short/');

const $groupsContent = _elements.getTabInner('group');

function drawFakeMessage(message) {
	const $lastGroup = $groupsContent.children('.group').first();

	const html = _shortMessages.htmlLongMessage(message);
	$lastGroup.prepend(html);
}

module.exports = drawFakeMessage;
