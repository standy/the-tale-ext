import {subscribe} from '../utils/pubsub';
import {checkHero} from './checkHero';
import {checkQuest} from './checkQuest';

subscribe('newTurn', function(messagesNew, gameData) {
	window.setTimeout(function() {
		checkHero(gameData);
	}, 1000);
});

subscribe('newMessages', function(messagesNew, gameData) {
	window.setTimeout(function() {
		checkQuest(gameData);
	}, 1000);
});
