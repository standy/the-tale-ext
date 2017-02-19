import {subscribe} from '../utils/pubsub';
import {checkHero} from './checkHero';
import {checkQuest} from './checkQuest';

subscribe('newTurn', (messagesNew, gameData) => {
	window.setTimeout(() => {
		checkHero(gameData);
	}, 1000);
});

subscribe('newMessages', (messagesNew, gameData) => {
	window.setTimeout(() => {
		checkQuest(gameData);
	}, 1000);
});
