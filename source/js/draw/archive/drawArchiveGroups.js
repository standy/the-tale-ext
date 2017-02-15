var $ = require('jquery');
var utils = require('../../utils/');
var _subscribe = utils.subscribe;
var _const = utils.const;
var _icons = _const.ICONS;
var _elements = utils.elements;
var _utils = utils.utils;
var _settings = utils.settings;
var _log = utils.log;
var isActType = utils.isActType;
var archiveGroups = require('./archiveGroups');


var showArchive = _settings.settingsValues.showArchive;
var $archiveTab = _elements.getTab('archive').toggle(showArchive);

var $archiveTabContent = _elements.getTabInner('archive');

$('<span class="link-ajax archive-renew">обновить</span>').appendTo($archiveTabContent)
	.on('click', function() {
		drawArchiveGroups(archiveGroups);
	});

var $archiveContent = $('<div class="archive-content"></div>').appendTo($archiveTabContent);
$archiveContent.on('click', '.group-toggle', function() {
	$(this).closest('.group').toggleClass('open');
});



function drawArchiveGroups(archiveGroups) {
	var levelIndex = 0;
	var levelsLog = _log.get('levelsLog') || [];
	for (var i = 0; i < archiveGroups.length; i++) {
		var group = archiveGroups[i];
		var ts = group.ts[1];
		var lv = levelsLog[levelIndex] || [];
		while (ts > lv[0]) {
			levelIndex++;
			var lvlHtml = '<div class="level">' + lv[1] + ' уровень!</div>';
			$archiveContent.prepend(lvlHtml);
			lv = levelsLog[levelIndex] || [];
		}
		drawArchiveGroup(archiveGroups[i], i, archiveGroups);
	}
}


function drawArchiveGroup(archiveGroup, index, archiveGroups) {
	var isOpen = _settings.settingsValues.groupOpenOnDefault;
	var groupType = archiveGroup.broken ? 'broken' : archiveGroup.type;
	var groupLink;
	if (archiveGroup.mobId) {
		groupLink = '/guide/mobs/' + archiveGroup.mobId;
	}
	var htmlGroupIcon = _const.ACTION_TYPE_ICONS[groupType] || '';
	if (groupLink) {
		htmlGroupIcon = '<a class="action-icon ' + groupType + '" href="' + groupLink + '" target="_blank">' + htmlGroupIcon + '</a>';
	} else {
		htmlGroupIcon = '<span class="action-icon ' + groupType + '">' + htmlGroupIcon + '</span>';
	}
	var title = (archiveGroup.text || 'неизвестное действие');
	var htmlTitle = '<span class="action-name">' + title + '</span>';


	var timeStart = archiveGroup.ts[0];
	var timeEnd = archiveGroup.ts[1];
	var archiveGroupNext = archiveGroups[index + 1];
	if (groupType !== 'fight' && archiveGroupNext && archiveGroupNext.ts) {
		var timeStartNext = archiveGroupNext.ts[0];
		if (timeStartNext - timeEnd < 120) {
			// проверка на случай сломанной группы (3)
			timeEnd = timeStartNext;
		}
	}
	var timeSpan = timeEnd - timeStart;

	var htmlTime = /*'<span class="glyphicon glyphicon-time"></span> ' +*/
		'<span class="group-time ' + (timeSpan > 600 ? 'bad' : timeSpan > 300 ? 'average' : '') + '">' +
			_utils.timeSpan(timeSpan) +
		'</span> ';


	var htmlGroupList = '';
	if (archiveGroup.total && (archiveGroup.type === 'fight' || archiveGroup.type === 'fight-god')) {
		htmlGroupList =
			'<span class="stats-archive stats-archive-me">' +
				drawArchiveActStat(archiveGroup.total.me) +
			'</span>' +
			'<span class="stats-archive stats-archive-enemy">' +
				drawArchiveActStat(archiveGroup.total.enemy) +
			'</span>';
	} else {
		var actName = _const.ACTION_TYPE_TEXTS[archiveGroup.type || 'undefined'];
		if (archiveGroup.broken) {
			actName = _const.ERROR_CODES[archiveGroup.broken || 1];
		}
		htmlGroupList = '<span class="stats-archive">' + actName + '</span>';
	}
	var html =
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
	var types = ['dmgSum'].concat(_const.FIGHT);
	var html = '';
//			html += JSON.stringify(stats)
	for (var i = 0; i < types.length; i++) {
		var type = types[i];
		if (stats[type]) {
			var stat = stats[type];
			var htmlStat = '';
			var htmlStatName = _icons[type];
			var count = stat.count;
			var sum = stat.sum;
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


