var $ = require('jquery');
var utils = require('../utils/');
var _subscribe = utils.subscribe;
var _const = utils.const;
var _settings = utils.settings;
var _notification = utils.notification;
var _heroName = utils.heroName;


function checkHero(gameData) {
	var _settingsValues = _settings.settingsValues;

	var hero = gameData.account.hero;
	var actionType = hero.action.type;
	var actionPercent = hero.action.percents;
	var actionName = _const.ACTION_TYPE_NAMES[actionType];

	var energy = hero.energy.value;
	var energyBonus = _settingsValues.autohelpEnergyBonus ? hero.energy.bonus - _settingsValues.autohelpEnergyBonusMax : 0;
	if (energyBonus < 0) energyBonus = 0;

	if (energy + energyBonus < 4) return;


	var isFight = actionName === 'fight';
	var isRest = actionType < 10 && actionName !== 'fight';

	var isBoss = !!hero.action.is_boss;
	if (_settingsValues.autohelpHp && hero.base.health < _settingsValues.autohelpHpLowerValue && isFight && (!_settingsValues.autohelpHpBoss || isBoss)) {
		godHelp('Низкое здоровье: ' + hero.base.health);
		return;
	}

	var isHeplingСompanion = actionName === 'companionHelp';
	if (_settingsValues.autohelpСompanion && isHeplingСompanion && hero.companion.health < _settingsValues.autohelpСompanionHp) {
		godHelp('Низкое здоровье спутника: ' + hero.companion.health);

		return;
	}

	if (_settingsValues.autohelpEnergy && energy > _settingsValues.autohelpEnergyGreaterValue && (
			(_settingsValues.autohelpEnergyFight && isFight) ||
			(_settingsValues.autohelpEnergyRest && isRest) ||
			(_settingsValues.autohelpEnergyWalk && actionName === 'walk') ||
			(_settingsValues.autohelpEnergyTradeMed && (actionName === 'trade' || actionName === 'energy'))
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
	if (_settingsValues.autohelpIdle && actionType === 0 && !isFight && actionPercent > 0 && actionPercent < 0.8) {
		godHelp('Герой бездействует');
		return;
	}
	if (_settingsValues.autohelpDead && actionType === 4 && !isFight && actionPercent > 0 && actionPercent < 0.8) {
		godHelp('Герой умер');
		return;
	}

	var hasCard = !$('.pgf-get-card-button').hasClass('pgf-hidden');
	if (_settingsValues.autocard && hasCard) {
		$('.pgf-get-card-button a').trigger('click');
		return;
	}

	return true;

	function godHelp(msg, ability, getParams) {
		ability = ability || 'help';
		console.log('god ' + ability + '!', getParams, actionName, msg, $.extend({}, hero));
		if (_settingsValues.autohelpNotify) {
			_notification.sendNotify('The Tale Extended - ' + _heroName, {
				tag: 'autohelp',
				body: 'Сработала автоматическая помощь ' +
					'\n' + msg + '' +
					'\nТекущее действие: ' + _const.ACTION_TYPE_TEXTS[actionName] + '',
				addTime: 1
			});
		}
//				console.log('godHelp! real');
		if (!_settingsValues.autohelp) {
			return;
		}
		var paramsStr = '';
		for (var key in getParams) if (getParams.hasOwnProperty(key)) {
			paramsStr += '&' + key + '=' + getParams[key];
		}
		var url = '/game/abilities/' + ability + '/api/use?api_version=1.0&api_client=' + window.API_CLIENT + paramsStr;
//				console.log('url: ', url)
//				if (!_settingsValues.autohelp) return;
		hero.energy.value -= 4;
		$.ajax({
			url: url,
			dataType: 'json',
			type: 'post',
			data: {}
		});
	}
}

module.exports = checkHero;

_subscribe('newTurn', function(messagesNew, gameData) {
	window.setTimeout(function() {
		checkHero(gameData);
	}, 1000);
});

