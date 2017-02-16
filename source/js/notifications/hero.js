const utils = require('./../utils/');
const _settings = utils.settings;
//var _publish = utils.publish;
const _subscribe = utils.subscribe;

const sendNotify = require('./sendNotify');



let lastNotifyMessagesText = '';
_subscribe('newMessages', function(messagesNew, gameData) {
	const hero = gameData.account.hero;
	const _settingsValues = _settings.settingsValues;
	if (!_settingsValues.notify) return;
	const notifyMessages = [];
	if (_settingsValues.notifyHeroHp) {
		const health = hero.base.health;
//		var healthMax = hero.base.max_health;
//		var healthPercent = health / healthMax * 100;
		const minHp = _settingsValues.notifyHeroHpLowerValue;
		if (health < minHp) {
			notifyMessages.push('Низкое здоровье: ' + health + ' HP');
		}
	}
	if (_settingsValues.notifyHeroEnergy) {
		const energy = hero.energy.value;
//		var energyMax = hero.energy.max;
//		var energyPercent = energy / energyMax * 100;
		const maxEnergy = _settingsValues.notifyHeroEnergyGreaterValue;
		if (energy > maxEnergy) {
			notifyMessages.push('Энергия накопилась: ' + energy);
		}
	}
	if (_settingsValues.notifyHeroIdle) {
		const actionType = hero.action.type;
		if (actionType === 0) {
			notifyMessages.push('Герой бездействует');
		}
	}

	if (notifyMessages.length) {
		const notifyMessagesText = notifyMessages.join('\n');
		if (notifyMessagesText !== lastNotifyMessagesText) {
			sendNotify('The Tale Extended - ' + utils.heroName, {
				tag: 'send',
				body: notifyMessagesText,
			});
		}
		lastNotifyMessagesText = notifyMessagesText;
	}
});
