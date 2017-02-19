import {declensionByNumber, timeSpan} from '../../utils/utils';
import CONST from '../../utils/const';
import {isActType} from '../../utils/isActType';
import log from '../../utils/log';
const ICONS = CONST.ICONS;
import {settingsValues} from '../../settings/settings';
import {elements} from '../../utils/elements';
import {archiveGroups as externalArchiveGroups} from '../archive/archiveGroups';
import {countStatsTotal} from './countStatsTotal';



elements.addTab('stats-side', {
	zone: 'equip',
	title: 'стат',
	content: '<div class="stats" />',
});
elements.activeTab('stats-side');
const $stats = elements.getTabInner('stats-side');

export function drawStatsSide(archiveGroups) {
	archiveGroups = archiveGroups || externalArchiveGroups;
	const groups = settingsValues.statsByLevel ? groupsByLevel(archiveGroups, settingsValues.statsByLevelValue) : archiveGroups;

	const statsTotal = countStatsTotal(groups, settingsValues.statsActionsCount);
	const mobId = settingsValues.statsByMob && (settingsValues.statsByMobId || statsTotal.lastMobId);

	let html = '';
	let htmlMe;
	if (settingsValues.myStatsByMob && mobId) {
		htmlMe = drawStatsSideByActor(statsTotal.meByMob[mobId]);
	} else {
		htmlMe = drawStatsSideByActor(statsTotal.me);
	}
	let htmlEnemy;
	if (mobId) {
		htmlEnemy =
			'<tr class="unhover">' +
				'<td class="stats-against" colspan="5"><a href="/guide/mobs/' + mobId + '" target="_blank">' + CONST.MOBS[mobId] + '</a></td>' +
			'</tr>' +
			drawStatsSideByActor(statsTotal.enemyByMob[mobId]);
	} else {
		htmlEnemy =
			'<tr class="unhover">' +
				'<td class="stats-against" colspan="5">бестии</td>' +
			'</tr>' +
			drawStatsSideByActor(statsTotal.enemy);
	}
	const statsTable =
		'<table class="table table-condensed table-noborder table-hover-dark table-stats">' +
			'<tr class="unhover">' +
				'<th class="stats-name"></th>' +
				'<th class="stats-average" title="среднее значение">средн</th>' +
				'<th class="stats-count" title="количество срабатываний в боях">шанс(%)</th>' +
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


	const loot = statsTotal.loot;
	const htmlLoot =
		'<span class="stats-name" title="Поднял/Пусто/Выбросил/Умер">' + ICONS.pickup + '</span> ' +
		'<span title="Поднял">' + loot.pickup + '</span> / ' +
		'<span title="Пусто">' + loot.empty + '</span> / ' +
		'<span title="Выбросил">' + loot.drop + '</span> / ' +
		'<span title="Умер">' + loot.death + '</span>';


	let htmlTime =
		'<b>' + statsTotal.actionsSum + '</b> ' + declensionByNumber(statsTotal.actionsSum, ['действие', 'действия', 'действий']) + ' за ' + timeSpan(statsTotal.actionsTime) + '<br />';
	const interestAverageActions = [{
		type: 'fight,rest',
		text: 'бой/отдых',
		icon: '<span class="glyphicon glyphicon-flag"></span>',
	}, {
		type: 'walk',
		text: 'в пути',
	}, {
		type: 'quest,city,nearcity,noeffect',
		text: 'задания',
	}, {
		type: 'idle',
		text: 'безделье',
	}, {
		type: 'dead',
		text: 'воскресание',
	}, {
		type: 'energy',
		text: 'восстановление',
	}, {
		type: 'companionHeal',
		text: 'уход на спутником',
	}, {
		type: 'trade,equip',
		text: 'торговля и экипировка',
	}, {
		type: 'broken,proxy,pvp,undefined',
		text: 'остальное',
	}, {
		title: '<br/><b>В среднем:</b>',
	}, {
		type: 'fight,rest',
		countType: 'fight',
		countAverage: 1,
		icon: '<span class="glyphicon glyphicon-flag"></span>',
		text: 'на бой с учетом отдыха',
	}, {
		type: 'fight',
		countAverage: 1,
		text: 'на бой',
	}, {
		type: 'rest',
		countAverage: 1,
		text: 'на отдых',
	}];
	for (let i = 0; i < interestAverageActions.length; i++) {
		const act = interestAverageActions[i];
		if (act.title) {
			htmlTime += act.title + '<br />';
			continue;
		}

		const types = act.type.split(',');
		let count = 0;
		let countTotal = 0;
		let time = 0;
		for (let j = 0; j < types.length; j++) {
			const type = types[j];
			time += statsTotal.actionsTimes[type] || 0;
			countTotal += statsTotal.actionsCounts[type] || 0;
			if (!act.countType) count += statsTotal.actionsCounts[type];
		}
		if (act.countType) count = statsTotal.actionsCounts[act.countType];
		const timePercent = Math.round(time / statsTotal.actionsTime * 1000) / 10;
		if (act.countAverage) time = time / count;


		if (time) {
			const type = types[0];
			htmlTime +=
				'<span class="action-icon ' + (act.countType || type) + '" ' +
				'title="' + types.map(item => CONST.ACTION_TYPE_TEXTS[item]).join(', ') + '">' +
				(act.icon || CONST.ACTION_TYPE_ICONS[type]) +
				'</span>';
			if (!act.countAverage) {
				htmlTime += '<span title="' + timeSpan(time) + '">' + timePercent.toFixed(1) + '%</span> - ';
			} else {
				htmlTime += timeSpan(time);
			}
			htmlTime += ' ' + act.text + ' (' + countTotal + ')<br />';
		}
	}


	html += statsTable;
	html += '<div class="stats-side stats-loot">' + htmlLoot + '</div>';
	html += '<div class="stats-side stats-time">' + htmlTime + '</div>';

	$stats.html(html);
}


