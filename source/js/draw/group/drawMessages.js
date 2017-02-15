const utils = require('../../utils/');
const _elements = utils.elements;
const drawGroup = require('./drawGroup');


const $groupsContent = _elements.getTabInner('group');

function drawMessages(messagesGrouped) {
	let html = '';
	for (let i = 0; i < messagesGrouped.length; i++) {
		html = drawGroup(messagesGrouped[i], i) + html;
	}
	$groupsContent.html(html);
}

module.exports = drawMessages;
