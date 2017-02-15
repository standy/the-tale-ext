const _archive = require('../archive/');

function countStatsTotal(archiveGroups, count) {
	archiveGroups = archiveGroups || _archive.archiveGroups;
	count = count || archiveGroups.length;
	const me = {};
	const enemy = {};
	let fights = 0;
	const loot = {pickup: 0, empty: 0, drop: 0, death: 0};
	const meByMob = {};
	const enemyByMob = {};
	const actionsTimes = {};
	const actionsCounts = {};
	let actionsSum = 0;
	let actionsTime = 0;
	let fightRestTime = 0;
	let otherTime = 0;
	let mobId;

	for (let i = Math.max(archiveGroups.length - count, 0); i < archiveGroups.length; i++) {
		const fullStats = archiveGroups[i];
		let type = fullStats.broken ? 'broken' : fullStats.type;
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
			// Счетчик боев с мобом
			meByMob[mobId].fightsCount = enemyByMob[mobId].fightsCount = (meByMob[mobId].fightsCount || 0) + 1;
			fights++;
			const lt = fullStats.loot;
			if (lt) {
				loot[lt]++;
			}
		}
		const nextFullStats = archiveGroups[i + 1];
		const timeStart = fullStats.ts[0];
		let timeEnd = fullStats.ts[1];
		if (type !== 'fight' && nextFullStats && nextFullStats.ts) {
			const timeStartNext = nextFullStats.ts[0];
			if (timeStartNext - timeEnd < 120) {
				// проверка на случай сломанной группы (2)
				timeEnd = timeStartNext;
			}
		}
		const time = timeEnd - timeStart;
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
	// проброс счетчика боев для отценки шанса пассивного скил
	me.fightsCount = enemy.fightsCount = fights;
	const statsTotal = {
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
	for (const type in addFrom) {
		if (addFrom.hasOwnProperty(type)) {
			const st = addFrom[type];
			addTo[type] = addTo[type] || {sum: 0, count: 0};
			if (typeof st === 'number') {
				addTo[type].count += st;
			} else {
				addTo[type].count += st.count;
				addTo[type].sum += st.sum;
			}
		}
	}
}


module.exports = countStatsTotal;
