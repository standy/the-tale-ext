var _groupMessages = module.exports = {};
_groupMessages.list = require('./list');
_groupMessages.addMessages = require('./addMessages');
_groupMessages.drawFakeMessage = require('./drawFakeMessage');
_groupMessages.drawMessages = require('./drawMessages');
_groupMessages.redrawGroup = require('./redrawGroup');


var $ = require('jquery');
var _trace = require('../../trace/');
var utils = require('../../utils/');
var _subscribe = utils.subscribe;
var _elements = utils.elements;
var _settings = utils.settings;

_subscribe('init', function() {
	_groupMessages.addMessages(_trace.messagesLog);
	_groupMessages.drawMessages(_groupMessages.list);
//	_subscribe('groupFinished', function(group, index) {
//		_groupMessages.redrawGroup(index);
//	});
	_subscribe('groupStarted', function(group, index) {
		_groupMessages.redrawGroup(index - 1);
	});
	_subscribe('newTurn', function(messagesNew) {
		_groupMessages.addMessages(messagesNew);
		_groupMessages.redrawGroup(_groupMessages.list.length - 1);
	});
});

_elements.getTabInner('group').on('click', '.group-title', function() {
	var $group = $(this).closest('.group');
	var index = $group.data('index');
	console.log('group>', _groupMessages.list[index]);
});


_elements.addControl('group-toggle', {
	title: 'Только действия / Подробности',
	content: '<span class="glyphicon glyphicon-chevron-' + (_settings.settingsValues.groupOpenOnDefault ? 'down' : 'up') + '"></span>'
})
	.on('click', function() {
//		_elements.activeTab('group');
		var $icon = $(this).children('.glyphicon');
		var isOpen = $icon.hasClass('glyphicon-chevron-up');
		_elements.getTabInner('group')
			.children('.group').toggleClass('open', isOpen);
		_elements.getTabInner('archive')
			.find('.group').toggleClass('open', isOpen);
		$icon.toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
	});



$('body').on('click', '.group-toggle', function() {
	$(this).closest('.group').toggleClass('open');
});

