var utils = require('../../utils/');
var _elements = utils.elements;
var _shortMessages = require('../short/');

var $groupsContent = _elements.getTabInner('group');

function drawFakeMessage(message) {
	var $lastGroup = $groupsContent.children('.group').first();

	var html = _shortMessages.htmlLongMessage(message);
	$lastGroup.prepend(html);
}

module.exports = drawFakeMessage;
