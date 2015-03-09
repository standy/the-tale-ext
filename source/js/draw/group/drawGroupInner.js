var $ = require('jquery');
var utils = require('./../../utils/index.js');
var _subscribe = utils.subscribe;
var _const = utils.const;
var _elements = utils.elements;
var _settings = utils.settings;
var _log = utils.log;
var _utils = utils.utils;
var _shortMessages = require('./../short/index.js');


function drawGroupInner(group, groupNext) {
	if (!group || !group.messages || !group.messages.length) return '';
	var messages = group.messages;
	var groupData = group.data;

	var messageFirst = messages[0];
	var messageLast = messages[messages.length - 1];

	var groupType = groupData.type;
	var groupLink = (groupData.info_link || '').replace('/info', '');
	var htmlGroupIcon = _const.ACTION_TYPE_ICONS[groupType] || '';
	var iconAttr = 'class="action-icon ' + groupType + '" title="' + _const.ACTION_TYPE_TEXTS[groupType] + '"';

	if (groupData.isBroken && !groupData.unfinished) {
		htmlGroupIcon = _const.ACTION_TYPE_ICONS.broken;
		var title = _const.ERROR_CODES[groupData.isBroken || 1];
		iconAttr = 'class="action-icon broken" title="' + title + '"';
	}
	if (groupLink) {
		htmlGroupIcon = '<a ' + iconAttr + ' href="' + groupLink + '" target="_blank">' + htmlGroupIcon + '</a>';
	} else {
		htmlGroupIcon = '<span ' + iconAttr + '">' + htmlGroupIcon + '</span>';
	}


	var htmlTitle = '<span class="action-name">' + (groupData.actionName || 'неизвестное действие') + '</span>';

	var timeStart = messageFirst[0];
	var timeEnd = messageLast[0];
	if (groupType !== 'fight' && groupNext && groupNext.messages[0]) {
		var timeStartNext = groupNext.messages[0] && groupNext.messages[0][0];
		if (timeStartNext - timeEnd < 120) {
			// проверка на случай сломанной группы
			timeEnd = timeStartNext;
		}
	}
	var timeSpan = timeEnd - timeStart;
	var htmlTime = /*'<span class="glyphicon glyphicon-time"></span> ' +*/
		'<span class="group-time ' + (timeSpan > 600 ? 'bad' : timeSpan > 300 ? 'average' : '') + '">' +
		_utils.timeSpan(timeSpan) +
		'</span> ';



	var htmlGroupList = _shortMessages.htmlMessages(messages);

	var html =
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

