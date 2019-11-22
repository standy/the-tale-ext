///<reference path="../typings.d.ts"/>

import storage from '../storage/storage';
import {sendNotify} from '../notifications/sendNotify';
import {ACTION_TYPE_TEXTS} from '../utils/const/texts';

export default class Auto {
	static readonly CHOICES: any = {
		/* peacefullnes */
		peacePlus: [
			'help', /* collect_debt */
		],
		peaceMinus: [
			'attack', /* collect_debt */
		],
		honorPlus: [
			'spy', /* spying */
			'delivery', /* delivery */
			'jump_defence', /* caravan */
		],
		honorMinus: [
			'open_up', /* spying */
			'blackmail', /* spying */
			'steal', /* delivery */
			'fake', /* delivery */
			'jump_attack', /* caravan */
		],
	};
	private lastquest = '';
	private lastPosition: PlainObject<number> = {
		x: -1,
		y: -1,
		dx: -1,
		dy: -1
	};
	
	check(hero: any, settingsValues: SettingsValues) {
		setTimeout(() => {
			this.checkHero(hero, settingsValues);
			this.checkQuest(hero, settingsValues);
		}, 1000);
	}

	checkHero(hero: any, settingsValues: SettingsValues) {
		const actionType = hero.action.type as ACTION_TYPE_NAMES;
		const actionPercent = hero.action.percents;
		const heroPosition = hero.position;

		if (settingsValues.autoFollowHero && (
			this.lastPosition.x !== heroPosition.x ||
			this.lastPosition.y !== heroPosition.y ||
			this.lastPosition.dx !== heroPosition.dx ||
			this.lastPosition.dy !== heroPosition.dy
		)) {
			this.lastPosition = heroPosition;
			window.widgets.map.CenterOnHero();
		}

		const energy = hero.energy.value;

		if (energy > 1 && settingsValues.cleanInventory && hero.secondary.max_bag_size - Object.keys(hero.bag).length < settingsValues.cleanInventorySlots ) {
			cleanInventory();
		}

		if (energy < 4) return;

		const isFight = actionType === ACTION_TYPE_NAMES.fight;
		const isRest = actionType < 10 && actionType !== ACTION_TYPE_NAMES.fight;

		const isBoss = !!hero.action.is_boss;

		if (
			settingsValues.autohelpHp &&
			hero.base.health < settingsValues.autohelpHpLowerValue &&
			isFight &&
			(!settingsValues.autohelpHpBoss || isBoss)
		) {
			godHelp(`Низкое здоровье: ${hero.base.health}`);
			return;
		}

		const isHeplingCompanion = actionType === ACTION_TYPE_NAMES.companionHeal;
		if (settingsValues.autohelpCompanion && isHeplingCompanion && hero.companion.health < settingsValues.autohelpCompanionHp) {
			godHelp(`Низкое здоровье спутника: ${hero.companion.health}`);

			return;
		}

		if (settingsValues.autohelpEnergy && energy > settingsValues.autohelpEnergyGreaterValue && (
			(settingsValues.autohelpEnergyFight && isFight) ||
			(settingsValues.autohelpEnergyRest && isRest) ||
			(settingsValues.autohelpEnergyWalk && actionType === ACTION_TYPE_NAMES.walk) ||
			(settingsValues.autohelpEnergyTradeMed && (actionType === ACTION_TYPE_NAMES.trade || actionType === ACTION_TYPE_NAMES.energy))
		)) {
			godHelp(`Накопилась энергия: ${energy}`);

			return;
		}
		if (settingsValues.autohelpIdle && actionType === 0 && !isFight && actionPercent > 0 && actionPercent < 0.8) {
			godHelp('Герой бездействует');
			return;
		}
		if (settingsValues.autohelpDead && actionType === 4 && !isFight && actionPercent > 0 && actionPercent < 0.8) {
			godHelp('Герой умер');
			return;
		}

		const hasCard = !$('.pgf-get-card-button').hasClass('pgf-hidden');
		if (settingsValues.autocard && hasCard) {
			$('.pgf-get-card-button a').trigger('click');
			return;
		}
		const hasModal = $('.modal-header') && ($('.pgf-dialog-title').text() === 'Вы получаете новую карту!');
		if (hasModal) {
			$('.pgf-dialog-button-0').trigger('click');
			return;
		}
		return;


		function cleanInventory() {
			if (!settingsValues.autohelp) {
				return;
			}

			const url = `/game/abilities/drop_item/api/use?api_version=1.0&api_client=${window.API_CLIENT}`;
			hero.energy.value -= 1;

			$.ajax({
				url,
				dataType: 'json',
				type: 'post',
				success: function() {
					if (settingsValues.autohelpNotify) {
						sendNotify(`The Tale Extended - ${storage.heroName}`, {
							tag: 'autohelp',
							body:
								`Сработала автоматическая помощь
								Очистка рюкзака
								Текущее действие: ${ACTION_TYPE_TEXTS[actionType]}`,
							addTime: true,
						});
					}
				},
				data: {},
			});
		}

		function godHelp(msg: string) {
			const ability = 'help';
			console.log(`god ${ability}!`, actionType, msg, Object.assign({}, hero));
			if (settingsValues.autohelpNotify) {
				sendNotify(`The Tale Extended - ${storage.heroName}`, {
					tag: 'autohelp',
					body:
					`Сработала автоматическая помощь
						${msg}
						Текущее действие: ${ACTION_TYPE_TEXTS[actionType]}`,
					addTime: true,
				});
			}
			if (!settingsValues.autohelp) {
				return;
			}
			// return;

			const url = `/game/abilities/${ability}/api/use?api_version=1.0&api_client=${window.API_CLIENT}`;

			hero.energy.value -= 4;

			// const csrf = document.head.innerHTML.match(/"X-CSRFToken"[^"]*(".*")/)[1].replace(/"/g, '');
			$.ajax({
				url,
				dataType: 'json',
				type: 'post',
				// beforeSend: function(xhr) {
				// 	xhr.setRequestHeader('X-CSRFToken', csrf);
				// },
				data: {},
			});
		}
	}

