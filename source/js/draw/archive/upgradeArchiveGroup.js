/** добавляет к архивам поле total */

import $ from 'jquery';
import CONST from '../../utils/const';
import {isActType} from '../../utils/isActType';

export function upgradeArchiveGroup(archiveGroup, index) {
	if (!archiveGroup || !archiveGroup.ts) {
		return archiveGroup;
	}
	if (archiveGroup.me) {
		$.extend(archiveGroup, {
			total: {
				me: countTotalFromArchive(archiveGroup.me, 'me'),
				enemy: countTotalFromArchive(archiveGroup.enemy, 'enemy', archiveGroup.mobId === 66),
			},
		});
	}
	return archiveGroup;

	/* подсчет всех сумм из архива */
	function countTotalFromArchive(archiveGroupFrom) {
		const addTo = {dmgSum: {count: 0, sum: 0}};
		for (const type in archiveGroupFrom) {
			if (archiveGroupFrom.hasOwnProperty(type)) {
				const vals = archiveGroupFrom[type];
				const isPassive = isActType('PASSIVE', type);
				const isHeal = type === 'heal';

				let count;
				let sum;
				if (typeof vals === 'number') {
					count = vals;
					sum = 0;
				} else {
					count = vals.length;
					sum = vals.reduce((pv, cv) => pv + cv, 0) || 0;
				}

				let av;
				let critMin;
				let critVals;
				let critCount = 0;
				addTo[type] = addTo[type] || {sum: 0, count: 0};
				if (type === 'hit' && sum) {
					av = sum / count;
					critMin = av * 1.35;
					critVals = vals.filter(item => item > critMin);
					critCount = critVals.length;
				}
				if (critCount) {
					addTo.crit = addTo.crit || {sum: 0, count: 0};
					const critSum = critVals.reduce((pv, cv) => pv + cv, 0) || 0;
					addTo.crit.count += critCount;
					addTo.crit.sum += critSum;
				}
				addTo[type].count += count;
				addTo[type].sum += sum;


				const typeSumTo = CONST.SUM_TO_MAIN[type];
				if (typeSumTo) {
					addTo[typeSumTo] = addTo[typeSumTo] || {sum: 0, count: 0};
					addTo[typeSumTo].sum += sum;
				}
				if (!isHeal) {
					if (!isPassive) {
						addTo.dmgSum.count += count;
					}
					addTo.dmgSum.sum += sum;
				}
			}
		}
		return addTo;
	}
}

