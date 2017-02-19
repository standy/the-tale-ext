import $ from 'jquery';
import {settingsValues} from '../../settings/settings';
import {elements} from '../../utils/elements';
import {archiveGroups} from './archiveGroups';
import {timeSpan} from '../../utils/utils';
import {subscribe} from '../../utils/pubsub';
import log from '../../utils/log';
import {isActType} from '../../utils/isActType';
import CONST from '../../utils/const';
const ICONS = CONST.ICONS;

elements.addTab('archive', {zone: 'main', title: 'архив'});
elements.addControl('archive-log', {title: 'Архив', content: '<span class="value"></span> <span class="glyphicon glyphicon-th"></span></span>'});

const $archiveTabContent = elements.getTabInner('archive');
const $archiveContent = $('<div class="archive-content"></div>').appendTo($archiveTabContent);


function drawArchiveGroups(archiveGroups) {
	let levelIndex = 0;
	const levelsLog = log.get('levelsLog') || [];
	for (let i = 0; i < archiveGroups.length; i++) {
		const group = archiveGroups[i];
		const ts = group.ts[1];
		let lv = levelsLog[levelIndex] || [];
		while (ts > lv[0]) {
			levelIndex++;
			const lvlHtml = `<div class="level">${lv[1]} уровень!</div>`;
			$archiveContent.prepend(lvlHtml);
			lv = levelsLog[levelIndex] || [];
		}
		drawArchiveGroup(archiveGroups[i], i, archiveGroups);
	}
}


function drawArchiveGroup(archiveGroup, index, archiveGroups) {
	const isOpen = settingsValues.groupOpenOnDefault;
	const groupType = archiveGroup.broken ? 'broken' : archiveGroup.type;
	let groupLink;
	if (archiveGroup.mobId) {
		groupLink = `/guide/mobs/${archiveGroup.mobId}`;
	}
	let htmlGroupIcon = CONST.ACTION_TYPE_ICONS[groupType] || '';
	if (groupLink) {
		htmlGroupIcon = `<a class="action-icon ${groupType}" href="${groupLink}" target="_blank">${htmlGroupIcon}</a>`;
	} else {
		htmlGroupIcon = `<span class="action-icon ${groupType}">${htmlGroupIcon}</span>`;
	}
	const title = (archiveGroup.text || 'неизвестное действие');
	const htmlTitle = `<span class="action-name">${title}</span>`;


	const timeStart = archiveGroup.ts[0];
	let timeEnd = archiveGroup.ts[1];
	const archiveGroupNext = archiveGroups[index + 1];
	if (groupType !== 'fight' && archiveGroupNext && archiveGroupNext.ts) {
		const timeStartNext = archiveGroupNext.ts[0];
		if (timeStartNext - timeEnd < 120) {
			// проверка на случай сломанной группы (3)
			timeEnd = timeStartNext;
		}
	}
	const timeDiff = timeEnd - timeStart;

	const htmlTime = `<span class="group-time ${timeDiff > 600 ? 'bad' : timeDiff > 300 ? 'average' : ''}">${timeSpan(timeDiff)}</span> `;


	let htmlGroupList = '';
	if (archiveGroup.total && (archiveGroup.type === 'fight' || archiveGroup.type === 'fight-god')) {
		htmlGroupList =
			`<span class="stats-archive stats-archive-me">${drawArchiveActStat(archiveGroup.total.me)}</span>
			<span class="stats-archive stats-archive-enemy">${drawArchiveActStat(archiveGroup.total.enemy)}</span>`;
	} else {
		let actName = CONST.ACTION_TYPE_TEXTS[archiveGroup.type || 'undefined'];
		if (archiveGroup.broken) {
			actName = CONST.ERROR_CODES[archiveGroup.broken || 1];
		}
		htmlGroupList = `<span class="stats-archive">${actName}</span>`;
	}
	let html =
		`<div class="group-title">${htmlGroupIcon}${htmlTime}${htmlTitle}</div>
		<div class="group-controls">
			<span class="group-toggle on-close text-muted glyphicon glyphicon-chevron-up"></span>
			<span class="group-toggle on-open text-muted glyphicon glyphicon-chevron-down"></span>
		</div>
		<div class="archive-log-list on-open">${htmlGroupList}</div>`;

	html =
		`<div class="group${isOpen ? ' open' : ''}" data-index="${index}">${html}</div>`;

	$archiveContent.prepend(html);
}


function drawArchiveActStat(stats) {
	const types = ['dmgSum'].concat(CONST.FIGHT);
	let html = '';
//			html += JSON.stringify(stats)
	for (let i = 0; i < types.length; i++) {
		const type = types[i];
		if (stats[type]) {
			const stat = stats[type];
			let htmlStat = '';
			const htmlStatName = ICONS[type];
			const count = stat.count;
			const sum = stat.sum;
			if (isActType('FIGHT_COUNTS', type)) {
				htmlStat += `${count}x${htmlStatName}`;
			} else {
				if (type === 'dmgSum') {
					htmlStat += `${htmlStatName}=<b>${sum}</b> `;
				} else {
					htmlStat += `${count}x${htmlStatName}`;
					htmlStat += `=${sum} `;
				}
			}

			html += `<span class="stats-archive-act stats-archive-${type}">${htmlStat}</span>`;
		}
	}
	return html;
}


export function initArchiveGroups() {
	let showArchive = settingsValues.showArchive;
	const $archiveTab = elements.getTab('archive').toggle(showArchive);

	$('<span class="link-ajax archive-renew">обновить</span>').appendTo($archiveTabContent)
		.on('click', () => {
			drawArchiveGroups(archiveGroups);
		});

	$archiveContent.on('click', '.group-toggle', function() {
		$(this).closest('.group').toggleClass('open');
	});

	subscribe('settingsChange', (key, value) => {
		if (key === 'showArchive') {
			showArchive = value;
			$archiveTab.toggle(showArchive);
			if (!showArchive) {
				$archiveContent.html('');
			}
		}
	});
}
