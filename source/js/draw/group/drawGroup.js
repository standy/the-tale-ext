const utils = require('../../utils/');
const _settings = utils.settings;
const drawGroupInner = require('./drawGroupInner');
const messagesGrouped = require('./list');


function drawGroup(group, index, isOpen) {
	isOpen = isOpen || _settings.settingsValues.groupOpenOnDefault;
	const html =
		'<div class="group' + (isOpen ? ' open' : '') + '" data-index="' + index + '">' +
			drawGroupInner(group, messagesGrouped[index + 1]) +
		'</div>';
	return html;
}

module.exports = drawGroup;
