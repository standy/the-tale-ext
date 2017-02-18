import $ from 'jquery';
import {elements} from '../utils/elements';
import log from '../utils/log';
import {subscribe} from '../utils/pubsub';
import {messagesLog} from '../trace/messagesLog';
import {traceInit} from './traceInit';
import {traceStart} from './traceStart';



subscribe('init', function(game_data) {
	traceInit();
	traceStart();
});


subscribe('newMessages', function(messagesNew, gameData, timestamp) {
	log.set('game_data', gameData);
	const hero = gameData.account.hero;
	const levelsLog = log.get('levelsLog') || [];
	const lastLevel = (levelsLog[levelsLog.length - 1] || [])[1];
	if (hero.base.level !== lastLevel) {
		console.info('level up!', hero.base.level);
		levelsLog.push([timestamp, hero.base.level]);
		log.set('levelsLog', levelsLog);
	}
	let powersLog = log.get('powersLog') || [];
	powersLog = powersLog.filter(function(t) { return typeof t[1] === 'number'; });
	const lastPower = (powersLog[powersLog.length - 1] || [])[1];
	const powerSum = hero.secondary.power[0] + hero.secondary.power[1];
	if (powerSum !== lastPower) {
		console.info('power up!', powerSum);
		powersLog.push([timestamp, powerSum]);
		log.set('powersLog', powersLog);
	}
});


subscribe('init', function() {
	$('#pgf-journal-container')
		.on('click', '[data-ts]', function() {
			const timestamp = $(this).data('ts');
			messagesLog.forEach(function(message) {
				if (message[0] === timestamp) {
					console.log(message);
				}
			});
		})
		.on('click', '[data-click]', function() {
			console.log($(this).data('click'));
		});
});

subscribe('newTurn', function(messagesNew) {
	window.setTimeout(function() {
		elements.getControl('journal-log')
			.find('.value').text(messagesLog.length);
	}, 10);
});

