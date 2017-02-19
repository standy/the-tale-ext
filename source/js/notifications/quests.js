import {subscribe} from '../utils/pubsub';
import {checkQuests} from './checkQuests';


subscribe('preload', () => {
	subscribe('newMessages', (messagesNew, game_data) => {
		const hero = game_data.account.hero;
		const quests = hero.quests.quests;
		checkQuests(quests);
	});
});
