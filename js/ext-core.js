$(document).on('ajaxSuccess.ext', function(event, XMLHttpRequest, setting, result) {
	"use strict";
	if (setting.url.indexOf('/game/api/info?api_client=') === 0) {
		var game_data = result.data;

		try {
			_ext.heroName = game_data.account.hero.base.name;
			_ext.map_version = game_data.map_version;
		} catch(e) {}


		if (!_ext.preloadDone) {
//			$(document).trigger(pgf.game.events.DATA_REFRESHED, game_data);
			_ext.publish('preload', game_data);
		}
		_ext.preloadDone = 1;

		if (!game_data.account.is_old) {
			_ext.publish('load', game_data);
			$('.ext-wait').hide();
			$(document).off('ajaxSuccess.ext');
			delete _ext.preloadDone;
		}
	}
});


_ext.const = {
	MAX_LOG_LENGTH: 1000,
	MAX_ARCHIVE_LENGTH: 2000,
	FIGHT_START:  ['fight'],
	FIGHT:        ['hit', 'might', 'fire', 'poisoncloud', 'vamp', 'stunHit', 'crit', 'flame', 'poison', 'slow', 'mush', 'speed', 'ue', 'eva', 'stun', 'heal'],
	FIGHT_VALUES: ['hit', 'might', 'fire',                'vamp', 'stunHit', 'crit', 'flame', 'poison',                                               'heal'],
	FIGHT_COUNTS: [                        'poisoncloud',                                               'slow', 'mush', 'speed', 'ue', 'eva', 'stun'        ],
	DMG:          ['hit', 'might', 'fire', 'poisoncloud', 'vamp', 'stunHit', 'crit'                                                                         ],
	DOT:          [                                                                  'flame', 'poison'                                                      ],
	DEBUFF:       [                                                                                     'slow'                                              ],
	BUFF:         [                                                                                             'mush', 'speed', 'ue'                       ],
	ACTIVE:       ['hit', 'might', 'fire', 'poisoncloud', 'vamp', 'stunHit',                                    'mush'         , 'ue'                       ],
	PASSIVE:      [                                                          'crit', 'flame', 'poison', 'slow',         'speed',       'eva', 'stun', 'heal'],

	SUM_TO_MAIN: {flame: 'fire', poison: 'poisoncloud', crit: 'hit'},
	LOOT: ['pickup', 'empty', 'drop'],
	REST: ['rest'],
	SHORT: ['hit', 'might', 'fire', 'flame', 'poison', 'vamp', 'slow', 'poisoncloud', 'mush', 'ue', 'eva', 'heal', 'godheal', 'rest', 'coins', 'speed', 'stunHit', 'stun', 'pvpeff', 'pvpice', 'pvpflame', 'pvpfail'],
	ACTION_TYPE_NAMES: {
		0:  'idle',      //безделие
		1:  'quest',     //задание
		2:  'walk',      //путешествие между городами
		3:  'fight',     //сражение 1x1 с монстром
		4:  'dead',      //воскрешение
		5:  'city',      //действия в городе
		6:  'rest',      //отдых
		7:  'equip',     //экипировка
		8:  'trade',     //торговля
		9:  'nearcity',  //путешествие около города
		10: 'energy',    //восстановление энергии
		11: 'noeffect',  //действие без эффекта на игру
		12: 'proxy',     //прокси-действия для взаимодействия героев
		13: 'pvp',       //PvP 1x1
		14: 'test'       //проверочное действие
	},
	ACTION_TYPE_TEXTS: {
		idle:       'безделие',
		quest:      'задание',
		walk:       'путешествие между городами',
		fight:      'сражение 1x1 с монстром',
		dead:       'воскрешение',
		city:       'действия в городе',
		rest:       'отдых',
		equip:      'экипировка',
		trade:      'торговля',
		nearcity:   'путешествие около города',
		energy:     'восстановление энергии',
		noeffect:   'действие без эффекта на игру',
		proxy:      'прокси-действия для взаимодействия героев',
		pvp:        'PvP 1x1',
		undefined:  'неизвестное действие',
		broken:     'неразобранное действие'
	},
	ACTION_TYPE_ICONS: {
		idle:        '<span class="glyphicon glyphicon-home"></span>',
		quest:       '<span class="glyphicon glyphicon-globe"></span>',
		walk:        '<span class="glyphicon glyphicon-road"></span>',
		fight:       '<span class="glyphicon glyphicon-leaf"></span>',
		dead:        '<span class="glyphicon glyphicon-remove"></span>',
		city:        '<span class="glyphicon glyphicon-home"></span>',
		rest:        '<span class="glyphicon glyphicon-heart-empty"></span>',
		equip:       '<span class="glyphicon glyphicon-collapse-down"></span>',
		trade:       '<span class="glyphicon glyphicon-copyright-mark"></span>',
		nearcity:    '<span class="glyphicon glyphicon-globe"></span>',
		energy:      '<span class="glyphicon glyphicon-flash"></span>',
		noeffect:    '<span class="glyphicon glyphicon-music"></span>',
		broken:      '<span class="glyphicon glyphicon-ban-circle"></span>'
	},
	ERROR_CODES: {
		1: 'Неполное действие',
		2: 'Не найдено начало боя',
		3: 'Не найден конец боя',
		4: 'Дыра в середине действия',
		5: 'Запись обрывается'
	},
	ICONS: {
		hit:        '<span class="glyphicon glyphicon-leaf"></span>',
		crit:       '<span class="glyphicon glyphicon-star"></span>',
		might:      '<span class="glyphicon glyphicon-tower"></span>',
		fire:       '<span class="glyphicon glyphicon-fire"></span>',
		flame:      '<span class="glyphicon glyphicon-fire small"></span>',
		poisoncloud:'<span class="glyphicon glyphicon-tint"></span>',
		poison:     '<span class="glyphicon glyphicon-tint small"></span>',
		vamp:       '<span class="glyphicon glyphicon-cutlery"></span>',

		ue:         '<span class="glyphicon glyphicon-refresh"></span> ',
		eva:        '<span class="glyphicon glyphicon-transfer"></span> ',
		slow:       '<span class="glyphicon glyphicon-link"></span>',
		mush:       '<span class="glyphicon glyphicon-arrow-up"></span>',
		speed:      '<span class="glyphicon glyphicon-forward"></span>',

		stunHit:    '<span class="glyphicon glyphicon-step-forward"></span>',
		stun:       '<span class="glyphicon glyphicon-bell"></span>',

		rest:       '<span class="glyphicon glyphicon-heart-empty"></span>',
		heal:       '<span class="glyphicon glyphicon-heart"></span>',

		dmgSum:    '<span class="glyphicon glyphicon-asterisk"></span>',

		godheal:    '<span class="glyphicon glyphicon-heart-empty"></span>',
		coins:      '<span class="glyphicon glyphicon-copyright-mark"></span>',

		pickup:    '<span class="glyphicon glyphicon-ok-circle"></span>',
		empty:     '<span class="glyphicon glyphicon-remove-circle"></span>',
		drop:      '<span class="glyphicon glyphicon-ban-circle"></span>',

		pvpeff:     '<span class="glyphicon glyphicon-flash"></span>',
		pvpice:     '<span class="glyphicon glyphicon-cloud-upload"></span>',
		pvpflame:   '<span class="glyphicon glyphicon-cloud-download"></span>',
		pvpfail:    '<span class="glyphicon glyphicon-cloud"></span>'
	},
	ACTION_TRANSLATE: {
		hit: 'Удар',
		crit: 'Критический удар',
		stunHit: 'Разбег-толчок',
		stun: 'Шок',
		might: 'Тяжёлый удар',
		slow: 'Заморозка',
		speed: 'Ускорение',
		fire: 'Шар огня',
		flame: 'Пламя',
		mush: 'Волшебный гриб',
		ue: 'Шаг в сторону',
		eva: 'Увернулся',
		poisoncloud: 'Ядовитое облако',
		poison: 'Отравление',
		vamp: 'Удар вампира',
		heal: 'Регенерация',
		dmgSum: 'Всего'
	},
	MOBS: [null,"олень","одичавшая одежда","осы","хищный кустик","кабан-секач","бродячий дуб","волк","дух леса","оскорблённая эльфийка","блюститель природы","медведь","аристократ","единорог","призрачный волк","астральный охотник","головастик","домашний поползень","одичавшие светлячки","ползун","пиявка","гигантская росянка","сбежавший эксперимент","слизь","гидра","щупальце","химический мусорник","упырь","кикимора","бесхозный голем","охотник за реагентами","мутировавший гоблин","василиск","ожившее пугало","хищный хомяк","борец за справедливость","саранча","маньяк-извращенец","карточный шулер","богомол","благородный разбойник","одержимый колдун","механический дракончик","дварф-изгнанник","неистовый сектант","механический голем","убийца","полоумный маг","шакал","скорпион","налётчик","огненная лиса","орк-изгнанник","скарабей","гремучая змея","саламандра","пустынный дракончик","джинн","берсерк","смерч","заблудший шаман","шайтан","крыса","бандит","призрак","неупокоенный","гремлин","подыльник","странствующий рыцарь","нага","охотник за головами","суккуб","вирика","див","додо","ангиак","бхут","гвиллион","вилах","вендиго","галд","ачери","земляная даппи","огненная даппи","анчутка","жихарь","йиена","мара","боец Серого Ордена","спятивший лорд","волколак","медвелак","аколит огня","ламия","баргест","вий","гьюнальский паук","дэра","гриндель","грим","кагир","друджи","даса","стая ичетики","кера","куд","ларва","егви","каменный великан","каннибал","ламашту","лахама","наркоман","бывший палач","мародёр","страхолев","злоцвет","варвар","ночная хныка","омерзень","смрадень","глыдень","песчаный холерник","мать анаконд","белая гиена","мраморный бык","язвомор","лишайница","жирница","бульг","костогрыз","каменник","вирница","тигр","барбегаз","бродячий огонек","скальник","пупырник","стогница","куропатка гуанила","пёстробородый","капитан Серых Плащей","аколит льда","семиглаз","гюрза","медвежук","снежная росомаха","койот","горный манул","мастер огня","мастер льда","кобольд","пожиратель плоти","главарь пестробородых","ученик Силы","гомункул","некромант","тагар","стрига","приземник","лесной тролль","вурдалак","болотный тролль","бескуд","атач"]
};



