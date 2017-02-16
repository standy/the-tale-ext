const $ = require('jquery');
const _subscribe = require('./pubsub').subscribe;

const tabs = {};

const $diaryRoot = $('#pgf-diary-container').parent().parent();
const $diaryTabs = $diaryRoot.children('.nav-tabs');
const $diaryContainer = $diaryRoot.children('.tab-content');

const $equipRoot = $('#pgf-equipment-container').parent().parent();
const $equipTabs = $equipRoot.children('.nav-tabs');
const $equipContainer = $equipRoot.children('.tab-content');

const zones = {
	main: {
		$tabs: $diaryTabs,
		$container: $diaryContainer,
	},
	equip: {
		$tabs: $equipTabs,
		$container: $equipContainer,
	},
};



function addTab(name, opts) {
	const zone = opts.zone || 'main';
	const $tabs = zones[zone].$tabs;
	const $container = zones[zone].$container;

	const $tab = $('<li class="pull-right"><a href="#pgf-' + name + '-container" class="pgf-' + name + '-tab-button" data-toggle="tab">' + opts.title + '</a></li>');
	let $content;
	if (zone === 'main') {
		$content = $('<div class="tab-pane log-block" id="pgf-' + name + '-container"></div>');
	} else {
		$content = $('<div class="tab-pane" id="pgf-' + name + '-container"></div>');
	}

	$tabs.append($tab);
	$container.append($content);

	let $inner = $content;
	if (opts.content) {
		$inner = $(opts.content).appendTo($content);
	}

	tabs[name] = {
		zone: zone,
		$tab: $tab,
		$content: $content,
		$inner: $inner,
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

const controls = {};
const $controls = $('<div class="ext-controls pull-right"></div>').insertAfter('#current-action-block, #pvp-info-block');
function addControl(name, opts) {
	const html = '<span class="ext-control link-ajax" id="ext-' + name + '" title="' + opts.title + '">' + (opts.content || '') + '</span>';

	const $el = $(html).appendTo($controls);
	controls[name] = {
		$el: $el,
	};
	return $el;
}
function getControl(name) {
	return controls[name].$el;
}

const _elements = {
	addTab: addTab,
	activeTab: activeTab,
	getTab: getTab,
	getTabInner: getTabInner,

	addControl: addControl,
	getControl: getControl,
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
