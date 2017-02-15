const $ = require('jquery');
const utils = require('../../utils/');
const _subscribe = utils.subscribe;
const _const = utils.const;
const _icons = _const.ICONS;
const _elements = utils.elements;
const _utils = utils.utils;
const _settings = utils.settings;
const _log = utils.log;
const isActType = utils.isActType;
const archiveGroups = require('./archiveGroups');


let showArchive = _settings.settingsValues.showArchive;
const $archiveTab = _elements.getTab('archive').toggle(showArchive);

const $archiveTabContent = _elements.getTabInner('archive');

$('<span class="link-ajax archive-renew">обновить</span>').appendTo($archiveTabContent)
	.on('click', function() {
		drawArchiveGroups(archiveGroups);
	});

const $archiveContent = $('<div class="archive-content"></div>').appendTo($archiveTabContent);
$archiveContent.on('click', '.group-toggle', function() {
	$(this).closest('.group').toggleClass('open');
});



function drawArchiveGroups(archiveGroups) {
	let levelIndex = 0;
	const levelsLog = _log.get('levelsLog') || [];
	for (let i = 0; i < archiveGroups.length; i++) {
		const group = archiveGroups[i];
		const ts = group.ts[1];
		let lv = levelsLog[levelIndex] || [];
		while (ts > lv[0]) {
			levelIndex++;
			const lvlHtml = '<div class="level">' + lv[1] + ' уровень!</div>';
			$archiveContent.prepend(lvlHtml);
			lv = levelsLog[levelIndex] || [];
		}
		drawArchiveGroup(archiveGroups[i], i, archiveGroups);
	}
}


function drawArchiveGroup(archiveGroup, index, archiveGroups) {
	const isOpen = _settings.settingsValues.groupOpenOnDefault;
	const groupType = archiveGroup.broken ? 'broken' : archiveGroup.type;
	let groupLink;
	if (archiveGroup.mobId) {
		groupLink = '/guide/mobs/' + archiveGroup.mobId;
	}
	let htmlGroupIcon = _const.ACTION_TYPE_ICONS[groupType] || '';
	if (groupLink) {
		htmlGroupIcon = '<a class="action-icon ' + groupType + '" href="' + groupLink + '" target="_blank">' + htmlGroupIcon + '</a>';
	} else {
		htmlGroupIcon = '<span class="action-icon ' + groupType + '">' + htmlGroupIcon + '</span>';
	}
	const title = (archiveGroup.text || 'неизвестное действие');
	const htmlTitle = '<span class="action-name">' + title + '</span>';


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
	const timeSpan = timeEnd - timeStart;

	const htmlTime = /*'<span class="glyphicon glyphicon-time"></span> ' +*/
		'<span class="group-time ' + (timeSpan > 600 ? 'bad' : timeSpan > 300 ? 'average' : '') + '">' +
			_utils.timeSpan(timeSpan) +
		'</span> ';


	let htmlGroupList = '';
	if (archiveGroup.total && (archiveGroup.type === 'fight' || archiveGroup.type === 'fight-god')) {
		htmlGroupList =
			'<span class="stats-archive stats-archive-me">' +
				drawArchiveActStat(archiveGroup.total.me) +
			'</span>' +
			'<span class="stats-archive stats-archive-enemy">' +
				drawArchiveActStat(archiveGroup.total.enemy) +
			'</span>';
	} else {
		let actName = _const.ACTION_TYPE_TEXTS[archiveGroup.type || 'undefined'];
		if (archiveGroup.broken) {
			actName = _const.ERROR_CODES[archiveGroup.broken || 1];
		}
		htmlGroupList = '<span class="stats-archive">' + actName + '</span>';
	}
	let html =
			'<div class="group-title">' + htmlGroupIcon + htmlTime + htmlTitle + '</div>' +
			'<div class="group-controls">' +
				'<span class="group-toggle on-close text-muted glyphicon glyphicon-chevron-up"></span>' +
				'<span class="group-toggle on-open text-muted glyphicon glyphicon-chevron-down"></span>' +
			'</div>' +
			'<div class="archive-log-list on-open">' + htmlGroupList + '</div>';

	html =
		'<div class="group' + (isOpen ? ' open' : '') + '" data-index="' + index + '">' +
			html +
		'</div>';

	$archiveContent.prepend(html);
}


function drawArchiveActStat(stats) {
	const types = ['dmgSum'].concat(_const.FIGHT);
	let html = '';
//			html += JSON.stringify(stats)
	for (let i = 0; i < types.length; i++) {
		const type = types[i];
		if (stats[type]) {
			const stat = stats[type];
			let htmlStat = '';
			const htmlStatName = _icons[type];
			const count = stat.count;
			const sum = stat.sum;
			if (isActType('FIGHT_COUNTS', type)) {
				htmlStat += count + 'x' + htmlStatName;
			} else {
				if (type === 'dmgSum') {
					htmlStat += htmlStatName + '=<b>' + sum + '</b> ';
				} else {
					htmlStat += count + 'x' + htmlStatName;
					htmlStat += '=' + sum + ' ';
				}
			}

			html += '<span class="stats-archive-act stats-archive-' + type + '">' + htmlStat + '</span>';
		}
	}
	return html;
}



module.exports = drawArchiveGroups;



_subscribe('settingsChange', function(key, value) {
	if (key === 'showArchive') {
		showArchive = value;
		$archiveTab.toggle(showArchive);
		if (!showArchive) {
			$archiveContent.html('');
		}
	}
});