	checkQuest(hero: any, settingsValues: SettingsValues) {
		if (!settingsValues.autoquest) {
			return;
		}

		const selectChoices: PlainObject<boolean> = {
			peacePlus: settingsValues.autoquestPeace && settingsValues.autoquestPeacePlus,
			peaceMinus: settingsValues.autoquestPeace && settingsValues.autoquestPeaceMinus,
			honorPlus: settingsValues.autoquestHonor && settingsValues.autoquestHonorPlus,
			honorMinus: settingsValues.autoquestHonor && settingsValues.autoquestHonorMinus,
		};

		const quests = hero.quests.quests;
		const line = quests[1].line;
		for (let i = 0; i < line.length; i++) {
			const q = line[i];
			for (let choiceIndex = 0; choiceIndex < q.choice_alternatives.length; choiceIndex++) {
				const choiceName = q.choice_alternatives[choiceIndex][1];
				const option_uid = q.choice_alternatives[choiceIndex][0];
				const choiceType = option_uid.replace('#option(','').replace(')','').split(',')[2].replace(/\s+/g, ''); 
				for (const reward in Auto.CHOICES) {
					if (
						selectChoices[reward] &&
						Auto.CHOICES.hasOwnProperty(reward) &&
						Auto.CHOICES[reward].includes(choiceType)
					) {
						this.chooseQuest(option_uid, choiceName, settingsValues);
					}
				}
			}
		}
	}

	private chooseQuest(uid: string, name: string, settingsValues: SettingsValues) {
		if (settingsValues.autoquestNotify && this.lastquest !== name) {
			this.lastquest = name;
			sendNotify(`The Tale Extended - ${storage.heroName}`, {
				tag: 'autoquest',
				body: `Сделан выбор! \n— ${name}`,
				addTime: true,
				icon: `${window.extPath}img/quest/caravan.png`,
			});
		}

		if (!settingsValues.autoquest) {
			return;
		}
		// const csrf = document.head.innerHTML.match(/("X-CSRFToken")(.*)(".*")/, 'g')[3].replace(/"/g, '');
		$.ajax({
			url: `/game/quests/api/choose?api_version=1.0&api_client=${window.API_CLIENT}&option_uid=${encodeURIComponent(uid)}`,
			dataType: 'json',
			type: 'post',
			// beforeSend: function(xhr) {
			// 	xhr.setRequestHeader('X-CSRFToken', csrf);
			// },
			data: {},
		});
	}
}
