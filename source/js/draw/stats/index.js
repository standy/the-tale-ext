/**
 * Модуль нужен для отрисовки статистики
 * статистика собирается из архива
 * */

const _stats = module.exports = {};
_stats.drawStatsSide = require('./drawStatsSide');
_stats.countStatsTotal = require('./countStatsTotal');


const utils = require('../../utils/');
const _subscribe = utils.subscribe;

_subscribe('settingsChange', function(key, value) {
	if (['statsByMob', 'statsByMobId', 'myStatsByMob', 'statsActionsCount', 'statsByLevel', 'statsByLevelValue'].indexOf(key) > 0) {
		_stats.drawStatsSide();
	}
});

_subscribe('preload', function() {
	_stats.drawStatsSide();

	_subscribe('newMessages', function() {
		_stats.drawStatsSide();
	});
});


