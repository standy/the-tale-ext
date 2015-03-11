var utils = require('./../utils/');
var _settings = utils.settings;
//var _publish = utils.publish;
var _subscribe = utils.subscribe;

var sendNotify = require('./sendNotify');



var lastNotifyMessagesText = '';
_subscribe('newMessages', function(messagesNew, gameData) {
	var hero = gameData.account.hero;
	var _settingsValues = _settings.settingsValues;
	if (!_settingsValues.notify) return;
	var notifyMessages = [];
	if (_settingsValues.notifyHeroHp) {
		var health = hero.base.health;
//		var healthMax = hero.base.max_health;
//		var healthPercent = health / healthMax * 100;
		var minHp = _settingsValues.notifyHeroHpLowerValue;
		if (health < minHp) {
			notifyMessages.push('Низкое здоровье: ' + health + ' HP');
		}
	}
	if (_settingsValues.notifyHeroEnergy) {
		var energy = hero.energy.value;
//		var energyMax = hero.energy.max;
//		var energyPercent = energy / energyMax * 100;
		var maxEnergy = _settingsValues.notifyHeroEnergyGreaterValue;
		if (energy > maxEnergy) {
			notifyMessages.push('Энергия накопилась: ' + energy);
		}
	}
	if (_settingsValues.notifyHeroIdle) {
		var actionType = hero.action.type;
		if (actionType === 0) {
			notifyMessages.push('Герой бездействует');
		}
	}

	if (notifyMessages.length) {
		var notifyMessagesText = notifyMessages.join('\n');
		if (notifyMessagesText !== lastNotifyMessagesText) {
			sendNotify('The Tale Extended - ' + utils.heroName, {
				tag: 'send',
				body: notifyMessagesText
			});
		}
		lastNotifyMessagesText = notifyMessagesText;
	}
});
