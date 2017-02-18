import $ from 'jquery';
import {messagesGrouped} from './messagesGrouped';
import CONST from '../../utils/const';
import {publish} from '../../utils/pubsub';
import {isActType} from '../../utils/isActType';

export function addMessages(messagesList) {
	for (let i = 0; i < messagesList.length; i++) {
		addMessage(messagesList[i]);
	}
	return messagesGrouped;
}

/*
data: {
	actionName: "пытается одолеть волка"
	info_link: "/guide/mobs/7/info"
	type: "fight"
	typeId: 3
}*/
function addMessage(message) {
	const hero = message[3];
	const act = message[4];
	const action = hero.action || false;
	let currActionName;
	let currType;
	let currInfoLink;
	let currTypeId;
	let grData;
	let actionName;

	let currGr = messagesGrouped[messagesGrouped.length - 1];
	const isFirstGrouop = !currGr;

	if (isFirstGrouop) {
		/* самая первая группа */
		currGr = {
			data: {},
		};
	} else {
		currActionName = currGr.data.actionName;
		currType = currGr.data.type;
		currInfoLink = currGr.data.info_link;
		currTypeId = currGr.data.typeId;
	}


	if (action) {
		actionName = action.description;
		const actionTypeId = action.type;
		const actionType = CONST.ACTION_TYPE_NAMES[actionTypeId];
		const actionInfoLink = action.info_link;

		if (!currActionName) currGr.data.actionName = currActionName = actionName;
		if (!currType) currGr.data.type = actionType;
		if (!currInfoLink) currGr.data.info_link = actionInfoLink;
		if (!currTypeId) currGr.data.typeId = actionTypeId;
		grData = {
			actionName: actionName,
			type: actionType,
			info_link: actionInfoLink,
			typeId: actionTypeId,
		};
		if (isFirstGrouop) {
			grData.isBroken = 1;
		}
	}


	if (act) {
		const actType = act.type;
		const isFightStart = isActType('FIGHT_START', actType);
		const isFightEnd = isActType('LOOT', actType);
		if (actType === 'godheal' || actType === 'godhit' || actType === 'godcoins') {
			grData = $.extend(grData, {god: 1});
		}

		if (isFightStart) {
			if (!isFirstGrouop) {
				finishGroup();
			}
			newGroup(message, {fightStarted: 1}); //fight started, not finished
			return;
		}
		if (isFightEnd) {
			if (isFirstGrouop) {
				newGroup(message, grData);
			} else {
				const lastG = addToLastGroup(message, {
					actionName: 'в бою',
					type: 'fight',
					info_link: '',
					typeId: 3,
				});
				if (lastG.data.fightStarted) {
					delete lastG.data.fightStarted;
					if (lastG.data.isBroken !== 4 && lastG.data.isBroken !== 5) {
						delete lastG.data.isBroken;
					}
				} else {
					lastG.data.isBroken = 2; //fight ended, but not started
				}
				finishGroup();
			}

			if (action && actionName !== currActionName) {
				newGroup([message[0], message[1], actionName, false, false], grData);
			}
			return;
		}
		if (currGr.messages && currGr.messages.length && !currGr.data.fightStarted && isActType('FIGHT', act.type)) {
			grData = $.extend(grData, {isBroken: 5});
		}
	}


	if (action && actionName && currActionName && actionName !== currActionName) {
		finishGroup();
		newGroup(message, grData);
		return;
	}
	if (isFirstGrouop) {
		newGroup(message, grData);
	} else {
		addToLastGroup(message, grData);
	}

	function addToLastGroup(message, data) {
		const lastG = messagesGrouped[messagesGrouped.length - 1];
		if (data) {
			lastG.data = $.extend(data, lastG.data);
		}
		if (lastG.messages.length) {
			const prevMsg = lastG.messages[lastG.messages.length - 1];
			if (message[0] - prevMsg[0] > 1200) {
				// hole in messages 20 min
				lastG.data.isBroken = 4;
			}
		}
		lastG.messages.push(message);
		return lastG;
	}

	function finishGroup(data) {
		const lastG = messagesGrouped[messagesGrouped.length - 1];
		delete lastG.data.unfinished;
		if (lastG.data.fightStarted) {
			lastG.data.isBroken = 3; // fight started, not ended
		}
		if (data) {
			lastG.data = $.extend(data, lastG.data);
		}
		publish('groupFinished', lastG, messagesGrouped.length - 1);
	}
	function newGroup(message, data) {
		const newG = {
			data: {unfinished: 1},
			messages: [],
		};
		if (data) {
			newG.data = $.extend(data, newG.data);
		}
		if (message) {
			newG.messages.push(message);
		}
		messagesGrouped[messagesGrouped.length] = newG;
		publish('groupStarted', newG, messagesGrouped.length - 1);
	}
}
