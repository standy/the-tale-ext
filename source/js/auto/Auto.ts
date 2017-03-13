///<reference path="../typings.d.ts"/>

import {sendNotify} from '../notifications/sendNotify';
import {ACTION_TYPE_TEXTS} from '../utils/const';

export default class Auto {

	check(hero: any, settingsValues: SettingsValues) {
		setTimeout(() => {
			this.checkHero(hero, settingsValues);
		}, 1000);
	}

	checkHero(hero: any, settingsValues: SettingsValues) {
		const actionType = hero.action.type as ACTION_TYPE_NAMES;
		const actionPercent = hero.action.percents;

		const energy = hero.energy.value;
		let energyBonus = settingsValues.autohelpEnergyBonus ? hero.energy.bonus - settingsValues.autohelpEnergyBonusMax : 0;
		if (energyBonus < 0) energyBonus = 0;

		if (energy + energyBonus < 4) return;


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

		return;



		function godHelp(msg: string) {
			const ability = 'help';
			console.log(`god ${ability}!`, actionType, msg, Object.assign({}, hero));
			if (settingsValues.autohelpNotify) {
				sendNotify(`The Tale Extended - {_heroName}`, {
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
}