var _subscribeList = [];
function publish(e) {
	var sp = e.split('.');
	var event = sp[0];
	var namespace = sp[1];
	for (var i=0; i<_subscribeList.length; i++) {
		var s = _subscribeList[i];
		if ((!namespace || namespace === s.namespace) && (!event || event === s.event)) {
			s.fn.apply(_ext, Array.prototype.slice.call(arguments, 1));
		}
	}
}
function subscribe(e, fn) {
	var events = e.split(',');
	if (events.length > 1) {
		events.forEach(function(ev) {subscribe(ev, fn);});
		return;
	}
	var sp = e.split('.');
	var event = sp[0];
	var namespace = sp[1];
	_subscribeList.push({
		event: event,
		namespace: namespace,
		fn: fn
	});
}
var cacheStore = {};
var cacheTimeId = {};
function cache(name, value, time) {
	if (arguments.length > 1) {
		cacheStore[name] = value;
		if (cacheTimeId[name]) window.clearTimeout(cacheTimeId[name]);
		if (time) {
			cacheTimeId[name] = window.setTimeout(function() {
				delete cacheStore[name];
			}, time)
		}
	} else {
		return cacheStore[name];
	}
}
$.extend(_ext, {
	subscribeList: _subscribeList,
	cacheStore: cacheStore,
	cache: cache,
	publish: publish,
	subscribe: subscribe
});

