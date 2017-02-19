import {subscribe} from '../../utils/pubsub';
import {drawStatsSide} from './drawStatsSide';

/**
 * Модуль нужен для отрисовки статистики
 * статистика собирается из архива
 * */

subscribe('settingsChange', (key, value) => {
	if (['statsByMob', 'statsByMobId', 'myStatsByMob', 'statsActionsCount', 'statsByLevel', 'statsByLevelValue'].indexOf(key) > 0) {
		drawStatsSide();
	}
});

subscribe('preload', () => {
	drawStatsSide();

	subscribe('newMessages', () => {
		drawStatsSide();
	});
});


