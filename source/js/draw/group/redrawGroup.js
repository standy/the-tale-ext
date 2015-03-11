var utils = require('../../utils/');
var _elements = utils.elements;

var messagesGrouped = require('./list');
var drawGroup = require('./drawGroup');
var drawGroupInner = require('./drawGroupInner');

var $groupsContent = _elements.getTabInner('group');

function redrawGroup(index, isOpen) {
	var $group = $groupsContent.children('.group[data-index="' + index + '"]');
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
