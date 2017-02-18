/** пересчет группы в архив */

import $ from 'jquery';
import {upgradeArchiveGroup} from './upgradeArchiveGroup';
import {isActType} from '../../utils/isActType';

export function countArchiveFromGroup(group) {
	const groupData = group.data;
	const messages = group.messages;
	if (!messages.length) { return false; }
	const isBroken = groupData.isBroken;
	const dataType = groupData.type;
	const first = messages[0];
	const last = messages[messages.length - 1];
	const archiveGroup = $.extend({}, {
		ts: [first[0], last[0]],
		type: dataType,
		text: groupData.actionName,
		broken: isBroken,
	});

	if (dataType === 'fight' && !isBroken) {
		archiveGroup.me = {};
		archiveGroup.enemy = {};
		if (groupData.info_link) {
			const mobId = groupData.info_link.replace('/guide/mobs/', '').replace('/info', '');
			if (+mobId) {
				archiveGroup.mobId = +mobId;
			}
		}

		/* пересчет последней группы */
		for (let i = 0; i < messages.length; i++) {
			const message = messages[i];
			const act = message[4];
			if (!act) continue;
			const type = act.type; /* тип фразы */
			if (isActType('FIGHT', type)) {
				const isMe = act.isMe;
				const addTo = archiveGroup[isMe ? 'me' : 'enemy'];
				if (isActType('FIGHT_VALUES', type)) {
					addTo[type] = addTo[type] || [];
					addTo[type].push(act.value);
				} else {
					addTo[type] = addTo[type] || 0;
					addTo[type]++;
				}
			} else if (isActType('LOOT', type)) {
				archiveGroup.loot = type;
			}
		}
	}

	upgradeArchiveGroup(archiveGroup);
	return archiveGroup;
}