var _store = (function() {
	var prefix = 'ext-';
	function setStore(key, value) {
		localStorage.setItem(prefix + key, JSON.stringify(value));
	}
	function getStore(key) {
		return JSON.parse(localStorage.getItem(prefix + key) || localStorage.getItem(key));
	}
	if (window.localStorage && window.JSON) {
		return {
			get: getStore,
			set: setStore
		}
	} else {
		return {
			get: function() {},
			set: function() {}
		}
	}
})({});

/* log */
var _log = (function() {
	function setLog(name, messages) {
		try {
			if (name === 'messagesLog') {
				var max = _settings.settingsValues.maxLogLength || _ext.const.MAX_LOG_LENGTH;
				pgf.base.settings.set(name, JSON.stringify(messages.slice(messages.length - max)));
			} else {
				pgf.base.settings.set(name, JSON.stringify(messages));
			}
		} catch (e) {
			console.warn('setLog', name, e);
		}
	}
	function getLog(name) {
		var g = pgf.base.settings.get(name);
		return g ? JSON.parse(g) : '';
	}
	function logToConsole(name) {
		var strLog = pgf.base.settings.get(name);
		var s = strLog
			.replace(/\],\[/g, '],\n\t[')
			.replace(/\},{/g, '},\n\t{')
			.replace(/"(action|base|energy|habits|secondary|turn)"/g, '\n\t\t"$1"');
		console.log(s);
	}
	function toStr(messages) {
		var strLog = JSON.stringify(messages);
		var s = strLog
			.replace(/\],\[/g, '],\n\t[')
			.replace(/"(action|base|energy|habits|secondary|turn)"/g, '\n\t\t"$1"');
		return s;
	}
	function size() {
		var t = 0;
		for(var x in localStorage){
			t += localStorage[x].length * 2;
		}
//			console.log(t/1024+ " KB");
		return t;
	}
	if (window.localStorage && window.JSON) {
		return {
			toConsole: logToConsole,
			toStr: toStr,
			get: getLog,
			size: size,
			set: setLog
		};
	} else {
		return {
			toConsole: function() {},
			toStr: function() {},
			get: function() {},
			size: function() {},
			set: function() {}
		};
	}
})();
/* eo log */



