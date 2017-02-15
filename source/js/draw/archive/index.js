/**
 * Этот модуль сохраняет данные из сообщения в архив
 * само сообщение не сохраняется
 * модуль нужен для построения статистики
 *
 * Так же есть возможность посмотреть архив, переключатель в настройках
 * */

const _archive = module.exports = {};
_archive.drawArchiveGroups = require('./drawArchiveGroups');
_archive.loadArchiveGroups = require('./loadArchiveGroups');
_archive.saveArchiveGroups = require('./saveArchiveGroups');
_archive.addArchiveGroup = require('./addArchiveGroup');
_archive.archiveGroups = require('./archiveGroups');


const $ = require('jquery');
const utils = require('../../utils/');
const _subscribe = utils.subscribe;
const _elements = utils.elements;
const _groupMessages = require('../group/');

_subscribe('init', function() {
	_archive.loadArchiveGroups();
	for (let i = 1; i < _groupMessages.list.length; i++) {
		const gr = _groupMessages.list[i];
		_archive.addArchiveGroup(gr);
	}
	_archive.saveArchiveGroups();


	_subscribe('newMessages', function() {
		const group = _groupMessages.list[_groupMessages.list.length - 1];
		_archive.addArchiveGroup(group);
	});
	_subscribe('groupFinished', function(group, index) {
		_archive.addArchiveGroup(group);
		_archive.saveArchiveGroups();
	});
});
_elements.getTabInner('archive').on('click', '.group-title', function() {
	const $group = $(this).closest('.group');
	const index = $group.data('index');
	const ts = _archive.archiveGroups[index].ts || [];
	console.log('archive>', _archive.archiveGroups[index], index, new Date(ts[0] * 1000));
});

_subscribe('newTurn', function(messagesNew) {
	window.setTimeout(function() {
		_elements.getControl('archive-log')
			.find('.value').text(_archive.archiveGroups.length);
	}, 10);
});

