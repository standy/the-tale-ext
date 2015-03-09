var $ = require('jquery');
var _subscribe = require('./pubsub.js').subscribe;

var tabs = {};

var $diaryRoot = $('#pgf-diary-container').parent().parent();
var $diaryTabs = $diaryRoot.children('.nav-tabs');
var $diaryContainer = $diaryRoot.children('.tab-content');

var $equipRoot = $('#pgf-equipment-container').parent().parent();
var $equipTabs = $equipRoot.children('.nav-tabs');
var $equipContainer = $equipRoot.children('.tab-content');

var zones = {
	main: {
		$tabs: $diaryTabs,
		$container: $diaryContainer
	},
	equip: {
		$tabs: $equipTabs,
		$container: $equipContainer
	}
};



function addTab(name, opts) {
	var zone = opts.zone || 'main';
	var $tabs = zones[zone].$tabs;
	var $container = zones[zone].$container;

	var $tab = $('<li class="pull-right"><a href="#pgf-' + name + '-container" class="pgf-' + name + '-tab-button" data-toggle="tab">' + opts.title + '</a></li>');
	var $content;
	if (zone === 'main') {
		$content = $('<div class="tab-pane log-block" id="pgf-' + name + '-container"></div>');
	} else {
		$content = $('<div class="tab-pane" id="pgf-' + name + '-container"></div>');
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
//		tabs[name].$tab.addClass('active').siblings().removeClass('active');
//		if (tabs[name].zone === 'mainMiddle') {
//			$('#pgf-journal-container').addClass('active').siblings().removeClass('active');
//			tabs[name].$content.show().siblings().hide();
//		} else {
//			tabs[name].$content.addClass('active').siblings().removeClass('active');
//		}
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

var _elements = {
	addTab: addTab,
	activeTab: activeTab,
	getTab: getTab,
	getTabInner: getTabInner,

	addControl: addControl,
	getControl: getControl
};

module.exports = _elements;


_elements.addTab('sets', {zone: 'main', title: '<span class="glyphicon glyphicon-cog" title="Настройки &laquo;The Tale Extended&raquo;"></span>'});
_elements.addTab('towns', {zone: 'main', title: 'города'});
_elements.addTab('archive', {zone: 'main', title: 'архив'});
_elements.addTab('group', {zone: 'main', title: 'кратко'});
_subscribe('init', function() {
	_elements.activeTab('group');
});

_elements.addControl('journal-log', {title: 'Журнал', content: '<span class="value"></span> <span class="glyphicon glyphicon-th-list"></span></span>'});
//	.on('click', function() { _log.toConsole('messagesLog'); });

_elements.addControl('archive-log', {title: 'Архив', content: '<span class="value"></span> <span class="glyphicon glyphicon-th"></span></span>'});
//	.on('click', function() { _log.toConsole('archiveGroups'); });