/* settings */
var _settings = (function(_settings) {
	function getSettingInput(key) {
		return $('input[data-name="' + key + '"]');
	}

	var sets = [
		{
			title: 'Персонаж',
			fields: [{
				label: 'Начало имени героя:',
				note: 'Общая часть имени для всех падежей',
				inputs: [{
					name: 'heroNameStart',
					type: 'text'
				}]

			}]
		},
		{
			title: 'Уведомления',
			fields: [{
				label: 'Отправлять уведомления',
				name: 'notify',
				isToggle: 1,
				value: true,
				subs: [{
					label: 'Выбор в задании',
					name: 'notifyQuestChoose',
					isToggle: 1,
					value: true
				}, {
					label: 'Герой бездействует',
					name: 'notifyHeroIdle',
					isToggle: 1,
					value: true
				/*}, {
					label: 'Герой воскресает',
					name: 'notifyHeroDead',
					isToggle: 1,
					value: true*/
				}, {
					label: 'Здоровье ниже ',
					name: 'notifyHeroHp',
					isToggle: 1,
					value: true,
					inputs: [{
						type: 'num',
						addOn: '%',
						name: 'notifyHeroHpLowerPercent',
						value: 10
					}]
				}, {
					label: 'Энергия выше ',
					name: 'notifyHeroEnergy',
					isToggle: 1,
					value: true,
					inputs: [{
						type: 'num',
						addOn: '%',
						name: 'notifyHeroEnergyGreaterPercent',
						value: 80
					}]
				}]
			}]
		}, {
			title: 'Статистика',
			fields: [{
				label: 'Уровень героя: последний, или',
				name: 'statsByLevel',
				isToggle: 1,
				value: true,
				inputs: [{
					type: 'num',
					name: 'statsByLevelValue'
				}]
			}, {
				label: 'Монстр: последний, или',
				name: 'statsByMob',
				isToggle: 1,
				value: true,
				inputs: [{
					type: 'num',
					name: 'statsByMobId',
					addOn: 'ID'
				}],
				subs: [{
					label: 'Статистика героя против монстра',
					name: 'myStatsByMob',
					isToggle: 1,
					value: false
				}]
			}, {
				label: 'Количество действий в статистике:',
				inputs: [{
					name: 'statsActionsCount',
					type: 'num'
				}]
			}]
		}, {
			title: 'Отображение',
			fields: [{
				label: 'Выводить подробности действий',
				name: 'groupOpenOnDefault',
				isToggle: 1,
				value: true
			}, {
				label: 'Показывать архив',
				name: 'showArchive',
				isToggle: 1,
				value: false
			}]
		}, {
			title: 'Хранилище <span id="storage-size"></span>',
			fields: [{
				label: 'Сообщений в кратком журнале:',
				inputs: [{
					name: 'maxLogLength',
					type: 'num',
					value:  _ext.const.MAX_LOG_LENGTH
				}]
			}, {
				label: 'Действий в архиве:',
				inputs: [{
					name: 'maxArchiveLength',
					type: 'num',
					value:  _ext.const.MAX_ARCHIVE_LENGTH
				}]
			}, {
				label: '<span class="link-ajax" id="reset-stats">Очистить хранилище</span>'
			}]
		}
	];
	_ext.subscribe('settingsChange', checkDependences);
	function checkDependences(key, value, isDisabled) {
		if (deps[key]) {
			deps[key].forEach(function(keyName) {
				if (keyName) getSettingInput(keyName).closest('.input-wrap').toggleClass('disabled', isDisabled || !value);//.prop('disabled', !value);
			});
		}
	}

	var deps = {};
	function addSets(sets) {
		for (var i=0; i<sets.length;i++) {
			settingsDefaults(sets[i].fields);
		}

		function settingsDefaults(fields) {
			var childs = [];
			for (var i=0; i<fields.length;i++) {
				var st = fields[i];
				childs.push(st.name);
//					console.log('defaults', st.name);
				if (typeof settingsValues[st.name] === 'undefined') settingsValues[st.name] = st.value;
				var subsChilds = [];
				if (st.inputs) {
					subsChilds = settingsDefaults(st.inputs).concat(subsChilds);
				}
				if (st.subs) {
					subsChilds = settingsDefaults(st.subs).concat(subsChilds);
				}
				if (st.fields) subsChilds = settingsDefaults(st.fields).concat(subsChilds);

				if (subsChilds.length && st.name) {
					deps[st.name] = subsChilds;
					childs = subsChilds.concat(childs);
				}
			}
			return childs;
		}
	}

	var settingsValues = _log.get('settings') || {};
	addSets(sets);
	function drawSets(sets) {
		var $sets = _elements.getTabInner('sets');
		var html = '';
		for (var i=0; i<sets.length;i++) {
			var st = sets[i];
			html +=
				'<div class="">' +
					'<div class="sets-header">' + (st.title||'') + '</div>' +
					drawSetsGroup(st.fields) +
				'</div>';
		}
		html = '<div class="settings-form form-horizontal">' + html + '</div>';
		$sets.append(html);
		$sets.find('input').each(function() {
			var $input = $(this);
			var name = $input.data('name');
			var value = $input.is('[type="checkbox"]') ? $input.prop('checked') : $input.val();
			var isDisabled = $input.closest('.input-wrap').hasClass('disabled')//.prop('disabled');
			checkDependences(name, !isDisabled && value);
		});
	}

	function init() {
		var $sets = _elements.getTabInner('sets');

		drawSets(sets);

		$sets
			.on('change', 'input', function() {
				var $input = $(this);
				var name = $input.data('name');
				var value = $input.is('[type="checkbox"]') ? $input.prop('checked') : $input.val();
				if ($input.data('type') == 'num') { value =+value; }
				settingsValues[name] = value;
				var isDisabled = $input.closest('.input-wrap').hasClass('disabled')//.prop('disabled');
				_ext.publish('settingsChange', name, value, isDisabled);
				_log.set('settings', settingsValues);
			})
			.on('click', '#reset-stats', function() {
				if (confirm('Будет сброшена вся история\nПродолжить?')) {
					_ext.log.set('messagesLog', '');
					_ext.trace.messagesLog.splice(0, _ext.trace.messagesLog.length);
					_ext.log.set('archiveGroups', '');
					_ext.archive.archiveGroups.splice(0, _ext.archive.archiveGroups.length);
					_ext.stats.drawStatsSide();
					_ext.elements.getTabInner('group').html('')
				}
			});
	}

	function drawSetsGroup(fields) {
//			console.log('drawSetsGroup', sets);
		var html = '';
		for (var i=0;i<fields.length;i++) {
			var st = fields[i];

			var inputsHtml = '';
			if (st.inputs) {
				inputsHtml = ' ' + st.inputs.map(drawInput).join('');
			}
			var label =
				'<div class="input-wrap ' + (st.isToggle ? 'checkbox' : '') + '">' +
					'<label>' +
						drawInput(st) +
						st.label +
					'</label>' +
					inputsHtml +
				'</div>';


			html +=
				'<div class="sets' + (st.isInline ? ' sets-inline' : '') + '">' +
					'<div class="sets-title">' +
						label +
						(st.note ? '<div class="note-block">' + st.note + '</div>' : '') +
					'</div>' +
					(st.subs ? drawSetsGroup(st.subs) : '') +
				'</div>';
		}
		_log.set('settings', settingsValues);

		return html;

		function drawInput(st) {
			if (typeof settingsValues[st.name] === 'undefined') settingsValues[st.name] = st.value;
			var html = '';
			if (st.isToggle || st.type === 'checkbox') {
				html = '<input type="checkbox" data-name="' + st.name + '""' + (settingsValues[st.name] ? ' checked' : '') + '> ';
			} else if (st.type === 'text' || st.type === 'num') {
				html = '<input type="text" class="input-tiny input-tiny-' + st.type + '"' +
					' data-name="' + st.name + '"' +
					(' data-type="' + st.type + '"') +
					(settingsValues[st.name] ? ' value="' + settingsValues[st.name] + '"' : '') + '>';
				if (st.addOn) {
					html = '<div class="input-wrap input-append">' + html + '<span class="add-on">' + st.addOn + '</span></div>';
				} else {
					html = '<div class="input-wrap input-wrap-inline">' + html + '</div>';
				}
			}
			return html;
		}
	}

	_ext.isMyName = function(str) {
		return str.indexOf(_settings.settingsValues.heroNameStart) >= 0;
	};


	$.extend(_settings, {
		init: init,
		addSets: addSets,
		drawSets: drawSets,
		getSettingInput: getSettingInput,
		settingsValues: settingsValues
	});
	return _settings;
})({});
_ext.subscribe('init', function() {
	_settings.init();
});

