///<reference path="../typings.d.ts"/>
import storage from '../storage/storage';
import {sendNotify} from './sendNotify';


export default class Notifications {
	static questTests = ['action', 'choice', 'name', 'type', 'uid'];

	lastNotifyMessagesText: string = '';
	lastQuests: any[];

	static isSameQuest(q1: any, q2: any) {
		return Notifications.questTests.every(key => q1[key] === q2[key]);
	}

	check(hero: any, settingsValues: SettingsValues) {
		if (!settingsValues.notify) return;
		this.checkHero(hero, settingsValues);
		this.checkQuests(hero.quests.quests, settingsValues);
	}


	checkHero(hero: any, settingsValues: SettingsValues) {
		if (!settingsValues.notify) return;
		const notifyMessages = [];

		const minHp = settingsValues.notifyHeroHpLowerValue;
		if (settingsValues.notifyHeroHp && minHp) {
			const health = hero.base.health;
			if (health < minHp) {
				notifyMessages.push(`Низкое здоровье: ${health} HP`);
			}
		}

		const maxEnergy = settingsValues.notifyHeroEnergyGreaterValue;
		if (settingsValues.notifyHeroEnergy && maxEnergy && hero.energy) {
			const energy = hero.energy.value;
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
			if (notifyMessagesText !== this.lastNotifyMessagesText) {
				sendNotify(`The Tale Extended - ${storage.heroName}`, {
					tag: 'send',
					body: notifyMessagesText,
				});
			}
			this.lastNotifyMessagesText = notifyMessagesText;
		}
	}

	checkQuests(quests: any[], settingsValues: SettingsValues) {
		const line = quests[1].line;
		const lineOld = this.lastQuests && this.lastQuests[1] && this.lastQuests[1].line || [];
		const newLines = [];
		for (let i = 0; i < line.length; i++) {
			const q = line[i];
			const qOld = lineOld[i];
			if (!qOld || !Notifications.isSameQuest(q, qOld)) {
				if (
					settingsValues.notify &&
					settingsValues.notifyQuestChoose &&
					q.choice_alternatives &&
					q.choice_alternatives.length
				) {
					sendNotify(q.name, {
						tag: 'quest',
						body: `${storage.heroName} ${q.action}!`,
						icon: `${window.extPath}img/quest/caravan.png`, // window.extPath + 'img/quest/' + q.type + '.png',
						addTime: true,
					});
				}
				newLines.push(q);
			}
		}
		this.lastQuests = quests;
	}
}
