import $ from 'jquery';
import {loadArchiveGroups} from './loadArchiveGroups';
import {saveArchiveGroups} from './saveArchiveGroups';
import {archiveGroups} from './archiveGroups';
import {elements} from '../../utils/elements';
import {addArchiveGroup} from './addArchiveGroup';
import {initArchiveGroups} from './initArchiveGroups';
import {subscribe} from '../../utils/pubsub';
import {messagesGrouped} from '../group/messagesGrouped';

/**
 * Этот модуль сохраняет данные из сообщения в архив
 * само сообщение не сохраняется
 * модуль нужен для построения статистики
 *
 * Так же есть возможность посмотреть архив, переключатель в настройках
 * */


subscribe('init', () => {
	loadArchiveGroups();
	for (let i = 1; i < messagesGrouped.length; i++) {
		const gr = messagesGrouped[i];
		addArchiveGroup(gr);
	}
	saveArchiveGroups();


	subscribe('newMessages', () => {
		const group = messagesGrouped[messagesGrouped.length - 1];
		addArchiveGroup(group);
	});
	subscribe('groupFinished', (group, index) => {
		addArchiveGroup(group);
		saveArchiveGroups();
	});
});
elements.getTabInner('archive').on('click', '.group-title', function() {
	const $group = $(this).closest('.group');
	const index = $group.data('index');
	const ts = archiveGroups[index].ts || [];
	console.log('archive>', archiveGroups[index], index, new Date(ts[0] * 1000));
});

subscribe('newTurn', messagesNew => {
	window.setTimeout(() => {
		elements.getControl('archive-log')
			.find('.value').text(archiveGroups.length);
	}, 10);
});

initArchiveGroups();
