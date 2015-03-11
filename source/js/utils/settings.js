var _subscribe = require('./pubsub').subscribe;
var _publish = require('./pubsub').publish;
var _const = require('./const');
var $ = require('jquery');
var _log = require('./log');
var _elements = require('./elements');


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
					name: 'notifyHeroHpLowerValue',
					value: 200
				}]
			}, {
				label: 'Энергия выше ',
				name: 'notifyHeroEnergy',
				isToggle: 1,
				value: true,
				inputs: [{
					type: 'num',
					name: 'notifyHeroEnergyGreaterValue',
					value: 9
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
				value:  _const.MAX_LOG_LENGTH
			}]
		}, {
			label: 'Действий в архиве:',
			inputs: [{
				name: 'maxArchiveLength',
				type: 'num',
				value:  _const.MAX_ARCHIVE_LENGTH
			}]
		}, {
			label: '<span class="link-ajax" id="reset-stats">Очистить хранилище</span>'
		}]
	}
];
_subscribe('settingsChange', checkDependences);
function checkDependences(key, value, isDisabled) {
	if (deps[key]) {
		deps[key].forEach(function(keyName) {
			if (keyName) {
				getSettingInput(keyName).closest('.input-wrap').toggleClass('disabled', isDisabled || !value);//.prop('disabled', !value);
			}
		});
	}
}

var deps = {};
function addSets(sets) {
	for (var i = 0; i < sets.length;i++) {
		settingsDefaults(sets[i].fields);
	}

	function settingsDefaults(fields) {
		var childs = [];
		for (var i = 0; i < fields.length;i++) {
			var st = fields[i];
			childs.push(st.name);
//					console.log('defaults', st.name);
			if (typeof settingsValues[st.name] === 'undefined') {
				settingsValues[st.name] = st.value;
			}
			var subsChilds = [];
			if (st.inputs) {
				subsChilds = settingsDefaults(st.inputs).concat(subsChilds);
			}
			if (st.subs) {
				subsChilds = settingsDefaults(st.subs).concat(subsChilds);
			}
			if (st.fields) {
				subsChilds = settingsDefaults(st.fields).concat(subsChilds);
			}

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
	for (var i = 0; i < sets.length;i++) {
		var st = sets[i];
		html +=
			'<div class="">' +
				'<div class="sets-header">' + (st.title || '') + '</div>' +
				drawSetsGroup(st.fields) +
			'</div>';
	}
	html = '<div class="settings-form form-horizontal">' + html + '</div>';
	$sets.append(html);
	$sets.find('input').each(function() {
		var $input = $(this);
		var name = $input.data('name');
		var value = $input.is('[type="checkbox"]') ? $input.prop('checked') : $input.val();
		var isDisabled = $input.closest('.input-wrap').hasClass('disabled');
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
			if ($input.data('type') === 'num') { value = +value; }
			settingsValues[name] = value;
			var isDisabled = $input.closest('.input-wrap').hasClass('disabled');
			_publish('settingsChange', name, value, isDisabled);
			_log.set('settings', settingsValues);
		});
}

function drawSetsGroup(fields) {
//			console.log('drawSetsGroup', sets);
	var html = '';
	for (var i = 0;i < fields.length;i++) {
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
		if (typeof settingsValues[st.name] === 'undefined') {
			settingsValues[st.name] = st.value;
		}
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



var _settings = {
	init: init,
	addSets: addSets,
	drawSets: drawSets,
	getSettingInput: getSettingInput,
	settingsValues: settingsValues
};

module.exports = _settings;


_subscribe('init', function() {
	_settings.init();
});

_subscribe('preload', function() {
	if (!_settings.settingsValues.heroNameStart) {
		/* todo is `this` correct _ext */
		var heroName = this.heroName;
		_settings.settingsValues.heroNameStart = heroName.substring(0, Math.max(3, heroName.length - 2));
		_settings.getSettingInput('heroNameStart').val(_settings.settingsValues.heroNameStart).trigger('change');
	}
});

_subscribe('settingsChange', function(key/*, value*/) {
	if (key === 'heroNameStart') {
		/* todo is `this` correct _ext */
		this.groupMessages.drawMessages(this.groupMessages.list);
	}
});



_subscribe('newTurn', function(messagesNew) {
	window.setTimeout(function() {
		$('#storage-size')
			.text('(занято ' + Math.round(_log.size() / 1024 / 1024 * 100) / 100 + 'Мб)');
	}, 10);
});

