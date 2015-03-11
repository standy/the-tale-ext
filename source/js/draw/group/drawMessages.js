var utils = require('../../utils/');
var _elements = utils.elements;
var drawGroup = require('./drawGroup');


var $groupsContent = _elements.getTabInner('group');

function drawMessages(messagesGrouped) {
	var html = '';
	for (var i = 0; i < messagesGrouped.length; i++) {
		html = drawGroup(messagesGrouped[i], i) + html;
	}
	$groupsContent.html(html);
}

module.exports = drawMessages;
