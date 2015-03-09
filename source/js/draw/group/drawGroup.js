var utils = require('../../utils/index.js');
var _settings = utils.settings;
var drawGroupInner = require('./drawGroupInner.js');
var messagesGrouped = require('./list.js');


function drawGroup(group, index, isOpen) {
	isOpen = isOpen || _settings.settingsValues.groupOpenOnDefault;
	var html =
		'<div class="group' + (isOpen ? ' open' : '') + '" data-index="' + index + '">' +
			drawGroupInner(group, messagesGrouped[index + 1]) +
		'</div>';
	return html;
}

module.exports = drawGroup;
