const utils = require('../../utils/');
const _const = utils.const;
const _utils = utils.utils;
const _shortMessages = require('../short/');


function drawGroupInner(group, groupNext) {
	if (!group || !group.messages || !group.messages.length) return '';
	const messages = group.messages;
	const groupData = group.data;

	const messageFirst = messages[0];
	const messageLast = messages[messages.length - 1];

	const groupType = groupData.type;
	const groupLink = (groupData.info_link || '').replace('/info', '');
	let htmlGroupIcon = _const.ACTION_TYPE_ICONS[groupType] || '';
	let iconAttr = 'class="action-icon ' + groupType + '" title="' + _const.ACTION_TYPE_TEXTS[groupType] + '"';

	if (groupData.isBroken && !groupData.unfinished) {
		htmlGroupIcon = _const.ACTION_TYPE_ICONS.broken;
		const title = _const.ERROR_CODES[groupData.isBroken || 1];
		iconAttr = 'class="action-icon broken" title="' + title + '"';
	}
	if (groupLink) {
		htmlGroupIcon = '<a ' + iconAttr + ' href="' + groupLink + '" target="_blank">' + htmlGroupIcon + '</a>';
	} else {
		htmlGroupIcon = '<span ' + iconAttr + '">' + htmlGroupIcon + '</span>';
	}


	const htmlTitle = '<span class="action-name">' + (groupData.actionName || 'неизвестное действие') + '</span>';

	const timeStart = messageFirst[0];
	let timeEnd = messageLast[0];
	if (groupType !== 'fight' && groupNext && groupNext.messages[0]) {
		const timeStartNext = groupNext.messages[0] && groupNext.messages[0][0];
		if (timeStartNext - timeEnd < 120) {
			// проверка на случай сломанной группы
			timeEnd = timeStartNext;
		}
	}
	const timeSpan = timeEnd - timeStart;
	const htmlTime = /*'<span class="glyphicon glyphicon-time"></span> ' +*/
		'<span class="group-time ' + (timeSpan > 600 ? 'bad' : timeSpan > 300 ? 'average' : '') + '">' +
		_utils.timeSpan(timeSpan) +
		'</span> ';



	const htmlGroupList = _shortMessages.htmlMessages(messages);

	const html =
		'<div class="group-title on-close' + (groupData.god ? ' god' : '') + '">' + htmlGroupIcon + htmlTime + htmlTitle + '</div>' +
//		'<div class="group-stats on-close">' + htmlStats + '</div>' +
		'<div class="group-controls">' +
			'<span class="group-toggle on-close text-muted glyphicon glyphicon-chevron-up"></span>' +
			'<span class="group-toggle on-open text-muted glyphicon glyphicon-chevron-down"></span>' +
		'</div>' +
		'<ul class="unstyled pgf-log-list on-open">' + htmlGroupList + '</ul>';

	return html;
}

module.exports = drawGroupInner;

