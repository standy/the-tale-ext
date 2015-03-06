var _auto = (function(_auto) {
	var sets = [{
		title: 'Помощь герою (<span class="link-ajax" data-auto="rest">миролюбие</span>/<span class="link-ajax" data-auto="fight">агрессия</span>)',
		fields: [{
			label: 'Автоматическая помощь',
			note: 'Внимание! Настройки применяются в момент нажатия',
			name: 'autohelp',
			isToggle: 1,
			value: false,
			subs: [{
				label: 'Уведомлять о помощи',
				name: 'autohelpNotify',
				isToggle: 1,
				value: false
			}, {
				label: 'Использовать бонусную энергию, оставить',
				note: 'Указанный запас энергии тратиться не будет',
				name: 'autohelpEnergyBonus',
				isToggle: 1,
				value: false,
				inputs: [{
					name: 'autohelpEnergyBonusMax',
					type: 'num'
				}]
			}, {
				label: 'Герой бездействует',
				name: 'autohelpIdle',
				isToggle: 1,
				value: true
			}, {
				label: 'Герой воскресает',
				name: 'autohelpDead',
				isToggle: 1,
				value: true
			}, {
				label: 'Здоровье в бою ниже ',
				name: 'autohelpHp',
				isToggle: 1,
				value: true,
				inputs: [{
					type: 'num',
					name: 'autohelpHpLowerValue',
					value: 200
				}],
				subs: [{
					label: 'только против босса',
					name: 'autohelpHpBoss',
					isToggle: 1,
					isInline: 1,
					value: true
				}]
			}, {
				label: 'Лечение спутника, если его здоровье меньше',
				name: 'autohelpСompanion',
				isToggle: 1,
				isInline: 1,
				value: true,
				inputs: [{
					type: 'num',
					name: 'autohelpСompanionHp',
					isInline: 1,
					value: 20
				}]
			}, {
				label: 'Энергия выше ',
				name: 'autohelpEnergy',
				isToggle: 1,
				value: true,
				inputs: [{
					type: 'num',
					name: 'autohelpEnergyGreaterValue',
					value: 10
				}],
				subs: [{
					label: 'в бою',
					name: 'autohelpEnergyFight',
					isToggle: 1,
					isInline: 1,
					value: false
				}, {
					label: 'вне боя',
					name: 'autohelpEnergyRest',
					isToggle: 1,
					isInline: 1,
					value: false
				}, {
					label: 'в пути',
					name: 'autohelpEnergyWalk',
					isToggle: 1,
					isInline: 1,
					value: true
				}, {
					label: 'торг/медитация',
					name: 'autohelpEnergyTradeMed',
					isToggle: 1,
					isInline: 1,
					value: true
				}/*, {
					label: 'Починка',
					name: 'autohelpEnergyRepairBuilding',
					isToggle: 1,
					value: false,
					inputs: [{
						type: 'num',
						addOn: 'ID',
						name: 'autohelpEnergyRepairBuildingID'
					}, {
						type: 'num',
						addOn: 'X',
						name: 'autohelpEnergyRepairBuildingX'
					}, {
						type: 'num',
						addOn: 'Y',
						name: 'autohelpEnergyRepairBuildingY'
					}, {
						type: 'num',
						addOn: '%',
						name: 'autohelpEnergyRepairBuildingPercent'
					}]
				}*/]
			}]
		}, {
			label: 'Автоматический выбор в задании',
			name: 'autoquest',
			isToggle: 1,
			value: false,
			subs: [{
				label: 'Уведомлять о выборе',
				name: 'autoquestNotify',
				isToggle: 1,
				value: false
			}, {
				label: 'Задания, влияющие на честь',
//					note: 'Доставка, сопроводить караван, пошпионить',
				name: 'autoquestHonor',
				isToggle: 1,
				value: true,
				subs: [{
					label: 'честно',
					name: 'autoquestHonorPlus',
					isToggle: 1,
					isInline: 1,
					value: true
				}, {
					label: 'бесчестно',
					name: 'autoquestHonorMinus',
					isToggle: 1,
					isInline: 1,
					value: false
				}]
			}, {
				label: 'Задания, влияющие на миролюбие',
//					note: 'Выбить долг',
				name: 'autoquestPeace',
				isToggle: 1,
				value: true,
				subs: [{
					label: 'миролюбиво',
					name: 'autoquestPeacePlus',
					isToggle: 1,
					isInline: 1,
					value: true
				}, {
					label: 'воинственно',
					name: 'autoquestPeaceMinus',
					isToggle: 1,
					isInline: 1,
					value: false
				}]
			}]
		}, {
			label: 'Брать карты',
			name: 'autocard',
			isToggle: 1,
			value: false
		}]
	}];

	_ext.subscribe('preload', function(gameData) {
		if (gameData) {
			var hero = gameData.account.hero;
			var energyBonus = hero.energy.bonus;
			var $inputMax = _ext.settings.getSettingInput('autohelpEnergyBonusMax');
			if (!+$inputMax.val()) $inputMax.val(Math.max(0, energyBonus-10)).trigger('change');
		}
	});

	function initSets() {
		_ext.settings.addSets(sets);
		_ext.settings.drawSets(sets);

		var $sets = _ext.elements.getTabInner('sets');
		$sets.on('click', '[data-auto]', function(e) {
			e.preventDefault();
			var type = $(this).data('auto');
			var types = {
				rest: {
					autohelpIdle: 1,
					autohelpDead: 1,
					autohelpHp: 1,
					autohelpHpBoss: 1,
					autohelpEnergy: 1,
					autohelpEnergyFight: 0,
					autohelpEnergyRest: 0,
					autohelpEnergyWalk: 1,
					autohelpEnergyTradeMed: 1
				},
				fight: {
					autohelpIdle: 0,
					autohelpDead: 0,
					autohelpHp: 1,
					autohelpHpBoss: 0,
					autohelpEnergy: 1,
					autohelpEnergyFight: 1,
					autohelpEnergyRest: 0,
					autohelpEnergyWalk: 0,
					autohelpEnergyTradeMed: 0
				}
			};
			var conf = types[type];
			for (var key in conf) if (conf.hasOwnProperty(key)) {
				var value = !!conf[key];
				var $input = _ext.settings.getSettingInput(key);
				$input.prop('checked', value).trigger('change');
			}
		})
	}

	function checkHero(gameData) {
		var _settingsValues = _ext.settings.settingsValues;

		var hero = gameData.account.hero;
		var actionType = hero.action.type;
		var actionPercent = hero.action.percents;
		var actionName = _ext.const.ACTION_TYPE_NAMES[actionType];

		var energy = hero.energy.value;
		var energyBonus = _settingsValues.autohelpEnergyBonus ? hero.energy.bonus - _settingsValues.autohelpEnergyBonusMax : 0 ;
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

		function godHelp(msg, ability, getParams) {
			ability = ability || 'help';
			console.log('god ' + ability + '!', getParams, actionName, msg, $.extend({}, hero));
			if (_settingsValues.autohelpNotify) {
				_ext.notification.sendNotify('The Tale Extended - ' + ext.heroName, {
					tag: 'autohelp',
					body: 'Сработала автоматическая помощь ' +
						'\n' + msg + '' +
						'\nТекущее действие: ' + _ext.const.ACTION_TYPE_TEXTS[actionName] + '',
					addTime: 1
				});
			}
//				console.log('godHelp! real');
			if (!_settingsValues.autohelp) return;
			var paramsStr = '';
			for (var key in getParams) if (getParams.hasOwnProperty(key)) {
				paramsStr += '&' + key + '=' + getParams[key];
			}
			var url = '/game/abilities/' + ability + '/api/use?api_version=1.0&api_client='+window.API_CLIENT + paramsStr;
//				console.log('url: ', url)
//				if (!_settingsValues.autohelp) return;
			hero.energy.value -= 4;
			$.ajax({
				url: url,
				dataType: 'json',
				type: 'post',
				data: {}
			})
		}
	}


	var CHOICES = {
		/* peacefullnes */
		peacePlus: [
			'прибегнуть к дипломатии' /* collect_debt */
		],
		peaceMinus: [
			'задействовать грубую силу' /* collect_debt */
		],
		honorPlus: [
			'довести дело до конца', /* spying */
			'защищать торговца', /* caravan */
			'честно выполнить свои обязательства' /* delivery */
		],
		honorMinus: [
			'поддаться укорам совести и раскрыться', /* spying */
			'шантажировать самостоятельно', /* spying */
			'присвоить письмо и продать', /* delivery */
			'украсть-украсть-украсть', /* delivery */
			'подделать письмо' /* delivery */
		]
	};

	var lastquest = '';
	function checkQuest(gameData) {
		var _settingsValues = _ext.settings.settingsValues;
		var selectChoices = {};
		if (_settingsValues.autoquestPeacePlus) selectChoices.peacePlus = 1;
		if (_settingsValues.autoquestPeaceMinus) selectChoices.peaceMinus = 1;
		if (_settingsValues.autoquestHonorPlus) selectChoices.honorPlus = 1;
		if (_settingsValues.autoquestHonorMinus) selectChoices.honorMinus = 1;

		var hero = gameData.account.hero;
		var quests = hero.quests.quests;
		var line = quests[1].line;
		for (var i=0; i<line.length; i++) {
			var q = line[i];
			for (var choiceIndex=0; choiceIndex < q.choice_alternatives.length; choiceIndex++) {
				var choiceName = q.choice_alternatives[choiceIndex][1];
				var option_uid = q.choice_alternatives[choiceIndex][0];
				for (var reward in CHOICES) {
					if (CHOICES[reward].indexOf(choiceName) >=0 ) {
						if (selectChoices[reward]) {
							chooseQuest(option_uid, choiceName);
						}
					}
				}
			}
		}
		function chooseQuest(uid, name) {
			if (_settingsValues.autoquestNotify && lastquest != name) {
				lastquest = name;
				_ext.notification.sendNotify('The Tale Extended - ' + ext.heroName, {
					tag: 'autoquest',
					body: 'Сделан выбор! \n— ' + name + '',
					addTime: 1,
					icon: window.extPass + 'img/quest/caravan.png'
				});
			}

			if (!_settingsValues.autoquest) return;
			$.ajax({
				url: '/game/quests/api/choose?api_version=1.0&api_client='+window.API_CLIENT+'&option_uid='+encodeURIComponent(uid),
				dataType: 'json',
				type: 'post',
				data: {
				}
			})
		}
	}



	function getBuildingState(x,y) {
		var dfr = $.Deferred();
		var name = 'integrity-' + x + '-' + y;
		if (_ext.cache(name)) {
			dfr.resolve(_ext.cache(name));
		} else {
			requestPlaceHtml(x,y)
				.done(function(html) {
//					var $info = $(html);
					var integrityParse = /data-building-integrity="([\d.]+)"/.exec(html);
					var integrity = integrityParse && integrityParse[1];
					_ext.cache(name, integrity, 10 * 60 * 1000);
					console.log('integrity request:', integrity)
					dfr.resolve(integrity);
				});
		}
		return dfr;
	}

	function requestPlaceHtml(x,y) {
		return $.ajax({
			url: '/game/map/cell-info?x=' + x + '&y=' + y + '&_=' + (+new Date),
			method: 'get',
			dataType: 'html'
		})
	}


	$.extend(_auto, {
		checkHero: checkHero,
		checkQuest: checkQuest,
		initSets: initSets
	});
	return _auto;
})({});
_ext.subscribe('newTurn', function(messagesNew, gameData) {
	window.setTimeout(function() {
		_auto.checkHero(gameData);
	}, 1000);
});
_ext.subscribe('newMessages', function(messagesNew, gameData) {
	window.setTimeout(function() {
		_auto.checkQuest(gameData);
	}, 1000);
});

_ext.subscribe('init', function() {
	_auto.initSets();
});
_ext.auto = _auto;
