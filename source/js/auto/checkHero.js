import $ from 'jquery';
import {utils} from '../utils/initUtils';
import {sendNotify} from '../notifications/sendNotify';
import CONST from '../utils/const';
import {settingsValues} from '../settings/settings';
const _heroName = utils.heroName;


export function checkHero(gameData) {
	const hero = gameData.account.hero;
	const actionType = hero.action.type;
	const actionPercent = hero.action.percents;
	const actionName = CONST.ACTION_TYPE_NAMES[actionType];

	const energy = hero.energy.value;
	let energyBonus = settingsValues.autohelpEnergyBonus ? hero.energy.bonus - settingsValues.autohelpEnergyBonusMax : 0;
	if (energyBonus < 0) energyBonus = 0;

	if (energy + energyBonus < 4) return;


	const isFight = actionName === 'fight';
	const isRest = actionType < 10 && actionName !== 'fight';

	const isBoss = !!hero.action.is_boss;
	if (settingsValues.autohelpHp && hero.base.health < settingsValues.autohelpHpLowerValue && isFight && (!settingsValues.autohelpHpBoss || isBoss)) {
		godHelp('Низкое здоровье: ' + hero.base.health);
		return;
	}

	const isHeplingCompanion = actionName === 'companionHeal';
	if (settingsValues.autohelpCompanion && isHeplingCompanion && hero.companion.health < settingsValues.autohelpCompanionHp) {
		godHelp('Низкое здоровье спутника: ' + hero.companion.health);

		return;
	}

	if (settingsValues.autohelpEnergy && energy > settingsValues.autohelpEnergyGreaterValue && (
			(settingsValues.autohelpEnergyFight && isFight) ||
			(settingsValues.autohelpEnergyRest && isRest) ||
			(settingsValues.autohelpEnergyWalk && actionName === 'walk') ||
			(settingsValues.autohelpEnergyTradeMed && (actionName === 'trade' || actionName === 'energy'))
		)) {
		//console.log('check passed', energy, _settingsValues.autohelpEnergyGreaterValue)
		//			if (_settingsValues.autohelpEnergyRepairBuilding && _settingsValues.autohelpEnergyRepairBuildingID) {
		//				var x = _settingsValues.autohelpEnergyRepairBuildingX;
		//				var y = _settingsValues.autohelpEnergyRepairBuildingY;
		//				getBuildingState(x,y)
		//					.done(function(integrity) {
		//						if (integrity && integrity < (_settingsValues.autohelpEnergyRepairBuildingPercent/100 || 0.982)) {
		//							godHelp('repair', 'building_repair', {building: _settingsValues.autohelpEnergyRepairBuildingID});
		//						}
		//					});
		//			} else {
		godHelp('Накопилась энергия: ' + energy);

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

	return true;

	function godHelp(msg, ability, getParams) {
		const csrf = document.head.innerHTML.match(/("X-CSRFToken")(.*)(".*")/, 'g')[3].replace(/"/g, '');
		ability = ability || 'help';
		console.log('god ' + ability + '!', getParams, actionName, msg, $.extend({}, hero));
		if (settingsValues.autohelpNotify) {
			sendNotify('The Tale Extended - ' + _heroName, {
				tag: 'autohelp',
				body: 'Сработала автоматическая помощь ' +
					'\n' + msg + '' +
					'\nТекущее действие: ' + CONST.ACTION_TYPE_TEXTS[actionName] + '',
				addTime: 1,
			});
		}
		//				console.log('godHelp! real');
		if (!settingsValues.autohelp) {
			return;
		}
		let paramsStr = '';
		for (const key in getParams) {
			if (getParams.hasOwnProperty(key)) {
				paramsStr += '&' + key + '=' + getParams[key];
			}
		}
		const url = '/game/abilities/' + ability + '/api/use?api_version=1.0&api_client=' + window.API_CLIENT + paramsStr;
		//				console.log('url: ', url)
		//				if (!_settingsValues.autohelp) return;
		hero.energy.value -= 4;
		$.ajax({
			url: url,
			dataType: 'json',
			type: 'post',
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-CSRFToken', csrf);
			},
			data: {},
		});
	}
}