_ext.subscribe('preload', function() {
	if (!_settings.settingsValues.heroNameStart) {
		var heroName = _ext.heroName;
		_settings.settingsValues.heroNameStart = heroName.substring(0, Math.max(3, heroName.length-2));
		_settings.getSettingInput('heroNameStart').val(_settings.settingsValues.heroNameStart).trigger('change');
	}
});

_ext.subscribe('settingsChange', function(key, value) {
	if (key === 'heroNameStart') {
		_trace.traceInit();
		_ext.groupMessages.drawMessages( _ext.groupMessages.list );
	}
});

/* eo settings */


var lastNonifyMessagesText = '';
_ext.subscribe('newMessages', function(messagesNew, gameData) {
	var hero = gameData.account.hero;
	var _settingsValues = _settings.settingsValues;
	if (!_settingsValues.notify) return;
	var notifyMessages = [];
	if (_settingsValues.notifyHeroHp) {
		var health = hero.base.health;
		var healthMax = hero.base.max_health;
		var healthPercent = health / healthMax * 100;
		var minHp = _settingsValues.notifyHeroHpLowerPercent;
		if (healthPercent < minHp) {
			notifyMessages.push('Низкое здоровье: ' + Math.round(healthPercent) + '%');
		}
	}
	if (_settingsValues.notifyHeroEnergy) {
		var energy = hero.energy.value;
		var energyMax = hero.energy.max;
		var energyPercent = energy / energyMax * 100;
		var maxEnergy = _settingsValues.notifyHeroEnergyGreaterPercent;
		if (energyPercent > maxEnergy) {
			notifyMessages.push('Энергия накопилась: ' + energy + '');
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
		if (notifyMessagesText != lastNonifyMessagesText) {
			_notification.sendNotify('The Tale Extended - ' + _ext.heroName, {
				tag: 'send',
				body: notifyMessagesText
			});
		}
		lastNonifyMessagesText = notifyMessagesText;
	}
});





/* trace */
var _trace = (function(_trace) {

	var messagesLog = _log.get('messagesLog') || [];
	function traceInit() {
		for (var i=0; i<messagesLog.length; i++) {
			var messageNew = messagesLog[i];
			messageNew[4] = _ext.parse.short(messageNew[2]) || false;
		}
	}

	function traceData(game_data) {

		var hero = game_data.account.hero;
		if (!hero) return;
		var heroData = {
			action: {
				description: hero.action.description,
				type: hero.action.type,
				info_link: hero.action.info_link,
				is_boss: hero.action.is_boss,
				percents: hero.action.percents
			},
			base: {
				health: hero.base.health,
				max_health: hero.base.max_health,
				level: hero.base.level,
				alive: hero.base.alive,
				money: hero.base.money
			},
			energy: {
				bonus: hero.energy.bonus,
				max: hero.energy.max,
				value: hero.energy.value
			},
			secondary: {
//					initiative: hero.secondary.initiative,
				loot_items_count: hero.secondary.loot_items_count,
//					max_bag_size: hero.secondary.max_bag_size,
//					move_speed: hero.secondary.move_speed,
				power: hero.secondary.power
			},
			turn: game_data.turn.number
		};

		var lastLog = messagesLog[messagesLog.length-1] || [];
		var lastTimestamp = lastLog[0];
		var messagesPack = hero.messages;
		messagesPack[messagesPack.length-1][3] = heroData;
		var messagesPackTimestamp = messagesPack[messagesPack.length-1][0];
		var messagesNew = [];
		for (var i=0; i<messagesPack.length; i++) {
			if (!lastTimestamp || messagesPack[i][0] > lastTimestamp) {
				var messageNew = messagesPack[i];
//					if (messagesPackTimestamp === messageNew[0]) messageNew[3] = heroData;
				messageNew[3] = messageNew[3] || false;
				messageNew[4] = _ext.parse.short(messageNew[2]) || false;

				messagesLog.push(messageNew);
				messagesNew.push(messageNew);
			}
		}
		_log.set('messagesLog', messagesLog.map(function(item) { return [item[0], item[1], item[2], item[3]]; }));
		_trace.heroData = heroData;

		_ext.publish('newTurn', messagesNew, game_data, messagesPackTimestamp);
		if (messagesNew.length) {
			_ext.publish('newMessages', messagesNew, game_data, messagesPackTimestamp);
		}
	}
	function traceStart() {
		$(document).bind(pgf.game.events.DATA_REFRESHED + '.ext-trace', function(e, game_data){
			traceData(game_data);
		});
	}
	function traceStop() {
		$(document).unbind(pgf.game.events.DATA_REFRESHED + '.ext-trace');
	}


	$.extend(_trace, {
		messagesLog: messagesLog, //.slice(messagesLog.length - 500)
		traceData: traceData,
		traceInit: traceInit,
		traceStart: traceStart,
		traceStop: traceStop
	});

	return _trace;
})({});

_ext.subscribe('init', function(game_data) {
	_trace.traceInit();
	_trace.traceStart();
});
/* eo trace */

_ext.subscribe('newMessages', function(messagesNew, gameData, timestamp) {


	_log.set('game_data', gameData);
	var hero = gameData.account.hero;
	var levelsLog = _log.get('levelsLog') || [];
	var lastLevel = (levelsLog[levelsLog.length-1] || [])[1];
	if (hero.base.level !== lastLevel) {
		console.info('level up!', hero.base.level);
		levelsLog.push([timestamp, hero.base.level]);
		_log.set('levelsLog', levelsLog);
	}
	var powersLog = _log.get('powersLog') || [];
	powersLog = powersLog.filter(function(t) { return typeof t[1] === 'number'; } );
	var lastPower = (powersLog[powersLog.length-1] || [])[1];
	var powerSum = hero.secondary.power[0] + hero.secondary.power[1];
	if (powerSum !== lastPower) {
		console.info('power up!', powerSum);
		powersLog.push([timestamp, powerSum]);
		_log.set('powersLog', powersLog);
	}
	_ext.trace.lastGameData = gameData;
});


_ext.subscribe('init', function() {
	$('#pgf-journal-container').on('click', '[data-ts]', function() {
		var timestamp = $(this).data('ts');
		_trace.messagesLog.forEach(function(message) {
			if (message[0] === timestamp) {
				console.log(message);
			}
		});
	});
	$('#pgf-journal-container').on('click', '[data-click]', function() {
		console.log($(this).data('click'));
	});
});

$('body').on('click', '.group-toggle', function() {
	$(this).closest('.group').toggleClass('open');
});



/* elements */
var _elements = (function(_elements) {
	var tabs = {};
	var $mainRoot = $('#pgf-map-container').parent().parent();
	var $diaryRoot = $('#pgf-diary-container').parent().parent();
	var $equipRoot = $('#pgf-equipment-container').parent().parent();

	var $mainTabs = $mainRoot.children('.nav-tabs');
	var $diaryTabs = $diaryRoot.children('.nav-tabs');
	var $equipTabs = $equipRoot.children('.nav-tabs');
	var $mainContainer = $mainRoot.children('.tab-content');
	var $mainMilldeContainer = $('#log-block').parent();
	var $diaryContainer = $diaryRoot.children('.tab-content');
	var $equipContainer = $equipRoot.children('.tab-content');

	$mainTabs.on('click', '.pgf-journal-tab-button', function() {
		var journal = $(this).data('journal');
		if (journal) activeTab(journal);
		else {
			$('#log-block').show().siblings().hide();
			$('#pgf-journal-container').addClass('active').siblings().removeClass('active');
		}
	});
	function addTab(name, opts) {
		var zone = opts.zone || 'main';
		var $tabs;
		var $container;
		if (zone === 'main') {
			$tabs = $mainTabs;
			$container = $mainContainer;
		} else if (zone === 'mainMiddle') {
			$tabs = $mainTabs;
			$container = $mainMilldeContainer;
		} else if (zone === 'diary') {
			$tabs = $diaryTabs;
			$container = $diaryContainer;
		} else if (zone === 'equip') {
			$tabs = $equipTabs;
			$container = $equipContainer;
		}

		var $tab;
		var $content;
		if (zone === 'mainMiddle') {
			$tab = $('<li class="pull-right"><a href="#pgf-journal-container" class="pgf-journal-tab-button" data-toggle="tab" data-journal="'+name+'">'+opts.title+'</a></li>');
			$content = $('<div class="block log-block" id="log-block-'+name+'" style="display: none"></div>');
		} else {
			$tab = $('<li' + (zone === 'main' ? ' class="pull-right"' : '') + '><a href="#pgf-'+name+'-container" class="pgf-'+name+'-tab-button" data-toggle="tab">'+opts.title+'</a></li>');
			$content = $('<div class="tab-pane ' + (zone === 'main' ? ' span8' : zone === 'diary' ? 'block log-block' : '') + '" id="pgf-'+name+'-container"></div>');
		}
		$tabs.append($tab);
		$container.append($content);

		var $inner = $content;
		if (opts.content) {
			$inner = $(opts.content).appendTo($content);
		}

		tabs[name] = {
			zone: zone,
			$tab: $tab,
			$content: $content,
			$inner: $inner
		};
		return $inner;
	}
	function getTabInner(name) {
		return tabs[name].$inner;
	}
	function getTab(name) {
		return tabs[name].$tab;
	}

	function activeTab(name) {
		tabs[name].$tab.addClass('active').siblings().removeClass('active');
		if (tabs[name].zone === 'mainMiddle') {
			$('#pgf-journal-container').addClass('active').siblings().removeClass('active');
			tabs[name].$content.show().siblings().hide();
		} else {
			tabs[name].$content.addClass('active').siblings().removeClass('active');
		}
	}

	var controls = {};
	var $controls = $('<div class="ext-controls pull-right"></div>').insertAfter('#current-action-block, #pvp-info-block');
	function addControl(name, opts) {
		var html = '<span class="ext-control link-ajax" id="ext-' +  name + '" title="' + opts.title + '">' + (opts.content || '') + '</span>';

		var $el = $(html).appendTo($controls);
		controls[name] = {
			$el: $el
		};
		return $el;
	}
	function getControl(name) {
		return controls[name].$el;
	}

	$.extend(_elements, {
		addTab: addTab,
		activeTab: activeTab,
		getTab: getTab,
		getTabInner: getTabInner,

		addControl: addControl,
		getControl: getControl
	});
	return _elements;
})({});

/* eo elements */

_elements.addTab('sets', {zone: 'mainMiddle', title: 'настройки'});
//	_elements.addTab('stats', {zone: 'mainMiddle', title: 'статистика'});
_elements.addTab('archive', {zone: 'mainMiddle', title: 'архив'});
_elements.addTab('group', {zone: 'mainMiddle', title: 'кратко'});
_elements.addTab('towns', {zone: 'diary', title: 'города'});
_ext.subscribe('init', function() {
	_elements.activeTab('group');
});


_elements.addControl('journal-log', {title: 'Журнал', content: '<span class="value"></span> <span class="glyphicon glyphicon-th-list"></span></span>'})
	.on('click', function() { _log.toConsole('messagesLog'); });

_elements.addControl('archive-log', {title: 'Архив', content: '<span class="value"></span> <span class="glyphicon glyphicon-th"></span></span>'})
	.on('click', function() { _log.toConsole('archiveGroups'); });


_ext.subscribe('newTurn', function(messagesNew) {
	window.setTimeout(function() {
		_ext.elements.getControl('journal-log')
			.find('.value').text(_trace.messagesLog.length);

		_ext.elements.getControl('archive-log')
			.find('.value').text(_ext.archive.archiveGroups.length);

		$('#storage-size')
			.text('(занято ' + Math.round( _ext.log.size() / 1024 / 1024 * 100 )/100 + ' из 5Мб)');
	}, 10);
});


/* notifications */
var _notification = (function(_notification) {
	var rndStr = Math.random() + '';

	function request() {
		if (Notification.permission.toLowerCase() !== 'granted') {
			Notification.requestPermission( newMessage );
		}
		function newMessage(permission) {
			if( permission !== "granted" ) return false;
			var notify = new Notification("Thanks for letting notify you");
			return true;
		}
	}
	$('body').one('click', request);



	function sendNotify(name, options) {
//			if (!_settings.settingsValues.notify) return;

		var d = new Date();
		var h = d.getHours();
		var m = d.getMinutes();
		var time = h + ':' + (m<10?'0'+m:m);
		var nt = new Notification(name, {
			tag: options.tag + rndStr,
			body: options.body + (options.addTime ? '\n' + time : ''),
			icon: options.icon || (window.extPass + 'img/128.png')
		});
		nt.onclick = nt.onclose = function() {
			rndStr = Math.random() + '';
		};
	}


	$.extend(_notification, {
		sendNotify: sendNotify
	});
	return _notification;

})({});


/* quests */
var _quests = (function(_quests) {
	var lastQusets;
	function checkQuests(quests) {
		var line = quests[1].line;
		var lineOld = lastQusets && lastQusets[1] && lastQusets[1].line || [];
		var newLines = [];
		for (var i=0; i<line.length; i++) {
			var q = line[i];
			var qOld = lineOld[i];
			if (!qOld || !isSameQuest(q, qOld)) {

				if (_settings.settingsValues.notifyQuestChoose && q.choice_alternatives && q.choice_alternatives.length) {
//					console.info('quest!', q.type, _ext.heroName + ' ' + q.action + '!', q);
					if (_settings.settingsValues.notify) {
						_notification.sendNotify(q.name,  {
							tag: 'quest',
							body: _ext.heroName + ' ' + q.action + '!',
							icon: window.extPass + 'img/quest/caravan.png', //window.extPass + 'img/quest/' + q.type + '.png',
							addTime: 1
						});
					}
				} else {
//					console.info('quest.', q.type, q.experience, q.power, _ext.heroName + ' ' + q.action + '!', q);
				}
				newLines.push(q);

			}
		}
		if (newLines.length) {
			_ext.publish('questUpdate', line);
		}
		lastQusets = quests;
	}

	function isSameQuest(q1,q2) {
		var tests = ['action', 'choice', 'name', 'type', 'uid'];
		for (var s in tests) if (tests.hasOwnProperty(s)) {
			var key = tests[s];
			if (q1[key] !== q2[key]) return false;
		}
		return true;
	}

	$.extend(_quests, {
		checkQuests: checkQuests
	});
	return _quests;
})({});

_ext.subscribe('preload', function() {
	_ext.subscribe('newMessages', function(messagesNew, game_data) {
		var hero = game_data.account.hero;
		var quests = hero.quests.quests;
		_quests.checkQuests(quests);
	});
});
/* questss */



/* utils functions */

var _utils = {};
_utils.capitalize = function(text) {
	return text.substring(0,1).toUpperCase() + text.substring(1);
};
_utils.declenstionByNumber = function(number, titles, addCount) {
	return (addCount ? number + ' ' : '' ) + titles[ (number%100>4 && number%100<20)? 2 : [2, 0, 1, 1, 1, 2][(number%10<5)?number%10:5] ];
};
_utils.timeSpan = function(timeSpan) {
	timeSpan = timeSpan|0;
	var h = (timeSpan / 60 / 60)|0;
	var m = ((timeSpan / 60)|0) % 60;
	var s = timeSpan % 60;
	return (h ? h + ':' : '') + (m<10?'0':'') + m + ':' + (s<10?'0':'') + s ;
};

/* eo utils functions */


_ext.store = _store;
_ext.settings = _settings;
_ext.elements = _elements;
_ext.quests = _quests;
_ext.notification = _notification;
_ext.utils = _utils;
_ext.elements = _elements;
_ext.log = _log;
_ext.trace = _trace;