function drawStatsSideByActor(stats) {
	let html = '';
	if (!stats) return html;
	const types = [].concat(CONST.ACTIVE, ['dmgSum'], CONST.PASSIVE);
	for (let i = 0; i < types.length; i++) {
		const type = types[i];
		const isDot = isActType('DOT', type);
		const isPassive = isActType('PASSIVE', type);
		const sumTo = CONST.SUM_TO_MAIN[type];
		const dmgSum = stats.dmgSum || {};
		const hit = stats.hit || {};

		if (stats[type]) {
			const stat = stats[type];
			const title = CONST.ACTION_TRANSLATE[type] +
				(sumTo ? ', включено в ' + CONST.ACTION_TRANSLATE[sumTo]
					: (isPassive ? ', не учитывается в сумме' : '')
				);
			let htmlStat = '<td class="stats-name" title="' + title + '">' + ICONS[type] + '</td> ';

			const count = stat.count;
			const sum = stat.sum;
			const average = (Math.round(sum / count * 100) / 100) || 0;
			const totalSum = dmgSum.sum;
			let hitCount = 0;
			const hitSum = hit.sum || 0;
			let chance = 0;

			if (isPassive) {
				// Если скилл пассивный, берем % срабатываний от кол-ва общих боев (боев с мобом)
				hitCount = stats.fightsCount;
				chance = count / hitCount * 100;
			} else {
				hitCount = hit.count || 0;
				chance = type === 'dmgSum' ? 100 : count / (hitCount + count) * 100;
			}
			const chanceText = type === 'hit' ? '-' : chance >= 100 ? Math.round(chance * 10) / 10 : chance.toFixed(2);

			const countText = 'сработал ' + declensionByNumber(count, ['раз', 'раза', 'раз'], 1);

			if (!sum) {
				htmlStat += '<td class="stats-average"></td>';
				htmlStat += '<td class="stats-count" title="' + countText + '">' + chanceText + '</td>';
				htmlStat += '<td class="stats-count"></td>';
				htmlStat += '<td class="stats-sum"></td>';
			} else {
				const averagePercents = sum / count * hitCount / hitSum * 100;
				const averagePercentsText = Math.round(averagePercents * 100) / 100 + '';

				const dmgPercents = sum / totalSum * 100;
				const dmgPercentsText = '' + (dmgPercents < 100 ? dmgPercents.toFixed(1) : Math.round(dmgPercents)) + '%';
				const sumText = 'всего ' + declensionByNumber(sum, ['урон', 'урона', 'урона'], 1);

				const bonusPercent = Math.round((averagePercents - 100) * chance) / 100;
				const bonusPercentText = bonusPercent && !isDot
					? (bonusPercent >= 0 ? '+' : '&ndash;') + Math.abs(bonusPercent) + '%'
					: '';
				const bpTranslateText = (averagePercentsText >= 100 ? '+' : '&ndash;') +
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
	const levelsLog = log.get('levelsLog') || [];
	let lv1;
	let lv2;
	if (level) {
		lv1 = levelsLog.filter(item => item[1] === level)[0] || [];
		lv2 = levelsLog.filter(item => item[1] === level + 1)[0] || [];
	} else {
		lv1 = levelsLog[levelsLog.length - 1];
		lv2 = [];
	}
	const time1 = lv1[0];
	const time2 = lv2[0];
	let i1 = null;
	let i2 = null;
	for (let i = 0; i < archiveGroups.length; i++) {
		const ts1 = archiveGroups[i].ts[0];
		const ts2 = archiveGroups[archiveGroups.length - 1 - i].ts[0];
		if (i1 === null && ts1 > time1) { i1 = i; }
		if (i2 === null && ts2 < time2) { i2 = archiveGroups.length - 1 - i; }
	}
	return (i1 !== null && !time2) ? archiveGroups.slice(i1) : archiveGroups.slice(i1 || 0, i2 || 0);
}
