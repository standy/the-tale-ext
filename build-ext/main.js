window.ext = (function(_ext) {
	"use strict";

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



_ext.waitForInit = 1;
_ext.const = {
	MAX_LOG_LENGTH: 1000,
	MAX_ARCHIVE_LENGTH: 5000,
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

var _store = _ext.store = (function() {
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
//					var max = _ext.const.MAX_LOG_LENGTH;
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


_ext.settings = _settings;
_ext.elements = _elements;
_ext.quests = _quests;
_ext.notification = _notification;
_ext.utils = _utils;
_ext.elements = _elements;
_ext.log = _log;
_ext.trace = _trace;



var _parse = (function(_parse) {

	var parseShortRaw = [
		/* --pvp-- */
		'[pvpeff]Мощный поток энергии вздыбил землю вокруг {actor}. Эффективность {} увеличена на {eff} единиц(а|у|ы).',
		'[pvpeff]Кровь на мгновение застилает глаза {actor}. Эффективность увеличена на {eff} единиц(а|у|ы).',
		'[pvpeff]{actor} почувствовал(а|о|и) как (его|ее|их) мышцы крепчают, а сознание очищается. Эффективность боя увеличилась на {eff} единиц(а|у|ы).',
		'[pvpeff]Хранитель усилил связь с {actor} и увеличил (его|ее|их) эффективность на {eff} единиц(а|у|ы).',

		'[pvpice]Хранитель {actor} сконцентрировался и увеличил скорость прироста энергии.',
		'[pvpice]Холодная голова и кристально чистые мысли помогли хранителю {actor} увеличить скорость прироста энергии.',

		'[pvpflame]Хранитель {actor} нарушил(а|о|и) концентрацию противник(а|ов) и уменьшил скорость прироста (его|ее|их) энергии.',

		'[pvpfail]Тучи за спиной {actor} сошлись… И снова разошлись, ничего не произошло.',
		'[pvpfail]Хранитель {actor} не смог сконцентрироваться и потратил энергию впустую.',
		'[pvpfail]Хранителю не хватило концентрации для установления связи с {actor}. Энергия ушла в никуда.',


		/* dmg */
		'[hit]Изучив тактику {victim}, {actor} провел(а|о|и) атаку и нанес(ла|ло|ли) {value} единиц(у|а|ы) урона.',
		'[hit]Сосредоточившись, {actor} провел(а|о|и) атаку и лишил(а|о|и) {victim} {value} HP.',
		'[hit]Обманув {victim}, {actor} смог(ла|ло|ли) провести неожиданную атаку, лишив противник(а|ов) {value} HP.',
		'[hit]Усыпив бдительность {victim}, {actor} набросил(ся|ась|ось|ись) на противник(а|ов) и нанес(ла|ло|ли) {value} единиц(у|а|ы) урона.',
		'[hit]{actor} нанес(ла|ло|ли) точный удар, уменьшая здоровье {victim} на {value} HP.',
		'[hit]Апперкот, и вокруг {victim} взметнул(ась|ись) {value} звездоч(ка|ки|ек).',
		'[hit]Быстрая атака {actor} лишила {victim} {value} HP.',
		'[hit]{actor} виртуозно провел(а|о|и) атаку и нанес(ла|ло|ли) {victim} {value} единиц(у|а|ы) урона.',
		'[hit]Рассекающий удар {actor} нанёс(ла|ло|ли) {value} единиц(у|а|ы) урона {victim}.',
		'[hit]Стоило только {victim} замахнуться, как {actor} резко ударил(а|о|и) (его|ее|их) по больному месту и нанес(ла|ло|ли) {value} единиц(у|а|ы) урона.',
		'[hit]Умелая подсечка, и придорожный камень нанёс голов(е|ам) {victim} {value} урона.',
		'[hit]Ловко парировав удар, {actor} провод(ит|ят) успешный контрудар, лишая {victim} {value} HP.',
		'[hit]{actor} поцарапал(а|о|и) {victim} на {value} HP.',
		'[hit]{actor} быстро прицелил(ся|ась|ось|ись), изготовил(ся|ась|ось|ись) и в стремительном рывке обрушил(а|о|и) разящий удар в {value} единиц(у|а|ы) урона на {victim}.',
		'[hit]{victim} пропустил(а|о|и) удар и теперь страда(ет|ют) отсутствием {value} HP.',
		'[hit]{victim} пропуска(ет|ют) лёгкий тычок в {value} единиц(у|ы) урона.',
		'[hit]Быстрота реакции {actor} помогла (ему|ей|им) нанести {victim} {value} единиц(у|а|ы) урона.',
		'[hit]{actor} отош(ел|ла|ло|ли) в сторону, и {victim} с разбега врезал(ся|ась|ось|ись) в стену, потеряв {value} HP.',
		'[hit]{actor} поднатужил(ся|ась|ось|ись) и нанес(ла|ло|ли) {value} единиц(у|а|ы) урона.',
		'[hit]С кошачьей грацией {actor} извернул(ся|ась|ось|ись) и нанес(ла|ло|ли) {value} единиц(у|а|ы) урона.',
		'[hit]{actor} точным ударом поразил(а|о|и) {victim} на {value} единиц(у|а|ы) урона.',
		'[hit]{victim} потерял(а|о|и) {value} HP, пропустив атаку {actor}.',
		'[hit]«Скрытая атака»! — заорал(а|о|и) {actor} и выбил(а|о|и) из {victim} {value} HP.',
		'[hit]Замахиваясь, {victim} пропустил(а|о|и) резкий и быстрый выпад {actor}, забравший {value} HP.',
		'[hit]Молниеносная атака {actor} нанесла {value} единиц(у|а|ы) урона.',
		'[hit]После обмена серией стремительных ударов с {victim}, {actor} наконец наш(ел|ла|ло|ли) брешь в защите и нанес(ла|ло|ли) {value} единиц(у|а|ы) урона.',
		'[hit]Кувырком уходя из-под удара и контратакуя, {actor} сумел(а|о|и) нанести {victim} {value} единиц(у|а|ы) урона.',
		'[hit]{victim} приготовил(ся|ась|ось|ись) парировать удар, но не ожидал(а|о|и) от {actor} такой стремительности и теря(ет|ют) {value} HP.',
		'[hit]{victim} не ожидал(а|о|и) такого выпада от {actor} и получа(ет|ют) {value} единиц(у|а|ы) урона.',
		'[hit]{actor} провод(ит|ят) сногсшибательный приём, {victim} пада(ет|ют) и теря(ет|ют) {value} HP.',
		'[hit]Вложив всю злость в удар, {actor} нанес(ла|ло|ли) {value} единиц(у|а|ы) урона.',
		'[hit]{actor} поднатужил(ся|ась|ось|ись) и нанес(а|о|и) {value} единиц(у|а|ы) урона.',
		'[hit]Издавая зловещие звуки, {actor} сжима(ет|ют) {} что есть силы в своих объятиях! {victim} кряхт(ит|ят) и получа(ет|ют) {value} единиц(у|а|ы) урона.',
		'[hit]{Victim} не ожидал(а|о|и) такого выпада от {actor}, и получа(е|ю)т {value} единиц(у|а|ы) урона.',

		/* might */
		'[might]Как следует размахнувшись, {actor} одним сильным ударом вынес(ла|ло|ли) из {victim} {value} HP.',
		'[might]Вложив всю свою силу в удар, {actor} нанес(ла|ло|ли) {victim} {value} единиц(у|а|ы) урона.',
		'[might]После короткого и очень сильного удара {actor}, по телу {victim} прокатилась волна боли на {value} единиц(у|а|ы) урона.',
		'[might]Сильнейший удар обрушил(а|о|и) {actor}, выколачивая из {victim} {value} HP.',
		'[might]{victim} потерял(а|о|и) {value} HP от чрезвычайно сильного удара {actor}.',
		'[might]Собрав всю злобу и силу в один удар, {actor} уменьшил(а|о|и) здоровье {victim} на {value} HP.',
		'[might]{actor} размахнул(ся|ась|ось|ись) сильнее обычного и нанес(ла|ло|ли) {value} единиц(у|а|ы) урона.',
		'[might]Взяв размах от плеча, {actor} сокрушительным ударом выбил(а|о|и) из {victim} {value} HP.',

		/* magic */
		'[poison]Яд тянет из {victim} силы и {value} HP.',
		'[poison]{victim} чувству(ет|ют) себя всё хуже. Отравление съедает {value} HP.',
		'[poison]Отрава вытягивает из {victim} {value} HP.',
		'[poison]Яд неумолимо отнимает здоровье {victim}. Еще {value} HP потрачен(о|ы) на борьбу с отравой.',
		'[poison]Чувствуя действие яда всё сильнее, {victim} теря(е|ю)т {value} HP.',
		'[poison]{victim} теря(е|ю)т {value} HP от отравления.',
		'[poison]Головокружение и тошнота — не самое страшное, куда серьёзней {victim} показалась потеря {value} HP.',
		'[poison]Отрава вытягивает из {victim} {value} HP.',
		'[poison]{victim} отравлен(а|о|ы) и теря(е|ю)т {value} единиц(у|ы) здоровья.',
		'[poison]{victim} страда(е|ю)т от отравления, получая {value} единиц(у|ы) урона.',
		'[poison]Медленно убивая {victim} изнутри, отравление наносит {value} единиц(у|ы) урона.',
		'[poison]Сильное отравление лишает {victim} {value} HP.',
		'[poison]Нанося {victim} {value} единиц(у|ы) урона, отравление грозит (ему|ей|им) летальным исходом.',
		'[poison]Охваченн(ый|ая|ое|ые) ядовитыми парами, {victim} теряет {value} HP.',
		'[poison]Смерть подступает всё ближе, и {victim} теря(е|ю)т от отравления {value} HP.',
		'[poison]Яд растекается по венам {victim}. Он(а|о|и) теря(е|ю)т {value} HP.',
		'[poison]{victim} задыха(е|ю)тся и кашля(е|ю)т в созданном {actor} ядовитом облаке.',

		'[poisoncloud]{victim} оказал(ся|ась|ось|ись) в созданном {actor} облаке яда.',
		'[poisoncloud]Быстро создав ядовитое облако, {actor} окутал(а|о|и) им {victim}.',
		'[poisoncloud]{actor} создал(а|о|и) вокруг {victim} ядовитое облако.',
		'[poisoncloud]{victim} задыха(е|ю)тся и кашляет в созданном {actor} ядовитом облаке.',
		'[poisoncloud]Ядовитое облако, сотворённое {actor}, окутало {victim}.',
		'[poisoncloud]Ядовитое облако, созданное {actor}, обволокло {victim}.',
		'[poisoncloud]{actor} создал(а|о|и) странный пар вокруг {victim} и (тот|та|то|те) начал(а|о|и) задыхаться.',
		'[poisoncloud]{actor} создал(а|о|и) ядовитое облако вокруг {victim}.',


		/* vampire */
		'[vamp]Жаждая крови {victim}, {actor} вонзил(а|о|и) зубы в (его|ее|их) тело. От такой атаки {victim} потерял(а|о|и) {value} HP, а {} приобрел(а|о|и) {vamp} HP.',
		'[vamp]Вконец остервенев от злости, {actor} вцепил(ся|ась|ось|ись) зубами в {victim} и нанес(ла|ло|ли) (ему|ей|им) {value} единиц(у|ы) урона, при этом восстановив {vamp} HP.',
		'[vamp]{actor} вспомнил(а|о|и), что из оружия у (него|нее|ней|них) есть ещё и зубы. Вцепившись ими в {victim}, он(а|о|и) восстановил(а|о|и) {vamp} HP и нанес(ла|ло|ли) противник(у|ам) {value} единиц(у|ы) урона.',
		'[vamp]Хорошо прицелившись, {actor} прыгнул(а|о|и) и впил(ся|ась|ось|ись) зубами в {victim}, нанеся (ему|ей|им) {value} единиц(у|ы) урона и восстановив себе {vamp} HP.',
		'[vamp]Выждав подходящий момент для сложной атаки, {actor} с силой грызанул(а|о|и) {victim} и, почувствовав (его|ее|их) кровь, восстановил(а|о|и) {vamp} HP. От укуса {} потерял(а|о|и) {value} HP.',
		'[vamp]{actor} зубами впил(ся|ась|ось|ись) в {victim}, нанес(ла|ло|ли) {value} единиц(у|а|ы) урона и восстановил(а|о|и) {vamp} HP.',
		'[vamp]Даже самая толстая кожа не спасла бы от укуса {actor}. {victim} проща(е|ю)тся с {value} HP, из которых {vamp} HP переход(и|я)т к {}.',
		'[vamp]{actor} вытянул(а|о|и) из {} {value} HP и излечил(а|о|и) свои раны на {vamp} HP.',


		/* evasion */
		'[ue]Серией быстрых движений {actor} дезориентиру(ет|ют) {victim}.',
		'[ue]{actor} ловко уш(ел|ла|ло|ли) в сторону от {victim}.',
		'[ue]{actor} мастерски уш(ел|ла|ло|ли) от атаки {victim}.',

		'[eva]{actor} носит(ся|ась|ось|ись) кругами вокруг {victim}, вынуждая (его|ее|их) промахнуться.',

		'[eva]Отточенным движением {actor} уш(ел|ла|ло|ли) из-под удара.',
		'[eva]{actor} увернул(ся|ась|ось|ись) от {victim} и (его|ее|их) чудовищной силы удара.',
		'[eva]{actor} увернул(ся|ась|ось|ись) от удара.',
		'[eva]{actor} резко качнул(ся|ась|ось|ись) в сторону и {victim} промахнул(ся|ась|ось|ись).',
		'[eva]{actor} провел(а|о|и) обманное движение, и {victim} промазал(а|о|и).',

		'[eva]Солнце ослепило {victim}, и (тот|та|то|те) промахнул(ся|ась|ось|ись) по {actor}.',
		'[eva]{victim} слишком долго собирал(ся|ась|ось|ись) с мыслями, и удар пришёлся в никуда.',
		'[eva]{victim} «крякнул(а|о|и)» и промахнул(ся|ась|ось|ись).',
		'[eva]Перемудрив с обманными движениями, {victim} промахнул(ся|ась|ось|ись).',
		'[eva]{victim} поднатужил(ся|ась|ось|ись)… и промахнул(ся|ась|ось|ись)…',
		'[eva]{victim} промахнул(ся|ась|ось|ись)! {victim} промахнул(ся|ась|ось|ись)!',
		'[eva]{actor} вовремя подал(ся|ась|ось|ись) назад, и {victim} промахнул(ся|ась|ось|ись).',
		'[eva]{actor} успел(а|о|и) отбежать подальше, пока {victim} замахивал(ся|ась|ось|ись).',
		'[eva]Слишком сильно размахнувшись, {victim} сбил(ся|ась|ось|ись) с темпа и не попал(а|о|и) по {actor}.',
		'[eva]Сильнейший удар {victim} со свистом рассёк воздух, даже не задев {actor}.',
		'[eva]Попавшая в глаз {victim} соринка сорвала атаку, и он(а|о|и) промахнул(ся|ась|ось|ись).',
		'[eva]{victim}, готовясь к сильному удару, совсем забыл(а|о|и) о точности и промахнул(ся|ась|ось|ись).',
		'[eva]Явно считая, что сила есть, а точности не надо, {victim} промахнул(ся|ась|ось|ись) по {actor}.',

		'[eva,fire]Слишком долго готовясь к атаке, {victim} упустил(а|о|и) подходящий момент, и (его|ее|их) огненный шар не попал в цель.',
		'[eva,fire]{victim} запустил(а|о|и) шар огня в {}, но не тут-то было! {actor} виртуозно уклонил(ся|ась|ось|ись) от пламени.',
		'[eva,stunHit]{victim} разбежал(ся|ась|ось|ись) и пронес(ся|лась|лось|лись) мимо {actor}.',
		'[eva,stunHit]{victim} бросил(ся|ась|ось|ись) в сторону {actor}, но увы, проскочил(а|о|и) мимо.',
		'[eva,vamp]{victim} клацнул(а|о|и) зубами рядом с {actor}, не сумев вцепиться в (него|нее|них).',
		'[eva,vamp]{actor} ускользнул(а|о|и) от зубов {victim}.',
		'[eva,vamp]{victim} укусил(а|о|и) себя вместо {actor}.',
		'[eva,vamp]Слишком сильно открыв рот для укуса, {victim} ощутил(а|о|и) боль в челюсти и не смог(ла|ло|ли) укусить {actor}.',
		'[eva,vamp]{victim} попытал(ся|ась|ось|ись) укусить {actor}, но промахнул(ся|ась|ось|ись).',
		'[eva,vamp]{victim} раззявил(а|о|и) рот, но подходящий для укуса момент уже был упущен.',
		'[eva,vamp]{victim} промахнул(ся|ась|ось|ись), бесполезно клацнув зубами.',

		/* magic */
		'[slow]Легко, почти непринуждённо, {actor} охлажда(ет|ют) воздух вокруг {victim}, сковывая (его|ее|их) движения.',
		'[slow]{actor}, сосредоточившись, ударил(а|о|и) {victim} потоком липкого холодного воздуха, сковав (его|ее|их) члены и замедлив движения.',
		'[slow]Собравшись, {actor} направля(ет|ют) инеевые искры в сторону врага. Воздух вокруг {victim} замерзает и густеет, замедляя (его|ее|их) движения.',
		'[slow]{actor} взывает к зимним ветрам и {victim} окутывает ужасный холод, (его|ее|их) движения замедляются.',
		'[slow]Призывая в помощь зимние ледяные ветра, {actor} бьет холодом, и {victim}, покрываясь инеем, замедля(ется|ются).',
		'[slow]{actor} встряхнул(а|о|и) кисти рук и на кончиках (его|ее|их) пальцев образовались ледяные иглы. Сконцентрировавшись, (он|она|оно|они) нанес(ла|ло|ли) удар холодом. Движения {victim} замедлились.',
		'[slow]Собравшись, {actor} направляет инеевые искры в сторону враг(а|ов). Воздух вокруг {victim} замерзает и густеет, замедляя (его|ее|их) движения.',
		'[slow]{actor} сделал(а|о|и) глубокий вдох и резко выдохнул(а|о|и). {victim} ощутил(а|о|и) как идёт мороз по коже и замедляются (его|ее|их) движения.',
		'[slow]{actor} вызыва(е|ю)т лютую стужу и направля(е|ю)т холод в сторону {victim}, замедляя (его|ее|их) движения.',

		'[speed]Скорость движений {actor} сильно возросла после того как он(а|о|и) сделал(а|о|и) магический пасс.',
		'[speed]{actor} использу(е|ю)т скрытые резервы организма и заметно ускоря(е|ю)тся.',
		'[speed]{actor} перенаправля(е|ю)т свою ци в нижнее русло и начина(е|ю)т двигаться быстрее.',
		'[speed]{actor} замыка(е|ю)т на себе потоки магии и начина(е|ю)т двигаться значительно быстрее.',
		'[speed]{actor} концентрируется и скорость (его|ее|их) движений возрастает.',
		'[speed]Обуздав стихию ветра, {actor} ускоря(е|ю)т движения.',
		'[speed]Воспользовавшись магией, {actor} начина(е|ю)т двигаться невероятно быстро.',
		'[speed]{actor} сотворя(е|ю)т сложный знак и значительно ускоря(е|ю)тся.',
		'[speed]Сделав сложный пасс, {actor} начина(е|ю)т двигаться быстрее.',

		'[mush]«Волшебный гриб!» — воскликнул(а|о|и) {actor}, запихивая в рот мухомор.',
		'[mush]Откуда-то {actor} достал(а|о|и) и отправил(а|о|и) в рот волшебный синий гриб.',

		'[fire]{actor} броса(ет|ют) огненный шар в {victim} и сжига(ет|ют) (ему|ей|им) {value} HP.',
		'[fire]{actor} кида(ет|ют) огненный шар, опалив {victim} и нанеся {value} единиц(у|ы) урона (его|ее|их) здоровью.',
		'[fire]{actor} концентриру(ет|ют) магическую энергию и выпуска(ет|ют) пылающий огненный шар. {victim} получа(ет|ют) урон в {value} HP и сильные ожоги.',
		'[fire]{actor} выпустил(а|о|и) два огненных шара, но {victim} ловко увернул(ся|ась|ось|ись) и уже готовил(ся|ась|ось|ись) к удару, как оба шара, закрутившись по спирали, развернулись и врезались (ему|ей|им) в спину. Коварное самонаводящееся заклинание нанесло {value} единиц(у|ы) урона и подожгло {}.',
		'[fire]{actor} создал(а|о|и) огненный шар и направил(а|о|и) его прямо во врага… Есть контакт! Повреждение — {value} единиц(а|у|ы) урона.',
		'[fire]Выпущенный {actor} шар огня ожёг {victim} на {value} HP.',
		'[fire]Взывая к пламени, {actor} выпуска(ет|ют) огненный шар в ничего не подозревающ(его|ую|ее|их|ий) {victim}, уменьшая (его|ее|их) здоровье на {value} HP.',
		'[fire]Взывая к пламени, {actor} выпуска(ет|ют) огненный шар в ничего не подозревавший {victim}, уменьшая (его|ее|их) здоровье на {value} HP.',//err
		'[fire]{victim} не успел(а|о|и) увернуться от возникшего прямо из воздуха всполоха пламени. От ожогов (он|она|оно|они) потерял(а|о|и) {value} HP.',

		'[fire]{actor} выпустил(а|о|и) шар огня. Волшебное пламя нанесло {value} единиц(у|ы) урона ошарашенн(ому|ой|ым) {victim}.',
		'[fire]Почувствовав тепло, {actor} сформировал(а|о|и) его в огненный шар и ударил(а|о|и) им по {victim}, нанеся {value} единиц(у|ы) урона.',
		'[fire]{actor} взмахива(е|ю)т руками и магическое пламя стремительно покрывает {victim}, забирая {value} HP.',

		'[flame]Теряя {value} HP, {victim} пыта(ется|ются) сбить с себя пламя.',
		'[flame]Пламя окутывает {victim}, нанося {value} единиц(у|ы) урона.',
		'[flame]Вместе с запахом палёного ветер уносит в сторону от {victim} {value} HP.',
		'[flame]Хрустящей корочки ещё нет, но {value} HP у {victim} уже сгорело.',
		'[flame]Жаркое пламя наносит {victim} {value} единиц(у|ы) урона.',
		'[flame]Подожженн(ый|ая|ое|ые) {victim} теря(ет|ют) {value} HP.',
		'[flame]{victim} стара(ется|ются) сбить с себя пламя, но оно всё равно сжигает {value} HP.',
		'[flame]Весёлые языки пламени пляшут по {victim}, нанося {value} единиц(у|ы) урона.',
		'[flame]Пламя слизывает с {victim} {value} HP, как корова языком.',
		'[flame]Безжалостный огонь наносит {victim} {value} единиц(у|ы) урона.',
		'[flame]Пламя в недоступном месте вызвало у {victim} ужасную боль и нанесло {value} единиц(у|ы) урона.',
		'[flame]{victim} горит и получа(ет|ют) {value} единиц(у|ы) урона.',
		'[flame]Языки пламени гуляют по {victim}, и (он|она|оно|они) теря(ет|ют) {value} HP.',
		'[flame]Охваченн(ый|ая|ое|ые) огнём, {victim} лишил(ся|ась|ось|ись) {value} HP.',
		'[flame]{victim} меч(е|у)тся, охваченн(ый|ая|ое|ые) пламенем, и получа(е|ю)т {value} единиц(у|ы) урона.',
		'[flame]{victim} пыла(е|ю)т словно факел(ы) и получа(е|ю)т {value} единиц(у|ы) урона.',
		'[flame]От ожогов {victim} получа(е|ю)т {value} единиц(у|ы) урона.',

		'[stunHit]{actor} разбежал(ся|ась|ось|ись) и в прыжке, толкнув {victim}, нанес(ла|ло|ли) {value} единиц(у|ы) урона.',
		'[stunHit]{actor} с разбега пнул(а|о|и) {victim} и нанес(ла|ло|ли) {value} единиц(у|ы) урона.',
		'[stunHit]Разбежавшись, {actor} толкнул(а|о|и) {victim}, выколачивая из (него|нее|них) {value} HP.',
		'[stunHit]Набрав скорость, {actor} врезал(ся|ась|ось|ись) всей массой в противника. {victim} получил(а|о|и) ушибы и потерял(а|о|и) {value} HP.',
		'[stunHit]Немного отступив, {actor} разогнал(ся|ась|ось|ись) и толчком нанес(ла|ло|ли) {victim} {value} единиц(у|ы) урона.',
		'[stunHit]Дождавшись, когда {victim} окаж(е|у)тся на достаточном расстоянии, {actor} разбежал(ся|ась|ось|ись) и ударил(а|о|и), нанеся {value} единиц(у|ы) урона.',
		'[stunHit]Примерившись, {actor} толчком выколотил(а|о|и) {value} единиц(у|ы) урона из {victim}.',
		'[stunHit]Подобно дикому кабану {actor} нес(е|у)тся вперед и таран(и|я)т {victim} так, что он(а|о|и) отлета(е|ю)т на несколько метров. От удара {} потерял(а|о|и) {value} HP.',
		'[stunHit]{actor} разбежал(ся|ась|ось|ись) и впечатал(а|о|и) {victim} в дерево, несчастн(ый|ая|ое|ые) не досчитал(ся|ась|ось|ись) {value} HP.',

		'[stun]{victim} в шоке и не мо(жет|гут) атаковать.',
		'[stun]{victim} пересчитыва(е|ю)т звёздочки, кружащиеся у (него|нее|них) над голов(ой|ами).',
		'[stun]{victim} пыта(е|ю)тся восстановить равновесие.',
		'[stun]{victim} было подумал(а|о|и) ударить, но оказал(ся|ась|ось|ись) не в состоянии додумать мысль.',
		'[stun]Оглушенн(ый|ая|ое|ые) {victim} вяло крут(и|я)т голов(ой|ами), не решаясь атаковать.',
		'[stun]{victim} пыта(е|ю)тся прийти в себя.',
		'[stun]Пропустив сильный удар, {victim} пыта(е|ю)тся устоять на ногах.',
		'[stun]{victim} с увлечением лов(и|я)т летающие вокруг голов(ы) звёздочки.',
		'[stun]У {victim} троится в глазах.',

		/* heal */
		'[heal]Дав себе установку выздороветь, {actor} восстановил(а|о|и) {value} HP.',
		'[heal]Сконцентрировавшись, {actor} восстановил(а|о|и) {value} HP.',
		'[heal]{actor} восстановил(а|о|и) {value} HP.',
		'[heal]«Исцеление — это то, что сейчас важнее всего», — подумал(а|о|и) {actor} и восстановил(а|о|и) {value} HP.',
		'[heal]{actor} восстановил(а|о|и) {value} HP и смахнул(а|о|и) пот.',
		'[heal]{actor} отскакива(е|ю)т в сторону и, воспользовавшись короткой паузой, восстанавлива(е|ю)т {value} HP.',

		'[godheal]Вокруг {} засветился воздух и (его|ее|их) раны затянулись, излечив {value} HP.',
		'[godheal]Банка с йодом? Что мне с ней сделать, выпить?',
		'[godheal]Почувствовав жжение в теле, {} замечает, что (его|ее|их) раны затягиваются.',
		'[godheal]{} исцелен на {value} HP.',
		'[godheal]Зелёный луч ударил с небес, исцеляя {} на {value} HP.', //crit
		'[godheal]Снег посыпался на {}, восстанавливая {value} HP.',
		'[godheal]Банка с йодом? Что мне с ней сделать, выпить?',
		'[godheal]Ха-ха, божественная регенерация!',

		'[godhit]Неведомая сила подняла {} в воздух и швырнула под ноги {}.',
		'[godhit]Молния существенно поджарила {}.',
		'[godhit]Вот значит как работают вакуумные бомбы…',
		'[godhit]Бабочка неудачно приземлилась на {}, выведя (того|ту|то|тех) из равновесия, результат — серьёзная шишка у {}.',
		'[godhit]На горизонте показалась яркая точка, стремительно приближающаяся к {}. Мгновение и шар огня выжег аккуратный круг там, где находился противник.',
		'[godhit]«Неужели… Это… Случилось?!» — ошарашенно шепчет {}, наблюдая за тем, что подошедший отряд стражников делает с {}.',
		'[godhit]Неожиданно огромный перст опустился с небес прямо на {}. {} издал(а|о|и) сдавленный визг.',
		'[godhit]Лёгкий ветерок внезапно снёс {} с места и впечатал в скалу. {} злобно смеётся над оглушённым монстром.',
		'[godhit]Почувствовав приятный аромат жареного, {} замечает, что {} охватило яркое пламя. С душераздирающим визгом он(а|о|и) медленно обуглива(е|ю)тся.',
		'[godhit]{} оказал(ся|ась|ось|ись) не готов(а|о|ы) к падению метеорита. В образовавшемся кратере будет сложно искать добычу.',
		'[godhit]«Падающие наковальни — это, конечно, хорошо, но вот куда они потом пропадают»? — задался {} вопросом, созерцая то, во что превратил(ся|ась|ось|ись) {}.',
		'[godhit]{} еле успел(а|о|и) отскочить от взрыва шаровой молнии. {} подлетел(а|о|и) в воздух и больно упал(а|о|и) вниз.',

		'[rest]Раны начинают затягиваться, и {actor} восстанавлива(ет|ют) {value} HP.',
		'[rest]Немного отдохнув и набравшись сил, {actor} восстановил(а|о|и) {value} HP.',
		'[rest]Увидев неподалёку небольшой кожаный мешочек, {actor} решил(а|о|и) изучить его и обнаружил(а|о|и) несколько пробирок с красной жидкостью, по запаху напоминавшей чай из целебных трав. Выпив последний сосуд, {actor} стал(а|о|и) чувствовать себя бодрее на {value} HP, а вот мешочек развеялся в прах. Увы, его с собой не забрать.',
		'[rest]{actor} стиснул(а|о|и) зубы и со второй попытки всё-таки вправил(а|о|и) недавно полученный вывих. Восстановлено {value} HP.',
		'[rest]{actor} уделил(а|о|и) внимание своему исстрадавшемуся телу: сделал(а|о|и) перевязку, промыл(а|о|и) раны, ссадины, — и облегчение не заставило себя долго ждать. Исцелено {value} HP.',
		'[rest]{actor} накладыва(ет|ют) ватно-марлевую повязку, как учили. Видать, не зря учили — восстанавливается {value} HP.',
		'[rest]{actor} прикладыва(ет|ют) прохладные примочки к ушибленному плечу, тем самым снимая отёк и успокаивая боль. Вылечено {value} HP.',
		'[rest]Как приятно на время отбросить грозное оружие, вездесущий рюкзак и прилечь на землицу родную. В блаженном покое {actor} восстанавлива(ет|ют) {value} HP.',
		'[rest]Использовав совет одного целителя, {actor} собрал(а|о|и) немного паутины и аккуратно уложил(а|о|и) её в промытую рану. Буквально на глазах кровь свернулась, образовав защитный слой. Вылечен(о) {value} HP.',
		'[rest]«Эльфийских капель не найти полезней! Эльфийские капли от всех болезней»! — напева(ет|ют) {actor}, восстанавливая {value} HP.',
		'[rest]Обнаружив неподалёку небольшой источник, {actor} решил(а|о|и) сделать несколько глотков и промыть раны. Появилось ощущение свежести, спокойствия и уверенности. Вылечено {value} HP.',
		'[rest]«Эх, а водичка-то из родничка просто прелесть», — {actor} поправля(ет|ют) {value} HP.',
		'[rest]{actor} слегка подкрепил(ся|ась|ось|ись), вылечено {value} HP.',
		'[rest]Проходящий мимо монах ткнул дорожной тростью в {actor} и на (нем|ней|нём|них) сразу начали заживляться раны. Вылечено {value} HP.',
		'[rest]«Как хорошо просто полежать, дав своему телу немного отдохнуть, восстановить силы и здоровье». Исцелено {value} HP.',
		'[rest]Проходящий мимо шаман кастанул чайник и исцелил на {value} HP',
		'[rest]«Волшебный пластырь — действительно эффективная штука! За мгновение восстановил(а|о|и) {value} HP»!',
		'[rest]Растущие рядом лопухи помогли восстановить {value} HP.',
		'[rest]Целебные орочьи горчичники вылечили {value} HP, но оставили пару ожогов.',
		'[rest]Пара съеденных яблок улучшила настроение и восстановила {value} HP.',
		'[rest]«Наверное, стоит приложить что-нибудь холодное к ушибленной ноге и дать ей немного отдыха». Вылечено {value} HP.',
		'[rest]Ух ты, а подорожник помогает: вылечил(а|о|и) {value} HP',
		'[rest]Пожевал(а|о|и) корешок, он оказался целебным и восстановил {value} HP. «Хоть какая-то от этих диет польза».',
		'[rest]Крепкий отвар помог восстановить {value} HP.',
		'[rest]«Рана загнила. Делать нечего, чтобы зараза не пошла дальше, придётся прижигать». Вылечено {value} HP.',
		'[rest]Магическое зелье Й.О.Д. начинает действовать и восстанавливает {value} HP.',
		'[rest]«Ужас, как же раскалывается голова… Может есть смысл просто полежать ни о чём не думая?» Восстановлено {value} HP.',
		'[rest]Вино помогло вернуть {value} HP всего за несколько глотков.',
		'[rest]Пролетавшая мимо фея помогла восстановить {value} HP.',
		'[rest]Применил(а|о|и) магию вуду и исцелил(ся|ась|ось|ись) на {value} HP',
		'[rest]Удачно наложенная повязка восстановила {value} HP.',
		'[rest]Отвар из чистотела помог {actor} избавиться от раздражений на коже, чем сильно поднял настроение. Вылечено {value} HP.',
		'[rest]Втирая пиявок в кожу, {actor} восстановил(а|о|и) {value} HP.',
		'[rest]«Так вот от чего у меня плечо зудит»! — облегченно восклица(ет|ют) {actor}, выдирая кусок зуба из своей раны. Вылечено {value} HP.',
		'[rest]Отвар целебных трав возымел силу и вернул {value} HP.',
		'[rest]Сделав настой календулы, {actor} промыва(ет|ют) свои воспалённые и слезящиеся от пыли глаза. Вылечено {value} HP.',
		'[rest]Втерев в раны наскоро приготовленную мазь, {actor} сразу же почувствовал(а|о|и) себя лучше. Вылечено {value} HP.',
		'[rest]«Ну и гадость»! — {actor} выпивает очередную порцию запасённого когда-то лечебного отвара.',
		'[rest]Стиснув зубы, зашивает глубокий порез.',
		'[rest]Пьёт целебный отвар.',
		'[rest]{} чувствует, как лёгкие наполняются воздухом, а рассудок — ясностью.',
		'[rest]Война войной, а обед — по расписанию. Скушав маленько припасов, {} подлечил(ся|ась|ось|ись) на {value} HP.',





		/* coins */
		'[coins]Нет, таких торгашей надо вешать. {value} монет(а|у|ы) за {item}, он с ума сошёл!',
		'[coins]«Получил(а|о|и) {value} монет(а|у|ы) в награду за {item}».',
		'[coins]{value} монет(а|у|ы) за {item}. Честная сделка.',
		'[coins]«За {item} {value} монет(а|у|ы). Вот же ей Бо… бей лавочников, спасай Пандору!»',
		'[coins]«Эх, не зря я тащил(а|о|и) {item}», — решил(а|о|и) {}, пряча {value} монет(а|у|ы).',
		'[coins]«Мне чужого не надо, вот и продаю {item}. Тем более, {value} монет(а|у|ы) не лишн(яя|ие|их)».',
		'[coins]Применив пытливость и изворотливость ума, {} продал(а|о|и) {item} аж за {value} монет(а|у|ы). Перед продажей оставил(а|о|и) подпись «{}» на самом заметном месте — хоть какой-то заметный след в истории.',
		'[coins]«Цел(ая|ые|ых) {value} монет(а|у|ы) за {item}? В чём подвох, торговец»?',
		'[coins]«{value} монет(а|у|ы) за {item}? Ладно, забирай, я сегодня добр(ый|ая|ое)».',
		'[coins]«Что?! {value} монет(а|у|ы) за мои подвиги?! А {item} на обочине валял(ся|ась|ось|ись), по-твоему?! Ладно, не ори. По рукам. Проклятый торгаш».',
		'[coins]«Глупый торговец, отдал {value} монет(а|у|ы) за дешев(ый|ую|ое|ые) {item}».',
		'[coins]{} скептически смотр(ит|ят) на {value} монет(а|у|ы), вырученн(ую|ые|ых) за {item}, и, пожимая плечами, убира(ет|ют) деньги в карман.',
		'[coins]{}, остервенело торгуясь, получа(ет|ют) таки {value} монет(а|у|ы) за {item}.',
		'[coins]«Отличная цена за {item}. Положил(а|о|и) {value} монет(а|у|ы) в кошелёк».',
		'[coins]{} грозно посмотрел(а|о|и) на спекулянта: «Ладно, давай сюда сво(ю|и|их|й) {value} монет(а|у|ы) и забирай {item}, пока я не передумал(а|о|и)».', //err
		'[coins]«Не торговцы, а жлобы! Я ему {item}, а он мне жалк(ую|ие|их) {value} монет(а|у|ы)! Небось втридорога продаст»!',
		'[coins]«А {value} монет(а|у|ы) за {item} гораздо лучше чем ничего»…',
		'[coins]«Слышь, ты, хапуга?! {value} монет(а|у|ы) за {item}?! Окстись! Давай деньги. Молчи, с тобой торг закончен…»',
		'[coins]«{value} монет(а|у|ы) за {item}? Да это же последний писк моды»!',
		'[coins]«{value} монет(а|у|ы) за {item} — это надо обмыть!»',
		'[coins]«{value} монет(а|у|ы) за {item}… Выйдешь ты на тракт… Нет, нет, ничего! Удачной торговли вам! И детям вашим! Крохобор…»',
		'[coins]С обречённым видом {} расста(ё|ю)тся с {item} всего за {value} монет(а|у|ы).',
		'[coins]День явно был не самым удачным. Всего {value} монет(а|у|ы) за первоклассн(ый|ую|ое|ые) {item}. Но это был единственный покупатель, и {} со смиренным лицом спрятал(а|о|и) деньги в карман.',
		'[coins]Торговка была хороша, даже слишком. И {} пришлось отдать {item} всего за {value} монет(а|у|ы).',
		'[coins]«{value} монет(а|у|ы) против плохоньк(ой|ого|их) {item}? Соглас(ен|на|но)».',
		'[coins]«Обманывать людей нехорошо… но так выгодно»… — думал(а|о|и) {}, пересчитывая {value} монет(а|у|ы) полученн(ую|ые|ых) за {item}.',
		'[coins]«{value} монет(а|у|ы) за {item} и неприятный запах — ну что за место?!»',
		'[coins]«{item} стоит не меньше {value} монет(а|у|ы)! Нет, так я найду другого покупателя! То-то же!»',
		'[coins]«Отличная сделка! {value} монет(а|у|ы) лучше, чем {item}».',
		'[coins]{item} остал(ся|ась|ось|ись) в лавке, а {value} монет(а|у|ы) забрал(а|о|и) {}.',
		'[coins]«Всего {value} монет(а|у|ы) за {item}?! Да они издеваются!»',
		'[coins]После долгих споров и препираний торговец все же согласился отдать {value} монет(а|у|ы) за {item}.',
		'[coins]«За прекрасн(ый|ую|ое|ые) {item} жалк(ую|их) {value} монет(а|у|ы). Сволочи!»',
		'[coins]«Вынудил(а|о|и) торговца купить {item} за {value} монет(а|у|ы)».',
		'[coins]«Вшив(ая|ые|ых) {value} монет(а|у|ы) за {item}. Ворьё!»',
		'[coins]{value} монет(а|у|ы) — достойная плата за {item}.',
		'[coins]«Мошенники! Всего {value} монет(а|у|ы) за прекрасн(ый|ую|ое|ые) {item}!»',
		'[coins]«Безобразие! Жалк(ая|ие|их) {value} монет(а|у|ы) за редчайш(ий|ую|ее|ие) {item}?! Грабёж! Ох и жульё на здешнем рынке»…',

		/* pickup */
		'[pickup]{item} лег(ла|ло|ли) в рюкзак как родн(ая|ой|ое|ые).',
		'[pickup]«Вроде бы всего лишь {item}, а приятно».',
		'[pickup]Обыскав место сражения, {} находит {item} и забирает добычу себе.',
		'[pickup]«{} всё равно больше не нужно, а мне {item} пригод(ится|ятся)».',
		'[pickup]«{item} самое место у меня в рюкзаке».',
		'[pickup]{}, довольн(ый|ая|ое|ые) собой, обыскав {}, убира(ет|ют) найденн(ый|ую|ое|ые) {item} к себе в сумку.',
		'[pickup]«Эх, с паршивой овцы хоть шерсти клок»! — думал(а|о|и) {}, пряча {item} в рюкзак.',
		'[pickup]«Что с {} взять, кроме {item}?»',
		'[pickup]Попрыгав и похлопав в ладоши от восторга, {} упаковыва(ет|ют) обнаруженн(ый|ую|ое|ые) {item} в рюкзак.',
		'[pickup]«Превосходно, вот и трофеями судьба не обделила», — думает {}, убирая {item} в рюкзак.',
		'[pickup]Битва закончена лишь тогда, когда собраны трофеи. {}, положив {item} к себе в рюкзак, продолжа(ет|ют) своё странствие.',
		'[pickup]Вытерев {item} о траву, {} упаковал(а|о|и) добычу в рюкзак.',
		'[pickup]«{}, воровато озираясь, прикарманил(а|о|и) {item}».',
		'[pickup]{} мертв(а|о|ы). {item} в рюкзаке. {} счастлив(а|о|ы).',
		'[pickup]«Нет худа без добра! Вот отличн(ый|ая|ое|ые) {item}, надо прибрать себе в рюкзак».',
		'[pickup]«Что тут у нас? {item}! Неплохо…»',
		'[pickup]«Сегодня явно мой день, столь восхитительн(ый|ую|ое|ые) {item} не каждый раз найдёшь. Надо бы (его|ее|их) к себе в рюкзак положить».',
		'[pickup]«Ну вот так всегда, никогда на них живого места нет: тут как-то неестественно вывернуто, там кость торчит, глаз вытек, рожа изуродована, а про шкуру так и вообще говорить нечего… Постойте-ка! А вот {item}, кажется, не очень помят(а|о|ы), да и кровью не пропитал(ся|ась|ось|ись). Решено. Беру»!',
		'[pickup]«{item}. А что ещё взять с {}?»',
		'[pickup]{} перебрал(а|о|и) добычу и закинул(а|о|и) {item} к себе в сумку.',
		'[pickup]Присвистнув от радости, {} пряч(ет|ат) найденн(ый|ую|ое|ые) {item} в сумку.',
		'[pickup]Какая удача! Обшарив останки {}, {} наш(ел|ла|ло|ли) {item}!',
		'[pickup]«Как(ой|ая|ое|ие) замечательн(ый|ая|ое|ые) {item}, в хозяйстве пригод(ится|ятся)», — {} убира(ет|ат) добычу в рюкзак.',
		'[pickup]«Невесть что, но горсть монет я за это уж точно получу» — пробормотал(а|о|и) {}, убирая {item} в рюкзак.',
		'[pickup]Чистая победа — грязн(ый|ая|ое|ые) {item}.',
		'[pickup]«Древняя мудрость гласит: {item} в рюкзак — авантюристу приятней… Неее… баба с возу — авантюристу легче?…»',
		'[pickup]«О, {item}! Пригод(и|я)тся».',
		'[pickup]{item} воня(ет|ют) даже сильнее, чем грязн(ый|ая|ое|ые) {}, но {} не из брезгливых.',
		'[pickup]«Отлично, {item}! Доволочь до города — там можно будет продать».',
		'[pickup]«Вот это я понимаю! {item}! То что надо!»',
		'[pickup]«Ух ты, как(ой|ая|ое|ие) прекрасн(ый|ая|ое|ые) {item}!» — {} с блаженным лицом укладывает трофей к себе в сумку.',
		'[pickup]«Так, что тут у нас? {item}? Долж(ен|на|но|ны) пригодиться».',
		'[pickup]{} морщит нос, но вытира(ет|ют) дурно пахнущ(ий|ую|ее|ое|ие|их) {item} и запихива(е|ю)т в рюкзак.',//err
		'[pickup]«Не густо, всего лишь {item}, но хоть что-то».',
		'[pickup]«Что это тут», — думал(а|о|и) {}, выуживая {item} из того, что осталось от {}.',
		'[pickup]«Хлам, конечно, но может и удастся продать…» — подумал(а|о|и) {}, убирая {item} в сумку.',
		'[pickup]Воровато оглядываясь по сторонам, {} запихивает в рюкзак {item}.',
		'[pickup]«Вот в такие моменты я понимаю, что всё не зря», — думает {}, умиляясь найденн(ому|ой|ым) {item} и пряча (его|ее|их) к себе в рюкзак.',
		'[pickup]«Хм… Не мешок бриллиантов, но и {item} с {} тоже ничего».',
		'[pickup]Изумительн(ый|ая|ое|ые) {item} — достойная награда победителя.',
		'[pickup]«{item}? В рюкзак! В хозяйстве пригодится».',
		'[pickup]«Не дело трофеями пренебрегать». — пробормотал(а|о|и) {}, засовывая {item} к себе в рюкзак.',
		'[pickup]«Моя Прелесть», — подумал(а|о|и) {} и, оглядываясь по сторонам, бережно спрятал(а|о|и) {item} в рюкзак.',
		'[pickup]«Сражение превращается в бесполезный риск, если нет трофеев», — замечает про себя {}, пряча {item} в рюкзак.',
		'[pickup]«Приш(ел|ла|ло|ли), увидел(а|о|и), победил(а|о|и) — забрал(а|о|и) {item}!»',
		'[pickup]{} — смерть, победителю — {item} — вот естественный ход вещей.',
		'[pickup]«{item}! Всё в дом, всё в дом!»',
		'[pickup]Один из лучших экземпляров {item}, и победитель забирает (его|ее|их) по праву.',
		'[pickup]«Хороший враг — мёртвый враг, а хорош(ий|ая|ее|ие) {item} — {item} в рюкзаке».',
		'[pickup]«Так себе {item}, но не бросать же».',
		'[pickup]«Дело за малым: продать {item} и купить что-нибудь нужное».',
		'[pickup]«{item}… Неплохой трофей»…',
		'[pickup]«Мертв(ый|ая|ое|ые) {} на первое, сладкое чувство победы на второе, и {item} на десерт».',
		'[pickup]«Неплохая вещица, (этот|эта|это|эти) {item} — надо оставить себе».',
		'[pickup]«После славной битвы и трофей должен быть достойным победителя! Что тут у нас… {item}, значит. Отлично»!',
		'[pickup]«С паршив(ого|ой|ых) {} хоть {item} клок… А, там про овцу и шерсть…»',
		'[pickup]«Раны болят не так сильно, если после боя тебя ждёт достойная награда… Вот прекрасн(ый|ая|ое|ые) {item}, положим (его|ее|их) в рюкзак… Хм-м, определённо, самочувствие стало лучше».',
		'[pickup]«Нет лучшего места для {item}, чем мой рюкзак».',
		'[pickup]{item} и слава — вот награда {} за победу над {} коварн(ым|ой|ыми)!',
		'[pickup]Грёзы о трофеях были не напрасны. {} восхищается {item} и убирает (его|ее|их) в рюкзак.',
		'[pickup]Взглядом опытного мародера {} осмотрел(а|о|и) останки {} и спрятал(а|о|и) {item} в рюкзак.',
		'[pickup]{}, воровато озираясь, прикарманил(а|о|и) {item}.',

		/* empty */
		'[empty]«Нет, мешок денег было бы чересчур, но хоть что-то могло достаться в награду?»',
		'[empty]{} склоняется над поверженн(ым|ой|ыми) {}… и ничего не находит.',
		'[empty]Порывшись в останках {}, {} ничего не наш(ел|ла|ло), вытер(ла|ло|ли) руки и уш(ел|ла|ло).',
		'[empty]«Ненавижу, когда так получается: бьёшься, жизнью рискуешь, а награды нет!»',
		'[empty]{} посмотрел(а|о), что осталось от {}, и с досадой отметил(а|о): «Добычи нет».',
		'[empty]{} не наш(ел|ла|ло) ничего полезного на тушк(е|ах) монстр(а|ов).',
		'[empty]«Тут брать нечего. Если так дело и дальше будет, я по миру пойду».',
		'[empty]«И за что было сражаться? Добычи явно нет».',
		'[empty]«Какая уж тут добыча? В живых остал(ся|ась|ось|ись), и то славно».',
		'[empty]«Нечего взять с {}… Ладно, найду ещё кого-нибудь».',
		'[empty]{} отдубасил(а|о) бандита так, что ничего ценного уже не осталось.',
		'[empty]{} с унынием смотрит на то, что осталось от {}. Совершенно очевидно, что здесь поживиться нечем.',
		'[empty]«И какой смысл столько времени тратить на сражение, если после этого даже взять нечего»?',
		'[empty]Сегодня {} без награды, но главное, что (он|она|оно) жив(а|о).',
		'[empty]«Что тут? Пусто»… — Пнув {}, {} продолжает свой путь.',
		'[empty]{} склоняется над поверженн(ым|ой|ыми) {} и… плюясь и ворча, не находит добычи.',
		'[empty]{} со злостью плюёт на останки {}, всё равно трофеев никаких.',
		'[empty]{} настолько увлек(ся|лась|лось|лись), что от {} ничего не осталось.',
		'[empty]{} понял(а|о|и), что поживиться тут нечем, но не унывает: «Легче сумка — шире шаг».',
		'[empty]«Можно было бы строго судить авантюриста, если опять нет добычи, и этот авантюрист пошёл бы грабить караваны?…»',
		'[empty]В этот раз {} остал(ся|ась|ось|ись) без добычи.',
		'[empty]Небрежно осмотрев останки {}, и не найдя ничего полезного, {} отправил(ся|ась|ось|ись) дальше.',
		'[empty]«Тьфу ты ж! И взять с {} нечего!»',
		'[empty]«Трофеев нет, но будет ещё и на нашей улице праздник!»',
		'[empty]«Ангел хранитель, эй! Победили — это спасибо, конечно, но что я буду есть, если снова нет трофеев?»',
		'[empty]«Хранитель, эй! Победили — это спасибо, конечно, но что я буду есть, если снова нет трофеев?»',
		'[empty]«Победа есть, а добычи нет…»',
		'[empty]{} отдубасил(а|о) {} так, что ничего ценного уже не осталось.',
		'[empty]«Вот же тварь какая, и взять-то нечего».',
		'[empty]Раздосадованн(ый|ая|ое|ые) отсутствием трофеев, {} глумится над останками {}.',
		'[empty]«Ну что за день сегодня такой?… Даже с {} взять нечего».',
		'[empty]Измотанн(ый|ая|ое|ые) битвой {} с брезгливостью смотрит на место сражения, понимая, что трофеев здесь явно нет.',
		'[empty]Плохо. Очень плохо. {} остал(ся|ась|ось|ись) без добычи.',
		'[empty]Очередн(ой|ые) монстр(ы) без добычи, куда катится этот мир?',
		'[empty]Останки поверженн(ого|ой|ых) {} испарились прямо на глазах. Стоп! А где трофей?',
		'[empty]«И снова нечего взять».',
		'[empty]Останки {} выглядят слишком противно, чтобы пытаться найти что-то ценное.',
		'[empty]Покойся с миром, несчастн(ый|ая|ое|ые) {}. Не принесла победа ни добычи, ни славы.',
		'[empty]«Да уж… Добычи нет, и стоило ли рисковать?»',
		'[empty]Ничего ценного. В следующий раз повезёт.',
		'[empty]«Совсем нет добычи? Будем искать!»',
		'[empty]И кукиш с маслом, как награда герою.',
		'[empty]«Вот же твари какие, и взять-то нечего».',
		'[empty]«Рискуешь жизнью, терпишь лишения, сбиваешь ноги в кровь, и что в итоге? Ни-че-го!»',
		'[empty]После ожесточённой схватки {} оказал(ся|ась|ось|ись) настолько искромсан(а|о|ы), что о добыче можно и не думать.',
		'[empty]«Как-то и зимы холоднее стали, и рюкзаки делают маленькие. Тяжёлые времена ждут этот мир».',



		/* drop */
		'[drop]«Вот несправедливость какая: отличн(ый|ая|ое|ые) {drop}, а забрать не получится — рюкзак уже полный».',
		'[drop]«Надо что ли рюкзак побольше купить, а то такими вещами приходится разбрасываться… Неплох(ой|ая|ое|ие) был(и) {drop}».',
//			'[drop]Короткая вспышка — и {} с удивлением смотр(ит|ят) на горстку пепла, оставшуюся от {drop}.', //manual drop
		'[drop]Найденн(ый|ая|ое|ые) {drop} не помеща(ется|ются) в рюкзак. «Кто ты, тот счастливчик, что получит (его|ее|их) задарма? И когда уже я найду брошенный кем-то трофей?»',
		'[drop]Сердце кровью обливается, когда приходится бросать {drop}. Но {} смотрит в набитый доверху рюкзак, и становится легче.',
		'[drop]Повертев в руках {drop}, доставш(ийся|уюся|ееся|иеся|егося) от {}, {} с сожалением выкинул(а|о|и) (его|ее|их) — в рюкзаке не осталось места.', //err
		'[drop]{} пытается запихнуть трофей в рюкзак, но, потерпев сокрушительное фиаско, решает, что {drop} ему не так уж сильно и нужен.',
		'[drop]{}, повертев в руках {item}, и не найдя куда (его|ее|их) засунуть, решил(а|о|и) в следующий раз купить штаны с дополнительными карманами.',
		'[drop]{item} остал(ся|ась|ось|ись) валяться на обочине дороги.',
		'[drop]В рюкзаке нет свободного места и {item} пришлось оставить.',
		'[drop]«Это не дело: рюкзак — битком — трофеи складывать некуда».',
		'[drop]«Нужен рюкзак побольше, а то в этот уже не влезает».',
		'[drop]«Хм… {item}. А запихнуть-то некуда — рюкзак набит — придется выкинуть».',
		'[drop]{} пыжится, всё вертит и пытается впихнуть {item} в рюкзак, но там слишком мало места. Вздохнув, он выбрасывает {item}.',
		'[drop]Рюкзак полон и {} не может взять добыт(ый|ую|ое|ые) {item}.',
		'[drop]Хмуро глядя в набитый доверху рюкзак, {} оставляет добычу на земле.',
		'[drop]«Опять забыл(а|о|и) от хлама избавиться»! — ворчит {}, выбрасывая подобранн(ый|ую|ое|ые) {item}.',
		'[drop]«Надо срочно продать чего-нибудь, освободить место в рюкзаке. Ну жалко ж бросать {item}!»',
		'[drop]«Был бы рюкзак побольше… А пока {item} придется выбросить».',
		'[drop]Найденн(ый|ая|ое|ые) {item} не помеща(ется|ются) в рюкзак. «Кто ты, тот счастливчик, что получит (его|ее|их) задарма? И когда уже я найду брошенный кем-то трофей?»',
		'[drop]Оставлю я {item} здесь, может кому сгодится.',
		'[drop]{item} никак не влаз(ит|ят) в рюкзак, придётся выкинуть.',
		'[drop]«Некуда уже пихать, ну и демон с {item}».',
		'[drop]{} попытал(ся|ась|ось|ись) впихнуть {item} к себе в рюкзак, но, услышав подозрительный треск швов, оставил(а|о|и) эту затею и выкинул(а|о|и) добычу.',
		'[drop]«Нет, всё же грех жаловаться. Вон уже и трофеи складывать некуда!»',
		'[drop]«Надо что ли рюкзак побольше купить, а то такими вещами приходится разбрасываться… Неплох(ой|ая|ое|ие) был(а|о|и) {item}».',
		'[drop]«Святой лук-порей! Опять куча хлама в инвентаре»! — со слезами на глазах, {} уходит прочь, а {item} остается одиноко лежать на земле.',
		'[drop]«Вот и {item} уже не влезает. Решено — пора продавать трофеи».',
		'[drop]В придорожные кусты лет(и|я)т {item}. В рюкзак (его|ее|их) уже не впихнуть.',
		'[drop]Израненн(ый|ая|ое) {} смотрит в переполненный рюкзак и понимает, что {item} туда уже не влезет, и (его|ее|их) придётся бросить. Знакомая каждому, извечная и обидная ситуация.',
		'[drop]«В рюкзаке совсем нет места. Зачем мне столько барахла»? — думает {}, выбрасывая добытый {item}.',
		'[drop]Рюкзак полон настолько, что чуть ли не трещит по швам. {} с грустью оставляет добыт(ый|ую|ое|ые) {item} и идёт дальше.',
		'[drop]Красиво жить не запретишь! Рюкзак уже битком, и неплох(ой|ая|ое|ие) {item} летит в канаву.',
		'[drop]Рюкзак и так слишком тяжёлый. Вздохнув, {} оставляет {item} на поле боя.',
		'[drop]«То совсем пусто, то густо, так что уже и в рюкзак не влезает — придется выкидывать хорош(ий|ую|ое|ие) {item}».',
		'[drop]{} безуспешно пытается засунуть {item} в трещащий по швам рюкзак: «Да здесь еще три артефакта влезет, глупая авоська! Где заклинание утрамбовывания»?!',
		'[drop]Обливаясь слезами, {} последний раз смотр(и|я)т на найденн(ый|ую|ое|ые) {item} и оставляет (его|ее|их) на обочине — в рюкзаке уже нет места.',
		'[drop]Неплох(ой|ая|ое|ие) {item}, но в рюкзак уже не влез(е|ю)т.',
		'[drop]«Так бывает», — отмеча(е|ю)т {}, глядя в доверху набитый рюкзак и выкидыва(е|ю)т {item}.',
		'[drop]«Если я возьму с собой ещё и {item}, то спина мне этого не простит».',
		'[drop]«Так не достанешься же ты никому, {item}»! — иступлённо крикнул(а|о|и) {} и выбросил(а|о|и) трофей, не поместившийся в рюкзак, в канаву.',
		'[drop]{} пытается запихнуть трофей в рюкзак, но, потерпев сокрушительное фиаско, решает, что {item} (ему|ей|им) не так уж сильно и нуж(ен|на|но|ны).',

		/* fight */
		'[fight]{} и {} сошлись на узкой дорожке.',
		'[fight]За спиной {} хрустнула ветка. Он(а|о|и) ме-едленно обернул(ся|ась|ось|ись), доставая оружие, и увидел(а|о|и) {}, стоя(щего|щую|щее|щих|щий|щая|щие|вший) с видом полной невинности.', //err
		'[fight]«А это ещё что за бести(я|и)? {}?»',
		'[fight]«Ни на минуту нельзя расслабиться»! — {} атаку(е|ю)т {}.',
		'[fight]Впереди {}, ищущ(ий|ая|ое|ие) неприятностей, — «Эй, я здесь!»',
		'[fight]{} преградил(а|о|и) дорогу. {} вынужден(а|о|и) принять сражение.',
		'[fight]«{}? Что ж, потанцуем!»',
		'[fight]{} на горизонте, в бой!',
		'[fight]Битвы не избежать — впереди {}.',
		'[fight]Как {} ни пытал(ся|ась|ось|ись) притвориться мертв(ым|ой), {} всё равно пош(ел|ла|ло|ли) в наступление.',
		'[fight]«Что там впереди? {}? Ближе… Сейчас я буду добывать трофеи».',
		'[fight]«Что-то тут не так. Не в засаду ли меня несё… Проклятье! {}!»',
		'[fight]«Судьба сводит меня с {}? Что ж…»',
		'[fight]Ужасн(ый|ая|ое|ые) {} выскочил(а|о|и) из кустов.',
		'[fight]«Это {}! К бою!»',
		'[fight]«{}! Оружие наголо!»',
		'[fight]«Ни минуты покоя!» — на пути {}!',
		'[fight]«Ого, да это {}. Исчезающий вид»!',
		'[fight]«И так жить на свете страшно, а тут еще и {}»!',
		'[fight]«Проклятье! Не золотуха, так {}!»',
		'[fight]«Это была самая большая ошибка в твоей жизни… и последняя»… — грозно произнес(ла|ло|ли) {} и приготовил(ся|ась|ось|ись) к бою против {}.',
		'[fight]Обернул(ся|ась|ось|ись) на странный шум и увидел(а|о|и) {}.',
		'[fight]«{}, как мне вас не хватало»! — проворчал(а|о|и) {}, разминая кисти рук.',
		'[fight]«Неужто передо мной {}? Отлично! Будет чем пополнить мою коллекцию трофеев»!',
		'[fight]«Говорят, места тут спокойные. Тогда что тут дела(е|ю)т {}?!»',
		'[fight]«Ха-ха! Вот мы и сошлись, {}»!',
		'[fight]Вовремя заметив приближающ(егося|уюся|ееся|ихся|ийся) {}, {} приготовил(ся|ась|ось|ись) к бою.',
		'[fight]«На ловца и зверь бежит! Сегодня это {}!»',
		'[fight]Неожиданно, перед {} появля(е|ю)тся {}, заставляя (его|ее|их) подпрыгнуть от испуга! «Никому не дозволено безнаказанно меня пугать»! — вопит {} и отчаянно бросается в бой.',
		'[fight]{} на пути!',
		'[fight]{} видит, как дорогу прегражда(е|ю)т {}.',
		'[fight]За очередным поворотом дороги {} сталкивается с {}.',
		'[fight]«Подозрительно тихо, не нравится мне это… Так и есть, {}!»',
		'[fight]Из придорожных зарослей выскочил(а|о|и) {}!',
		'[fight]{}, чувствуя опасность, насторожил(ся|ась|ось|ись) и вовремя заметил(а|о|и) {}.',
		'[fight]{} заметил(а|о|и) впереди {} и готовится к схватке.',
		'[fight]«Впереди {}! Здоров(ый|ая|ое|ые), зараз(а|ы)!»',
		'[fight]«Вот сколько раз уже сражал(ся|ась|ось|ись) с {}, а популяция их всё не убывает… О! Вот опять»!',
		'[fight]Из-за кустов показыва(ется|ются) {}. «Не случайно нынешней ночью тревожные сны снились».',
		'[fight]{} в опасности — на (его|ее|их) пути {}.',
		'[fight]«Я, отважн(ый|ая|ое) {}, смело принимаю бой! Никто не выстоит против меня! Даже {}»!',
		'[fight]{} преградил(а|о|и) дорогу. {} вынужден(а|о|и) принять сражение.',



		'[fight]Вовремя заметив {victim}, {actor} подкрал(ся|ась|ось|ись) сзади и сразил(а|о|и) противник(а|ов) одним ударом.'
//			'Проезжавший мимо крестьянин узнал Че Гевару и немного подвёз на своей телеге.'

		/* */
	];

	var parseHighlightRaw = [
		'[value]\\d+ звездоч(?:ка|ки|ек)?',
		'[value]\\d+ HP',
		'[value]\\d+ единиц(:?у|а|ы)? урона',
		'[value]\\d+ урона?',
		'[energy]\\d+ единиц(:?у|а|ы)? энергии',
		'[coins]\\d+ монет(?:ами|ой|а|у|ы)?',
		'[exp]\\d+ опыт(?:а)?',
		'[level]\\d+ уровень'
	];

	function processHighlightRaw(parseHighlightRaw) {
		var typeReg = /^\[[a-zA-Z]+\]/g;
		var result = [];
		for (var i = 0; i<parseHighlightRaw.length; i++) {
			var cfgString = parseHighlightRaw[i];
			var parsedCfg = {};

			var p = typeReg.exec(cfgString);
			if (p && p[0]) parsedCfg.type = p[0].substring(1, p[0].length-1);
			cfgString = cfgString.replace(typeReg, '');

			parsedCfg.regex = new RegExp(cfgString);
			result.push(parsedCfg)
		}
		return result;
	}
	function processShortRaw(cfgRaw) {
		var ESCAPE = /[?.]/g;
		var anyRegExp = new RegExp('({})', 'g');
		var numbersRegExp = new RegExp('({value})', 'g');
		var paramsRegExp = new RegExp('({[a-zA-Z]+})', 'g');
		var namesRegExp = '([а-яА-ЯёЁa-zA-Z\\d _\\-\']+)';

		var paramReg = /{([a-zA-Z]+)}/g;
		var result = [];

		var typeReg = /^\[([a-zA-Z]+)(?:,([a-zA-Z]+))?\]/;

		for(var i = 0; i<cfgRaw.length; i++) {
			var cfgString = cfgRaw[i];
			var parsedCfg = {};

			var p = typeReg.exec(cfgString);
			if (p) {
				if (p[1]) parsedCfg.type = p[1];
				if (p[2]) parsedCfg.sec = p[2];
//				else parsedCfg.sec = 'vamp';
				cfgString = cfgString.replace(p[0], '');
			}
			if (cfgString.charAt(0) != '~') {
				cfgString = '^' + cfgString;
				cfgString = cfgString + '$';
			}

			var paramNames = [];
			do  {
				var p = paramReg.exec(cfgString);
				if (p) paramNames.push(p[1]);
			} while (p);
			parsedCfg.params = paramNames;

			cfgString = cfgString
				.replace(ESCAPE, '\\$&')
				.replace(/\(/g, '(?:')
				.replace(/\)/g, ')?')
				.replace(anyRegExp, '.+')
				.replace(numbersRegExp, '(\\d+)')
				.replace(paramsRegExp, namesRegExp);
			parsedCfg.regex = new RegExp(cfgString);
			result[i] = parsedCfg;
		}
		return result;
	}

	var cfgShort = processShortRaw(parseShortRaw);
	var cfgHighlight = processHighlightRaw(parseHighlightRaw);

	function parseShort(msg) {
		for(var i = 0; i<cfgShort.length; i++) {
			var cfgParsedLine = cfgShort[i];
			var paramNames = cfgParsedLine.params;
			var values = cfgParsedLine.regex.exec(msg);

			if (values) {
				values = values.slice(1);

				var act = {};
				act.type = cfgParsedLine.type;
				if (cfgParsedLine.sec) act.sec = cfgParsedLine.sec;
				for(var paramIndex = 0; paramIndex < paramNames.length; paramIndex++) {
					var param = paramNames[paramIndex];
					act[param] = isNaN(values[paramIndex]) ? values[paramIndex] : +values[paramIndex];
				}

				act.isMe = (act.actor ? _ext.isMyName(act.actor) : (act.victim ? !_ext.isMyName(act.victim) : true ))|0;
				if (!_ext.settings.settingsValues.heroNameStart) act.isMe = 0;

			}
		}

		return act;
	}
	function parseHighlight(msg, act) {
		for (var i = 0; i<cfgHighlight.length; i++) {
			var regExp = cfgHighlight[i].regex;
			var type = cfgHighlight[i].type || 'value';
			msg = msg.replace(regExp, '<span class="' + type + '">$&</span>')
		}
		for (var cls in act) if (act.hasOwnProperty(cls)) {
			var value = act[cls];
			if (cls != 'value' && cls != 'type') {
				msg = msg.replace(value, '<span class="'+cls+'">'+value+'</span>')
			}
		}
		return msg;
	}


	$.extend(_parse, {
		short: parseShort,
		highlight: parseHighlight
	});
	return _parse;
})({});

_ext.parse = _parse;




var _const = _ext.const;
var _trace = _ext.trace;
var _elements = _ext.elements;
var _icons = _const.ICONS;

function isActType(types, actType) {
	return _const[types].indexOf(actType) >= 0;
}


/* towns */
var _towns = (function(_towns) {
	var $townsContent = _elements.getTabInner('towns');
	$('body')
		.on('click.town', '.town', function() {
			if (!mapData) return;
			var id = $(this).data('place-id');
			showMapDialogById(id);
		})
		.on('click.town', '.reload', function() {
			if (_ext.map_version) {
				_towns.mapDataUpdate(_ext.map_version)
					.done(function(mapData) {
						townParams(mapData);
					});
			}
		});


	$townsContent.html('<span class="link-ajax pull-right reload glyphicon glyphicon-repeat"></span>');



	var mapData;
	function mapDataUpdate(map_version) {
		return $.ajax({
			url: '/dcont/map/region-' + map_version + '.js',
			dataType: 'json',
			type: 'get'
		})
			.done(function(map_data) {
				_towns.mapData = mapData = map_data;
				_ext.publish('townsInit', map_data);
			});
	}

	function init() {
		var places = mapData.places;
		var html = '';
		for (var i in places) if (places.hasOwnProperty(i)) {
			var place = places[i];
			html +=
				'<tr class="place-row" data-place-id="' + place.id + '">' +
					'<td class="size"><span class="badge">' + place.size + '</span></td>' +
					'<td>' +
						'<span class="link-ajax town" data-place-id="' + place.id + '">' + place.name + '</span>' +
						' <span class="quest"></span>' +
					'</td>' +
//						'<td data-city-param="1" class="production"></td>' +
					'<td data-city-param="размер экономики"></td>' +
					'<td data-city-param="безопасность"></td>' +
					'<td data-city-param="транспорт"></td>' +
					'<td data-city-param="свобода"></td>' +
				'</tr>';
		}
		html =
			'<table class="table table-towns table-noborder table-hover-dark table-condensed">' +
				'<thead>' +
					'<th class="size" title="Размер города">Р</th>' +
					'<th>Название</th>' +
//						'<th>Произв.</th>' +
					'<th title="Размер экономики">Э</th>' +
					'<th title="Безопасность">Безоп.</th>' +
					'<th title="Транспорт">Транс.</th>' +
					'<th title="Свобода">Своб.</th>' +
				'</thead>' +
				'<tbody>' +
					html +
				'</tbody>' +
			'</table>';
		var $table = $(html).appendTo($townsContent);
		window.tables.makeSortable($table);



		_towns.townQuestUpdate = function(quests) {
			$('.place-row .quest').html('');
			for (var questsIndex=0;questsIndex<quests.length;questsIndex++) {
				var quest = quests[questsIndex];
				var actors = quest.actors;
				for (var i=0; i<actors.length; i++) {
					var actor = actors[i];
					var isFrom = i === 0 && actors.length > 1;
					var actorType = actor[0];
					var actorTypeId = actor[1];
					var placeId = actorTypeId == 1 ? actor[2].id : actor[2].place;
					var $placeRow = $('.place-row[data-place-id="' + placeId + '"]');
					var $townQuest = $placeRow.find('.quest');
					var questHtml =
						(isFrom ? '<span class="glyphicon glyphicon-arrow-right"></span>' : '<span class="glyphicon glyphicon-arrow-left"></span>') +
						'<span class="quest-icon-mini pgf-quest-icon ' + quest.type + '" title="' + actorType + '"></span> ';
					$townQuest.append(questHtml);
				}
			}
		};

		for (var i=0; i<_prevParams.length; i++) {
			_towns.townQuestUpdate.apply(_towns, _prevParams[i]);
		}

	}
	var _prevParams = [];
	_towns.townQuestUpdate = function() {
		_prevParams.push(arguments);
	};

	function townParams(mapData) {
		var places = mapData.places;
		for (var i in places) {
			(function(placeIndex) {
				var place = places[placeIndex];
				requestPlace(place.pos.x, place.pos.y)
					.done(function(html) {
						var parsed = parsePlaceHtml(html);
						var $placeRow = $('.place-row[data-place-id="' + placeIndex + '"]');
						parsed.cityParams.forEach(function(item) {
							var val = item.value;
							if (val < 100) val = '&nbsp;' + val;
							$placeRow.children('[data-city-param="' + item.name + '"]').html(val);
						});
					});
			})(i);
		}
	}


	function parsePlaceHtml(html) {
		var $info = $(html);

		var cityParams = [];
		var $cityParamsRows = $info.find('#pgf-cell-place-parameters').find('tr').slice(1);
		$cityParamsRows.each(function() {
			var $row = $(this);
			var paramName = $.trim($row.children('th').first().text());
			var valueText = $row.children('td').first().text();
			var value = parseFloat(valueText);
			cityParams.push({
				name: paramName,
				value: value
			});
		});
		return {
			cityParams: cityParams
		};
	}

	function requestPlace(x,y) {
		return $.ajax({
			url: '/game/map/cell-info?x=' + x + '&y=' + y + '&_=' + (+new Date()),
			method: 'get',
			dataType: 'html'
		});
	}


	function showMapDialogById(id) {
		var place = mapData.places[id];
		showMapDialog(place.pos.x, place.pos.y);
	}
	function showMapDialog(x, y) {
		pgf.ui.dialog.Create({ fromUrl: pgf.urls['game:map:cell_info'](x, y),
			OnOpened: function(dialog) {
				pgf.base.InitializeTabs('game-map-cell-info', 'map',
					[[jQuery('.pgf-cell-description-button', dialog), 'description'],
						[jQuery('.pgf-cell-persons-button', dialog), 'persons'],
						[jQuery('.pgf-cell-place-parameters-button', dialog),'place-parameters'],
						[jQuery('.pgf-cell-place-demographics-button', dialog),'place-demographics'],
						[jQuery('.pgf-cell-place-bills-button', dialog),'place-bills'],
						[jQuery('.pgf-cell-place-modifiers-button', dialog), 'place-modifiers'],
						[jQuery('.pgf-cell-place-chronicle-button', dialog), 'place-chronicle'],
						[jQuery('.pgf-cell-building-button', dialog), 'building'],
						[jQuery('.pgf-cell-map-button', dialog), 'map'],
						[jQuery('.pgf-cell-debug-button', dialog), 'debug']]);
				jQuery('[rel="tooltip"]', dialog).tooltip(pgf.base.tooltipsArgs);

				if (widgets.abilities) {
					widgets.abilities.UpdateButtons();
					widgets.abilities.RenderAbility(pgf.game.constants.abilities.building_repair);
					jQuery('.angel-ability', dialog).toggleClass('pgf-hidden', false);
				}

			},
			OnClosed: function(dialog) {
				pgf.base.HideTooltips(dialog);
			}
		});
	}

	$.extend(_towns, {
		init : init,
		mapDataUpdate : mapDataUpdate,
		showMapDialogById : showMapDialogById
	});
	return _towns;
})({});

_ext.subscribe('preload', function() {
	if (_ext.map_version) {
		_towns.mapDataUpdate(_ext.map_version)
			.done(function() {
				_towns.init();
			});
	}
});
_ext.subscribe('questUpdate', function(quest) {
	_towns.townQuestUpdate(quest);
});
/* eo towns */

/* shortMessages */
var _shortMessages = (function(_shortMessages) {
//		var $shortContainer = _elements.getTabInner('short');
	function htmlMessages(messages) {
		var html = '';
		for (var i=0; i<messages.length; i++) {
			var message = messages[i];
//				var m = JSON.stringify(message);  data-m=\''+ m +'\'
			var htmlShortMsg = htmlMessage(message);
			var timestamp = message[0];
			var time = message[1];
			var htmlMsg;
			if (htmlShortMsg) {
				while (messages[i+1] && messages[i+1][1] === time) {
					var htmlShortMsg2 = htmlMessage(messages[i+1]);
					if (!htmlShortMsg2) break;
					htmlShortMsg += htmlShortMsg2;
					i++;
				}
				htmlMsg = '<li data-ts="'+timestamp+'" class="log-record-short">' + htmlShortMsg + '</li>';
			} else {
				var htmlLongMsg = htmlLongMessage(message);
				htmlMsg = '<li data-ts="'+timestamp+'" class="log-record">' + htmlLongMsg + '</li>';
			}
			html = htmlMsg + html;
		}
		return html;
	}

	function htmlMessage(message) {
		var time = message[1];
		var msg = message[2];
		var act = message[4]; //_ext.parse.message(message, 'message');

		var htmlMsg;
		if (!act || !act.type) return '';
		var isMe = act.isMe;
		var type = act.type;
		var sec = act.sec;
		var t = '';
		var val = act.value || '';
		var icon = _icons[type];
//			if (sec) console.log(sec, message[3], time)
		if (sec) icon += '<span class="sub-icon">' + _icons[sec] + '</span>';
		if (type === 'hit') t = val;
		else if (type === 'vamp') t = val + icon + '<span class="vamp">' + act.vamp + '</span>';
		else if (isActType('SHORT', type)) t = val + icon;

		if (t) htmlMsg = '<span class="submessage act act-' + act.type + (isMe ? ' me' : ' enemy') + '" title="' + time + '> ' + msg + '">' + t + '</span>';
		return htmlMsg || '';
	}

	function htmlLongMessage(message) {
		var time = message[1];
		var msg = message[2];
		var act = message[4];

		var actType = '';
		if (act && act.type) {
			var isMe = act.isMe ;
			actType = ' msg msg-' + act.type + (isMe ? ' me' : ' enemy');
		}
		var messageHighlight = _ext.parse.highlight(msg, act);


		var htmlLongMsg =
			'<div class="pgf-time time">' + time + '</div>' +
				'<div class="pgf-message message">' +
				'<div class="submessage' + actType + '">' + messageHighlight + '</div>' +
			'</div>';

		return htmlLongMsg;
	}

	$.extend(_shortMessages, {
		htmlMessage: htmlMessage,
		htmlLongMessage: htmlLongMessage,
		htmlMessages: htmlMessages
	});
	return _shortMessages;
})({});

/* eo shortMessages */


/* group */
var _groupMessages = (function(_groupMessages) {

	var $groupsContent = _elements.getTabInner('group');
	var $lastGroup;

	var messagesGrouped = [];

	function addMessages(messagesList) {
		for (var i=0; i<messagesList.length; i++) {
			addMessage(messagesList[i]);
		}
		return messagesGrouped;
	}

	/*
	data: {
		actionName: "пытается одолеть волка"
		info_link: "/guide/mobs/7/info"
		type: "fight"
		typeId: 3
	}*/
	function addMessage(message) {
		var hero = message[3];
		var act = message[4];
		var action = hero.action || false;

		var currGr = messagesGrouped[messagesGrouped.length-1];
		var isFirstGrouop = !currGr;

		if (isFirstGrouop) {
			/* самая первая группа */
			currGr = { /* заглушка */
				data: {}
			}
		} else {
			var currActionName = currGr.data.actionName;
			var currType = currGr.data.type;
			var currInfoLink = currGr.data.info_link;
			var currTypeId = currGr.data.typeId;
		}


		if (action) {
			var actionName = action.description;
			var actionTypeId = action.type;
			var actionType = _const.ACTION_TYPE_NAMES[actionTypeId];
			var actionInfoLink = action.info_link;

			if (!currActionName) currGr.data.actionName = currActionName = actionName;
			if (!currType) currGr.data.type = currType = actionType;
			if (!currInfoLink) currGr.data.info_link = currInfoLink = actionInfoLink;
			if (!currTypeId) currGr.data.typeId = currTypeId = actionTypeId;
			var grData = {
				actionName: actionName,
				type: actionType,
				info_link: actionInfoLink,
				typeId: actionTypeId
			};
			if (isFirstGrouop) grData.isBroken = 1; // first group
		}


		if (act) {
			var actType = act.type;
			var isFightStart = isActType('FIGHT_START', actType);
			var isFightEnd = isActType('LOOT', actType);
			if (actType === 'godheal' || actType === 'godhit') {
				grData = $.extend(grData, {god: 1});
			}

			if (isFightStart) {
				if (!isFirstGrouop) finishGroup();
				newGroup(message, {fightStarted: 1}); //fight started, not finished
				return;
			}
			if (isFightEnd) {
				if (isFirstGrouop) {
					newGroup(message, grData)
				} else {
					var lastG = addToLastGroup(message, {
						actionName: 'в бою',
						type: 'fight',
						info_link: '',
						typeId: 3
					});
					if (lastG.data.fightStarted) {
						delete lastG.data.fightStarted;
						if (lastG.data.isBroken !== 4 && lastG.data.isBroken !== 5) {
							delete lastG.data.isBroken;
						}
					} else {
						lastG.data.isBroken = 2; //fight ended, but not started
					}
					finishGroup();
				}

				if (action && actionName !== currActionName) {
					newGroup([message[0], message[1], actionName, false, false], grData);
				}
				return;
			}
			if (currGr.messages && currGr.messages.length && !currGr.data.fightStarted && isActType('FIGHT', act.type)) {
				grData = $.extend(grData, {isBroken: 5});
			}

		}


		if (action && actionName && currActionName && actionName !== currActionName) {
			finishGroup();
			newGroup(message, grData);
			return;
		}
		if (isFirstGrouop) {
			newGroup(message, grData)
		} else {
			addToLastGroup(message, grData);
		}

		function addToLastGroup(message, data) {
			var lastG = messagesGrouped[messagesGrouped.length-1];
			if (data) lastG.data = $.extend(data, lastG.data);
			if (lastG.messages.length) {
				var prevMsg = lastG.messages[lastG.messages.length-1];
				if (message[0] - prevMsg[0] > 1200) lastG.data.isBroken = 4; // hole in messages 20 min
			}
			lastG.messages.push(message);
			return lastG;
		}

		function finishGroup(data) {
			var lastG = messagesGrouped[messagesGrouped.length-1];
			delete lastG.data.unfinished;
			if (lastG.data.fightStarted) {
				lastG.data.isBroken = 3; // fight started, not ended
			}
			if (data) lastG.data = $.extend(data, lastG.data);
			_ext.publish('groupFinished', lastG, messagesGrouped.length-1);
		}
		function newGroup(message, data) {
			var newG = {
				data: {unfinished: 1},
				messages: []
			};
			if (data) newG.data = $.extend(data, newG.data);
			if (message) newG.messages.push(message);
			messagesGrouped[messagesGrouped.length] = newG;
			_ext.publish('groupStarted', newG, messagesGrouped.length-1);
		}
	}

	function redrawGroup(index, isOpen) {
		var $group = $groupsContent.children('.group[data-index="'+index+'"]');
		if ($group.length) {
			if (typeof isOpen !== 'undefined') {
				$group.toggleClass('open', isOpen);
			}
			$group.html(drawGroupInner(messagesGrouped[index], messagesGrouped[index+1]));
		} else {
			$groupsContent.prepend(drawGroup(messagesGrouped[index], index, isOpen));
		}
	}


	function drawGroup(group, index, isOpen) {
		isOpen = isOpen || _ext.settings.settingsValues.groupOpenOnDefault;
		var html =
			'<div class="group' + (isOpen ? ' open' : '') + '" data-index="' + index + '">' +
				drawGroupInner(group, messagesGrouped[index+1]) +
			'</div>';
		return html;
	}
	function drawGroupInner(group, groupNext) {
		if (!group || !group.messages || !group.messages.length) { return ''; }
		var messages = group.messages;
		var groupData = group.data;

		var messageFirst = messages[0];
		var messageLast = messages[messages.length-1];

		var groupType = groupData.type;
		var groupLink = (groupData.info_link || '').replace('/info', '');
		var htmlGroupIcon = _const.ACTION_TYPE_ICONS[groupType] || '';
		var iconAttr = 'class="action-icon ' + groupType + '" title="' + _const.ACTION_TYPE_TEXTS[groupType] + '"';

		if (groupData.isBroken && !groupData.unfinished) {
			htmlGroupIcon = _const.ACTION_TYPE_ICONS['broken'];
			var title = _const.ERROR_CODES[groupData.isBroken || 1];
			iconAttr = 'class="action-icon broken" title="' + title + '"';
		}
		if (groupLink) {
			htmlGroupIcon = '<a ' + iconAttr + ' href="'+groupLink+'" target="_blank">' + htmlGroupIcon + '</a>';
		} else {
			htmlGroupIcon = '<span ' + iconAttr + '">' + htmlGroupIcon + '</span>';
		}


		var htmlTitle = '<span class="action-name">' + (groupData.actionName || 'неизвестное действие') + '</span>';

		var timeStart = messageFirst[0];
		var timeEnd = messageLast[0];
		if (groupType !== 'fight' && groupNext && groupNext.messages[0]) {
			var timeStartNext = groupNext.messages[0] && groupNext.messages[0][0];
			if (timeStartNext - timeEnd < 120) timeEnd = timeStartNext; // проверка на случай сломанной группы
		}
		var timeSpan = timeEnd - timeStart;
		var htmlTime = /*'<span class="glyphicon glyphicon-time"></span> ' +*/
			'<span class="group-time ' + (timeSpan > 600 ? 'bad' : timeSpan > 300 ? 'average' : '') + '">' +
				_ext.utils.timeSpan(timeSpan) +
			'</span> ';



		var htmlGroupList = _shortMessages.htmlMessages(messages);

		var html =
				'<div class="group-title on-close' + (groupData.god ? ' god' : '') + '">' + htmlGroupIcon + htmlTime + htmlTitle +'</div>' +
//					'<div class="group-stats on-close">' + htmlStats + '</div>' +
				'<div class="group-controls">' +
					'<span class="group-toggle on-close text-muted glyphicon glyphicon-chevron-up"></span>' +
					'<span class="group-toggle on-open text-muted glyphicon glyphicon-chevron-down"></span>' +
				'</div>' +
				'<ul class="unstyled pgf-log-list on-open">' + htmlGroupList + '</ul>';

		return html;
	}
	function drawMessages(messagesGrouped) {
		var html = '';
		for (var i=0; i<messagesGrouped.length; i++) {
			html = drawGroup(messagesGrouped[i], i) + html;
		}
		$groupsContent.html(html);
		$lastGroup = $groupsContent.children('.group').first();
	}
	function drawFakeMessage(message) {
		var html = _shortMessages.htmlLongMessage(message);
		$lastGroup.prepend(html);
	}


	$.extend(_groupMessages, {
		list: messagesGrouped,
		addMessages: addMessages,
		drawFakeMessage: drawFakeMessage,
//			addMessage: addMessage,
//			group: group,
		drawMessages: drawMessages,
		redrawGroup: redrawGroup
	});

	return _groupMessages;
})({});

_ext.subscribe('init', function() {
	_groupMessages.addMessages(_trace.messagesLog);
	_groupMessages.drawMessages( _groupMessages.list );
//		_ext.subscribe('groupFinished', function(group, index) {
//			_groupMessages.redrawGroup(index);
//		});
	_ext.subscribe('groupStarted', function(group, index) {
		_groupMessages.redrawGroup(index-1);
	});
	_ext.subscribe('newTurn', function(messagesNew) {
		_groupMessages.addMessages(messagesNew);
		_groupMessages.redrawGroup(_groupMessages.list.length-1);
	});

});

_elements.getTabInner('group').on('click', '.group-title', function() {
	var $group = $(this).closest('.group');
	var index = $group.data('index');
	console.log('group>', _groupMessages.list[index]);
});
/* eo group */

_ext.elements.addControl('group-toggle', {title: 'Только действия / Подробности', content: '<span class="glyphicon glyphicon-chevron-' + (_ext.settings.settingsValues.groupOpenOnDefault ? 'down' : 'up') + '"></span>'})
	.on('click', function() {
//			_ext.elements.activeTab('group');
		var $icon = $(this).children('.glyphicon');
		var isOpen = $icon.hasClass('glyphicon-chevron-up');
		_elements.getTabInner('group')
			.children('.group').toggleClass('open', isOpen);
		_elements.getTabInner('archive')
			.find('.group').toggleClass('open', isOpen);
		$icon.toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
	});



/* archive */
var _archive = (function(_archive) {
	var showArchive = _ext.settings.settingsValues.showArchive;
	var $archiveTab = _elements.getTab('archive').toggle(showArchive);

	_ext.subscribe('settingsChange', function(key, value) {
		if (key === 'showArchive') {
			showArchive = value;
			$archiveTab.toggle(showArchive);
			if (!showArchive) $archiveContent.html('');
		}
	});

	var $archiveTabContent = _elements.getTabInner('archive');

	$('<span class="link-ajax archive-renew">обновить</span>').appendTo($archiveTabContent)
		.on('click', function() {
			drawArchiveGroups(_archive.archiveGroups);
		});
	var $archiveContent = $('<div class="archive-content"></div>').appendTo($archiveTabContent);

	$archiveContent.on('click', '.group-toggle', function() {
		$(this).closest('.group').toggleClass('open');
	});

	function drawArchiveGroups(archiveGroups) {
		var levelIndex = 0;
		var levelsLog = _ext.log.get('levelsLog') || [];
		for (var i=0; i<archiveGroups.length; i++) {
			var group = archiveGroups[i];
			var ts = group.ts[1];
			var lv = levelsLog[levelIndex] || [];
			while (ts > lv[0]) {
				levelIndex++;
				var lvlHtml = '<div class="level">' + lv[1] + ' уровень!</div>';
				$archiveContent.prepend(lvlHtml);
				var lv = levelsLog[levelIndex] || [];
			}
			drawArchiveGroup(archiveGroups[i], i, archiveGroups);
		}
	}

	function drawArchiveGroup(archiveGroup, index, archiveGroups) {
		var isOpen =  _ext.settings.settingsValues.groupOpenOnDefault;
		var groupType = archiveGroup.broken ? 'broken' : archiveGroup.type;
		if (archiveGroup.mobId) {
			var groupLink = '/guide/mobs/' + archiveGroup.mobId;
		}
		var htmlGroupIcon = _const.ACTION_TYPE_ICONS[groupType] || '';
		if (groupLink) {
			htmlGroupIcon = '<a class="action-icon ' + groupType + '" href="'+groupLink+'" target="_blank">' + htmlGroupIcon + '</a>';
		} else {
			htmlGroupIcon = '<span class="action-icon ' + groupType + '">' + htmlGroupIcon + '</span>';
		}
		var title = (archiveGroup.text || 'неизвестное действие');
		var htmlTitle = '<span class="action-name">' + title + '</span>';


		var timeStart = archiveGroup.ts[0];
		var timeEnd = archiveGroup.ts[1];
		var archiveGroupNext = archiveGroups[index+1];
		if (groupType !== 'fight' && archiveGroupNext && archiveGroupNext.ts) {
			var timeStartNext = archiveGroupNext.ts[0];
			if (timeStartNext - timeEnd < 120) timeEnd = timeStartNext; // проверка на случай сломанной группы (3)
		}
		var timeSpan = timeEnd - timeStart;

		var htmlTime = /*'<span class="glyphicon glyphicon-time"></span> ' +*/
			'<span class="group-time ' + (timeSpan > 600 ? 'bad' : timeSpan > 300 ? 'average' : '') + '">' +
				_ext.utils.timeSpan(timeSpan) +
			'</span> ';


		var htmlGroupList = '';
		if (archiveGroup.total && (archiveGroup.type === 'fight' || archiveGroup.type === 'fight-god')) {
			htmlGroupList =
				'<span class="stats-archive stats-archive-me">' +
					drawArchiveActStat(archiveGroup.total.me) +
				'</span>' +
				'<span class="stats-archive stats-archive-enemy">' +
					drawArchiveActStat(archiveGroup.total.enemy) +
				'</span>';
		} else {
			var actName = _const.ACTION_TYPE_TEXTS[archiveGroup.type || 'undefined'];
			if (archiveGroup.broken) {
				actName = _const.ERROR_CODES[archiveGroup.broken || 1]
			}
			htmlGroupList = '<span class="stats-archive">' + actName + '</span>';
		}
		var html =
				'<div class="group-title">' + htmlGroupIcon + htmlTime + htmlTitle +'</div>' +
				'<div class="group-controls">' +
					'<span class="group-toggle on-close text-muted glyphicon glyphicon-chevron-up"></span>' +
					'<span class="group-toggle on-open text-muted glyphicon glyphicon-chevron-down"></span>' +
				'</div>' +
				'<div class="archive-log-list on-open">' + htmlGroupList + '</div>';

		html =
			'<div class="group' + (isOpen ? ' open' : '') + '" data-index="' + index + '">' +
				html +
			'</div>';

		$archiveContent.prepend(html);

	}

	function drawArchiveActStat(stats) {

		var types = ['dmgSum'].concat(_const.FIGHT);
		var html = '';
//			html += JSON.stringify(stats)
		for (var i=0; i<types.length; i++) {
			var type = types[i];
			if (stats[type]) {
				var stat = stats[type];
				var htmlStat = '';
				var htmlStatName = _icons[type];
				var count = stat.count;
				var sum = stat.sum;
				if (isActType('FIGHT_COUNTS', type)) {
					htmlStat += count + 'x' + htmlStatName;
				} else {
					if (type === 'dmgSum') {
						htmlStat += htmlStatName + '=<b>' + sum + '</b> ';
					} else {
						htmlStat +=  count + 'x' + htmlStatName;
						htmlStat += '=' + sum + ' ';
					}
				}

				html += '<span class="stats-archive-act stats-archive-' + type + '">' + htmlStat + '</span>';
			}
		}
		return html;

	}


	/* пересчет группы в архив */
	function countArchiveFromGroup(group) {
		var groupData = group.data;
		var messages = group.messages;
		if (!messages.length) return false;
		var isBroken = groupData.isBroken;
		var dataType = groupData.type;
		var first = messages[0];
		var last = messages[messages.length-1];
		var archiveGroup = $.extend({}, {
			ts: [first[0], last[0]],
			type: dataType,
			text: groupData.actionName,
			broken: isBroken
		});

		if (dataType === 'fight' && !isBroken) {
			archiveGroup.me = {};
			archiveGroup.enemy = {};
			if (groupData.info_link) {
				var mobId = groupData.info_link.replace('/guide/mobs/', '').replace('/info', '');
				if (+mobId) archiveGroup.mobId = +mobId;
			}

			for (var i=0; i<messages.length; i++) {
				var message = messages[i];
				var act = message[4];
				if (!act) continue;
				var type = act.type;
				if (isActType('FIGHT', type)) {
					var isMe = act.isMe;
					var addTo = archiveGroup[isMe ? 'me' : 'enemy'];
					var isFightValues = isActType('FIGHT_VALUES', type);
					if (!addTo[type]) {
						if (isFightValues) addTo[type] = [act.value];
						else addTo[type] = 1;
					} else {
						if (isFightValues) addTo[type].push(act.value);
						else addTo[type]++;
					}
				} else if (isActType('LOOT', type)) {
					archiveGroup.loot = type;
				}
			}
		}

		upgradeArchiveGroup(archiveGroup);
		return archiveGroup;
	}



	/* добавляет к архивам поле total */
	function upgradeArchiveGroup(archiveGroup, index) {
		if (!archiveGroup || !archiveGroup.ts) return archiveGroup;
		if (archiveGroup.me) {
			$.extend(archiveGroup, {
				total:{
					me: countTotalFromArchive(archiveGroup.me, 'me'),
					enemy: countTotalFromArchive(archiveGroup.enemy, 'enemy', archiveGroup.mobId == 66)
				}
			});
		}
		return archiveGroup;

		/* подсчет всех сумм из архива */
		function countTotalFromArchive(archiveGroupFrom) {
			var addTo = {dmgSum: {count:0, sum:0}};
			for (var type in archiveGroupFrom) if (archiveGroupFrom.hasOwnProperty(type)) {
				var vals = archiveGroupFrom[type];
				var isPassive = isActType('PASSIVE', type);
				var isHeal = type === 'heal';

				var count;
				var sum;
				if (typeof vals === 'number') {
					count = vals;
					sum = 0;
				} else {
					count = vals.length;
					sum = vals.reduce(function(pv, cv) { return pv + cv; }, 0) || 0;
				}

				var av;
				var critMin;
				var critVals;
				var critCount = 0;
				addTo[type] = addTo[type] || {sum: 0, count: 0};
				if (type === 'hit' && sum) {
					av = sum/count;
					critMin = av * 1.35;
					critVals = vals.filter(function(item) { return item > critMin;});
					critCount = critVals.length;
				}
				if (critCount) {
					addTo.crit = addTo.crit || {sum: 0, count: 0};
					var critSum = critVals.reduce(function(pv, cv) { return pv + cv; }, 0)||0;
					addTo.crit.count += critCount;
					addTo.crit.sum += critSum;
				}
				addTo[type].count += count;
				addTo[type].sum += sum;


				var typeSumTo = _const.SUM_TO_MAIN[type];
				if (typeSumTo) {
					addTo[typeSumTo] = addTo[typeSumTo] || {sum: 0, count: 0};
					addTo[typeSumTo].sum += sum;
				}
				if (!isHeal) {
					if (!isPassive) {
						addTo.dmgSum.count += count;
					}
					addTo.dmgSum.sum += sum;
				}
			}
			return addTo;
		}
	}
	function downgradeArchiveGroup(fullStats) {
		var archiveGroup = $.extend({}, fullStats);
		delete archiveGroup.total;
		delete archiveGroup.level;
		return archiveGroup;
	}

	function addArchiveGroup(group) {
		var _archiveGroups = _archive.archiveGroups;
		if (!group) return;
		var archiveGroup = countArchiveFromGroup(group);

		if (!archiveGroup) return;

		var lastStatGroup = _archiveGroups[_archiveGroups.length-1];
		if (!lastStatGroup || lastStatGroup.ts[0] === archiveGroup.ts[0]) {
			/* последняя группа обновляется каждый ход*/
			_archiveGroups[_archiveGroups.length-1] = archiveGroup;
		} else if (lastStatGroup.ts[0] < archiveGroup.ts[0]) {
			_archiveGroups.push(archiveGroup);
		} else {
			var isInArr = false;
			for (var i=0; i<_archiveGroups.length; i++) {
				var sg = _archiveGroups[i];
				if (sg.ts[0] === archiveGroup.ts[0]) {
					_archiveGroups[i] = archiveGroup;
					isInArr = true;
					break;
				}
			}
			if (!isInArr) {
				_archiveGroups.push(archiveGroup);
				_archiveGroups.sort(function(a,b) {
					return a.ts[0] - b.ts[0];
				});
//					console.log('add to millde', archiveGroup);
			}
		}
	}
	function loadArchiveGroups() {
		var _archiveGroups = _ext.log.get('archiveGroups') || [];
		_archiveGroups.sort(function(a,b) {
			return a.ts[0] - b.ts[0];
		});
		for (var i=0; i<_archiveGroups.length-1; i++) { /* remove doubles */
			if (_archiveGroups[i].ts[0] === _archiveGroups[i+1].ts[0]) {
				_archiveGroups.splice(i, 1);
				i--;
			}
		}
		_archiveGroups.map(upgradeArchiveGroup);
		_archive.archiveGroups = _archiveGroups;
	}
	function saveArchiveGroups() {
		var _archiveGroups = _archive.archiveGroups;
		var max = _ext.settings.settingsValues.maxArchiveLength || _const.MAX_ARCHIVE_LENGTH;

		_archiveGroups = _archiveGroups.slice(_archiveGroups.length-max);
		var toSave = _archiveGroups.map(downgradeArchiveGroup);
		_ext.log.set('archiveGroups', toSave);
	}

	$.extend(_archive, {
		drawArchiveGroups: drawArchiveGroups,

		loadArchiveGroups: loadArchiveGroups,
		saveArchiveGroups: saveArchiveGroups,
		addArchiveGroup: addArchiveGroup
	});
	return _archive;
})({});
_ext.subscribe('init', function() {
	_archive.loadArchiveGroups();
	for (var i=1; i<_groupMessages.list.length; i++) {
		var gr = _groupMessages.list[i];
		_archive.addArchiveGroup(gr);
	}
	_archive.saveArchiveGroups();


	_ext.subscribe('newMessages', function() {
		var group = _groupMessages.list[_groupMessages.list.length - 1];

		_archive.addArchiveGroup(group);
	});
	_ext.subscribe('groupFinished', function(group, index) {
		_archive.addArchiveGroup(group);
		_archive.saveArchiveGroups();
	});
});
_elements.getTabInner('archive').on('click', '.group-title', function() {
	var $group = $(this).closest('.group');
	var index = $group.data('index');
	var ts = _archive.archiveGroups[index].ts || [];
	console.log('archive>', _archive.archiveGroups[index], index, new Date(ts[0] * 1000));
});
/* eo archive */


/*var lastPosition;
var startTime = +new Date();
_ext.subscribe('newMessages', function(messagesNew, game_data) {
	if (!game_data) return;
	var position = game_data.account.hero.position;
	if (lastPosition) var dist = Math.abs(position.x - lastPosition.x) + Math.abs(position.y - lastPosition.y);
	if (!dist && lastPosition) return;
	var typeName = _ext.const.ACTION_TYPE_NAMES[game_data.account.hero.action.type];
	console.log('position: ', position.x.toFixed(5), position.y.toFixed(5), dist, typeName, Math.round((+new Date() - startTime)/1000), messagesNew);
	lastPosition = position;
});*/

/* stats */
/* статистика собирается из архива */
var _stats = (function(_stats) {
	_ext.elements.addTab('stats-side', {zone: 'equip', title: 'стат', content: '<div class="stats" />'});
	_ext.elements.activeTab('stats-side');
	var $stats = _ext.elements.getTabInner('stats-side');


	function addToStats(addTo, addFrom) {
		for (var type in addFrom) if (addFrom.hasOwnProperty(type)) {
			var st = addFrom[type];
			addTo[type] = addTo[type] || {sum: 0, count: 0};
			if (typeof st === 'number') {
				addTo[type].count += st;
			} else {
				addTo[type].count += st.count;
				addTo[type].sum += st.sum;
			}
		}

	}

	function countStatsTotal(archiveGroups, count) {
		archiveGroups = archiveGroups || _archive.archiveGroups;
		count = count || archiveGroups.length;
		var me = {};
		var enemy = {};
		var fights = 0;
		var loot = { pickup: 0, empty: 0, drop: 0};
		var meByMob = {};
		var enemyByMob = {};
		var actionsTimes = {};
		var actionsCounts = {};
		var actionsSum = 0;
		var actionsTime = 0;
		var fightRestTime = 0;
		var otherTime = 0;
		var mobId;

		for (var i=Math.max(archiveGroups.length-count, 0); i<archiveGroups.length; i++) {
			var fullStats = archiveGroups[i];
			var type = fullStats.broken ? 'broken' : fullStats.type;
			if (!fullStats.ts || type==='broken') continue;
			if (type === 'fight') {
				mobId = fullStats.mobId;
				addToStats(me, fullStats.total.me );
				addToStats(enemy, fullStats.total.enemy);
				meByMob[mobId] = meByMob[mobId] || {};
				addToStats(meByMob[mobId], fullStats.total.me);
				enemyByMob[mobId] = enemyByMob[mobId] || {};
				addToStats(enemyByMob[mobId], fullStats.total.enemy);

				fights++;
				var lt = fullStats.loot;
				if (lt) {
					loot[lt]++;
				}
			}
			var nextFullStats = archiveGroups[i+1];
			var timeStart = fullStats.ts[0];
			var timeEnd = fullStats.ts[1];
			if (type !== 'fight' && nextFullStats && nextFullStats.ts) {
				var timeStartNext = nextFullStats.ts[0];
				if (timeStartNext - timeEnd < 120) timeEnd = timeStartNext; // проверка на случай сломанной группы (2)
			}
			var time = timeEnd - timeStart;
//				lastTimeEnd = fullStats.ts[1];
			if (type === 'fight' || type === 'rest') {
				fightRestTime += time;
			} else {
				otherTime += time;
			}
			type = type || 'undefined';
			actionsTimes[type] = (actionsTimes[type] || 0) + time;
			actionsCounts[type] = (actionsCounts[type] | 0) + 1;
			actionsTime += time;
			actionsSum++;
		}



		var statsTotal = {
			fights: fights,
			fightRestTime: fightRestTime,
			otherTime: otherTime,
			actionsTime: actionsTime,
			actionsTimes: actionsTimes,
			actionsCounts: actionsCounts,
			actionsSum: actionsSum,
			loot: loot,
			me: me,
			enemy: enemy,
			meByMob: meByMob,
			enemyByMob: enemyByMob
		};
		if (mobId) statsTotal.lastMobId = mobId;
		return statsTotal;
	}

	_ext.subscribe('settingsChange', function(key, value) {
		if (key==='statsByMob' || key==='statsByMobId' || key==='myStatsByMob' || key==='statsActionsCount' || key==='statsByLevel' || key==='statsByLevelValue') {
			drawStatsSide();
		}
	});
//		var statsActionsCount = _ext.settings.settingsValues.statsActionsCount;
//		var statsByMob = _ext.settings.settingsValues.statsByMob;
	function groupsByLevel(archiveGroups, level) {
		var levelsLog = _ext.log.get('levelsLog') || [];
		if (level) {
			var lv1 = levelsLog.filter(function(item) { return item[1] === level;})[0] || [];
			var lv2 = levelsLog.filter(function(item) { return item[1] === level+1;})[0] || [];
		} else {
			lv1 = levelsLog[levelsLog.length-1];
			lv2 = [];
		}
		var time1 = lv1[0];
		var time2 = lv2[0];
		var i1 = null;
		var i2 = null;
		for (var i=0; i<archiveGroups.length; i++) {
			var ts1 = archiveGroups[i].ts[0];
			var ts2 = archiveGroups[archiveGroups.length - 1 - i].ts[0];
			if (i1===null && ts1>time1) i1 = i;
			if (i2===null && ts2<time2) i2 = archiveGroups.length - 1 - i;
		}
		return (i1!==null && !time2) ? archiveGroups.slice(i1) : archiveGroups.slice(i1|0, i2|0);
	}
	function drawStatsSide(archiveGroups) {
		archiveGroups = archiveGroups || _archive.archiveGroups;
		var groups =  _ext.settings.settingsValues.statsByLevel ? groupsByLevel(archiveGroups, _ext.settings.settingsValues.statsByLevelValue) : archiveGroups;

		var statsTotal = countStatsTotal(groups, _ext.settings.settingsValues.statsActionsCount);
		var mobId = _ext.settings.settingsValues.statsByMob && (_ext.settings.settingsValues.statsByMobId || statsTotal.lastMobId);

		var html = '';
		var htmlMe;
		if(_ext.settings.settingsValues.myStatsByMob && mobId) {
			htmlMe = drawStatsSideByActor(statsTotal.meByMob[mobId]);
		} else {
			htmlMe = drawStatsSideByActor(statsTotal.me);
		}
		var htmlEnemy;
		if (mobId) {
			htmlEnemy =
				'<tr class="unhover">' +
					'<td class="stats-against" colspan="5"><a href="/guide/mobs/' + mobId + '" target="_blank">' + _const.MOBS[mobId] + '</a></td>' +
				'</tr>' +
				drawStatsSideByActor(statsTotal.enemyByMob[mobId]);
		} else {
			htmlEnemy =
				'<tr class="unhover">' +
					'<td class="stats-against" colspan="5">бестии</td>' +
				'</tr>' +
				drawStatsSideByActor(statsTotal.enemy);
		}
		var statsTable =
			'<table class="table table-condensed table-noborder table-hover-dark table-stats">' +
				'<tr class="unhover">' +
					'<th class="stats-name"></th>' +
					'<th class="stats-average" title="среднее значение">средн</th>' +
					'<th class="stats-count" title="количество срабатываний из 100 ударов">шанс</th>' +
					'<th class="stats-sum" title="доля от общего урона">урон</th>' +
					'<th class="stats-bonus" title="прибавка к урону от умения">эфф</th>' +
				'</tr>' +
				'<tbody class="stats-me">' +
					htmlMe +
				'</tbody>' +
				'<tbody class="stats-enemy">' +
					htmlEnemy +
				'</tbody>' +
			'</table>';


		var loot = statsTotal.loot;
		var htmlLoot = '<span class="stats-name" title="Поднял/Пусто/Выбросил">' + _icons.pickup + '</span> ' +
			'<span title="Поднял">' + loot.pickup + '</span> / <span title="Пусто">' + loot.empty + '</span> / <span title="Выбросил">' + loot.drop + '</span>';


		var htmlTime =
			'<b>' + statsTotal.actionsSum + '</b> ' + _ext.utils.declenstionByNumber(statsTotal.actionsSum, ['действие', 'действия', 'действий']) + ' за ' + _ext.utils.timeSpan(statsTotal.actionsTime) + '<br />';
		var interestAverageActions = [{
			type: 'fight,rest',
			text: 'бой/отдых',
			icon: '<span class="glyphicon glyphicon-flag"></span>'
		}, {
			type: 'walk',
			text: 'в пути'
		}, {
			type: 'quest,city,nearcity,noeffect',
			text: 'задания'
		}, {
			type: 'idle',
			text: 'безделье'
		}, {
			type: 'dead',
			text: 'воскресание'
		}, {
			type: 'energy',
			text: 'восстановление'
		}, {
			type: 'trade,equip',
			text: 'торговля и экипировка'
		}, {
			type: 'broken,proxy,pvp,undefined',
			text: 'остальное'
		}, {
			title: '<br/><b>В среднем:</b>'
		}, {
			type: 'fight,rest',
			countType: 'fight',
			countAverage: 1,
			icon: '<span class="glyphicon glyphicon-flag"></span>',
			text: 'на бой с учетом отдыха'
		}, {
			type: 'fight',
			countAverage: 1,
			text: 'на бой'
		}, {
			type: 'rest',
			countAverage: 1,
			text: 'на отдых'
		}];
		for (var i=0; i<interestAverageActions.length; i++) {
			var act = interestAverageActions[i];
			if (act.title) {
				htmlTime += act.title + '<br />';
				continue;
			}

			var types = act.type.split(',');
			var count = 0;
			var countTotal = 0;
			var time = 0;
			for (var j=0; j<types.length; j++) {
				var type = types[j];
				time += statsTotal.actionsTimes[type]||0;
				countTotal += statsTotal.actionsCounts[type]||0;
				if (!act.countType) count += statsTotal.actionsCounts[type];
			}
			type = types[0];
			if (act.countType) count = statsTotal.actionsCounts[act.countType];
			var timePercent = Math.round(time / statsTotal.actionsTime * 1000) / 10;
			if (act.countAverage) time = time/count;


			if (time) {
				htmlTime += '<span class="action-icon ' + (act.countType || type) + '" title="' + types.map(function(item) { return _const.ACTION_TYPE_TEXTS[item]; }).join(', ') + '">' + (act.icon || _const.ACTION_TYPE_ICONS[type]) + '</span>';
				if (!act.countAverage) {
					htmlTime += '<span title="' +  _ext.utils.timeSpan(time) + '">' + timePercent.toFixed(1) + '%</span> - ';
				} else {
					htmlTime += _ext.utils.timeSpan(time);
				}
				htmlTime +=  ' ' + act.text + ' (' + countTotal + ')<br />';
			}
		}


		html += statsTable;
		html += '<div class="stats-side stats-loot">' + htmlLoot + '</div>';
		html += '<div class="stats-side stats-time">' + htmlTime + '</div>';

		$stats.html(html);
	}
	function drawStatsSideByActor(stats) {
		var html = '';
		if (!stats) return html;
		var types = [].concat(_const.ACTIVE, ['dmgSum'], _const.PASSIVE);
		for (var i=0; i<types.length; i++) {
			var type = types[i];
//				var isActive = isActType('ACTIVE', type);
			var isDot = isActType('DOT', type);
			var isPassive = isActType('PASSIVE', type);
			var sumTo = _const.SUM_TO_MAIN[type];
			var dmgSum = stats.dmgSum || {};
			var hit = stats.hit || {};

			if (stats[type]) {
				var stat = stats[type];
				var title = _const.ACTION_TRANSLATE[type] +
					(sumTo ? ', включено в ' + _const.ACTION_TRANSLATE[sumTo] :
						(isPassive ? ', не учитывается в сумме' : '' )
					);
				var htmlStat = '<td class="stats-name" title="' + title + '">' + _icons[type] + '</td> ';

				var count = stat.count;
				var sum = stat.sum;
				var average = (Math.round(sum / count * 100) / 100)||0;
				var hitCount = hit.count;
				var hitSum = hit.sum;
				var totalSum = dmgSum.sum;

				var chance = type === 'dmgSum' ? 100 : count/(hitCount + count) * 100;
				var chanceText = type === 'hit' ? '-' : chance>=100 ? Math.round(chance * 10)/10  : chance.toFixed(3);
				var countText = 'сработал ' + _ext.utils.declenstionByNumber(count, ['раз', 'раза', 'раз'], 1);

				if (!sum) {
					htmlStat += '<td class="stats-average"></td>';
					htmlStat += '<td class="stats-count" title="' + countText + '">' + chanceText + '</td>';
					htmlStat += '<td class="stats-count"></td>';
					htmlStat += '<td class="stats-sum"></td>';
				} else {
					var averagePercents = sum/count * hitCount/hitSum * 100;
					var averagePercentsText = Math.round(averagePercents * 100)/100 + '';

					var dmgPercents = sum/totalSum * 100;
					var dmgPercentsText = '' + (dmgPercents<100 ? dmgPercents.toFixed(1) : Math.round(dmgPercents)) + '%';
					var sumText = 'всего ' + _ext.utils.declenstionByNumber(sum, ['урон', 'урона', 'урона'], 1);

					var bonusPercent = Math.round((averagePercents - 100) * chance) / 100;
					var bonusPercentText = bonusPercent && !isDot ?
						(bonusPercent >= 0 ? '+' : '&ndash;') + Math.abs(bonusPercent) + '%' :
						'';
					var bpTranslateText = (averagePercentsText >= 100 ? '+' : '&ndash;') + Math.abs(Math.round(averagePercentsText*100 - 10000)/100) + '% x ' + chanceText;

					htmlStat += '<td class="stats-average" title="' + averagePercentsText + '%">' + average.toFixed(2) + '</td>';
					htmlStat += '<td class="stats-count" title="' + countText + '">' + chanceText + '</td>';
					htmlStat += '<td class="stats-sum" title="' + sumText + '">' + dmgPercentsText + '</td>';
					htmlStat += '<td class="stats-bonus" title="' + bpTranslateText + '">' + bonusPercentText + '</td>';
				}
/*						var bonusPercent;
					if (type === 'dmgSum') {
						bonusPercent = stat.sum/stat.count / stats.hit.sum * stats.hit.count - 1;
					} else if (type !== 'hit' && stats.hit && !sumTo && type !== 'heal') {
						var skillAvg = (stats.hit.sum + sum) / (stats.hit.count + count);
						var hitAvg = stats.hit.sum / stats.hit.count;
						bonusPercent = skillAvg / hitAvg - 1;
					} else {
						bonusPercent = '';
					}
					bonusPercent = Math.round(bonusPercent*10000)/100||0;
					var bonusPercentText = bonusPercent ?
						(bonusPercent >= 0 ? '+' : '&ndash;') + Math.abs(bonusPercent) + '%' :
						'';
					htmlStat += '<td class="stats-bonus">' + bonusPercentText + '</td>';
*/

				html += '<tr class="stats-row stats-row-' + type + '">' + htmlStat + '</tr>';
			}
		}
		return html;
	}


	$.extend(_stats, {
		drawStatsSide: drawStatsSide,
		countStatsTotal: countStatsTotal
	});
	return _stats;
})({});

_ext.subscribe('preload', function() {
	_stats.drawStatsSide();

	_ext.subscribe('newMessages', function() {
		_stats.drawStatsSide();
	});
});

/* eo stats */




_ext.archive = _archive;
_ext.groupMessages = _groupMessages;
_ext.shortMessages = _shortMessages;
_ext.towns = _towns;
_ext.stats = _stats;

_ext.publish('init');


/* dom stuff */
$('.navbar-fixed-top').removeClass('navbar-fixed-top');
$('body').css({'padding-top': 0});
$('.pgf-wait-data .alert-info').clone().attr('class', 'ext-wait').insertAfter('#current-action-block');
jQuery('.pgf-wait-data').toggleClass('pgf-hidden', true);
jQuery('.pgf-game-data').toggleClass('pgf-hidden', false);
/* dom stuff */




	return _ext;
})(window.ext || {});


//console.log('tables.js')
window.tables = (function(_tables) {
	"use strict";

	function makeSortable($table) {
		var $head = $table.find('thead tr').first();
		var $rows = $table.find('tbody tr');

		$head.children('th')
			.wrapInner('<span class="sort" />')
			.each(function(){

				var $th = $(this);
				var thIndex = $th.index();

				$th.children('.sort').click(function(){
					$th.siblings('th').children('.sort').attr('class', 'sort');
					var inverse = $(this).hasClass('sort-up');
					$(this).attr('class', 'sort sort-' + (inverse ? 'down' : 'up'));
					var arr = [];
					$rows.each(function() {
						var valueText = $.trim($(this).children('td').eq(thIndex).text());
						var value;

						value = (-valueText) || parseDate(valueText) || valueText;


						arr.push({
							$item: this,
							value: value
						})
					});
					arr.sort(function(a,b) {
						if (a.value == b.value) return 0;
						return a.value > b.value ?
							inverse ? 1 : -1
							: inverse ? -1 : 1;
					})
					arr.forEach(function(item) {
						$table.append(item.$item)
					})
				});

			});
	}


	$('.table').each(function() {
		makeSortable($(this))
	});

	$.extend(_tables, {
		makeSortable: makeSortable
	});

	function parseDate(str) { //02.04.2014 10:50
		var p = /(\d{2})\.(\d{2})\.(\d{4})\s(\d{1,2})\:(\d{2})/.exec(str);
		if (!p) return 0;
		return +new Date(p[3],p[2]-1,p[1],p[4],p[5]);
	}

	return _tables;
})({});


