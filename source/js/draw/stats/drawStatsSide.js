var $ = require('jquery');
var utils = require('../../utils/');
var _const = utils.const;
var _icons = _const.ICONS;
var _elements = utils.elements;
var _utils = utils.utils;
var _settings = utils.settings;
var _log = utils.log;
var isActType = utils.isActType;
var _archive = require('../archive/');

var countStatsTotal = require('./countStatsTotal');


_elements.addTab('stats-side', {
	zone: 'equip',
	title: 'стат',
	content: '<div class="stats" />'
});
_elements.activeTab('stats-side');
var $stats = _elements.getTabInner('stats-side');

function drawStatsSide(archiveGroups) {
	archiveGroups = archiveGroups || _archive.archiveGroups;
	var groups =  _settings.settingsValues.statsByLevel ? groupsByLevel(archiveGroups, _settings.settingsValues.statsByLevelValue) : archiveGroups;

	var statsTotal = countStatsTotal(groups, _settings.settingsValues.statsActionsCount);
	var mobId = _settings.settingsValues.statsByMob && (_settings.settingsValues.statsByMobId || statsTotal.lastMobId);

	var html = '';
	var htmlMe;
	if (_settings.settingsValues.myStatsByMob && mobId) {
		htmlMe = drawStatsSideByActor(statsTotal.meByMob[mobId]);
	} else {
		htmlMe = drawStatsSideByActor(statsTotal.me);
	}
	var htmlEnemy;
	if (mobId) {
		htmlEnemy =
			'<tr class="unhover">' +
				'<td class="stats-against" colspan="5"><a href="/guide/mobs/' + mobId + '" target="_blank">' + _const.MOBS[mobId] + '</a></td>' +
			'</tr>' +
			drawStatsSideByActor(statsTotal.enemyByMob[mobId]);
	} else {
		htmlEnemy =
			'<tr class="unhover">' +
				'<td class="stats-against" colspan="5">бестии</td>' +
			'</tr>' +
			drawStatsSideByActor(statsTotal.enemy);
	}
	var statsTable =
		'<table class="table table-condensed table-noborder table-hover-dark table-stats">' +
			'<tr class="unhover">' +
				'<th class="stats-name"></th>' +
				'<th class="stats-average" title="среднее значение">средн</th>' +
				'<th class="stats-count" title="количество срабатываний из 100 ударов">шанс</th>' +
				'<th class="stats-sum" title="доля от общего урона">урон</th>' +
				'<th class="stats-bonus" title="прибавка к урону от умения">эфф</th>' +
			'</tr>' +
			'<tbody class="stats-me">' +
				htmlMe +
			'</tbody>' +
			'<tbody class="stats-enemy">' +
				htmlEnemy +
			'</tbody>' +
		'</table>';


	var loot = statsTotal.loot;
	var htmlLoot = '<span class="stats-name" title="Поднял/Пусто/Выбросил">' + _icons.pickup + '</span> ' +
		'<span title="Поднял">' + loot.pickup + '</span> / <span title="Пусто">' + loot.empty + '</span> / <span title="Выбросил">' + loot.drop + '</span> / <span title="Выбросил">' + loot.death + '</span>';


	var htmlTime =
		'<b>' + statsTotal.actionsSum + '</b> ' + _utils.declensionByNumber(statsTotal.actionsSum, ['действие', 'действия', 'действий']) + ' за ' + _utils.timeSpan(statsTotal.actionsTime) + '<br />';
	var interestAverageActions = [{
		type: 'fight,rest',
		text: 'бой/отдых',
		icon: '<span class="glyphicon glyphicon-flag"></span>'
	}, {
		type: 'walk',
		text: 'в пути'
	}, {
		type: 'quest,city,nearcity,noeffect',
		text: 'задания'
	}, {
		type: 'idle',
		text: 'безделье'
	}, {
		type: 'dead',
		text: 'воскресание'
	}, {
		type: 'energy',
		text: 'восстановление'
	}, {
		type: 'trade,equip',
		text: 'торговля и экипировка'
	}, {
		type: 'broken,proxy,pvp,undefined',
		text: 'остальное'
	}, {
		title: '<br/><b>В среднем:</b>'
	}, {
		type: 'fight,rest',
		countType: 'fight',
		countAverage: 1,
		icon: '<span class="glyphicon glyphicon-flag"></span>',
		text: 'на бой с учетом отдыха'
	}, {
		type: 'fight',
		countAverage: 1,
		text: 'на бой'
	}, {
		type: 'rest',
		countAverage: 1,
		text: 'на отдых'
	}];
	for (var i = 0; i < interestAverageActions.length; i++) {
		var act = interestAverageActions[i];
		if (act.title) {
			htmlTime += act.title + '<br />';
			continue;
		}

		var types = act.type.split(',');
		var type;
		var count = 0;
		var countTotal = 0;
		var time = 0;
		for (var j = 0; j < types.length; j++) {
			type = types[j];
			time += statsTotal.actionsTimes[type] || 0;
			countTotal += statsTotal.actionsCounts[type] || 0;
			if (!act.countType) count += statsTotal.actionsCounts[type];
		}
		type = types[0];
		if (act.countType) count = statsTotal.actionsCounts[act.countType];
		var timePercent = Math.round(time / statsTotal.actionsTime * 1000) / 10;
		if (act.countAverage) time = time / count;


		if (time) {
			htmlTime += '<span class="action-icon ' + (act.countType || type) + '" title="' + types.map(function(item) { return _const.ACTION_TYPE_TEXTS[item]; }).join(', ') + '">' + (act.icon || _const.ACTION_TYPE_ICONS[type]) + '</span>';
			if (!act.countAverage) {
				htmlTime += '<span title="' + _utils.timeSpan(time) + '">' + timePercent.toFixed(1) + '%</span> - ';
			} else {
				htmlTime += _utils.timeSpan(time);
			}
			htmlTime +=  ' ' + act.text + ' (' + countTotal + ')<br />';
		}
	}


	html += statsTable;
	html += '<div class="stats-side stats-loot">' + htmlLoot + '</div>';
	html += '<div class="stats-side stats-time">' + htmlTime + '</div>';

	$stats.html(html);
}


