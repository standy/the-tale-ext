var utils = require('../utils/');
var _parse = require('../parse/');
var _publish = utils.publish;
var _subscribe = utils.subscribe;
var _log = utils.log;
var _settings = utils.settings;
var messagesLog = require('./messagesLog');


function traceData(game_data) {

	var hero = game_data.account.hero;
	if (!hero) return;

	var heroData = {
		action: {
			description: hero.action.description,
			type: hero.action.type,
			info_link: hero.action.info_link,
			is_boss: hero.action.is_boss,
			percents: hero.action.percents
		},
		base: {
			health: hero.base.health,
			max_health: hero.base.max_health,
			level: hero.base.level,
			alive: hero.base.alive,
			money: hero.base.money
		},
		energy: {
			bonus: hero.energy.bonus,
			max: hero.energy.max,
			value: hero.energy.value
		},
		secondary: {
//			initiative: hero.secondary.initiative,
			loot_items_count: hero.secondary.loot_items_count,
//			max_bag_size: hero.secondary.max_bag_size,
//			move_speed: hero.secondary.move_speed,
			power: hero.secondary.power
		},
		turn: game_data.turn.number
	};

	var lastLog = messagesLog[messagesLog.length - 1] || [];
	var lastTimestamp = lastLog[0];
	var messagesPack = hero.messages;
	messagesPack[messagesPack.length - 1][3] = heroData;
	var messagesPackTimestamp = messagesPack[messagesPack.length - 1][0];
	var messagesNew = [];
	for (var i = 0; i < messagesPack.length; i++) {
		if (!lastTimestamp || messagesPack[i][0] > lastTimestamp) {
			var messageNew = messagesPack[i];
//					if (messagesPackTimestamp === messageNew[0]) messageNew[3] = heroData;
			messageNew[3] = messageNew[3] || false;
			messageNew[4] = _parse.short(messageNew[2]) || false;

			messagesLog.push(messageNew);
			messagesNew.push(messageNew);
		}
	}
	_log.set('messagesLog', messagesLog.map(function(item) { return [item[0], item[1], item[2], item[3]]; }));
//	_trace.heroData = heroData;

	_publish('newTurn', messagesNew, game_data, messagesPackTimestamp);
	if (messagesNew.length) {
		_publish('newMessages', messagesNew, game_data, messagesPackTimestamp);
	}
}

module.exports = traceData;

