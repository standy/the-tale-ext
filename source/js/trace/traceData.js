import log from '../utils/log';
import {parseShort} from '../parse/parseShort';
import {messagesLog} from './messagesLog';
import {publish} from '../utils/pubsub';


export function traceData(game_data) {
	const hero = game_data.account.hero;
	if (!hero) return;

	const heroData = {
		action: {
			description: hero.action.description,
			type: hero.action.type,
			info_link: hero.action.info_link,
			is_boss: hero.action.is_boss,
			percents: hero.action.percents,
		},
		base: {
			health: hero.base.health,
			max_health: hero.base.max_health,
			level: hero.base.level,
			alive: hero.base.alive,
			money: hero.base.money,
		},
		energy: {
			bonus: hero.energy.bonus,
			max: hero.energy.max,
			value: hero.energy.value,
		},
		secondary: {
//			initiative: hero.secondary.initiative,
			loot_items_count: hero.secondary.loot_items_count,
//			max_bag_size: hero.secondary.max_bag_size,
//			move_speed: hero.secondary.move_speed,
			power: hero.secondary.power,
		},
		turn: game_data.turn.number,
	};

	const lastLog = messagesLog[messagesLog.length - 1] || [];
	const lastTimestamp = lastLog[0];
	const messagesPack = hero.messages;
	messagesPack[messagesPack.length - 1][3] = heroData;
	const messagesPackTimestamp = messagesPack[messagesPack.length - 1][0];
	const messagesNew = [];
	for (let i = 0; i < messagesPack.length; i++) {
		if (!lastTimestamp || messagesPack[i][0] > lastTimestamp) {
			const messageNew = messagesPack[i];
//					if (messagesPackTimestamp === messageNew[0]) messageNew[3] = heroData;
			messageNew[3] = messageNew[3] || false;
			messageNew[4] = parseShort(messageNew[2]) || false;

			messagesLog.push(messageNew);
			messagesNew.push(messageNew);
		}
	}
	log.set('messagesLog', messagesLog.map(item => [item[0], item[1], item[2], item[3]]));
//	_trace.heroData = heroData;

	publish('newTurn', messagesNew, game_data, messagesPackTimestamp);
	if (messagesNew.length) {
		publish('newMessages', messagesNew, game_data, messagesPackTimestamp);
	}
}