function drawStatsSideByActor(stats) {
	var html = '';
	if (!stats) return html;
	var types = [].concat(_const.ACTIVE, ['dmgSum'], _const.PASSIVE);
	for (var i = 0; i < types.length; i++) {
		var type = types[i];
		var isDot = isActType('DOT', type);
		var isPassive = isActType('PASSIVE', type);
		var sumTo = _const.SUM_TO_MAIN[type];
		var dmgSum = stats.dmgSum || {};
		var hit = stats.hit || {};

		if (stats[type]) {
			var stat = stats[type];
			var title = _const.ACTION_TRANSLATE[type] +
				(sumTo ? ', включено в ' + _const.ACTION_TRANSLATE[sumTo] :
					(isPassive ? ', не учитывается в сумме' : '')
				);
			var htmlStat = '<td class="stats-name" title="' + title + '">' + _icons[type] + '</td> ';

			var count = stat.count;
			var sum = stat.sum;
			var average = (Math.round(sum / count * 100) / 100) || 0;
			var hitCount = hit.count;
			var hitSum = hit.sum;
			var totalSum = dmgSum.sum;

			var chance = type === 'dmgSum' ? 100 : count / (hitCount + count) * 100;
			var chanceText = type === 'hit' ? '-' : chance >= 100 ? Math.round(chance * 10) / 10  : chance.toFixed(2);

			var countText = 'сработал ' + _utils.declensionByNumber(count, ['раз', 'раза', 'раз'], 1);

			if (!sum) {
				htmlStat += '<td class="stats-average"></td>';
				htmlStat += '<td class="stats-count" title="' + countText + '">' + chanceText + '</td>';
				htmlStat += '<td class="stats-count"></td>';
				htmlStat += '<td class="stats-sum"></td>';
			} else {
				var averagePercents = sum / count * hitCount / hitSum * 100;
				var averagePercentsText = Math.round(averagePercents * 100) / 100 + '';

				var dmgPercents = sum / totalSum * 100;
				var dmgPercentsText = '' + (dmgPercents < 100 ? dmgPercents.toFixed(1) : Math.round(dmgPercents)) + '%';
				var sumText = 'всего ' + _utils.declensionByNumber(sum, ['урон', 'урона', 'урона'], 1);

				var bonusPercent = Math.round((averagePercents - 100) * chance) / 100;
				var bonusPercentText = bonusPercent && !isDot ?
					(bonusPercent >= 0 ? '+' : '&ndash;') + Math.abs(bonusPercent) + '%' :
					'';
				var bpTranslateText = (averagePercentsText >= 100 ? '+' : '&ndash;') +
					Math.abs(Math.round(averagePercentsText * 100 - 10000) / 100) + '% x ' + chanceText;

				htmlStat += '<td class="stats-average" title="' + averagePercentsText + '%">' + average.toFixed(2) + '</td>';
				htmlStat += '<td class="stats-count" title="' + countText + '">' + chanceText + '</td>';
				htmlStat += '<td class="stats-sum" title="' + sumText + '">' + dmgPercentsText + '</td>';
				htmlStat += '<td class="stats-bonus" title="' + bpTranslateText + '">' + bonusPercentText + '</td>';
			}

			html += '<tr class="stats-row stats-row-' + type + '">' + htmlStat + '</tr>';
		}
	}
	return html;
}

function groupsByLevel(archiveGroups, level) {
	var levelsLog = _log.get('levelsLog') || [];
	var lv1;
	var lv2;
	if (level) {
		lv1 = levelsLog.filter(function(item) { return item[1] === level;})[0] || [];
		lv2 = levelsLog.filter(function(item) { return item[1] === level + 1;})[0] || [];
	} else {
		lv1 = levelsLog[levelsLog.length - 1];
		lv2 = [];
	}
	var time1 = lv1[0];
	var time2 = lv2[0];
	var i1 = null;
	var i2 = null;
	for (var i = 0; i < archiveGroups.length; i++) {
		var ts1 = archiveGroups[i].ts[0];
		var ts2 = archiveGroups[archiveGroups.length - 1 - i].ts[0];
		if (i1 === null && ts1 > time1) { i1 = i; }
		if (i2 === null && ts2 < time2) { i2 = archiveGroups.length - 1 - i; }
	}
	return (i1 !== null && !time2) ? archiveGroups.slice(i1) : archiveGroups.slice(i1 || 0, i2 || 0);
}

module.exports = drawStatsSide;

