import {utils} from '../utils/initUtils';
import {settingsValues} from '../settings/settings';
import {subscribe} from '../utils/pubsub';
import {sendNotify} from './sendNotify';

let lastNotifyMessagesText = '';
subscribe('newMessages', (messagesNew, gameData) => {
	const hero = gameData.account.hero;
	if (!settingsValues.notify) return;
	const notifyMessages = [];
	if (settingsValues.notifyHeroHp) {
		const health = hero.base.health;
//		var healthMax = hero.base.max_health;
//		var healthPercent = health / healthMax * 100;
		const minHp = settingsValues.notifyHeroHpLowerValue;
		if (health < minHp) {
			notifyMessages.push(`Низкое здоровье: ${health} HP`);
		}
	}
	if (settingsValues.notifyHeroEnergy) {
		const energy = hero.energy.value;
//		var energyMax = hero.energy.max;
//		var energyPercent = energy / energyMax * 100;
		const maxEnergy = settingsValues.notifyHeroEnergyGreaterValue;
		if (energy > maxEnergy) {
			notifyMessages.push(`Энергия накопилась: ${energy}`);
		}
	}
	if (settingsValues.notifyHeroIdle) {
		const actionType = hero.action.type;
		if (actionType === 0) {
			notifyMessages.push('Герой бездействует');
		}
	}

	if (notifyMessages.length) {
		const notifyMessagesText = notifyMessages.join('\n');
		if (notifyMessagesText !== lastNotifyMessagesText) {
			sendNotify(`The Tale Extended - ${utils.heroName}`, {
				tag: 'send',
				body: notifyMessagesText,
			});
		}
		lastNotifyMessagesText = notifyMessagesText;
	}
});
