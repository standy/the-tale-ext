var _archive = require('../archive/');

function countStatsTotal(archiveGroups, count) {
	archiveGroups = archiveGroups || _archive.archiveGroups;
	count = count || archiveGroups.length;
	var me = {};
	var enemy = {};
	var fights = 0;
	var loot = {pickup: 0, empty: 0, drop: 0};
	var meByMob = {};
	var enemyByMob = {};
	var actionsTimes = {};
	var actionsCounts = {};
	var actionsSum = 0;
	var actionsTime = 0;
	var fightRestTime = 0;
	var otherTime = 0;
	var mobId;

	for (var i = Math.max(archiveGroups.length - count, 0); i < archiveGroups.length; i++) {
		var fullStats = archiveGroups[i];
		var type = fullStats.broken ? 'broken' : fullStats.type;
		if (!fullStats.ts || type === 'broken') {
			continue;
		}
		if (type === 'fight') {
			mobId = fullStats.mobId;
			addToStats(me, fullStats.total.me);
			addToStats(enemy, fullStats.total.enemy);
			meByMob[mobId] = meByMob[mobId] || {};
			addToStats(meByMob[mobId], fullStats.total.me);
			enemyByMob[mobId] = enemyByMob[mobId] || {};
			addToStats(enemyByMob[mobId], fullStats.total.enemy);

			fights++;
			var lt = fullStats.loot;
			if (lt) {
				loot[lt]++;
			}
		}
		var nextFullStats = archiveGroups[i + 1];
		var timeStart = fullStats.ts[0];
		var timeEnd = fullStats.ts[1];
		if (type !== 'fight' && nextFullStats && nextFullStats.ts) {
			var timeStartNext = nextFullStats.ts[0];
			if (timeStartNext - timeEnd < 120) {
				// проверка на случай сломанной группы (2)
				timeEnd = timeStartNext;
			}
		}
		var time = timeEnd - timeStart;
//				lastTimeEnd = fullStats.ts[1];
		if (type === 'fight' || type === 'rest') {
			fightRestTime += time;
		} else {
			otherTime += time;
		}
		type = type || 'undefined';
		actionsTimes[type] = (actionsTimes[type] || 0) + time;
		actionsCounts[type] = (actionsCounts[type] || 0) + 1;
		actionsTime += time;
		actionsSum++;
	}



	var statsTotal = {
		fights: fights,
		fightRestTime: fightRestTime,
		otherTime: otherTime,
		actionsTime: actionsTime,
		actionsTimes: actionsTimes,
		actionsCounts: actionsCounts,
		actionsSum: actionsSum,
		loot: loot,
		me: me,
		enemy: enemy,
		meByMob: meByMob,
		enemyByMob: enemyByMob
	};
	if (mobId) {
		statsTotal.lastMobId = mobId;
	}
	return statsTotal;
}


function addToStats(addTo, addFrom) {
	for (var type in addFrom) if (addFrom.hasOwnProperty(type)) {
		var st = addFrom[type];
		addTo[type] = addTo[type] || {sum: 0, count: 0};
		if (typeof st === 'number') {
			addTo[type].count += st;
		} else {
			addTo[type].count += st.count;
			addTo[type].sum += st.sum;
		}
	}
}


module.exports = countStatsTotal;
