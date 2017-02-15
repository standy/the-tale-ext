const $ = require('jquery');
const core = require('../utils/');


const _log = core.log;
const _subscribe = core.subscribe;


const _trace = module.exports = {};
_trace.messagesLog = require('./messagesLog');
_trace.traceInit = require('./traceInit');
_trace.traceData = require('./traceData');
_trace.traceStart = require('./traceStart');
_trace.traceStop = require('./traceStop');



_subscribe('init', function(game_data) {
	_trace.traceInit();
	_trace.traceStart();
});


_subscribe('newMessages', function(messagesNew, gameData, timestamp) {
	_log.set('game_data', gameData);
	const hero = gameData.account.hero;
	const levelsLog = _log.get('levelsLog') || [];
	const lastLevel = (levelsLog[levelsLog.length - 1] || [])[1];
	if (hero.base.level !== lastLevel) {
		console.info('level up!', hero.base.level);
		levelsLog.push([timestamp, hero.base.level]);
		_log.set('levelsLog', levelsLog);
	}
	let powersLog = _log.get('powersLog') || [];
	powersLog = powersLog.filter(function(t) { return typeof t[1] === 'number'; });
	const lastPower = (powersLog[powersLog.length - 1] || [])[1];
	const powerSum = hero.secondary.power[0] + hero.secondary.power[1];
	if (powerSum !== lastPower) {
		console.info('power up!', powerSum);
		powersLog.push([timestamp, powerSum]);
		_log.set('powersLog', powersLog);
	}
	_trace.lastGameData = gameData;
});


_subscribe('init', function() {
	$('#pgf-journal-container')
		.on('click', '[data-ts]', function() {
			const timestamp = $(this).data('ts');
			_trace.messagesLog.forEach(function(message) {
				if (message[0] === timestamp) {
					console.log(message);
				}
			});
		})
		.on('click', '[data-click]', function() {
			console.log($(this).data('click'));
		});
});

_subscribe('newTurn', function(messagesNew) {
	window.setTimeout(function() {
		core.elements.getControl('journal-log')
			.find('.value').text(_trace.messagesLog.length);
	}, 10);
});

