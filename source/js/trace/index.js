var $ = require('jquery');
var pgf = require('pgf');
var core = require('./../utils/index.js');


var _log = core.log;
var _subscribe = core.subscribe;


var _trace = module.exports = {};
_trace.messagesLog = require('./messagesLog.js');
_trace.traceInit = require('./traceInit.js');
_trace.traceData = require('./traceData.js');
_trace.traceStart = require('./traceStart.js');
_trace.traceStop = require('./traceStop.js');



_subscribe('init', function(game_data) {
	_trace.traceInit();
	_trace.traceStart();
});


_subscribe('newMessages', function(messagesNew, gameData, timestamp) {
	_log.set('game_data', gameData);
	var hero = gameData.account.hero;
	var levelsLog = _log.get('levelsLog') || [];
	var lastLevel = (levelsLog[levelsLog.length - 1] || [])[1];
	if (hero.base.level !== lastLevel) {
		console.info('level up!', hero.base.level);
		levelsLog.push([timestamp, hero.base.level]);
		_log.set('levelsLog', levelsLog);
	}
	var powersLog = _log.get('powersLog') || [];
	powersLog = powersLog.filter(function(t) { return typeof t[1] === 'number'; });
	var lastPower = (powersLog[powersLog.length - 1] || [])[1];
	var powerSum = hero.secondary.power[0] + hero.secondary.power[1];
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
			var timestamp = $(this).data('ts');
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

