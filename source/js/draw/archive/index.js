/**
 * Этот модуль сохраняет данные из сообщения в архив
 * само сообщение не сохраняется
 * модуль нужен для построения статистики
 *
 * Так же есть возможность посмотреть архив, переключатель в настройках
 * */

var _archive = module.exports = {};
_archive.drawArchiveGroups = require('./drawArchiveGroups.js');
_archive.loadArchiveGroups = require('./loadArchiveGroups.js');
_archive.saveArchiveGroups = require('./saveArchiveGroups.js');
_archive.addArchiveGroup = require('./addArchiveGroup.js');
_archive.archiveGroups = require('./archiveGroups.js');


var $ = require('jquery');
var utils = require('../../utils/index.js');
var _subscribe = utils.subscribe;
var _elements = utils.elements;
var _settings = utils.settings;
var _groupMessages = require('./../group/index.js');

_subscribe('init', function() {
	_archive.loadArchiveGroups();
	for (var i = 1; i < _groupMessages.list.length; i++) {
		var gr = _groupMessages.list[i];
		_archive.addArchiveGroup(gr);
	}
	_archive.saveArchiveGroups();


	_subscribe('newMessages', function() {
		var group = _groupMessages.list[_groupMessages.list.length - 1];
		_archive.addArchiveGroup(group);
	});
	_subscribe('groupFinished', function(group, index) {
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

_subscribe('newTurn', function(messagesNew) {
	window.setTimeout(function() {
		_elements.getControl('archive-log')
			.find('.value').text(_archive.archiveGroups.length);
	}, 10);
});

