/**
 * Модуль нужен для отрисовки статистики
 * статистика собирается из архива
 * */

var _stats = module.exports = {};
_stats.drawStatsSide = require('./drawStatsSide.js');
_stats.countStatsTotal = require('./countStatsTotal.js');


var utils = require('../../utils/index.js');
var _subscribe = utils.subscribe;

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


