import {messagesGrouped} from './messagesGrouped';
import {addMessages} from './addMessages';
import {drawMessages} from './drawMessages';
import {redrawGroup} from './redrawGroup';


import $ from 'jquery';
import {elements} from '../../utils/elements';
import {subscribe} from '../../utils/pubsub';
import {settingsValues} from '../../settings/settings';
import {messagesLog} from '../../trace/messagesLog';

subscribe('init', function() {
	addMessages(messagesLog);
	drawMessages(messagesGrouped);
//	subscribe('groupFinished', function(group, index) {
//		redrawGroup(index);
//	});
	subscribe('groupStarted', function(group, index) {
		redrawGroup(index - 1);
	});
	subscribe('newTurn', function(messagesNew) {
		addMessages(messagesNew);
		redrawGroup(messagesGrouped.length - 1);
	});
});

elements.getTabInner('group').on('click', '.group-title', function() {
	const $group = $(this).closest('.group');
	const index = $group.data('index');
	console.log('group>', messagesGrouped[index]);
});


elements.addControl('group-toggle', {
	title: 'Только действия / Подробности',
	content: '<span class="glyphicon glyphicon-chevron-' + (settingsValues.groupOpenOnDefault ? 'down' : 'up') + '"></span>',
})
	.on('click', function() {
//		elements.activeTab('group');
		const $icon = $(this).children('.glyphicon');
		const isOpen = $icon.hasClass('glyphicon-chevron-up');
		elements.getTabInner('group')
			.children('.group').toggleClass('open', isOpen);
		elements.getTabInner('archive')
			.find('.group').toggleClass('open', isOpen);
		$icon.toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
	});



$('body').on('click', '.group-toggle', function() {
	$(this).closest('.group').toggleClass('open');
});

