var $ = require('jquery');
var utils = require('../utils/');
var _subscribe = utils.subscribe;
var _const = utils.const;
var _settings = utils.settings;
var _notification = require('../notifications/');
var _heroName = utils.heroName;


function checkHeroThrow(gameData) {
	var _settingsValues = _settings.settingsValues;

	var hero = gameData.account.hero;
	var actionType = hero.action.type;
	var actionPercent = hero.action.percents;
	var actionName = _const.ACTION_TYPE_NAMES[actionType];

	var energy = hero.energy.value;
	var energyBonus = _settingsValues.autothrowEnergyBonus ? hero.energy.bonus - _settingsValues.autothrowEnergyBonusMax : 0;
	if (energyBonus < 0) energyBonus = 0;

	if (energy + energyBonus < 3) return;

	if ((hero.secondary.loot_items_count === 0) || (hero.secondary.loot_items_count < hero.secondary.max_bag_size && !(_settingsValues.autothrowNotFull))) return;

	var has_garbage = false;
	for (var item in hero.bag) {
		if (hero.bag[item].type === 0) has_garbage = true;
	}

	if (_settingsValues.autothrowEnergy && energy > _settingsValues.autothrowEnergyGreaterValue && (has_garbage || _settingsValues.autothrowEquipment) && (actionName !== 'trade' && actionName !== 'energy')) {

		godThrow('Накопилась энергия: ' + energy);

		return;
	}



	return true;

	function godThrow(msg, ability, getParams) {
		ability = ability || 'drop_item';
		console.log('god ' + ability + '!', getParams, actionName, msg, $.extend({}, hero));
		if (_settingsValues.autothrowNotify) {
			_notification.sendNotify('The Tale Extended - ' + _heroName, {
				tag: 'autothrow',
				body: 'Сработало автоматическое выбрасывание ' +
					'\n' + msg + '' +
					'\nТекущее действие: ' + _const.ACTION_TYPE_TEXTS[actionName] + '',
				addTime: 1
			});
		}
		if (!_settingsValues.autothrow) {
			return;
		}
		var paramsStr = '';
		for (var key in getParams) if (getParams.hasOwnProperty(key)) {
			paramsStr += '&' + key + '=' + getParams[key];
		}
		var url = '/game/abilities/' + ability + '/api/use?api_version=1.0&api_client=' + window.API_CLIENT + paramsStr;
		hero.energy.value -= 3;
		$.ajax({
			url: url,
			dataType: 'json',
			type: 'post',
			data: {}
		});
	}
}

module.exports = checkHeroThrow;

_subscribe('newTurn', function(messagesNew, gameData) {
	window.setTimeout(function() {
		checkHeroThrow(gameData);
	}, 1000);
});

