import $ from 'jquery';
import pgf from 'pgf';
import {elements} from '../utils/elements';
import log from '../utils/log';
import {subscribe} from '../utils/pubsub';
import {messagesLog} from './messagesLog';
import {parseShort} from '../parse/parseShort';
import {traceData} from './traceData';


elements.addControl('journal-log', {title: 'Журнал', content: '<span class="value"></span> <span class="glyphicon glyphicon-th-list"></span></span>'});


subscribe('newMessages', (messagesNew, gameData, timestamp) => {
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
	powersLog = powersLog.filter(t => typeof t[1] === 'number');
	const lastPower = (powersLog[powersLog.length - 1] || [])[1];
	const powerSum = hero.secondary.power[0] + hero.secondary.power[1];
	if (powerSum !== lastPower) {
		console.info('power up!', powerSum);
		powersLog.push([timestamp, powerSum]);
		log.set('powersLog', powersLog);
	}
});


subscribe('init', () => {
	$('#pgf-journal-container')
		.on('click', '[data-ts]', function() {
			const timestamp = $(this).data('ts');
			messagesLog.forEach(message => {
				if (message[0] === timestamp) {
					console.log(message);
				}
			});
		})
		.on('click', '[data-click]', function() {
			console.log($(this).data('click'));
		});
});

subscribe('newTurn', () => {
	window.setTimeout(() => {
		elements.getControl('journal-log')
			.find('.value').text(messagesLog.length);
	}, 10);
});



function traceStart() {
	$(document).bind(`${pgf.game.events.DATA_REFRESHED}.ext-trace`, (e, game_data) => {
		traceData(game_data);
	});
}

function traceInit() {
	for (let i = 0; i < messagesLog.length; i++) {
		const messageNew = messagesLog[i];
		messageNew[4] = parseShort(messageNew[2]) || false;
	}
}

subscribe('init', () => {
	traceInit();
	traceStart();
});

subscribe('settingsChange', key => {
	if (key === 'heroNameStart') {
		traceInit();
	}
});

