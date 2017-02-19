import {timeSpan} from '../../utils/utils';
import CONST from '../../utils/const';
import {htmlMessages} from '../short/htmlMessages';


export function drawGroupInner(group, groupNext) {
	if (!group || !group.messages || !group.messages.length) return '';
	const messages = group.messages;
	const groupData = group.data;

	const messageFirst = messages[0];
	const messageLast = messages[messages.length - 1];

	const groupType = groupData.type;
	const groupLink = (groupData.info_link || '').replace('/info', '');
	let htmlGroupIcon = CONST.ACTION_TYPE_ICONS[groupType] || '';
	let iconAttr = `class="action-icon ${groupType}" title="${CONST.ACTION_TYPE_TEXTS[groupType]}"`;

	if (groupData.isBroken && !groupData.unfinished) {
		htmlGroupIcon = CONST.ACTION_TYPE_ICONS.broken;
		const title = CONST.ERROR_CODES[groupData.isBroken || 1];
		iconAttr = `class="action-icon broken" title="${title}"`;
	}
	if (groupLink) {
		htmlGroupIcon = `<a ${iconAttr} href="${groupLink}" target="_blank">${htmlGroupIcon}</a>`;
	} else {
		htmlGroupIcon = `<span ${iconAttr}">${htmlGroupIcon}</span>`;
	}


	const htmlTitle = `<span class="action-name">${groupData.actionName || 'неизвестное действие'}</span>`;

	const timeStart = messageFirst[0];
	let timeEnd = messageLast[0];
	if (groupType !== 'fight' && groupNext && groupNext.messages[0]) {
		const timeStartNext = groupNext.messages[0] && groupNext.messages[0][0];
		if (timeStartNext - timeEnd < 120) {
			// проверка на случай сломанной группы
			timeEnd = timeStartNext;
		}
	}
	const timeDiff = timeEnd - timeStart;
	const htmlTime = `<span class="group-time ${timeDiff > 600 ? 'bad' : timeDiff > 300 ? 'average' : ''}">${timeSpan(timeDiff)}</span> `;



	const htmlGroupList = htmlMessages(messages);

	const html =
		`<div class="group-title on-close${groupData.god ? ' god' : ''}">
			${htmlGroupIcon}
			${htmlTime}
			${htmlTitle}
		</div>
		<div class="group-controls">
			<span class="group-toggle on-close text-muted glyphicon glyphicon-chevron-up"></span>
			<span class="group-toggle on-open text-muted glyphicon glyphicon-chevron-down"></span>
		</div>
		<ul class="unstyled pgf-log-list on-open">
			${htmlGroupList}
		</ul>`;

	return html;
}
